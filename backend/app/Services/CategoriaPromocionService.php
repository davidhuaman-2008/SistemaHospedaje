<?php

namespace App\Services;

use App\Models\CategoriaPromocion;
use Illuminate\Support\Collection;

class CategoriaPromocionService
{
    public function listar(): Collection
    {
        return CategoriaPromocion::orderBy('orden')->get();
    }

    public function listarActivos(): Collection
    {
        return CategoriaPromocion::where('activo', true)->orderBy('orden')->get();
    }

    public function obtener(int $id): CategoriaPromocion
    {
        return CategoriaPromocion::findOrFail($id);
    }

    public function crear(array $datos): CategoriaPromocion
    {
        return CategoriaPromocion::create($datos);
    }

    public function actualizar(int $id, array $datos): CategoriaPromocion
    {
        $item = CategoriaPromocion::findOrFail($id);
        $item->update($datos);
        return $item->fresh();
    }

    public function desactivar(int $id): CategoriaPromocion
    {
        $item = CategoriaPromocion::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): CategoriaPromocion
    {
        $item = CategoriaPromocion::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        CategoriaPromocion::findOrFail($id)->delete();
    }
}