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
     * Considera:
     * - Habitacion activa
     * - Sin ocupacion que se cruce
     * - Sin mantenimiento activo
     * - Sin limpieza pendiente (si el rango empieza en menos de X min)
     * Regla R4: buffer configurable.
     */
    public function estaDisponible(int $idHabitacion, Carbon $inicio, Carbon $fin, ?int $excluirReserva = null): bool
    {
        // 1. La habitacion debe estar activa
        $habitacion = Habitacion::find($idHabitacion);
        if (!$habitacion || !$habitacion->activo) {
            return false;
        }

        // 2. No debe haber mantenimiento activo
        $mantenimiento = Mantenimiento::where('id_habitacion', $idHabitacion)
            ->whereIn('estado', ['REPORTADO', 'EN_PROCESO'])
            ->exists();

        if ($mantenimiento) {
            return false;
        }

        // 3. Limpieza: si el rango empieza en menos de X min, bloquear
        $limpieza = Limpieza::where('id_habitacion', $idHabitacion)
            ->whereIn('estado', ['PENDIENTE', 'EN_PROCESO'])
            ->first();

        if ($limpieza) {
            $bufferLimpieza = Configuracion::obtener('buffer_limpieza_minutos', 30);
            $minutosHastaInicio = Carbon::now()->diffInMinutes($inicio, false);

            // Si el rango empieza en menos del buffer, la limpieza puede no estar lista
            if ($minutosHastaInicio < $bufferLimpieza) {
                return false;
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

    public function habitacionesLibresConInfo(Carbon $inicio, Carbon $fin): Collection
    {
        $habitaciones = Habitacion::with(['piso', 'tipo'])
            ->where('activo', true)
            ->orderBy('id_piso')
            ->orderBy('orden')
            ->get();

        return $habitaciones->filter(function ($h) use ($inicio, $fin) {
            return $this->estaDisponible($h->id_habitacion, $inicio, $fin);
        })->values();
    }

    public function habitacionesConConflicto(Carbon $inicio, Carbon $fin): Collection
    {
        $habitaciones = Habitacion::with(['piso', 'tipo'])
            ->orderBy('id_piso')
            ->orderBy('orden')
            ->get();

        return $habitaciones->map(function ($h) use ($inicio, $fin) {
            // Si esta activa, chequear conflicto normal
            if ($h->activo) {
                $conflicto = $this->obtenerConflicto($h->id_habitacion, $inicio, $fin);
                if (!$conflicto) return null;

                return [
                    'id_habitacion' => $h->id_habitacion,
                    'numero' => $h->numero,
                    'piso_nombre' => $h->piso?->nombre,
                    'tipo_nombre' => $h->tipo?->nombre,
                    'motivo' => $conflicto['motivo'],
                    'ocupacion' => $conflicto['ocupacion'],
                ];
            }

            // Si esta inactiva
            return [
                'id_habitacion' => $h->id_habitacion,
                'numero' => $h->numero,
                'piso_nombre' => $h->piso?->nombre,
                'tipo_nombre' => $h->tipo?->nombre,
                'motivo' => 'Habitacion inactiva',
                'ocupacion' => null,
            ];
        })->filter()->values();
    }

    /**
     * Devuelve el motivo de bloqueo (o null si esta libre).
     * Prioridad: inactiva > mantenimiento > limpieza > ocupacion
     */
    public function obtenerConflicto(int $idHabitacion, Carbon $inicio, Carbon $fin, ?int $excluirReserva = null): ?array
    {
        // 1. Inactiva
        $habitacion = Habitacion::find($idHabitacion);
        if (!$habitacion || !$habitacion->activo) {
            return [
                'motivo' => 'Habitacion inactiva',
                'ocupacion' => null,
            ];
        }

        // 2. Mantenimiento activo
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

        // 3. Limpieza pendiente (si el rango empieza en menos de X min)
        $limpieza = Limpieza::where('id_habitacion', $idHabitacion)
            ->whereIn('estado', ['PENDIENTE', 'EN_PROCESO'])
            ->first();

        if ($limpieza) {
            $bufferLimpieza = Configuracion::obtener('buffer_limpieza_minutos', 30);
            $minutosHastaInicio = Carbon::now()->diffInMinutes($inicio, false);

            if ($minutosHastaInicio < $bufferLimpieza) {
                return [
                    'motivo' => 'En limpieza (' . ucfirst(strtolower($limpieza->estado)) . ')',
                    'ocupacion' => null,
                ];
            }
        }

        // 4. Ocupacion que se cruce
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