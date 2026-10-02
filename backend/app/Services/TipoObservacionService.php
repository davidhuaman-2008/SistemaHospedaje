<?php

namespace App\Services;

use App\Models\TipoObservacion;
use Illuminate\Support\Collection;

class TipoObservacionService
{
    public function listar(): Collection
    {
        return TipoObservacion::orderBy('orden')->get();
    }

    public function listarActivos(): Collection
    {
        return TipoObservacion::where('activo', true)->orderBy('orden')->get();
    }

    public function obtener(int $id): TipoObservacion
    {
        return TipoObservacion::findOrFail($id);
    }

    public function crear(array $datos): TipoObservacion
    {
        return TipoObservacion::create($datos);
    }

    public function actualizar(int $id, array $datos): TipoObservacion
    {
        $item = TipoObservacion::findOrFail($id);
        $item->update($datos);
        return $item->fresh();
    }

    public function desactivar(int $id): TipoObservacion
    {
        $item = TipoObservacion::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): TipoObservacion
    {
        $item = TipoObservacion::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        TipoObservacion::findOrFail($id)->delete();
    }
}