<?php

namespace App\Services;

use App\Models\Piso;
use Illuminate\Support\Collection;

class PisoService
{
    public function listar(): Collection
    {
        return Piso::orderBy('orden')->get();
    }

    public function listarActivos(): Collection
    {
        return Piso::where('activo', true)->orderBy('orden')->get();
    }

    public function obtener(int $id): Piso
    {
        return Piso::findOrFail($id);
    }

    public function crear(array $datos): Piso
    {
        return Piso::create($datos);
    }

    public function actualizar(int $id, array $datos): Piso
    {
        $item = Piso::findOrFail($id);
        $item->update($datos);
        return $item->fresh();
    }

    public function desactivar(int $id): Piso
    {
        $item = Piso::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): Piso
    {
        $item = Piso::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        Piso::findOrFail($id)->delete();
    }
}