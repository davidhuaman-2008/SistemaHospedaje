<?php

namespace App\Services;

use App\Models\Habitacion;
use Illuminate\Support\Collection;

class HabitacionService
{
    public function listar(): Collection
    {
        return Habitacion::with(['piso', 'tipo'])
            ->orderBy('id_piso')
            ->orderBy('orden')
            ->orderBy('numero')
            ->get();
    }

    public function listarActivas(): Collection
    {
        return Habitacion::with(['piso', 'tipo'])
            ->where('activo', true)
            ->orderBy('id_piso')
            ->orderBy('orden')
            ->orderBy('numero')
            ->get();
    }

    public function listarPorPiso(int $idPiso): Collection
    {
        return Habitacion::with(['piso', 'tipo'])
            ->where('id_piso', $idPiso)
            ->orderBy('orden')
            ->orderBy('numero')
            ->get();
    }

    public function listarPorTipo(int $idTipo): Collection
    {
        return Habitacion::with(['piso', 'tipo'])
            ->where('id_tipo', $idTipo)
            ->orderBy('id_piso')
            ->orderBy('orden')
            ->get();
    }

    public function obtener(int $id): Habitacion
    {
        return Habitacion::with(['piso', 'tipo'])->findOrFail($id);
    }

    public function crear(array $datos): Habitacion
    {
        return Habitacion::create($datos)->load(['piso', 'tipo']);
    }

    public function actualizar(int $id, array $datos): Habitacion
    {
        $item = Habitacion::findOrFail($id);
        $item->fill($datos);
        $item->save();
        return $item->fresh()->load(['piso', 'tipo']);
    }

    public function desactivar(int $id): Habitacion
    {
        $item = Habitacion::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): Habitacion
    {
        $item = Habitacion::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        Habitacion::findOrFail($id)->delete();
    }
}