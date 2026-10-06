<?php

namespace App\Services;

use App\Models\Configuracion;
use App\Models\Habitacion;
use App\Models\Limpieza;
use App\Models\Mantenimiento;
use App\Models\OcupacionHabitacion;
use Carbon\Carbon;

class EstadoHabitacionService
{
    public function calcular(Habitacion $habitacion): array
    {
        if (!$habitacion->activo) {
            return $this->respuesta('Inactiva', '#475569');
        }

        $mantenimiento = Mantenimiento::with(['tipo', 'prioridad', 'usuarioAsignado'])
            ->where('id_habitacion', $habitacion->id_habitacion)
            ->whereIn('estado', ['REPORTADO', 'EN_PROCESO'])
            ->first();

        if ($mantenimiento) {
            return $this->respuesta('Mantenimiento', '#f97316', null, null, [
                'id_mantenimiento' => $mantenimiento->id_mantenimiento,
                'mantenimiento_tipo' => $mantenimiento->tipo?->nombre,
                'mantenimiento_descripcion' => $mantenimiento->descripcion,
                'mantenimiento_prioridad' => $mantenimiento->prioridad?->nombre,
                'mantenimiento_prioridad_color' => $mantenimiento->prioridad?->color,
                'mantenimiento_estado' => $mantenimiento->estado,
                'mantenimiento_fecha_reporte' => $mantenimiento->fecha_reporte?->toIso8601String(),
                'mantenimiento_asignado' => $mantenimiento->usuarioAsignado?->nombre,
            ]);
        }

        $limpieza = Limpieza::where('id_habitacion', $habitacion->id_habitacion)
            ->whereIn('estado', ['PENDIENTE', 'EN_PROCESO'])
            ->first();

        if ($limpieza) {
            return $this->respuesta('Limpieza', '#06b6d4');
        }

        $ahora = Carbon::now();

        // =====================================================================
        // PRIORIDAD 1: Reserva CONFIRMADA/PENDIENTE sin check-in
        //             (incluye futuras Y vencidas)
        //             Si hay una reserva sin check-in, DEBE mostrarse como Reservada
        //             aunque la hora ya haya pasado.
        // =====================================================================
        $reservaSinCheckIn = OcupacionHabitacion::with(['reserva.cliente', 'reserva.estado', 'reserva.registroEstadia'])
            ->where('id_habitacion', $habitacion->id_habitacion)
            ->where('estado', 'ACTIVA')
            ->whereHas('reserva', function ($q) {
                $q->whereHas('estado', function ($q2) {
                    $q2->whereIn('slug', ['confirmada', 'pendiente']);
                });
                $q->whereDoesntHave('registroEstadia');
            })
            ->orderBy('fecha_inicio')
            ->first();

        if ($reservaSinCheckIn && $reservaSinCheckIn->reserva) {
            $horasAntes = Configuracion::obtener('horas_antes_bloqueo_reserva', 4);
            $limiteBloqueo = $ahora->copy()->addHours($horasAntes);
            $minutosParaEntrada = (int) round($ahora->diffInMinutes($reservaSinCheckIn->fecha_inicio, false));

            // Verificar si hay OTRA ocupacion activa (walk-in real) que choca
            $otraOcupacion = OcupacionHabitacion::with(['reserva.cliente'])
                ->where('id_habitacion', $habitacion->id_habitacion)
                ->where('estado', 'ACTIVA')
                ->where('id_reserva', '!=', $reservaSinCheckIn->id_reserva)
                ->whereHas('reserva.registroEstadia') // Solo walk-ins CON check-in
                ->where(function ($q) use ($ahora) {
                    $q->where('fecha_inicio', '<=', $ahora)
                      ->where('fecha_fin', '>=', $ahora);
                })
                ->first();

            if ($otraOcupacion && $otraOcupacion->reserva) {
                return $this->respuesta('Reservada-Urgente', '#dc2626', $reservaSinCheckIn->reserva->cliente?->nombre, $reservaSinCheckIn->reserva->id_reserva, [
                    'fecha_entrada' => $reservaSinCheckIn->fecha_inicio->toIso8601String(),
                    'fecha_salida_prevista' => $reservaSinCheckIn->fecha_fin->toIso8601String(),
                    'minutos_para_entrada' => $minutosParaEntrada,
                    'alerta_reserva_ocupada' => true,
                    'cliente_actual' => $otraOcupacion->reserva->cliente?->nombre,
                    'id_reserva_actual' => $otraOcupacion->reserva->id_reserva,
                ]);
            }

            // Si esta dentro de la ventana de bloqueo O YA PASO la hora -> Reservada
            if ($reservaSinCheckIn->fecha_inicio <= $limiteBloqueo) {
                return $this->respuesta('Reservada', '#7c3aed', $reservaSinCheckIn->reserva->cliente?->nombre, $reservaSinCheckIn->reserva->id_reserva, [
                    'fecha_entrada' => $reservaSinCheckIn->fecha_inicio->toIso8601String(),
                    'fecha_salida_prevista' => $reservaSinCheckIn->fecha_fin->toIso8601String(),
                    'minutos_para_entrada' => $minutosParaEntrada,
                    'alerta_reserva_ocupada' => false,
                ]);
            }

            // Fuera de la ventana -> Disponible con info de reserva futura
            return $this->respuesta('Disponible', '#10b981', null, null, [
                'reserva_futura' => [
                    'id_reserva' => $reservaSinCheckIn->reserva->id_reserva,
                    'codigo' => $reservaSinCheckIn->reserva->codigo_reserva,
                    'cliente' => $reservaSinCheckIn->reserva->cliente?->nombre,
                    'fecha_entrada' => $reservaSinCheckIn->fecha_inicio->toIso8601String(),
                    'minutos_para_entrada' => $minutosParaEntrada,
                    'horas_antes_bloqueo' => $horasAntes,
                ],
            ]);
        }

        // =====================================================================
        // PRIORIDAD 2: Ocupacion activa AHORA con check-in hecho
        // =====================================================================
        $ocupacion = OcupacionHabitacion::with(['reserva.cliente', 'reserva.registroEstadia'])
            ->where('id_habitacion', $habitacion->id_habitacion)
            ->where('estado', 'ACTIVA')
            ->where('fecha_inicio', '<=', $ahora)
            ->where('fecha_fin', '>=', $ahora)
            ->whereHas('reserva.registroEstadia') // Solo CON check-in
            ->first();

        if ($ocupacion && $ocupacion->reserva) {
            return $this->ocupadaConTiempo($ocupacion, $ahora);
        }

        // =====================================================================
        // PRIORIDAD 3: Ocupacion vencida CON check-in hecho
        // =====================================================================
        $vencida = OcupacionHabitacion::with(['reserva.cliente'])
            ->where('id_habitacion', $habitacion->id_habitacion)
            ->where('estado', 'ACTIVA')
            ->where('fecha_inicio', '<=', $ahora)
            ->where('fecha_fin', '<', $ahora)
            ->whereHas('reserva.registroEstadia')
            ->orderByDesc('fecha_fin')
            ->first();

        if ($vencida && $vencida->reserva) {
            return $this->ocupadaConTiempo($vencida, $ahora);
        }

        return $this->respuesta('Disponible', '#10b981');
    }

    private function ocupadaConTiempo(OcupacionHabitacion $ocupacion, Carbon $ahora): array
    {
        $reserva = $ocupacion->reserva;
        $inicio = $ocupacion->fecha_inicio;
        $fin = $ocupacion->fecha_fin;

        $minutosTotales = max(1, (int) round(abs($inicio->diffInMinutes($fin))));
        $minutosTranscurridos = max(0, (int) round(abs($inicio->diffInMinutes($ahora))));
        $minutosRestantes = (int) round($ahora->diffInMinutes($fin, false));
        $minutosExtra = $minutosRestantes < 0 ? abs($minutosRestantes) : 0;

        if ($minutosExtra > 0) {
            $estado = 'Vencida';
            $color = '#dc2626';
        } elseif ($minutosRestantes >= 0 && $minutosRestantes <= 30) {
            $estado = 'Por vencer';
            $color = '#f59e0b';
        } else {
            $estado = 'Ocupada';
            $color = '#ef4444';
        }

        return $this->respuesta($estado, $color, $reserva->cliente?->nombre, $reserva->id_reserva, [
            'fecha_entrada' => $inicio->toIso8601String(),
            'fecha_salida_prevista' => $fin->toIso8601String(),
            'minutos_transcurridos' => $minutosTranscurridos,
            'minutos_totales' => $minutosTotales,
            'minutos_restantes' => max(0, $minutosRestantes),
            'minutos_extra' => $minutosExtra,
            'horas_base' => $reserva->horas_base,
            'pagado' => (float) $reserva->pagado,
            'total' => (float) $reserva->total,
        ]);
    }

    private function respuesta(string $estado, string $color, ?string $cliente = null, ?int $idReserva = null, array $extra = []): array
    {
        return array_merge([
            'estado' => $estado,
            'color' => $color,
            'cliente' => $cliente,
            'id_reserva' => $idReserva,
            'fecha_entrada' => null,
            'fecha_salida_prevista' => null,
            'minutos_transcurridos' => null,
            'minutos_totales' => null,
            'minutos_restantes' => null,
            'minutos_extra' => null,
            'horas_base' => null,
            'pagado' => 0,
            'total' => 0,
            'minutos_para_entrada' => null,
            'alerta_reserva_ocupada' => false,
            'cliente_actual' => null,
            'id_reserva_actual' => null,
            'reserva_futura' => null,
            'id_mantenimiento' => null,
            'mantenimiento_tipo' => null,
            'mantenimiento_descripcion' => null,
            'mantenimiento_prioridad' => null,
            'mantenimiento_prioridad_color' => null,
            'mantenimiento_estado' => null,
            'mantenimiento_fecha_reporte' => null,
            'mantenimiento_asignado' => null,
        ], $extra);
    }

    public function mapa(): array
    {
        $habitaciones = Habitacion::with(['piso', 'tipo'])
            ->orderBy('id_piso')
            ->orderBy('orden')
            ->get();

        return $habitaciones->map(function ($h) {
            $estado = $this->calcular($h);
            return array_merge([
                'id_habitacion' => $h->id_habitacion,
                'numero' => $h->numero,
                'id_piso' => $h->id_piso,
                'piso_nombre' => $h->piso?->nombre,
                'id_tipo' => $h->id_tipo,
                'tipo_nombre' => $h->tipo?->nombre,
            ], $estado);
        })->toArray();
    }
}