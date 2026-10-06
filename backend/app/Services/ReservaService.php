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
            'cliente', 'habitacion', 'tarifa', 'estado', 'usuarioCreacion'
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

    /**
     * Crea un WALK-IN (cliente físico ahora).
     * Regla de oro: el cliente DEBE pagar la habitación.
     */
    public function crearWalkIn(array $datos, int $idUsuario): Reserva
    {
        return DB::transaction(function () use ($datos, $idUsuario) {
            $tarifa = Tarifa::findOrFail($datos['id_tarifa']);
            $entrada = Carbon::parse($datos['fecha_entrada'] ?? now());
            $salida = $entrada->copy()->addHours($tarifa->horas);

            if (!$this->disponibilidad->estaDisponible($datos['id_habitacion'], $entrada, $salida)) {
                throw new \InvalidArgumentException('La habitación no está disponible en ese horario.');
            }

            $montoHabitacion = (float) $tarifa->monto;
            $descuentoPct = 0;
            $descuentoMonto = 0;

            if (isset($datos['id_cliente'])) {
                $cliente = Cliente::with('nivel')->find($datos['id_cliente']);
                if ($cliente && $cliente->nivel) {
                    $descuentoPct = (float) $cliente->nivel->descuento;
                    $descuentoMonto = round($montoHabitacion * ($descuentoPct / 100), 2);
                }
            }

            $total = $montoHabitacion - $descuentoMonto;
            $pagado = (float) ($datos['adelanto'] ?? 0);

            // Regla: si el pago parcial es menor al total, se permite pero queda registrado como deuda
            // (el campo 'saldo' lo refleja automáticamente)

            // REGLA: 1 cliente = 1 sola reserva activa
            $reservaActiva = $this->clienteTieneReservaActiva($datos['id_cliente']);
            if ($reservaActiva) {
                $numeroHab = $reservaActiva->habitacion?->numero ?? 'desconocida';
                throw new \InvalidArgumentException(
                    "Este cliente ya tiene una reserva activa en la habitación {$numeroHab}. " .
                    "Si necesita otra habitación, regístrela a nombre de otra persona (familiar)."
                );
            }

            // REGLA: si hay pago, el método es obligatorio (o pagos[] mixtos)
            $pagosMixtos = $datos['pagos'] ?? null;
            $tienePagosMixtos = is_array($pagosMixtos) && count($pagosMixtos) > 0;

            if ($pagado > 0 && empty($datos['id_metodo_pago']) && !$tienePagosMixtos) {
                throw new \InvalidArgumentException(
                    'Debe seleccionar un método de pago cuando registra un adelanto.'
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

            $vueltoEntregado = 0; // Por defecto se guarda como saldo a favor

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
                'total' => $total,
                'pagado' => $pagado,
                'saldo' => max(0, $total - $pagado),
                'vuelto_entregado' => $vueltoEntregado,
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

            // Registrar pago(s) de la habitación
            if ($tienePagosMixtos) {
                // Pagos mixtos: uno por cada método
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
                // Pago único
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
            // REGLA: 1 cliente = 1 sola reserva activa
            $reservaActiva = $this->clienteTieneReservaActiva($datos['id_cliente']);
            if ($reservaActiva) {
                $numeroHab = $reservaActiva->habitacion?->numero ?? 'desconocida';
                throw new \InvalidArgumentException(
                    "Este cliente ya tiene una reserva activa en la habitación {$numeroHab}. " .
                    "Si necesita otra habitación, regístrela a nombre de otra persona (familiar)."
                );
            }
            $tarifa = Tarifa::findOrFail($datos['id_tarifa']);
            $entrada = Carbon::parse($datos['fecha_entrada']);
            $salida = $entrada->copy()->addHours($tarifa->horas);

            if (!$this->disponibilidad->estaDisponible($datos['id_habitacion'], $entrada, $salida)) {
                throw new \InvalidArgumentException('La habitación no está disponible en ese horario.');
            }

            $montoHabitacion = (float) $tarifa->monto;
            $descuentoPct = 0;
            $descuentoMonto = 0;

            if (isset($datos['id_cliente'])) {
                $cliente = Cliente::with('nivel')->find($datos['id_cliente']);
                if ($cliente && $cliente->nivel) {
                    $descuentoPct = (float) $cliente->nivel->descuento;
                    $descuentoMonto = round($montoHabitacion * ($descuentoPct / 100), 2);
                }
            }

            $total = $montoHabitacion - $descuentoMonto;
            $pagado = (float) ($datos['adelanto'] ?? 0);

            $estadoConfirmada = EstadoReserva::where('slug', 'confirmada')->firstOrFail();
            $codigo = 'RES-' . strtoupper(Str::random(6));

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

            // Si montoFinal es provisto, registrar como pago
            if ($montoFinal && $montoFinal > 0) {
                $reserva->pagado = (float) $reserva->pagado + $montoFinal;
            }

            $estadoFinalizada = EstadoReserva::where('slug', 'finalizada')->firstOrFail();

            $reserva->update([
                'id_estado' => $estadoFinalizada->id_estado,
                'fecha_salida_real' => $ahora,
                'pagado' => $reserva->pagado,
                'saldo' => max(0, (float) $reserva->total - (float) $reserva->pagado),
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
                    'motivo_anulacion' => 'Anulación de reserva: ' . $motivo,
                ]);

            return $reserva->fresh();
        });
    }

    /**
     * Cambia la reserva a otra habitación con lógica de dinero.
     */
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
                throw new \InvalidArgumentException('Esta reserva no tiene ocupación activa.');
            }

            // Guardar habitación VIEJA (para crear limpieza)
            $idHabitacionVieja = $ocupacion->id_habitacion;

            // Guardar fechas originales
            $fechaInicioOriginal = $ocupacion->fecha_inicio;
            $fechaFinOriginal = $ocupacion->fecha_fin;

            if (!$this->disponibilidad->estaDisponible($idNuevaHabitacion, $fechaInicioOriginal, $fechaFinOriginal, $idReserva)) {
                throw new \InvalidArgumentException('La habitación destino no está disponible.');
            }

            // Calcular nueva tarifa
            $nuevaHabitacion = Habitacion::with('tipo')->findOrFail($idNuevaHabitacion);
            $horasBase = $reserva->horas_base;

            // 1. Buscar tarifa con las mismas horas
            $nuevaTarifa = Tarifa::where('id_tipo', $nuevaHabitacion->id_tipo)
                ->where('horas', $horasBase)
                ->where('activo', true)
                ->first();

            $horasAjustadas = false;

            // 2. Si no existe, buscar la tarifa más chica disponible
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

            // Liberar ocupación anterior
            $ocupacion->update(['estado' => 'LIBERADA']);

            // Crear LIMPIEZA para la habitación VIEJA
            Limpieza::create([
                'id_habitacion' => $idHabitacionVieja,
                'id_reserva' => null,  // limpieza no atada a reserva (post-cambio)
                'estado' => 'PENDIENTE',
                'tipo' => 'NORMAL',
                'fecha_solicitud' => now(),
            ]);

            // Si las horas cambiaron, recalcular fecha_fin
            if ($horasAjustadas) {
                $nuevaFechaFin = $fechaInicioOriginal->copy()->addHours($nuevasHoras);
            } else {
                $nuevaFechaFin = $fechaFinOriginal;
            }

            // Crear nueva ocupación MANTENIENDO fecha_inicio original
            OcupacionHabitacion::create([
                'id_habitacion' => $idNuevaHabitacion,
                'id_reserva' => $idReserva,
                'fecha_inicio' => $fechaInicioOriginal,
                'fecha_fin' => $nuevaFechaFin,
                'estado' => 'ACTIVA',
            ]);

            // Actualizar reserva
            $reserva->id_habitacion = $idNuevaHabitacion;
            $reserva->id_tarifa = $nuevaTarifa->id_tarifa;
            $reserva->monto_habitacion = $montoNuevo;

            // Si las horas cambiaron, actualizar horas y fecha_salida
            if ($horasAjustadas) {
                $reserva->horas_base = $nuevasHoras;
                $reserva->horas_totales = $nuevasHoras;
                $reserva->fecha_salida_prevista = $nuevaFechaFin;
            }

            // Si la diferencia se paga ahora Y es positiva
            if ($modoDiferencia === 'AHORA' && $diferencia > 0) {
                if (!$idMetodoPago) {
                    throw new \InvalidArgumentException('Seleccione método de pago.');
                }
                $reserva->pagado = (float) $reserva->pagado + $diferencia;

                PagoReserva::create([
                    'id_reserva' => $idReserva,
                    'id_metodo_pago' => $idMetodoPago,
                    'monto' => $diferencia,
                    'es_adelanto' => false,
                    'fecha_pago' => now(),
                    'id_usuario' => $idUsuario,
                    'observaciones' => 'Cambio de habitación',
                ]);
            }

            if ($modoDiferencia === 'AHORA' && $diferencia < 0) {
                $reserva->pagado = (float) $reserva->pagado + $diferencia;
            }

            $reserva->recalcularTotal();
            $reserva->save();

            // Registrar ajuste
            ReservaAjuste::create([
                'id_reserva' => $idReserva,
                'tipo' => 'CAMBIO_HABITACION',
                'monto_anterior' => $montoAnterior,
                'monto_nuevo' => $montoNuevo,
                'diferencia' => $diferencia,
                'id_usuario' => $idUsuario,
                'fecha_ajuste' => now(),
                'notas' => "Cambio a habitación {$nuevaHabitacion->numero}. Modo: {$modoDiferencia}",
            ]);

            return $reserva->fresh(['cliente', 'habitacion', 'tarifa', 'estado']);
        });
    }

    /**
     * Agrega un consumo de producto a la reserva.
     */
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

            // Descontar stock
            $producto->decrement('stock_actual', $cantidad);

            // Si NO se pagó al momento → sumar a la cuenta de la reserva
            if (!$pagado) {
                $reserva->monto_consumos = (float) $reserva->monto_consumos + $subtotal;
                $reserva->recalcularTotal();
                $reserva->save();
            } else {
                // Si pagó al momento → registrar pago
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

    /**
     * Elimina un consumo (revierte stock y montos).
     */
    public function eliminarConsumo(int $idConsumo, int $idUsuario): void
    {
        DB::transaction(function () use ($idConsumo, $idUsuario) {
            $consumo = ReservaConsumo::with('producto')->findOrFail($idConsumo);
            $reserva = Reserva::findOrFail($consumo->id_reserva);

            // Devolver stock
            $consumo->producto->increment('stock_actual', $consumo->cantidad);

            // Si no estaba pagado, revertir monto_consumos
            if (!$consumo->pagado) {
                $reserva->monto_consumos = max(0, (float) $reserva->monto_consumos - (float) $consumo->subtotal);
                $reserva->recalcularTotal();
                $reserva->save();
            }

            $consumo->delete();
        });
    }

    /**
     * Aplica una extensión de tiempo a la reserva.
     */
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

            // Calcular monto
            $precioHora = (float) $tarifa->precio_hora_extra;
            $precioTurno = (float) $tarifa->precio_turno_adicional;
            $monto = $esTurnoAdicional ? $precioTurno : ($horasExtra * $precioHora);

            // Tolerancia actual (para auditoría)
            $tolerancia = Configuracion::obtener('tolerancia_extension_minutos', 30);

            // Minutos de exceso real (para auditoría)
            $entrada = Carbon::parse($reserva->fecha_entrada);
            $ahora = Carbon::now();
            $minutosTranscurridos = (int) round(abs($entrada->diffInMinutes($ahora)));
            $minutosExceso = max(0, $minutosTranscurridos - ($reserva->horas_base * 60));

            // Registrar extensión
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

            // Actualizar la reserva
            $reserva->monto_horas_extra = (float) $reserva->monto_horas_extra + $monto;

            if ($esTurnoAdicional) {
                // Turno adicional extiende las horas base
                $horasExtraTurno = $tarifa->horas;
                $reserva->horas_extra = (int) $reserva->horas_extra + $horasExtraTurno;
                $reserva->horas_totales = (int) $reserva->horas_totales + $horasExtraTurno;
                $reserva->fecha_salida_prevista = Carbon::parse($reserva->fecha_salida_prevista)->addHours($horasExtraTurno);
            } else {
                $reserva->horas_extra = (int) $reserva->horas_extra + $horasExtra;
                $reserva->horas_totales = (int) $reserva->horas_totales + $horasExtra;
                $reserva->fecha_salida_prevista = Carbon::parse($reserva->fecha_salida_prevista)->addHours($horasExtra);
            }

            // Si NO se carga a cuenta → es pago inmediato
            if (!$cargarACuenta && $idMetodoPago) {
                PagoReserva::create([
                    'id_reserva' => $idReserva,
                    'id_metodo_pago' => $idMetodoPago,
                    'monto' => $monto,
                    'es_adelanto' => false,
                    'fecha_pago' => now(),
                    'id_usuario' => $idUsuario,
                    'observaciones' => 'Extensión de tiempo: ' . ($esTurnoAdicional ? 'Turno adicional' : "{$horasExtra}h extra"),
                ]);

                $reserva->pagado = (float) $reserva->pagado + $monto;
            }

            $reserva->recalcularTotal();
            $reserva->save();

            return $reserva->fresh(['cliente', 'habitacion', 'tarifa', 'estado', 'extensiones']);
        });
    }

    /**
     * Lista las extensiones de una reserva.
     */
    public function listarExtensiones(int $idReserva): \Illuminate\Support\Collection
    {
        return ExtensionReserva::with(['metodoPago', 'usuario'])
            ->where('id_reserva', $idReserva)
            ->orderByDesc('id_extension')
            ->get();
    }
    /**
     * Agrega un pago adicional a una reserva existente (pago parcial / mixto).
     */
    public function agregarPago(int $idReserva, array $datos, int $idUsuario): Reserva
    {
        return DB::transaction(function () use ($idReserva, $datos, $idUsuario) {
            $reserva = Reserva::findOrFail($idReserva);

            if ($reserva->id_estado === 4) {
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

            // Recalcular pagado y saldo
            $totalPagado = PagoReserva::where('id_reserva', $idReserva)
                ->where('anulado', false)
                ->sum('monto');

            $reserva->pagado = $totalPagado;
            $reserva->saldo = max(0, (float) $reserva->total - $totalPagado);
            $reserva->save();

            // Recalcular pagado y saldo desde la tabla de pagos (fuente de verdad)
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

    /**
     * Anula un pago especifico de una reserva.
     */
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
            $totalPagado = PagoReserva::where('id_reserva', $pago->id_reserva)
                ->where('anulado', false)
                ->sum('monto');

            $reserva->pagado = $totalPagado;
            $reserva->saldo = max(0, (float) $reserva->total - $totalPagado);
            $reserva->save();

            // Recalcular pagado y saldo desde la tabla de pagos (fuente de verdad)
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

    /**
     * Entrega el vuelto al cliente.
     * Se registra como un PAGO NEGATIVO en pagos_reserva.
     * El campo 'pagado' se recalcula como SUM(pagos.monto WHERE anulado = false).
     */
    public function entregarVuelto(int $idReserva, float $monto, int $idMetodoPago, int $idUsuario): Reserva
    {
        return DB::transaction(function () use ($idReserva, $monto, $idMetodoPago, $idUsuario) {
            $reserva = Reserva::findOrFail($idReserva);

            if ($reserva->id_estado === 4) {
                throw new \InvalidArgumentException('No se puede entregar vuelto a una reserva finalizada.');
            }

            if ($monto <= 0) {
                throw new \InvalidArgumentException('El monto debe ser mayor a 0.');
            }

            // Calcular vuelto pendiente desde reserva.pagado (fuente de verdad)
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

            // Registrar pago NEGATIVO
            PagoReserva::create([
                'id_reserva' => $idReserva,
                'id_metodo_pago' => $idMetodoPago,
                'monto' => -$monto,  // NEGATIVO
                'es_adelanto' => false,
                'fecha_pago' => now(),
                'id_usuario' => $idUsuario,
                'observaciones' => 'Vuelto entregado al cliente',
            ]);

            // Recalcular pagado y saldo
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

    /**
     * Verifica si un cliente ya tiene una reserva activa (estado 'Activa').
     * Regla: 1 cliente = 1 sola reserva activa.
     * Si quiere alquilar otra habitación, debe registrarse con otro nombre (familiar).
     */
    public function clienteTieneReservaActiva(int $idCliente): ?Reserva
    {
        return Reserva::with(['habitacion'])
            ->where('id_cliente', $idCliente)
            ->whereHas('estado', function ($q) {
                $q->where('slug', 'activa');
            })
            ->first();
    }

    /**
     * Check-out con decisión sobre el vuelto pendiente.
     * 
     * Decisiones posibles:
     * - ENTREGADO: se registra pago negativo (sale de caja)
     * - NO_RECLAMADO: el vuelto queda como ingreso (no sale de caja)
     * - OTRO: se registra observación libre
     */
    public function checkOutConVuelto(
        int $idReserva,
        int $idUsuario,
        ?float $montoFinal,
        string $decisionTipo,  // 'ENTREGADO' | 'NO_RECLAMADO' | 'OTRO'
        ?int $idMetodoPago = null,
        ?string $observaciones = null
    ): Reserva {
        return DB::transaction(function () use ($idReserva, $idUsuario, $montoFinal, $decisionTipo, $idMetodoPago, $observaciones) {
            $reserva = Reserva::findOrFail($idReserva);

            // Calcular vuelto pendiente desde reserva.pagado (fuente de verdad)
            $vueltoPendiente = (float) $reserva->pagado - (float) $reserva->total;

            if ($vueltoPendiente <= 0.01) {
                throw new \InvalidArgumentException(
                    'No hay vuelto pendiente para esta reserva. ' .
                    "(Pagado: S/ {$reserva->pagado}, Total: S/ {$reserva->total})"
                );
            }

            // Decidir qué hacer
            if ($decisionTipo === 'ENTREGADO') {
                if (!$idMetodoPago) {
                    throw new \InvalidArgumentException('Seleccione un método para entregar el vuelto.');
                }

                // Registrar pago NEGATIVO (el vuelto sale de caja)
                PagoReserva::create([
                    'id_reserva' => $idReserva,
                    'id_metodo_pago' => $idMetodoPago,
                    'monto' => -$vueltoPendiente,
                    'es_adelanto' => false,
                    'fecha_pago' => now(),
                    'id_usuario' => $idUsuario,
                    'observaciones' => $observaciones ?? 'Vuelto entregado al cliente',
                ]);

                // Recalcular pagado
                $nuevoPagado = PagoReserva::where('id_reserva', $idReserva)
                    ->where('anulado', false)
                    ->sum('monto');

                $reserva->pagado = $nuevoPagado;
                $reserva->saldo = max(0, (float) $reserva->total - $nuevoPagado);
                $reserva->save();

            } elseif ($decisionTipo === 'NO_RECLAMADO') {
                // NO se registra pago negativo.
                // El vuelto queda como "ingreso" del hospedaje.
                // Se guarda observación en la reserva.
                $reserva->observaciones = $observaciones ?? 'Cliente se retiró sin reclamar el vuelto de S/ ' . number_format($vueltoPendiente, 2);
                $reserva->save();

            } elseif ($decisionTipo === 'OTRO') {
                if (!$observaciones) {
                    throw new \InvalidArgumentException('Se requiere una observación para esta decisión.');
                }
                $reserva->observaciones = $observaciones;
                $reserva->save();
            } else {
                throw new \InvalidArgumentException('Decisión inválida sobre el vuelto.');
            }

            // Ejecutar el check-out normal
            return $this->checkOut($idReserva, $idUsuario, $montoFinal);
        });
    }

    /**
     * Check-out con decisión sobre deuda pendiente.
     * 
     * Decisiones posibles:
     * - PAGO: el cliente pagó al salir → registra pago positivo
     * - NO_PAGO: el cliente se fue debiendo → crea observación al cliente
     */
    public function checkOutConDeuda(
        int $idReserva,
        int $idUsuario,
        ?float $montoFinal,
        string $decisionTipo,  // 'PAGO' | 'NO_PAGO'
        ?float $montoPago = null,
        ?int $idMetodoPago = null,
        ?int $idGravedad = null,
        ?string $motivo = null
    ): Reserva {
        return DB::transaction(function () use ($idReserva, $idUsuario, $montoFinal, $decisionTipo, $montoPago, $idMetodoPago, $idGravedad, $motivo) {
            $reserva = Reserva::findOrFail($idReserva);

            // Calcular deuda pendiente desde reserva.pagado (fuente de verdad)
            $deudaPendiente = (float) $reserva->total - (float) $reserva->pagado;

            if ($deudaPendiente <= 0.01) {
                throw new \InvalidArgumentException(
                    'No hay deuda pendiente para esta reserva. ' .
                    "(Total: S/ {$reserva->total}, Pagado: S/ {$reserva->pagado})"
                );
            }

            if ($decisionTipo === 'PAGO') {
                if (!$idMetodoPago) {
                    throw new \InvalidArgumentException('Seleccione un método de pago.');
                }
                if (!$montoPago || $montoPago <= 0) {
                    throw new \InvalidArgumentException('El monto debe ser mayor a 0.');
                }

                // Registrar pago positivo
                PagoReserva::create([
                    'id_reserva' => $idReserva,
                    'id_metodo_pago' => $idMetodoPago,
                    'monto' => $montoPago,
                    'es_adelanto' => false,
                    'fecha_pago' => now(),
                    'id_usuario' => $idUsuario,
                    'observaciones' => 'Pago al salir (cierre de deuda)',
                ]);

                // Recalcular pagado
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

                // Crear observación al cliente
                \App\Models\ClienteObservacion::create([
                    'id_cliente' => $reserva->id_cliente,
                    'id_tipo_observacion' => 1,  // 1 = Deuda (ID conocido del seeder)
                    'id_gravedad' => $idGravedad,
                    'motivo' => $motivo,
                    'monto_deuda' => $deudaPendiente,
                    'resuelto' => false,
                    'id_usuario_creacion' => $idUsuario,
                ]);

                // Guardar referencia en la reserva
                $reserva->observaciones = 'Cliente se retiró debiendo S/ ' . number_format($deudaPendiente, 2) . '. ' . $motivo;
                $reserva->save();
            } else {
                throw new \InvalidArgumentException('Decisión inválida sobre la deuda.');
            }

            // Ejecutar el check-out normal
            return $this->checkOut($idReserva, $idUsuario, $montoFinal);
        });
    }

    /**
     * Agrega MÚLTIPLES consumos a la reserva en una sola transacción.
     * Soporta:
     * - Pagar todo ahora (1 o varios pagos mixtos)
     * - Pagar parcialmente (resto se carga a la cuenta)
     * - No pagar nada (todo a la cuenta)
     *
     * @param array $consumos  [['id_producto' => X, 'cantidad' => Y], ...]
     * @param array $pagos     [['id_metodo_pago' => X, 'monto' => Y], ...]
     * @param bool  $cargarACuenta  Si true, el saldo no pagado va a la cuenta
     */
    public function agregarConsumosMultiple(
        int $idReserva,
        array $consumos,
        array $pagos,
        bool $cargarACuenta,
        int $idUsuario,
        ?string $observaciones = null
    ): Reserva {
        return DB::transaction(function () use ($idReserva, $consumos, $pagos, $cargarACuenta, $idUsuario, $observaciones) {
            $reserva = Reserva::findOrFail($idReserva);

            if ($reserva->id_estado === 4) {
                throw new \InvalidArgumentException('No se pueden agregar consumos a una reserva finalizada.');
            }

            if (empty($consumos)) {
                throw new \InvalidArgumentException('Debe agregar al menos un producto.');
            }

            // 1. VALIDAR STOCK DE TODOS LOS PRODUCTOS
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

            // 2. CALCULAR TOTAL DE CONSUMOS
            $totalConsumos = array_sum(array_column($productosValidados, 'subtotal'));

            // 3. CREAR CADA CONSUMO
            $consumosCreados = [];
            foreach ($productosValidados as $item) {
                $consumo = ReservaConsumo::create([
                    'id_reserva' => $idReserva,
                    'id_producto' => $item['producto']->id_producto,
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => (float) $item['producto']->precio_venta,
                    'subtotal' => $item['subtotal'],
                    'pagado' => false,  // se maneja con pagos abajo
                    'id_metodo_pago' => null,
                    'id_usuario' => $idUsuario,
                    'fecha_consumo' => now(),
                    'observaciones' => $observaciones,
                ]);

                // Descontar stock
                $item['producto']->decrement('stock_actual', $item['cantidad']);

                $consumosCreados[] = $consumo;
            }

            // 4. REGISTRAR PAGOS (si hay)
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

            // 5. SI NO SE PAGÓ TODO Y SE CARGA A CUENTA → sumar a monto_consumos
            $saldoConsumos = $totalConsumos - $totalPagadoConsumos;

            if ($cargarACuenta && $saldoConsumos > 0.01) {
                $reserva->monto_consumos = (float) $reserva->monto_consumos + $saldoConsumos;
            } elseif (!$cargarACuenta && $saldoConsumos > 0.01) {
                throw new \InvalidArgumentException(
                    "El pago (S/ {$totalPagadoConsumos}) no cubre el total de consumos (S/ {$totalConsumos}). " .
                    "Activá 'cargar a cuenta' o cobrá el resto."
                );
            }

            // 6. RECALCULAR TOTAL Y PAGADO
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

    // ========================================================================
    // MODULO 09B — RESERVAS FUTURAS
    // ========================================================================

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

    /**
     * Lista habitaciones libres en el rango SOLO si su tipo tiene tarifa de $horas.
     */
    public function listarDisponiblesEnRango(Carbon $inicio, Carbon $fin, int $horas): \Illuminate\Support\Collection
    {
        $libres = $this->disponibilidad->habitacionesLibresConInfo($inicio, $fin);

        // Filtrar: solo habitaciones cuyo tipo tenga tarifa activa con esas horas exactas
        return $libres->filter(function ($h) use ($horas) {
            return Tarifa::where('id_tipo', $h->id_tipo)
                ->where('horas', $horas)
                ->where('activo', true)
                ->exists();
        })->values();
    }

    public function listarConConflictoEnRango(Carbon $inicio, Carbon $fin): \Illuminate\Support\Collection
    {
        return $this->disponibilidad->habitacionesConConflicto($inicio, $fin);
    }
    // ========================================================================
    // FILTRADO — Reservas (RES-) vs Estadias (WK-)
    // ========================================================================

    /**
     * Lista SOLO reservas futuras (codigo RES-).
     * Incluye pendientes y confirmadas, ordenadas por fecha de entrada.
     */
    public function listarSoloReservas(): \Illuminate\Support\Collection
    {
        return Reserva::with([
            'cliente', 'habitacion.piso', 'habitacion.tipo', 'tarifa', 'estado', 'usuarioCreacion'
        ])
            ->where('codigo_reserva', 'LIKE', 'RES-%')
            ->orderByDesc('fecha_entrada')
            ->get();
    }

    /**
     * Lista SOLO estadias walk-in (codigo WK-).
     * Ordenadas por fecha de entrada descendente.
     */
    public function listarSoloWalkIns(): \Illuminate\Support\Collection
    {
        return Reserva::with([
            'cliente', 'habitacion.piso', 'habitacion.tipo', 'tarifa', 'estado', 'usuarioCreacion',
            'registroEstadia'
        ])
            ->where('codigo_reserva', 'LIKE', 'WK-%')
            ->orderByDesc('fecha_entrada')
            ->get();
    }

    /**
     * Lista el historial COMPLETO (todas las reservas + walk-ins).
     */
    public function listarHistorialCompleto(): \Illuminate\Support\Collection
    {
        return Reserva::with([
            'cliente', 'habitacion.piso', 'habitacion.tipo', 'tarifa', 'estado', 'usuarioCreacion'
        ])
            ->orderByDesc('fecha_entrada')
            ->get();
    }
    // ========================================================================
    // CHECK-IN DE RESERVA FUTURA
    // ========================================================================

    /**
     * Devuelve toda la info necesaria para la pantalla de Check-In:
     * - Reserva con cliente, habitacion, tarifa, pagos
     * - Observaciones pendientes del cliente
     * - Si la habitacion esta disponible AHORA
     * - Si ya tiene check-in hecho
     */
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

        // Observaciones pendientes del cliente
        $observaciones = \App\Models\ClienteObservacion::with(['tipo', 'gravedad'])
            ->where('id_cliente', $reserva->id_cliente)
            ->where('resuelto', false)
            ->get();

        // ¿Ya tiene check-in?
        $yaTieneCheckIn = $reserva->registroEstadia !== null;

        // ¿La habitacion esta disponible AHORA?
        $ahora = Carbon::now();
        $habitacionDisponible = $this->disponibilidad->estaDisponible(
            $reserva->id_habitacion,
            $ahora,
            $ahora->copy()->addHours((int) $reserva->horas_base),
            $reserva->id_reserva // excluir esta reserva
        );

        // ¿Que la esta ocupando? (si no esta disponible)
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

        // Estado de la reserva
        $estadoSlug = $reserva->estado?->slug;
        $esConfirmada = in_array($estadoSlug, ['confirmada', 'pendiente']);
        $esActiva = $estadoSlug === 'activa';
        $esCerrada = in_array($estadoSlug, ['finalizada', 'cancelada', 'anulada', 'no-show']);

        // ¿Puede hacer check-in?
        $puedeCheckIn = $esConfirmada && !$yaTieneCheckIn && $habitacionDisponible;

        // Motivo por el que NO puede
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

    /**
     * Hace el check-in de una reserva futura CON validaciones.
     * - Valida que este confirmada/pendiente
     * - Valida que la habitacion este disponible AHORA
     * - Valida que no tenga ya check-in
     * - Registra la visita del cliente
     * - Crea el registro_estadia
     */
    public function checkInValidado(int $idReserva, int $idUsuario): Reserva
    {
        return DB::transaction(function () use ($idReserva, $idUsuario) {
            $reserva = Reserva::with(['habitacion'])->findOrFail($idReserva);

            // Validar estado
            $estadoSlug = $reserva->estado?->slug;
            if (!in_array($estadoSlug, ['confirmada', 'pendiente'])) {
                throw new \InvalidArgumentException(
                    'Esta reserva no esta en estado confirmada (actual: ' . ($estadoSlug ?? 'desconocido') . ').'
                );
            }

            // Validar que no tenga check-in
            if ($reserva->registroEstadia) {
                throw new \InvalidArgumentException('Esta reserva ya tiene check-in hecho.');
            }

            // FECHA ORIGINAL de la reserva (se mantiene aunque llegue tarde)
            $fechaEntradaOriginal = Carbon::parse($reserva->fecha_entrada);
            $fechaSalidaOriginal = Carbon::parse($reserva->fecha_salida_prevista);

            // Validar que la habitacion NO este ocupada por OTRA reserva
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

            // Cambiar estado a activa
            $estadoActiva = EstadoReserva::where('slug', 'activa')->firstOrFail();

            // IMPORTANTE: NO cambiamos fecha_entrada ni fecha_salida_prevista
            // Se mantiene la fecha original de la reserva (el cliente pierde el tiempo que llego tarde)
            $reserva->update([
                'id_estado' => $estadoActiva->id_estado,
                // NO tocamos fecha_entrada, mantiene la original
                // NO tocamos fecha_salida_prevista, mantiene la original
            ]);

            // Crear registro de estadia CON la fecha original (no la de llegada)
            RegistroEstadia::create([
                'id_reserva' => $idReserva,
                'fecha_entrada' => $fechaEntradaOriginal,
                'id_usuario_checkin' => $idUsuario,
            ]);

            // La ocupacion mantiene sus fechas originales (ya estaba asi)

            // Registrar la visita del cliente (1 visita mas)
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
    }}
