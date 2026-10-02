<?php

namespace App\Services;

use App\Models\TipoHabitacion;
use Illuminate\Support\Collection;

class TipoHabitacionService
{
    public function listar(): Collection
    {
        return TipoHabitacion::orderBy('nombre')->get();
    }

    public function listarActivos(): Collection
    {
        return TipoHabitacion::where('activo', true)->orderBy('nombre')->get();
    }

    public function obtener(int $id): TipoHabitacion
    {
        return TipoHabitacion::findOrFail($id);
    }

    public function crear(array $datos): TipoHabitacion
    {
        return TipoHabitacion::create($datos);
    }

    public function actualizar(int $id, array $datos): TipoHabitacion
    {
        $item = TipoHabitacion::findOrFail($id);
        $item->update($datos);
        return $item->fresh();
    }

    public function desactivar(int $id): TipoHabitacion
    {
        $item = TipoHabitacion::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): TipoHabitacion
    {
        $item = TipoHabitacion::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        TipoHabitacion::findOrFail($id)->delete();
    }
}