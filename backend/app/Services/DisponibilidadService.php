<?php

namespace App\Services;

use App\Models\Habitacion;
use App\Models\OcupacionHabitacion;
use Carbon\Carbon;

class DisponibilidadService
{
    /**
     * Verifica si una habitación está disponible en un rango.
     * Regla R4: buffer de 30 min entre reservas.
     */
    public function estaDisponible(int $idHabitacion, Carbon $inicio, Carbon $fin, ?int $excluirReserva = null): bool
    {
        $buffer = 30; // minutos

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

    /**
     * Devuelve las habitaciones libres en un rango.
     */
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
}