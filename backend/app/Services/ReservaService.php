<?php

namespace App\Services;

use App\Models\Cliente;
use App\Models\Configuracion;
use App\Models\ExtensionReserva;
use App\Models\EstadoReserva;
use App\Models\Habitacion;
use App\Models\Limpieza;
use App\Models\OcupacionHabitacion;
use App\Models\PagoReserva;
use App\Models\Producto;
use App\Models\RegistroEstadia;
use App\Models\Reserva;
use App\Models\ReservaAjuste;
use App\Models\ReservaConsumo;
use App\Models\Tarifa;
use App\Models\TipoObservacion;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReservaService
{
    public function __construct(
        private DisponibilidadService $disponibilidad,
        private ClienteVisitaService $clienteVisita,
    ) {}

    public function listar()
    {
        return Reserva::with([
            'cliente', 'habitacion.piso', 'habitacion.tipo', 'tarifa', 'estado', 'usuarioCreacion'
        ])->orderByDesc('id_reserva')->get();
    }

    public function obtener(int $id): Reserva
    {
        return Reserva::with([
            'cliente', 'habitacion.tipo', 'habitacion.piso',
            'tarifa', 'estado', 'usuarioCreacion',
            'ocupaciones', 'pagos.metodoPago', 'registroEstadia',
            'consumos.producto', 'ajustes.usuario',
        ])->findOrFail($id);
    }

    public function crearWalkIn(array $datos, int $idUsuario): Reserva
    {
        return DB::transaction(function () use ($datos, $idUsuario) {
            $tarifa = Tarifa::findOrFail($datos['id_tarifa']);
            $entrada = Carbon::parse($datos['fecha_entrada'] ?? now());
            $salida = $entrada->copy()->addHours($tarifa->horas);

            if (!$this->disponibilidad->estaDisponible($datos['id_habitacion'], $entrada, $salida, null, 0, true)) {
                throw new \InvalidArgumentException('La habitacion no esta disponible en ese horario.');
            }

            $montoHabitacion = (float) $tarifa->monto;
            $descuentoPct = 0;
            $descuentoMonto = 0;
            $descuentoManualTipo = null;
            $descuentoManualMotivo = null;

            // Descuentos manuales (opcionales desde el request)
            $manualesAplicar = [];
            if (!empty($datos['descuento_manual_aniversario'])) {
                $manualesAplicar['aniversario'] = true;
            }
            if (!empty($datos['descuento_manual_cumpleanos'])) {
                $manualesAplicar['cumpleanos'] = true;
            }
            if (!empty($manualesAplicar)) {
                $descuentoManualMotivo = $datos['descuento_manual_motivo'] ?? null;
            }

            if (isset($datos['id_cliente'])) {
                $cliente = Cliente::with('nivel')->find($datos['id_cliente']);
                if ($cliente) {
                    $desc = app(\App\Services\DescuentoService::class)
                        ->calcular($cliente, $entrada, $montoHabitacion, $manualesAplicar);
                    $descuentoPct = $desc['porcentaje'];
                    $descuentoMonto = $desc['monto'];
                    $descuentoManualTipo = $desc['tipo'];
                }
            }

            $total = $montoHabitacion - $descuentoMonto;
            $pagado = (float) ($datos['adelanto'] ?? 0);

            // REGLA: 1 cliente = 1 sola reserva activa
            $reservaActiva = $this->clienteTieneReservaActiva($datos['id_cliente']);
            if ($reservaActiva) {
                $numeroHab = $reservaActiva->habitacion?->numero ?? 'desconocida';
                throw new \InvalidArgumentException(
                    "Este cliente ya tiene una reserva activa en la habitacion {$numeroHab}. " .
                    "Si necesita otra habitacion, registrela a nombre de otra persona (familiar)."
                );
            }

            // REGLA: si hay pago, el metodo es obligatorio (o pagos[] mixtos)
            $pagosMixtos = $datos['pagos'] ?? null;
            $tienePagosMixtos = is_array($pagosMixtos) && count($pagosMixtos) > 0;

            if ($pagado > 0 && empty($datos['id_metodo_pago']) && !$tienePagosMixtos) {
                throw new \InvalidArgumentException(
                    'Debe seleccionar un metodo de pago cuando registra un adelanto.'
                );
            }

            if ($tienePagosMixtos) {
                $sumaPagos = array_sum(array_column($pagosMixtos, 'monto'));
                if (abs($sumaPagos - $pagado) > 0.01) {
                    throw new \InvalidArgumentException(
                        "La suma de los pagos (S/ {$sumaPagos}) no coincide con el adelanto (S/ {$pagado})."
                    );
                }
            }

            $estadoActiva = EstadoReserva::where('slug', 'activa')->firstOrFail();
            $codigo = 'WK-' . strtoupper(Str::random(6));

            $reserva = Reserva::create([
                'codigo_reserva' => $codigo,
                'tipo_reserva' => 'NORMAL',
                'id_estado' => $estadoActiva->id_estado,
                'id_cliente' => $datos['id_cliente'],
                'id_habitacion' => $datos['id_habitacion'],
                'id_tarifa' => $datos['id_tarifa'],
                'id_usuario_creacion' => $idUsuario,
                'cantidad_personas' => $datos['cantidad_personas'] ?? 2,
                'fecha_entrada' => $entrada,
                'fecha_salida_prevista' => $salida,
                'horas_base' => $tarifa->horas,
                'horas_extra' => 0,
                'horas_totales' => $tarifa->horas,
                'monto_habitacion' => $montoHabitacion,
                'monto_horas_extra' => 0,
                'monto_consumos' => 0,
                'monto_ajustes' => 0,
                'descuento' => $descuentoMonto,
                'descuento_porcentaje' => $descuentoPct,
                'descuento_manual_tipo' => $descuentoManualTipo,
                'descuento_manual_motivo' => $descuentoManualMotivo,
                'descuento_manual_usuario_id' => $descuentoManualTipo ? $idUsuario : null,
                'total' => $total,
                'pagado' => $pagado,
                'saldo' => max(0, $total - $pagado),
                'vuelto_entregado' => 0,
                'telefono' => $datos['telefono'] ?? null,
                'notas' => $datos['notas'] ?? null,
                'observaciones' => $datos['observaciones'] ?? null,
            ]);

            OcupacionHabitacion::create([
                'id_habitacion' => $datos['id_habitacion'],
                'id_reserva' => $reserva->id_reserva,
                'fecha_inicio' => $entrada,
                'fecha_fin' => $salida,
                'estado' => 'ACTIVA',
            ]);

            RegistroEstadia::create([
                'id_reserva' => $reserva->id_reserva,
                'fecha_entrada' => $entrada,
                'id_usuario_checkin' => $idUsuario,
            ]);

            if ($tienePagosMixtos) {
                foreach ($pagosMixtos as $pago) {
                    PagoReserva::create([
                        'id_reserva' => $reserva->id_reserva,
                        'id_metodo_pago' => $pago['id_metodo_pago'],
                        'monto' => $pago['monto'],
                        'es_adelanto' => true,
                        'fecha_pago' => now(),
                        'id_usuario' => $idUsuario,
                    ]);
                }
            } elseif ($pagado > 0 && isset($datos['id_metodo_pago'])) {
                PagoReserva::create([
                    'id_reserva' => $reserva->id_reserva,
                    'id_metodo_pago' => $datos['id_metodo_pago'],
                    'monto' => $pagado,
                    'es_adelanto' => true,
                    'fecha_pago' => now(),
                    'id_usuario' => $idUsuario,
                ]);
            }

            // Recalcular pagado = SUM(pagos_reserva) — fuente de verdad
            $totalPagadoReal = PagoReserva::where('id_reserva', $reserva->id_reserva)
                ->where('anulado', false)
                ->sum('monto');

            $reserva->pagado = $totalPagadoReal;
            $reserva->saldo = max(0, (float) $total - $totalPagadoReal);
            $reserva->save();

            $this->clienteVisita->registrar(
                $datos['id_cliente'],
                $reserva->id_reserva,
                $datos['id_habitacion'],
                $montoHabitacion
            );

            return $reserva->fresh(['cliente', 'habitacion', 'tarifa', 'estado']);
        });
    }

    public function crearReserva(array $datos, int $idUsuario): Reserva
    {
        return DB::transaction(function () use ($datos, $idUsuario) {
            $reservaActiva = $this->clienteTieneReservaActiva($datos['id_cliente']);
            if ($reservaActiva) {
                $numeroHab = $reservaActiva->habitacion?->numero ?? 'desconocida';
                throw new \InvalidArgumentException(
                    "Este cliente ya tiene una reserva activa en la habitacion {$numeroHab}. " .
                    "Si necesita otra habitacion, registrela a nombre de otra persona (familiar)."
                );
            }
            $tarifa = Tarifa::findOrFail($datos['id_tarifa']);
            $entrada = Carbon::parse($datos['fecha_entrada']);
            $salida = $entrada->copy()->addHours($tarifa->horas);

            if (!$this->disponibilidad->estaDisponible($datos['id_habitacion'], $entrada, $salida, null, 0, true)) {
                throw new \InvalidArgumentException('La habitacion no esta disponible en ese horario.');
            }

            $montoHabitacion = (float) $tarifa->monto;
            $descuentoPct = 0;
            $descuentoMonto = 0;
            $descuentoManualTipo = null;
            $descuentoManualMotivo = null;

            // Descuentos manuales (opcionales desde el request)
            $manualesAplicar = [];
            if (!empty($datos['descuento_manual_aniversario'])) {
                $manualesAplicar['aniversario'] = true;
            }
            if (!empty($datos['descuento_manual_cumpleanos'])) {
                $manualesAplicar['cumpleanos'] = true;
            }
            if (!empty($manualesAplicar)) {
                $descuentoManualMotivo = $datos['descuento_manual_motivo'] ?? null;
            }

            if (isset($datos['id_cliente'])) {
                $cliente = Cliente::with('nivel')->find($datos['id_cliente']);
                if ($cliente) {
                    $desc = app(\App\Services\DescuentoService::class)
                        ->calcular($cliente, $entrada, $montoHabitacion, $manualesAplicar);
                    $descuentoPct = $desc['porcentaje'];
                    $descuentoMonto = $desc['monto'];
                    $descuentoManualTipo = $desc['tipo'];
                }
            }

            $total = $montoHabitacion - $descuentoMonto;
            $pagado = (float) ($datos['adelanto'] ?? 0);

            $estadoConfirmada = EstadoReserva::where('slug', 'confirmada')->firstOrFail();
            $codigo = $this->generarCodigoReserva($datos);

            $reserva = Reserva::create([
                'codigo_reserva' => $codigo,
                'tipo_reserva' => 'NORMAL',
                'id_estado' => $estadoConfirmada->id_estado,
                'id_cliente' => $datos['id_cliente'],
                'id_habitacion' => $datos['id_habitacion'],
                'id_tarifa' => $datos['id_tarifa'],
                'id_usuario_creacion' => $idUsuario,
                'cantidad_personas' => $datos['cantidad_personas'] ?? 2,
                'fecha_entrada' => $entrada,
                'fecha_salida_prevista' => $salida,
                'horas_base' => $tarifa->horas,
                'horas_extra' => 0,
                'horas_totales' => $tarifa->horas,
                'monto_habitacion' => $montoHabitacion,
                'monto_horas_extra' => 0,
                'monto_consumos' => 0,
                'monto_ajustes' => 0,
                'descuento' => $descuentoMonto,
                'descuento_porcentaje' => $descuentoPct,
                'descuento_manual_tipo' => $descuentoManualTipo,
                'descuento_manual_motivo' => $descuentoManualMotivo,
                'descuento_manual_usuario_id' => $descuentoManualTipo ? $idUsuario : null,
                'total' => $total,
                'pagado' => $pagado,
                'saldo' => max(0, $total - $pagado),
                'vuelto_entregado' => 0,
                'telefono' => $datos['telefono'] ?? null,
                'notas' => $datos['notas'] ?? null,
                'observaciones' => $datos['observaciones'] ?? null,
            ]);

            OcupacionHabitacion::create([
                'id_habitacion' => $datos['id_habitacion'],
                'id_reserva' => $reserva->id_reserva,
                'fecha_inicio' => $entrada,
                'fecha_fin' => $salida,
                'estado' => 'ACTIVA',
            ]);

            if ($pagado > 0 && isset($datos['id_metodo_pago'])) {
                PagoReserva::create([
                    'id_reserva' => $reserva->id_reserva,
                    'id_metodo_pago' => $datos['id_metodo_pago'],
                    'monto' => $pagado,
                    'es_adelanto' => true,
                    'fecha_pago' => now(),
                    'id_usuario' => $idUsuario,
                ]);
            }

            return $reserva->fresh(['cliente', 'habitacion', 'tarifa', 'estado']);
        });
    }

    public function checkIn(int $idReserva, int $idUsuario): Reserva
    {
        return DB::transaction(function () use ($idReserva, $idUsuario) {
            $reserva = Reserva::findOrFail($idReserva);

            if ($reserva->registroEstadia) {
                throw new \InvalidArgumentException('Esta reserva ya tiene check-in.');
            }

            $estadoActiva = EstadoReserva::where('slug', 'activa')->firstOrFail();
            $ahora = Carbon::now();

            $reserva->update([
                'id_estado' => $estadoActiva->id_estado,
                'fecha_entrada' => $ahora,
            ]);

            RegistroEstadia::create([
                'id_reserva' => $idReserva,
                'fecha_entrada' => $ahora,
                'id_usuario_checkin' => $idUsuario,
            ]);

            return $reserva->fresh();
        });
    }

    public function checkOut(int $idReserva, int $idUsuario, ?float $montoFinal = null): Reserva
    {
        return DB::transaction(function () use ($idReserva, $idUsuario, $montoFinal) {
            $reserva = Reserva::with(['registroEstadia', 'consumos'])->findOrFail($idReserva);
            $registro = $reserva->registroEstadia;

            if (!$registro || $registro->fecha_salida) {
                throw new \InvalidArgumentException('Esta reserva no tiene check-in activo.');
            }

            $ahora = Carbon::now();
            $horasReales = $registro->fecha_entrada->diffInHours($ahora);

            $registro->update([
                'fecha_salida' => $ahora,
                'horas_reales' => $horasReales,
                'id_usuario_checkout' => $idUsuario,
                'monto_final' => $montoFinal,
            ]);

            $estadoFinalizada = EstadoReserva::where('slug', 'finalizada')->firstOrFail();

            $totalPagadoReal = PagoReserva::where('id_reserva', $idReserva)
                ->where('anulado', false)
                ->sum('monto');

            $reserva->update([
                'id_estado' => $estadoFinalizada->id_estado,
                'fecha_salida_real' => $ahora,
                'pagado' => $totalPagadoReal,
                'saldo' => max(0, (float) $reserva->total - (float) $totalPagadoReal),
            ]);

            OcupacionHabitacion::where('id_reserva', $idReserva)
                ->update(['estado' => 'LIBERADA']);

            Limpieza::create([
                'id_habitacion' => $reserva->id_habitacion,
                'id_reserva' => $idReserva,
                'estado' => 'PENDIENTE',
                'tipo' => 'NORMAL',
                'fecha_solicitud' => now(),
            ]);

            return $reserva->fresh();
        });
    }

    public function cancelar(int $idReserva, int $idUsuario, string $motivo): Reserva
    {
        return DB::transaction(function () use ($idReserva, $idUsuario, $motivo) {
            $reserva = Reserva::findOrFail($idReserva);
            $estadoCancelada = EstadoReserva::where('slug', 'cancelada')->firstOrFail();

            $reserva->update([
                'id_estado' => $estadoCancelada->id_estado,
                'id_usuario_anulacion' => $idUsuario,
                'fecha_anulacion' => now(),
                'motivo_anulacion' => $motivo,
            ]);

            OcupacionHabitacion::where('id_reserva', $idReserva)
                ->update(['estado' => 'CANCELADA']);

            return $reserva->fresh();
        });
    }

    public function anular(int $idReserva, int $idUsuario, string $motivo): Reserva
    {
        return DB::transaction(function () use ($idReserva, $idUsuario, $motivo) {
            $reserva = Reserva::findOrFail($idReserva);
            $estadoAnulada = EstadoReserva::where('slug', 'anulada')->firstOrFail();

            $reserva->update([
                'id_estado' => $estadoAnulada->id_estado,
                'id_usuario_anulacion' => $idUsuario,
                'fecha_anulacion' => now(),
                'motivo_anulacion' => $motivo,
            ]);

            OcupacionHabitacion::where('id_reserva', $idReserva)
                ->update(['estado' => 'CANCELADA']);

            $registro = RegistroEstadia::where('id_reserva', $idReserva)->first();
            if ($registro && !$registro->fecha_salida) {
                $registro->update([
                    'fecha_salida' => now(),
                    'id_usuario_checkout' => $idUsuario,
                    'observaciones' => 'Anulada: ' . $motivo,
                ]);
            }

            PagoReserva::where('id_reserva', $idReserva)
                ->update([
                    'anulado' => true,
                    'id_usuario_anulacion' => $idUsuario,
                    'fecha_anulacion' => now(),
                    'motivo_anulacion' => 'Anulacion de reserva: ' . $motivo,
                ]);

            return $reserva->fresh();
        });
    }

    public function cambiarHabitacion(
        int $idReserva,
        int $idNuevaHabitacion,
        int $idUsuario,
        string $modoDiferencia = 'AL_FINAL',
        ?int $idMetodoPago = null
    ): Reserva {
        return DB::transaction(function () use ($idReserva, $idNuevaHabitacion, $idUsuario, $modoDiferencia, $idMetodoPago) {
            $reserva = Reserva::with(['ocupaciones', 'tarifa'])->findOrFail($idReserva);
            $ocupacion = $reserva->ocupaciones()->where('estado', 'ACTIVA')->first();

            if (!$ocupacion) {
                throw new \InvalidArgumentException('Esta reserva no tiene ocupacion activa.');
            }

            $idHabitacionVieja = $ocupacion->id_habitacion;
            $fechaInicioOriginal = $ocupacion->fecha_inicio;
            $fechaFinOriginal = $ocupacion->fecha_fin;

            if (!$this->disponibilidad->estaDisponible($idNuevaHabitacion, $fechaInicioOriginal, $fechaFinOriginal, $idReserva)) {
                throw new \InvalidArgumentException('La habitacion destino no esta disponible.');
            }

            $nuevaHabitacion = Habitacion::with('tipo')->findOrFail($idNuevaHabitacion);
            $horasBase = $reserva->horas_base;

            $nuevaTarifa = Tarifa::where('id_tipo', $nuevaHabitacion->id_tipo)
                ->where('horas', $horasBase)
                ->where('activo', true)
                ->first();

            $horasAjustadas = false;

            if (!$nuevaTarifa) {
                $nuevaTarifa = Tarifa::where('id_tipo', $nuevaHabitacion->id_tipo)
                    ->where('activo', true)
                    ->orderBy('horas', 'asc')
                    ->first();

                if ($nuevaTarifa) {
                    $horasAjustadas = true;
                }
            }

            if (!$nuevaTarifa) {
                throw new \InvalidArgumentException(
                    "El tipo {$nuevaHabitacion->tipo->nombre} no tiene tarifas activas."
                );
            }

            $nuevasHoras = $nuevaTarifa->horas;
            $montoAnterior = (float) $reserva->monto_habitacion;
            $montoNuevo = (float) $nuevaTarifa->monto;
            $diferencia = $montoNuevo - $montoAnterior;

            $ocupacion->update(['estado' => 'LIBERADA']);

            Limpieza::create([
                'id_habitacion' => $idHabitacionVieja,
                'id_reserva' => null,
                'estado' => 'PENDIENTE',
                'tipo' => 'NORMAL',
                'fecha_solicitud' => now(),
            ]);

            if ($horasAjustadas) {
                $nuevaFechaFin = $fechaInicioOriginal->copy()->addHours($nuevasHoras);
            } else {
                $nuevaFechaFin = $fechaFinOriginal;
            }

            OcupacionHabitacion::create([
                'id_habitacion' => $idNuevaHabitacion,
                'id_reserva' => $idReserva,
                'fecha_inicio' => $fechaInicioOriginal,
                'fecha_fin' => $nuevaFechaFin,
                'estado' => 'ACTIVA',
            ]);

            $reserva->id_habitacion = $idNuevaHabitacion;
            $reserva->id_tarifa = $nuevaTarifa->id_tarifa;
            $reserva->monto_habitacion = $montoNuevo;

            if ($horasAjustadas) {
                $reserva->horas_base = $nuevasHoras;
                $reserva->horas_totales = $nuevasHoras;
                $reserva->fecha_salida_prevista = $nuevaFechaFin;
            }

            if ($modoDiferencia === 'AHORA' && $diferencia > 0) {
                if (!$idMetodoPago) {
                    throw new \InvalidArgumentException('Seleccione metodo de pago.');
                }
                $reserva->pagado = (float) $reserva->pagado + $diferencia;

                PagoReserva::create([
                    'id_reserva' => $idReserva,
                    'id_metodo_pago' => $idMetodoPago,
                    'monto' => $diferencia,
                    'es_adelanto' => false,
                    'fecha_pago' => now(),
                    'id_usuario' => $idUsuario,
                    'observaciones' => 'Cambio de habitacion',
                ]);
            }

            if ($modoDiferencia === 'AHORA' && $diferencia < 0) {
                $reserva->pagado = (float) $reserva->pagado + $diferencia;
            }

            $reserva->monto_ajustes = (float) $reserva->monto_ajustes + $diferencia;

            $reserva->recalcularTotal();
            $reserva->save();

            ReservaAjuste::create([
                'id_reserva' => $idReserva,
                'tipo' => 'CAMBIO_HABITACION',
                'monto_anterior' => $montoAnterior,
                'monto_nuevo' => $montoNuevo,
                'diferencia' => $diferencia,
                'id_usuario' => $idUsuario,
                'fecha_ajuste' => now(),
                'notas' => "Cambio a habitacion {$nuevaHabitacion->numero}. Modo: {$modoDiferencia}",
            ]);

            return $reserva->fresh(['cliente', 'habitacion', 'tarifa', 'estado']);
        });
    }

    public function agregarConsumo(
        int $idReserva,
        int $idProducto,
        int $cantidad,
        bool $pagado,
        int $idUsuario,
        ?int $idMetodoPago = null,
        ?string $observaciones = null
    ): ReservaConsumo {
        return DB::transaction(function () use ($idReserva, $idProducto, $cantidad, $pagado, $idUsuario, $idMetodoPago, $observaciones) {
            $reserva = Reserva::findOrFail($idReserva);
            $producto = Producto::findOrFail($idProducto);

            if ($cantidad <= 0) {
                throw new \InvalidArgumentException('La cantidad debe ser mayor a 0.');
            }

            if ($producto->stock_actual < $cantidad) {
                throw new \InvalidArgumentException(
                    "Stock insuficiente. Disponible: {$producto->stock_actual}"
                );
            }

            $precioUnitario = (float) $producto->precio_venta;
            $subtotal = round($precioUnitario * $cantidad, 2);

            $consumo = ReservaConsumo::create([
                'id_reserva' => $idReserva,
                'id_producto' => $idProducto,
                'cantidad' => $cantidad,
                'precio_unitario' => $precioUnitario,
                'subtotal' => $subtotal,
                'pagado' => $pagado,
                'id_metodo_pago' => $pagado ? $idMetodoPago : null,
                'id_usuario' => $idUsuario,
                'fecha_consumo' => now(),
                'observaciones' => $observaciones,
            ]);

            $producto->decrement('stock_actual', $cantidad);

            if (!$pagado) {
                $reserva->monto_consumos = (float) $reserva->monto_consumos + $subtotal;
                $reserva->recalcularTotal();
                $reserva->save();
            } else {
                if ($idMetodoPago) {
                    PagoReserva::create([
                        'id_reserva' => $idReserva,
                        'id_metodo_pago' => $idMetodoPago,
                        'monto' => $subtotal,
                        'es_adelanto' => false,
                        'fecha_pago' => now(),
                        'id_usuario' => $idUsuario,
                        'observaciones' => 'Consumo: ' . $producto->nombre,
                    ]);

                    $reserva->pagado = (float) $reserva->pagado + $subtotal;
                    $reserva->save();
                }
            }

            return $consumo->fresh(['producto', 'metodoPago']);
        });
    }

    public function eliminarConsumo(int $idConsumo, int $idUsuario): void
    {
        DB::transaction(function () use ($idConsumo, $idUsuario) {
            $consumo = ReservaConsumo::with('producto')->findOrFail($idConsumo);
            $reserva = Reserva::findOrFail($consumo->id_reserva);

            $consumo->producto->increment('stock_actual', $consumo->cantidad);

            if (!$consumo->pagado) {
                $reserva->monto_consumos = max(0, (float) $reserva->monto_consumos - (float) $consumo->subtotal);
                $reserva->recalcularTotal();
                $reserva->save();
            }

            $consumo->delete();
        });
    }

    public function agregarExtension(
        int $idReserva,
        int $horasExtra,
        bool $cargarACuenta,
        int $idUsuario,
        ?int $idMetodoPago = null,
        bool $esTurnoAdicional = false,
        ?string $observaciones = null
    ): Reserva {
        return DB::transaction(function () use ($idReserva, $horasExtra, $cargarACuenta, $idUsuario, $idMetodoPago, $esTurnoAdicional, $observaciones) {
            $reserva = Reserva::with('tarifa')->findOrFail($idReserva);
            $tarifa = $reserva->tarifa;

            if (!$tarifa) {
                throw new \InvalidArgumentException('La reserva no tiene tarifa asociada.');
            }

            $precioHora = (float) $tarifa->precio_hora_extra;
            $precioTurno = (float) $tarifa->precio_turno_adicional;
            $monto = $esTurnoAdicional ? $precioTurno : ($horasExtra * $precioHora);

            $tolerancia = Configuracion::obtener('tolerancia_extension_minutos', 30);

            $entrada = Carbon::parse($reserva->fecha_entrada);
            $ahora = Carbon::now();
            $minutosTranscurridos = (int) round(abs($entrada->diffInMinutes($ahora)));
            $minutosExceso = max(0, $minutosTranscurridos - ($reserva->horas_base * 60));

            ExtensionReserva::create([
                'id_reserva' => $idReserva,
                'horas_extra' => $horasExtra,
                'monto' => $monto,
                'es_turno_adicional' => $esTurnoAdicional,
                'minutos_exceso' => $minutosExceso,
                'precio_hora_extra_aplicado' => $precioHora,
                'tolerancia_minutos' => $tolerancia,
                'pagado_inmediato' => !$cargarACuenta && $idMetodoPago !== null,
                'cargado_a_cuenta' => $cargarACuenta,
                'id_metodo_pago' => $idMetodoPago,
                'id_usuario' => $idUsuario,
                'fecha_extension' => now(),
                'observaciones' => $observaciones,
            ]);

            $reserva->monto_horas_extra = (float) $reserva->monto_horas_extra + $monto;

            if ($esTurnoAdicional) {
                $horasExtraTurno = $tarifa->horas;
                $reserva->horas_extra = (int) $reserva->horas_extra + $horasExtraTurno;
                $reserva->horas_totales = (int) $reserva->horas_totales + $horasExtraTurno;
                $reserva->fecha_salida_prevista = Carbon::parse($reserva->fecha_salida_prevista)->addHours($horasExtraTurno);
            } else {
                $reserva->horas_extra = (int) $reserva->horas_extra + $horasExtra;
                $reserva->horas_totales = (int) $reserva->horas_totales + $horasExtra;
                $reserva->fecha_salida_prevista = Carbon::parse($reserva->fecha_salida_prevista)->addHours($horasExtra);
            }

            if (!$cargarACuenta && $idMetodoPago) {
                PagoReserva::create([
                    'id_reserva' => $idReserva,
                    'id_metodo_pago' => $idMetodoPago,
                    'monto' => $monto,
                    'es_adelanto' => false,
                    'fecha_pago' => now(),
                    'id_usuario' => $idUsuario,
                    'observaciones' => 'Extension de tiempo: ' . ($esTurnoAdicional ? 'Turno adicional' : "{$horasExtra}h extra"),
                ]);

                $reserva->pagado = (float) $reserva->pagado + $monto;
            }

            $reserva->recalcularTotal();
            $reserva->save();

            return $reserva->fresh(['cliente', 'habitacion', 'tarifa', 'estado', 'extensiones']);
        });
    }

    public function listarExtensiones(int $idReserva): \Illuminate\Support\Collection
    {
        return ExtensionReserva::with(['metodoPago', 'usuario'])
            ->where('id_reserva', $idReserva)
            ->orderByDesc('id_extension')
            ->get();
    }

    public function agregarPago(int $idReserva, array $datos, int $idUsuario): Reserva
    {
        return DB::transaction(function () use ($idReserva, $datos, $idUsuario) {
            $reserva = Reserva::with('estado')->findOrFail($idReserva);

            if ($reserva->estado?->slug === 'finalizada') {
                throw new \InvalidArgumentException('No se pueden agregar pagos a una reserva finalizada.');
            }

            $monto = (float) $datos['monto'];
            if ($monto <= 0) {
                throw new \InvalidArgumentException('El monto debe ser mayor a 0.');
            }

            PagoReserva::create([
                'id_reserva' => $idReserva,
                'id_metodo_pago' => $datos['id_metodo_pago'],
                'monto' => $monto,
                'es_adelanto' => false,
                'fecha_pago' => now(),
                'id_usuario' => $idUsuario,
                'observaciones' => $datos['observaciones'] ?? 'Pago adicional',
            ]);

            $totalPagadoReal = PagoReserva::where('id_reserva', $idReserva)
                ->where('anulado', false)
                ->sum('monto');

            $reserva->pagado = $totalPagadoReal;
            $reserva->saldo = max(0, (float) $reserva->total - $totalPagadoReal);
            $reserva->save();

            return $reserva->fresh()->load([
                'cliente', 'habitacion.tipo', 'tarifa', 'estado',
                'consumos.producto', 'extensiones', 'ajustes',
                'pagos.metodoPago', 'pagos.usuario',
            ]);
        });
    }

    public function anularPago(int $idPago, int $idUsuario, string $motivo): Reserva
    {
        return DB::transaction(function () use ($idPago, $idUsuario, $motivo) {
            $pago = PagoReserva::findOrFail($idPago);
            $pago->update([
                'anulado' => true,
                'id_usuario_anulacion' => $idUsuario,
                'fecha_anulacion' => now(),
                'motivo_anulacion' => $motivo,
            ]);

            $reserva = Reserva::findOrFail($pago->id_reserva);

            $totalPagadoReal = PagoReserva::where('id_reserva', $reserva->id_reserva)
                ->where('anulado', false)
                ->sum('monto');

            $reserva->pagado = $totalPagadoReal;
            $reserva->saldo = max(0, (float) $reserva->total - $totalPagadoReal);
            $reserva->save();

            return $reserva->fresh()->load([
                'cliente', 'habitacion.tipo', 'tarifa', 'estado',
                'consumos.producto', 'extensiones', 'ajustes',
                'pagos.metodoPago', 'pagos.usuario',
            ]);
        });
    }

    public function entregarVuelto(int $idReserva, float $monto, int $idMetodoPago, int $idUsuario): Reserva
    {
        return DB::transaction(function () use ($idReserva, $monto, $idMetodoPago, $idUsuario) {
            $reserva = Reserva::with('estado')->findOrFail($idReserva);

            if ($reserva->estado?->slug === 'finalizada') {
                throw new \InvalidArgumentException('No se puede entregar vuelto a una reserva finalizada.');
            }

            if ($monto <= 0) {
                throw new \InvalidArgumentException('El monto debe ser mayor a 0.');
            }

            $vueltoPendiente = (float) $reserva->pagado - (float) $reserva->total;

            if ($vueltoPendiente <= 0.01) {
                throw new \InvalidArgumentException(
                    'No hay vuelto pendiente para esta reserva. ' .
                    "(Pagado: S/ {$reserva->pagado}, Total: S/ {$reserva->total})"
                );
            }

            if ($monto > $vueltoPendiente + 0.01) {
                throw new \InvalidArgumentException(
                    "El monto (S/ {$monto}) excede el vuelto pendiente (S/ {$vueltoPendiente})."
                );
            }

            PagoReserva::create([
                'id_reserva' => $idReserva,
                'id_metodo_pago' => $idMetodoPago,
                'monto' => -$monto,
                'es_adelanto' => false,
                'fecha_pago' => now(),
                'id_usuario' => $idUsuario,
                'observaciones' => 'Vuelto entregado al cliente',
            ]);

            $nuevoPagado = PagoReserva::where('id_reserva', $idReserva)
                ->where('anulado', false)
                ->sum('monto');

            $reserva->pagado = $nuevoPagado;
            $reserva->saldo = max(0, (float) $reserva->total - $nuevoPagado);
            $reserva->save();

            return $reserva->fresh()->load([
                'cliente', 'habitacion.tipo', 'habitacion.piso',
                'tarifa', 'estado', 'usuarioCreacion',
                'ocupaciones', 'pagos.metodoPago', 'registroEstadia',
                'consumos.producto', 'ajustes.usuario',
            ]);
        });
    }

    public function clienteTieneReservaActiva(int $idCliente): ?Reserva
    {
        return Reserva::with(['habitacion'])
            ->where('id_cliente', $idCliente)
            ->whereHas('estado', function ($q) {
                $q->where('slug', 'activa');
            })
            ->first();
    }

    public function checkOutConVuelto(
        int $idReserva,
        int $idUsuario,
        ?float $montoFinal,
        string $decisionTipo,
        ?int $idMetodoPago = null,
        ?string $observaciones = null
    ): Reserva {
        return DB::transaction(function () use ($idReserva, $idUsuario, $montoFinal, $decisionTipo, $idMetodoPago, $observaciones) {
            $reserva = Reserva::findOrFail($idReserva);

            $vueltoPendiente = (float) $reserva->pagado - (float) $reserva->total;

            if ($vueltoPendiente <= 0.01) {
                throw new \InvalidArgumentException(
                    'No hay vuelto pendiente para esta reserva. ' .
                    "(Pagado: S/ {$reserva->pagado}, Total: S/ {$reserva->total})"
                );
            }

            if ($decisionTipo === 'ENTREGADO') {
                if (!$idMetodoPago) {
                    throw new \InvalidArgumentException('Seleccione un metodo para entregar el vuelto.');
                }

                PagoReserva::create([
                    'id_reserva' => $idReserva,
                    'id_metodo_pago' => $idMetodoPago,
                    'monto' => -$vueltoPendiente,
                    'es_adelanto' => false,
                    'fecha_pago' => now(),
                    'id_usuario' => $idUsuario,
                    'observaciones' => $observaciones ?? 'Vuelto entregado al cliente',
                ]);

                $nuevoPagado = PagoReserva::where('id_reserva', $idReserva)
                    ->where('anulado', false)
                    ->sum('monto');

                $reserva->pagado = $nuevoPagado;
                $reserva->saldo = max(0, (float) $reserva->total - $nuevoPagado);
                $reserva->save();
            } elseif ($decisionTipo === 'NO_RECLAMADO') {
                $reserva->observaciones = $observaciones ?? 'Cliente se retiro sin reclamar el vuelto de S/ ' . number_format($vueltoPendiente, 2);
                $reserva->save();
            } elseif ($decisionTipo === 'OTRO') {
                if (!$observaciones) {
                    throw new \InvalidArgumentException('Se requiere una observacion para esta decision.');
                }
                $reserva->observaciones = $observaciones;
                $reserva->save();
            } else {
                throw new \InvalidArgumentException('Decision invalida sobre el vuelto.');
            }

            return $this->checkOut($idReserva, $idUsuario, null);
        });
    }

    public function checkOutConDeuda(
        int $idReserva,
        int $idUsuario,
        ?float $montoFinal,
        string $decisionTipo,
        ?float $montoPago = null,
        ?int $idMetodoPago = null,
        ?int $idGravedad = null,
        ?string $motivo = null
    ): Reserva {
        return DB::transaction(function () use ($idReserva, $idUsuario, $montoFinal, $decisionTipo, $montoPago, $idMetodoPago, $idGravedad, $motivo) {
            $reserva = Reserva::findOrFail($idReserva);

            $deudaPendiente = (float) $reserva->total - (float) $reserva->pagado;

            if ($deudaPendiente <= 0.01) {
                throw new \InvalidArgumentException(
                    'No hay deuda pendiente para esta reserva. ' .
                    "(Total: S/ {$reserva->total}, Pagado: S/ {$reserva->pagado})"
                );
            }

            if ($decisionTipo === 'PAGO') {
                if (!$idMetodoPago) {
                    throw new \InvalidArgumentException('Seleccione un metodo de pago.');
                }
                if (!$montoPago || $montoPago <= 0) {
                    throw new \InvalidArgumentException('El monto debe ser mayor a 0.');
                }

                PagoReserva::create([
                    'id_reserva' => $idReserva,
                    'id_metodo_pago' => $idMetodoPago,
                    'monto' => $montoPago,
                    'es_adelanto' => false,
                    'fecha_pago' => now(),
                    'id_usuario' => $idUsuario,
                    'observaciones' => 'Pago al salir (cierre de deuda)',
                ]);

                $nuevoPagado = PagoReserva::where('id_reserva', $idReserva)
                    ->where('anulado', false)
                    ->sum('monto');

                $reserva->pagado = $nuevoPagado;
                $reserva->saldo = max(0, (float) $reserva->total - $nuevoPagado);
                $reserva->save();
            } elseif ($decisionTipo === 'NO_PAGO') {
                if (!$idGravedad || !$motivo) {
                    throw new \InvalidArgumentException('Se requiere gravedad y motivo para registrar la deuda.');
                }

                $tipoDeuda = TipoObservacion::where('slug', 'deuda')->firstOrFail();

                \App\Models\ClienteObservacion::create([
                    'id_cliente' => $reserva->id_cliente,
                    'id_tipo_observacion' => $tipoDeuda->id_tipo_observacion,
                    'id_gravedad' => $idGravedad,
                    'motivo' => $motivo,
                    'monto_deuda' => $deudaPendiente,
                    'resuelto' => false,
                    'id_usuario_creacion' => $idUsuario,
                ]);

                $reserva->observaciones = 'Cliente se retiro debiendo S/ ' . number_format($deudaPendiente, 2) . '. ' . $motivo;
                $reserva->save();
            } else {
                throw new \InvalidArgumentException('Decision invalida sobre la deuda.');
            }

            return $this->checkOut($idReserva, $idUsuario, null);
        });
    }

    public function agregarConsumosMultiple(
        int $idReserva,
        array $consumos,
        array $pagos,
        bool $cargarACuenta,
        int $idUsuario,
        ?string $observaciones = null
    ): Reserva {
        return DB::transaction(function () use ($idReserva, $consumos, $pagos, $cargarACuenta, $idUsuario, $observaciones) {
            $reserva = Reserva::with('estado')->findOrFail($idReserva);

            if ($reserva->estado?->slug === 'finalizada') {
                throw new \InvalidArgumentException('No se pueden agregar consumos a una reserva finalizada.');
            }

            if (empty($consumos)) {
                throw new \InvalidArgumentException('Debe agregar al menos un producto.');
            }

            $productosValidados = [];
            foreach ($consumos as $item) {
                $producto = Producto::findOrFail($item['id_producto']);
                $cantidad = (int) $item['cantidad'];

                if ($cantidad <= 0) {
                    throw new \InvalidArgumentException(
                        "La cantidad debe ser mayor a 0 para '{$producto->nombre}'."
                    );
                }

                if ($producto->stock_actual < $cantidad) {
                    throw new \InvalidArgumentException(
                        "Stock insuficiente para '{$producto->nombre}'. Disponible: {$producto->stock_actual}."
                    );
                }

                $productosValidados[] = [
                    'producto' => $producto,
                    'cantidad' => $cantidad,
                    'subtotal' => round((float) $producto->precio_venta * $cantidad, 2),
                ];
            }

            $totalConsumos = array_sum(array_column($productosValidados, 'subtotal'));

            $consumosCreados = [];
            foreach ($productosValidados as $item) {
                $consumo = ReservaConsumo::create([
                    'id_reserva' => $idReserva,
                    'id_producto' => $item['producto']->id_producto,
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => (float) $item['producto']->precio_venta,
                    'subtotal' => $item['subtotal'],
                    'pagado' => false,
                    'id_metodo_pago' => null,
                    'id_usuario' => $idUsuario,
                    'fecha_consumo' => now(),
                    'observaciones' => $observaciones,
                ]);

                $item['producto']->decrement('stock_actual', $item['cantidad']);
                $consumosCreados[] = $consumo;
            }

            $totalPagadoConsumos = 0;
            if (!empty($pagos)) {
                foreach ($pagos as $pago) {
                    $monto = (float) $pago['monto'];
                    if ($monto <= 0) {
                        throw new \InvalidArgumentException('Cada pago debe ser mayor a 0.');
                    }

                    PagoReserva::create([
                        'id_reserva' => $idReserva,
                        'id_metodo_pago' => $pago['id_metodo_pago'],
                        'monto' => $monto,
                        'es_adelanto' => false,
                        'fecha_pago' => now(),
                        'id_usuario' => $idUsuario,
                        'observaciones' => 'Consumo: ' . count($consumosCreados) . ' producto(s)',
                    ]);

                    $totalPagadoConsumos += $monto;
                }
            }

            $saldoConsumos = $totalConsumos - $totalPagadoConsumos;

            if ($cargarACuenta && $saldoConsumos > 0.01) {
                $reserva->monto_consumos = (float) $reserva->monto_consumos + $saldoConsumos;
            } elseif (!$cargarACuenta && $saldoConsumos > 0.01) {
                throw new \InvalidArgumentException(
                    "El pago (S/ {$totalPagadoConsumos}) no cubre el total de consumos (S/ {$totalConsumos}). " .
                    "Activa 'cargar a cuenta' o cobra el resto."
                );
            }

            $reserva->recalcularTotal();

            $totalPagadoReal = PagoReserva::where('id_reserva', $idReserva)
                ->where('anulado', false)
                ->sum('monto');

            $reserva->pagado = $totalPagadoReal;
            $reserva->saldo = max(0, (float) $reserva->total - $totalPagadoReal);
            $reserva->save();

            return $reserva->fresh()->load([
                'cliente', 'habitacion.tipo', 'tarifa', 'estado',
                'consumos.producto', 'extensiones', 'ajustes',
                'pagos.metodoPago', 'pagos.usuario',
            ]);
        });
    }

    public function listarProximasConAlerta(): \Illuminate\Support\Collection
    {
        $ahora = Carbon::now();
        $horasAntes = Configuracion::obtener('horas_antes_bloqueo_reserva', 4);
        $limite = $ahora->copy()->addHours($horasAntes);

        $reservas = Reserva::with(['cliente', 'habitacion.piso', 'habitacion.tipo', 'estado', 'ocupaciones'])
            ->whereHas('estado', function ($q) {
                $q->whereIn('slug', ['confirmada', 'pendiente']);
            })
            ->where('fecha_entrada', '>=', $ahora)
            ->where('fecha_entrada', '<=', $limite)
            ->orderBy('fecha_entrada')
            ->get();

        return $reservas->map(function ($r) use ($ahora) {
            $minutosParaEntrada = (int) round($ahora->diffInMinutes($r->fecha_entrada, false));

            $ocupacionActual = OcupacionHabitacion::with(['reserva.cliente'])
                ->where('id_habitacion', $r->id_habitacion)
                ->where('estado', 'ACTIVA')
                ->where('fecha_inicio', '<=', $ahora)
                ->where('fecha_fin', '>=', $ahora)
                ->where('id_reserva', '!=', $r->id_reserva)
                ->first();

            return [
                'id_reserva' => $r->id_reserva,
                'codigo_reserva' => $r->codigo_reserva,
                'cliente' => $r->cliente?->nombre . ' ' . $r->cliente?->apellido,
                'telefono' => $r->telefono ?? $r->cliente?->celular,
                'habitacion' => [
                    'id_habitacion' => $r->habitacion?->id_habitacion,
                    'numero' => $r->habitacion?->numero,
                    'piso' => $r->habitacion?->piso?->nombre,
                    'tipo' => $r->habitacion?->tipo?->nombre,
                ],
                'fecha_entrada' => $r->fecha_entrada->toIso8601String(),
                'minutos_para_entrada' => $minutosParaEntrada,
                'estado_reserva' => $r->estado?->slug,
                'alerta_reserva_ocupada' => $ocupacionActual !== null,
                'cliente_actual' => $ocupacionActual?->reserva?->cliente?->nombre,
                'id_reserva_actual' => $ocupacionActual?->reserva?->id_reserva,
                'fecha_fin_ocupacion_actual' => $ocupacionActual?->fecha_fin?->toIso8601String(),
            ];
        });
    }

    public function listarHoy(): \Illuminate\Support\Collection
    {
        return Reserva::with(['cliente', 'habitacion.piso', 'estado'])
            ->whereDate('fecha_entrada', Carbon::today())
            ->whereHas('estado', function ($q) {
                $q->whereIn('slug', ['confirmada', 'pendiente']);
            })
            ->orderBy('fecha_entrada')
            ->get();
    }

    public function listarProximasCheckIn(): \Illuminate\Support\Collection
    {
        $ahora = Carbon::now();
        $tolerancia = Configuracion::obtener('tolerancia_no_show_minutos', 60);

        return Reserva::with(['cliente', 'habitacion.piso', 'estado'])
            ->whereHas('estado', function ($q) {
                $q->whereIn('slug', ['confirmada', 'pendiente']);
            })
            ->where('fecha_entrada', '<=', $ahora->copy()->addMinutes($tolerancia))
            ->where('fecha_entrada', '>=', $ahora->copy()->subMinutes($tolerancia))
            ->orderBy('fecha_entrada')
            ->get();
    }

    public function procesarNoShow(): int
    {
        return DB::transaction(function () {
            $ahora = Carbon::now();
            $tolerancia = Configuracion::obtener('tolerancia_no_show_minutos', 60);
            $limite = $ahora->copy()->subMinutes($tolerancia);

            $reservas = Reserva::with('estado')
                ->whereHas('estado', function ($q) {
                    $q->whereIn('slug', ['confirmada', 'pendiente']);
                })
                ->where('fecha_entrada', '<', $limite)
                ->get();

            $contador = 0;
            $estadoNoShow = EstadoReserva::where('slug', 'no-show')->first();

            if (!$estadoNoShow) {
                throw new \RuntimeException('No existe el estado No-Show.');
            }

            foreach ($reservas as $reserva) {
                $reserva->update([
                    'id_estado' => $estadoNoShow->id_estado,
                    'observaciones' => ($reserva->observaciones ?? '') . ' [No-Show automatico]',
                ]);

                OcupacionHabitacion::where('id_reserva', $reserva->id_reserva)
                    ->update(['estado' => 'LIBERADA']);

                $contador++;
            }

            return $contador;
        });
    }

    public function listarDisponiblesEnRango(Carbon $inicio, Carbon $fin, int $horas, int $horasAntesDecoracion = 0): \Illuminate\Support\Collection
    {
        $libres = $this->disponibilidad->habitacionesLibresConInfo($inicio, $fin, $horasAntesDecoracion);

        return $libres->filter(function ($h) use ($horas) {
            return Tarifa::where('id_tipo', $h->id_tipo)
                ->where('horas', $horas)
                ->where('activo', true)
                ->exists();
        })->values();
    }

    public function listarConConflictoEnRango(Carbon $inicio, Carbon $fin, int $horasAntesDecoracion = 0): \Illuminate\Support\Collection
    {
        return $this->disponibilidad->habitacionesConConflicto($inicio, $fin, $horasAntesDecoracion);
    }

    public function listarSoloReservas(): \Illuminate\Support\Collection
    {
        return Reserva::with([
            'cliente', 'habitacion.piso', 'habitacion.tipo', 'tarifa', 'estado', 'usuarioCreacion'
        ])
            ->where('codigo_reserva', 'LIKE', 'RES-%')
            ->orderByDesc('fecha_entrada')
            ->get()
            ->values();
    }

    public function listarSoloWalkIns(): \Illuminate\Support\Collection
    {
        return Reserva::with([
            'cliente', 'habitacion.piso', 'habitacion.tipo', 'tarifa', 'estado', 'usuarioCreacion',
            'registroEstadia'
        ])
            ->where('codigo_reserva', 'LIKE', 'WK-%')
            ->orderByDesc('fecha_entrada')
            ->get()
            ->values();
    }

    public function listarHistorialCompleto(): \Illuminate\Support\Collection
    {
        return Reserva::with([
            'cliente', 'habitacion.piso', 'habitacion.tipo', 'tarifa', 'estado', 'usuarioCreacion'
        ])
            ->orderByDesc('fecha_entrada')
            ->get();
    }

    public function obtenerInfoCheckIn(int $idReserva): array
    {
        $reserva = Reserva::with([
            'cliente.nivel',
            'habitacion.piso',
            'habitacion.tipo',
            'tarifa',
            'estado',
            'pagos.metodoPago',
            'usuarioCreacion',
        ])->findOrFail($idReserva);

        $observaciones = \App\Models\ClienteObservacion::with(['tipo', 'gravedad'])
            ->where('id_cliente', $reserva->id_cliente)
            ->where('resuelto', false)
            ->get();

        $yaTieneCheckIn = $reserva->registroEstadia !== null;

        $ahora = Carbon::now();
        $habitacionDisponible = $this->disponibilidad->estaDisponible(
            $reserva->id_habitacion,
            $ahora,
            $ahora->copy()->addHours((int) $reserva->horas_base),
            $reserva->id_reserva,
            0,
            true
        );

        $ocupacionActual = null;
        if (!$habitacionDisponible) {
            $ocupacion = OcupacionHabitacion::with(['reserva.cliente'])
                ->where('id_habitacion', $reserva->id_habitacion)
                ->where('estado', 'ACTIVA')
                ->where('id_reserva', '!=', $reserva->id_reserva)
                ->where('fecha_inicio', '<=', $ahora)
                ->where('fecha_fin', '>=', $ahora)
                ->first();

            if ($ocupacion) {
                $ocupacionActual = [
                    'id_reserva' => $ocupacion->reserva?->id_reserva,
                    'codigo_reserva' => $ocupacion->reserva?->codigo_reserva,
                    'cliente' => $ocupacion->reserva?->cliente?->nombre . ' ' . $ocupacion->reserva?->cliente?->apellido,
                    'fecha_fin' => $ocupacion->fecha_fin?->toIso8601String(),
                ];
            }
        }

        $estadoSlug = $reserva->estado?->slug;
        $esConfirmada = in_array($estadoSlug, ['confirmada', 'pendiente']);
        $esActiva = $estadoSlug === 'activa';
        $esCerrada = in_array($estadoSlug, ['finalizada', 'cancelada', 'anulada', 'no-show']);

        $puedeCheckIn = $esConfirmada && !$yaTieneCheckIn && $habitacionDisponible;

        $motivoBloqueo = null;
        if (!$esConfirmada) {
            $motivoBloqueo = $esActiva
                ? 'Esta reserva ya tiene check-in activo.'
                : 'Esta reserva no esta en estado confirmada.';
        } elseif ($yaTieneCheckIn) {
            $motivoBloqueo = 'Esta reserva ya tiene check-in hecho.';
        } elseif (!$habitacionDisponible) {
            $motivoBloqueo = 'La habitacion esta ocupada por otro cliente. Resolver el conflicto primero.';
        }

        return [
            'reserva' => $reserva,
            'observaciones_pendientes' => $observaciones,
            'puede_check_in' => $puedeCheckIn,
            'motivo_bloqueo' => $motivoBloqueo,
            'ya_tiene_check_in' => $yaTieneCheckIn,
            'es_confirmada' => $esConfirmada,
            'es_activa' => $esActiva,
            'es_cerrada' => $esCerrada,
            'habitacion_disponible' => $habitacionDisponible,
            'ocupacion_actual' => $ocupacionActual,
            'saldo_pendiente' => max(0, (float) $reserva->total - (float) $reserva->pagado),
        ];
    }

    public function checkInValidado(int $idReserva, int $idUsuario): Reserva
    {
        return DB::transaction(function () use ($idReserva, $idUsuario) {
            $reserva = Reserva::with(['habitacion'])->findOrFail($idReserva);

            $estadoSlug = $reserva->estado?->slug;
            if (!in_array($estadoSlug, ['confirmada', 'pendiente'])) {
                throw new \InvalidArgumentException(
                    'Esta reserva no esta en estado confirmada (actual: ' . ($estadoSlug ?? 'desconocido') . ').'
                );
            }

            if ($reserva->registroEstadia) {
                throw new \InvalidArgumentException('Esta reserva ya tiene check-in hecho.');
            }

            $fechaEntradaOriginal = Carbon::parse($reserva->fecha_entrada);
            $fechaSalidaOriginal = Carbon::parse($reserva->fecha_salida_prevista);

            $otraOcupacion = OcupacionHabitacion::where('id_habitacion', $reserva->id_habitacion)
                ->where('estado', 'ACTIVA')
                ->where('id_reserva', '!=', $reserva->id_reserva)
                ->where('fecha_inicio', '<=', Carbon::now())
                ->where('fecha_fin', '>=', Carbon::now())
                ->first();

            if ($otraOcupacion) {
                throw new \InvalidArgumentException(
                    'La habitacion esta ocupada por otro cliente. Resolver el conflicto antes de hacer check-in.'
                );
            }

            $estadoActiva = EstadoReserva::where('slug', 'activa')->firstOrFail();

            $reserva->update([
                'id_estado' => $estadoActiva->id_estado,
            ]);

            RegistroEstadia::create([
                'id_reserva' => $idReserva,
                'fecha_entrada' => $fechaEntradaOriginal,
                'id_usuario_checkin' => $idUsuario,
            ]);

            $this->clienteVisita->registrar(
                $reserva->id_cliente,
                $idReserva,
                $reserva->id_habitacion,
                (float) $reserva->monto_habitacion
            );

            return $reserva->fresh([
                'cliente', 'habitacion.tipo', 'habitacion.piso', 'tarifa', 'estado'
            ]);
        });
    }

    private function generarCodigoReserva(array $datos): string
    {
        $prefijo = !empty($datos['con_decoracion']) ? 'DEC-' : 'RES-';

        do {
            $codigo = $prefijo . strtoupper(Str::random(6));
        } while (Reserva::where('codigo_reserva', $codigo)->exists());

        return $codigo;
    }

    public function listarSoloDecoraciones(): \Illuminate\Support\Collection
    {
        return Reserva::with([
            'cliente', 'habitacion.piso', 'habitacion.tipo', 'tarifa', 'estado', 'usuarioCreacion'
        ])
            ->where('codigo_reserva', 'LIKE', 'DEC-%')
            ->orderByDesc('fecha_entrada')
            ->get()
            ->values();
    }
}
