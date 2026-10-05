<?php

namespace App\Services;

use App\Models\Habitacion;
use App\Models\Limpieza;
use App\Models\Mantenimiento;
use App\Models\OcupacionHabitacion;
use Carbon\Carbon;

class EstadoHabitacionService
{
    public function calcular(Habitacion $habitacion): array
    {
        // 1. Inactiva
        if (!$habitacion->activo) {
            return $this->respuesta('Inactiva', '#475569');
        }

        // 2. Mantenimiento activo (prioridad sobre Limpieza)
        $mantenimiento = Mantenimiento::with(['tipo', 'prioridad', 'usuarioAsignado'])
            ->where('id_habitacion', $habitacion->id_habitacion)
            ->whereIn('estado', ['REPORTADO', 'EN_PROCESO'])
            ->first();

        if ($mantenimiento) {
            return $this->respuesta(
                'Mantenimiento',
                '#f97316',
                null,
                null,
                [
                    'id_mantenimiento' => $mantenimiento->id_mantenimiento,
                    'mantenimiento_tipo' => $mantenimiento->tipo?->nombre,
                    'mantenimiento_descripcion' => $mantenimiento->descripcion,
                    'mantenimiento_prioridad' => $mantenimiento->prioridad?->nombre,
                    'mantenimiento_prioridad_color' => $mantenimiento->prioridad?->color,
                    'mantenimiento_estado' => $mantenimiento->estado,
                    'mantenimiento_fecha_reporte' => $mantenimiento->fecha_reporte?->toIso8601String(),
                    'mantenimiento_asignado' => $mantenimiento->usuarioAsignado?->nombre,
                ]
            );
        }

        // 3. Limpieza pendiente
        $limpieza = Limpieza::where('id_habitacion', $habitacion->id_habitacion)
            ->whereIn('estado', ['PENDIENTE', 'EN_PROCESO'])
            ->first();

        if ($limpieza) {
            return $this->respuesta('Limpieza', '#06b6d4');
        }

        $ahora = Carbon::now();

        // 3. Ocupación activa (ahora dentro del rango)
        $ocupacion = OcupacionHabitacion::with(['reserva.cliente'])
            ->where('id_habitacion', $habitacion->id_habitacion)
            ->where('estado', 'ACTIVA')
            ->where('fecha_inicio', '<=', $ahora)
            ->where('fecha_fin', '>=', $ahora)
            ->first();

        if ($ocupacion && $ocupacion->reserva) {
            return $this->ocupadaConTiempo($ocupacion, $ahora);
        }

        // 4. Vencida
        $vencida = OcupacionHabitacion::with(['reserva.cliente'])
            ->where('id_habitacion', $habitacion->id_habitacion)
            ->where('estado', 'ACTIVA')
            ->where('fecha_inicio', '<=', $ahora)
            ->where('fecha_fin', '<', $ahora)
            ->orderByDesc('fecha_fin')
            ->first();

        if ($vencida && $vencida->reserva) {
            return $this->ocupadaConTiempo($vencida, $ahora);
        }

        // 5. Reservada (futuro)
        $futura = OcupacionHabitacion::with(['reserva.cliente'])
            ->where('id_habitacion', $habitacion->id_habitacion)
            ->where('estado', 'ACTIVA')
            ->where('fecha_inicio', '>', $ahora)
            ->orderBy('fecha_inicio')
            ->first();

        if ($futura && $futura->reserva) {
            return $this->respuesta(
                'Reservada',
                '#7c3aed',
                $futura->reserva->cliente?->nombre,
                $futura->reserva->id_reserva,
                [
                    'fecha_entrada' => $futura->fecha_inicio->toIso8601String(),
                    'fecha_salida_prevista' => $futura->fecha_fin->toIso8601String(),
                ]
            );
        }

        // 6. Disponible
        return $this->respuesta('Disponible', '#10b981');
    }

    private function ocupadaConTiempo(OcupacionHabitacion $ocupacion, Carbon $ahora): array
    {
        $reserva = $ocupacion->reserva;
        $inicio = $ocupacion->fecha_inicio;
        $fin = $ocupacion->fecha_fin;

        // Minutos desde que entró hasta la salida prevista
        $minutosTotales = max(1, (int) round(abs($inicio->diffInMinutes($fin))));

        // Minutos desde que entró hasta ahora
        $minutosTranscurridos = max(0, (int) round(abs($inicio->diffInMinutes($ahora))));

        // Cuántos minutos faltan para que termine (positivo = falta)
        // Si fin > ahora → falta tiempo → positivo
        $minutosRestantes = (int) round($ahora->diffInMinutes($fin, false));

        // Si es negativo, excedió
        $minutosExtra = $minutosRestantes < 0 ? abs($minutosRestantes) : 0;

        // Estado según urgencia
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

        return $this->respuesta(
            $estado,
            $color,
            $reserva->cliente?->nombre,
            $reserva->id_reserva,
            [
                'fecha_entrada' => $inicio->toIso8601String(),
                'fecha_salida_prevista' => $fin->toIso8601String(),
                'minutos_transcurridos' => $minutosTranscurridos,
                'minutos_totales' => $minutosTotales,
                'minutos_restantes' => max(0, $minutosRestantes),
                'minutos_extra' => $minutosExtra,
                'horas_base' => $reserva->horas_base,
                'pagado' => (float) $reserva->pagado,
                'total' => (float) $reserva->total,
            ]
        );
    }

    private function respuesta(
        string $estado,
        string $color,
        ?string $cliente = null,
        ?int $idReserva = null,
        array $extra = []
    ): array {
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