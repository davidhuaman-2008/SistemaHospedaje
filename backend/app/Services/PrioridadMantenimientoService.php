<?php

namespace App\Services;

use App\Models\PrioridadMantenimiento;
use Illuminate\Support\Collection;

class PrioridadMantenimientoService
{
    public function listar(): Collection
    {
        return PrioridadMantenimiento::orderBy('orden')->get();
    }

    public function listarActivos(): Collection
    {
        return PrioridadMantenimiento::where('activo', true)->orderBy('orden')->get();
    }

    public function obtener(int $id): PrioridadMantenimiento
    {
        return PrioridadMantenimiento::findOrFail($id);
    }

    public function crear(array $datos): PrioridadMantenimiento
    {
        return PrioridadMantenimiento::create($datos);
    }

    public function actualizar(int $id, array $datos): PrioridadMantenimiento
    {
        $item = PrioridadMantenimiento::findOrFail($id);
        $item->update($datos);
        return $item->fresh();
    }

    public function desactivar(int $id): PrioridadMantenimiento
    {
        $item = PrioridadMantenimiento::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): PrioridadMantenimiento
    {
        $item = PrioridadMantenimiento::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        PrioridadMantenimiento::findOrFail($id)->delete();
    }
}