<?php

namespace App\Services;

use App\Models\Configuracion;
use App\Models\Habitacion;
use App\Models\Limpieza;
use App\Models\Mantenimiento;
use App\Models\OcupacionHabitacion;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class DisponibilidadService
{
    /**
     * Verifica si una habitacion esta disponible en un rango.
     *
     * @param int $idHabitacion
     * @param Carbon $inicio
     * @param Carbon $fin
     * @param int|null $excluirReserva
     * @param int $horasAntesDecoracion  0 = sin decoracion, >0 = con decoracion
     * @param bool $esWalkIn  true = no valida anticipacion minima (cliente ya esta)
     */
    public function estaDisponible(
        int $idHabitacion,
        Carbon $inicio,
        Carbon $fin,
        ?int $excluirReserva = null,
        int $horasAntesDecoracion = 0,
        bool $esWalkIn = false
    ): bool {
        // 0. Anticipacion minima (SOLO si NO es walk-in)
        if (!$esWalkIn) {
            $ahora = Carbon::now();
            $minutosHastaInicio = (int) round($ahora->diffInMinutes($inicio, false));

            if ($horasAntesDecoracion > 0) {
                // Con decoracion: minimo horas_antes_decoracion
                $horasMinimas = (int) Configuracion::obtener('horas_antes_decoracion', 24);
                if ($minutosHastaInicio < ($horasMinimas * 60)) {
                    return false;
                }
            } else {
                // Sin decoracion: minimo anticipacion_minima_reserva_minutos
                $anticipacionMin = (int) Configuracion::obtener('anticipacion_minima_reserva_minutos', 30);
                if ($minutosHastaInicio < $anticipacionMin) {
                    return false;
                }
            }
        }

        // 1. La habitacion debe estar activa
        $habitacion = Habitacion::find($idHabitacion);
        if (!$habitacion || !$habitacion->activo) {
            return false;
        }

        // Si hay decoracion, extender el rango hacia atras
        if ($horasAntesDecoracion > 0) {
            $inicio = $inicio->copy()->subHours($horasAntesDecoracion);
        }

        // 2. No debe haber mantenimiento activo
        $mantenimiento = Mantenimiento::where('id_habitacion', $idHabitacion)
            ->whereIn('estado', ['REPORTADO', 'EN_PROCESO'])
            ->exists();

        if ($mantenimiento) {
            return false;
        }

        // 3. Limpieza pendiente
        $limpieza = Limpieza::where('id_habitacion', $idHabitacion)
            ->whereIn('estado', ['PENDIENTE', 'EN_PROCESO'])
            ->first();

        if ($limpieza) {
            // Si NO es walk-in, validar buffer
            if (!$esWalkIn) {
                $bufferLimpieza = Configuracion::obtener('buffer_limpieza_minutos', 30);
                $minutosHastaInicio = (int) round(Carbon::now()->diffInMinutes($inicio, false));
                if ($minutosHastaInicio < $bufferLimpieza) {
                    return false;
                }
            }
        }

        // 4. No debe haber ocupacion que se cruce
        $buffer = Configuracion::obtener('buffer_limpieza_minutos', 30);
        $inicioConBuffer = $inicio->copy()->subMinutes($buffer);
        $finConBuffer = $fin->copy()->addMinutes($buffer);

        $query = OcupacionHabitacion::where('id_habitacion', $idHabitacion)
            ->where('estado', 'ACTIVA')
            ->where(function ($q) use ($inicioConBuffer, $finConBuffer) {
                $q->whereBetween('fecha_inicio', [$inicioConBuffer, $finConBuffer])
                  ->orWhereBetween('fecha_fin', [$inicioConBuffer, $finConBuffer])
                  ->orWhere(function ($q2) use ($inicioConBuffer, $finConBuffer) {
                      $q2->where('fecha_inicio', '<=', $inicioConBuffer)
                         ->where('fecha_fin', '>=', $finConBuffer);
                  });
            });

        if ($excluirReserva) {
            $query->where('id_reserva', '!=', $excluirReserva);
        }

        return $query->count() === 0;
    }

    public function habitacionesLibres(Carbon $inicio, Carbon $fin): array
    {
        $habitaciones = Habitacion::where('activo', true)->get();
        $libres = [];

        foreach ($habitaciones as $h) {
            if ($this->estaDisponible($h->id_habitacion, $inicio, $fin)) {
                $libres[] = $h->id_habitacion;
            }
        }

        return $libres;
    }

    public function habitacionesLibresConInfo(Carbon $inicio, Carbon $fin, int $horasAntesDecoracion = 0): Collection
    {
        $habitaciones = Habitacion::with(['piso', 'tipo'])
            ->where('activo', true)
            ->orderBy('id_piso')
            ->orderBy('orden')
            ->get();

        return $habitaciones->filter(function ($h) use ($inicio, $fin, $horasAntesDecoracion) {
            return $this->estaDisponible($h->id_habitacion, $inicio, $fin, null, $horasAntesDecoracion);
        })->values();
    }

    public function habitacionesConConflicto(Carbon $inicio, Carbon $fin, int $horasAntesDecoracion = 0): Collection
    {
        $habitaciones = Habitacion::with(['piso', 'tipo'])
            ->orderBy('id_piso')
            ->orderBy('orden')
            ->get();

        return $habitaciones->map(function ($h) use ($inicio, $fin, $horasAntesDecoracion) {
            $conflicto = $this->obtenerConflicto($h->id_habitacion, $inicio, $fin, null, $horasAntesDecoracion);
            if (!$conflicto) return null;

            return [
                'id_habitacion' => $h->id_habitacion,
                'numero' => $h->numero,
                'piso_nombre' => $h->piso?->nombre,
                'tipo_nombre' => $h->tipo?->nombre,
                'motivo' => $conflicto['motivo'],
                'ocupacion' => $conflicto['ocupacion'],
            ];
        })->filter()->values();
    }

    public function obtenerConflicto(int $idHabitacion, Carbon $inicio, Carbon $fin, ?int $excluirReserva = null, int $horasAntesDecoracion = 0): ?array
    {
        $ahora = Carbon::now();
        $minutosHastaInicio = (int) round($ahora->diffInMinutes($inicio, false));

        // 0. Anticipacion minima
        if ($horasAntesDecoracion > 0) {
            $horasMinimas = (int) Configuracion::obtener('horas_antes_decoracion', 24);
            if ($minutosHastaInicio < ($horasMinimas * 60)) {
                $horasRestantes = max(0, round($minutosHastaInicio / 60, 1));
                return [
                    'motivo' => "Necesita {$horasMinimas}h de anticipacion para decorar (faltan {$horasRestantes}h)",
                    'ocupacion' => null,
                ];
            }
        } else {
            $anticipacionMin = (int) Configuracion::obtener('anticipacion_minima_reserva_minutos', 30);
            if ($minutosHastaInicio < $anticipacionMin) {
                return [
                    'motivo' => "Muy proximo a la hora actual (minimo {$anticipacionMin} min de anticipacion)",
                    'ocupacion' => null,
                ];
            }
        }

        // 1. Inactiva
        $habitacion = Habitacion::find($idHabitacion);
        if (!$habitacion || !$habitacion->activo) {
            return ['motivo' => 'Habitacion inactiva', 'ocupacion' => null];
        }

        // 2. Mantenimiento
        $mantenimiento = Mantenimiento::with(['tipo', 'prioridad'])
            ->where('id_habitacion', $idHabitacion)
            ->whereIn('estado', ['REPORTADO', 'EN_PROCESO'])
            ->first();

        if ($mantenimiento) {
            return [
                'motivo' => 'En mantenimiento (' . ($mantenimiento->tipo?->nombre ?? 'General') . ')',
                'ocupacion' => null,
            ];
        }

        // 3. Limpieza
        $limpieza = Limpieza::where('id_habitacion', $idHabitacion)
            ->whereIn('estado', ['PENDIENTE', 'EN_PROCESO'])
            ->first();

        if ($limpieza) {
            $bufferLimpieza = Configuracion::obtener('buffer_limpieza_minutos', 30);
            if ($minutosHastaInicio < $bufferLimpieza) {
                return ['motivo' => 'En limpieza', 'ocupacion' => null];
            }
        }

        // 4. Ocupacion
        if ($horasAntesDecoracion > 0) {
            $inicio = $inicio->copy()->subHours($horasAntesDecoracion);
        }

        $buffer = Configuracion::obtener('buffer_limpieza_minutos', 30);
        $inicioConBuffer = $inicio->copy()->subMinutes($buffer);
        $finConBuffer = $fin->copy()->addMinutes($buffer);

        $query = OcupacionHabitacion::with(['reserva.cliente', 'reserva.estado'])
            ->where('id_habitacion', $idHabitacion)
            ->where('estado', 'ACTIVA')
            ->where(function ($q) use ($inicioConBuffer, $finConBuffer) {
                $q->whereBetween('fecha_inicio', [$inicioConBuffer, $finConBuffer])
                  ->orWhereBetween('fecha_fin', [$inicioConBuffer, $finConBuffer])
                  ->orWhere(function ($q2) use ($inicioConBuffer, $finConBuffer) {
                      $q2->where('fecha_inicio', '<=', $inicioConBuffer)
                         ->where('fecha_fin', '>=', $finConBuffer);
                  });
            });

        if ($excluirReserva) {
            $query->where('id_reserva', '!=', $excluirReserva);
        }

        $ocupacion = $query->first();
        if (!$ocupacion) return null;

        $estadoSlug = $ocupacion->reserva?->estado?->slug;
        $motivo = match ($estadoSlug) {
            'activa' => 'Ocupada por cliente actual',
            'confirmada' => 'Reservada por otro cliente',
            'pendiente' => 'Reserva pendiente de confirmar',
            default => 'Bloqueada',
        };

        return [
            'motivo' => $motivo,
            'ocupacion' => [
                'id_ocupacion' => $ocupacion->id_ocupacion,
                'fecha_inicio' => $ocupacion->fecha_inicio->toIso8601String(),
                'fecha_fin' => $ocupacion->fecha_fin->toIso8601String(),
                'estado' => $ocupacion->estado,
                'cliente' => $ocupacion->reserva?->cliente?->nombre,
                'estado_reserva' => $estadoSlug,
            ],
        ];
    }

    public function bloquearHabitacion(int $idHabitacion): void
    {
        Habitacion::where('id_habitacion', $idHabitacion)->lockForUpdate()->first();
    }
}