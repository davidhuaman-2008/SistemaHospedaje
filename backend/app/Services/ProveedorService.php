<?php

namespace App\Services;

use App\Models\Proveedor;
use Illuminate\Support\Collection;

class ProveedorService
{
    public function listar(): Collection
    {
        return Proveedor::orderBy('razon_social')->get();
    }

    public function listarActivos(): Collection
    {
        return Proveedor::where('activo', true)->orderBy('razon_social')->get();
    }

    public function obtener(int $id): Proveedor
    {
        return Proveedor::findOrFail($id);
    }

    public function crear(array $datos): Proveedor
    {
        return Proveedor::create($datos);
    }

    public function actualizar(int $id, array $datos): Proveedor
    {
        $item = Proveedor::findOrFail($id);
        $item->update($datos);
        return $item->fresh();
    }

    public function desactivar(int $id): Proveedor
    {
        $item = Proveedor::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): Proveedor
    {
        $item = Proveedor::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        Proveedor::findOrFail($id)->delete();
    }
}