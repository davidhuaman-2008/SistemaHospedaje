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

            // REGLA DE ORO: pagado >= total (para cubrir la habitación)
            if ($pagado < $total) {
                throw new \InvalidArgumentException(
                    "El cliente debe pagar el total de la habitación (S/ {$total}). Pagó S/ {$pagado}."
                );
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

            // Registrar pago de la habitación
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
    }}
