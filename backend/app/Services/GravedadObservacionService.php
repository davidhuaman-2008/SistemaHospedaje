<?php

namespace App\Services;

use App\Models\GravedadObservacion;
use Illuminate\Support\Collection;

class GravedadObservacionService
{
    public function listar(): Collection
    {
        return GravedadObservacion::orderBy('prioridad')->get();
    }

    public function listarActivos(): Collection
    {
        return GravedadObservacion::where('activo', true)->orderBy('prioridad')->get();
    }

    public function obtener(int $id): GravedadObservacion
    {
        return GravedadObservacion::findOrFail($id);
    }

    public function crear(array $datos): GravedadObservacion
    {
        return GravedadObservacion::create($datos);
    }

    public function actualizar(int $id, array $datos): GravedadObservacion
    {
        $item = GravedadObservacion::findOrFail($id);
        $item->update($datos);
        return $item->fresh();
    }

    public function desactivar(int $id): GravedadObservacion
    {
        $item = GravedadObservacion::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): GravedadObservacion
    {
        $item = GravedadObservacion::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        GravedadObservacion::findOrFail($id)->delete();
    }
}