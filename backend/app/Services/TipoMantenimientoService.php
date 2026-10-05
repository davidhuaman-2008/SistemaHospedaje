<?php

namespace App\Services;

use App\Models\TipoMantenimiento;
use Illuminate\Support\Collection;

class TipoMantenimientoService
{
    public function listar(): Collection
    {
        return TipoMantenimiento::orderBy('orden')->get();
    }

    public function listarActivos(): Collection
    {
        return TipoMantenimiento::where('activo', true)->orderBy('orden')->get();
    }

    public function obtener(int $id): TipoMantenimiento
    {
        return TipoMantenimiento::findOrFail($id);
    }

    public function crear(array $datos): TipoMantenimiento
    {
        return TipoMantenimiento::create($datos);
    }

    public function actualizar(int $id, array $datos): TipoMantenimiento
    {
        $item = TipoMantenimiento::findOrFail($id);
        $item->update($datos);
        return $item->fresh();
    }

    public function desactivar(int $id): TipoMantenimiento
    {
        $item = TipoMantenimiento::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): TipoMantenimiento
    {
        $item = TipoMantenimiento::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        TipoMantenimiento::findOrFail($id)->delete();
    }
}