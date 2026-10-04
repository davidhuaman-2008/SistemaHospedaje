<?php

namespace App\Services;

use App\Models\CategoriaProducto;
use Illuminate\Support\Collection;

class CategoriaProductoService
{
    public function listar(): Collection
    {
        return CategoriaProducto::orderBy('orden')->get();
    }

    public function listarActivos(): Collection
    {
        return CategoriaProducto::where('activo', true)->orderBy('orden')->get();
    }

    public function obtener(int $id): CategoriaProducto
    {
        return CategoriaProducto::findOrFail($id);
    }

    public function crear(array $datos): CategoriaProducto
    {
        return CategoriaProducto::create($datos);
    }

    public function actualizar(int $id, array $datos): CategoriaProducto
    {
        $item = CategoriaProducto::findOrFail($id);
        $item->update($datos);
        return $item->fresh();
    }

    public function desactivar(int $id): CategoriaProducto
    {
        $item = CategoriaProducto::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): CategoriaProducto
    {
        $item = CategoriaProducto::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        CategoriaProducto::findOrFail($id)->delete();
    }
}