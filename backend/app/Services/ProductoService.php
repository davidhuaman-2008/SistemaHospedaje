<?php

namespace App\Services;

use App\Models\Producto;
use Illuminate\Support\Collection;

class ProductoService
{
    public function listar(): Collection
    {
        return Producto::with(['categoria', 'proveedor'])
            ->orderBy('nombre')
            ->get();
    }

    public function listarActivos(): Collection
    {
        return Producto::with(['categoria', 'proveedor'])
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();
    }

    public function listarPorCategoria(int $idCategoria): Collection
    {
        return Producto::with(['categoria', 'proveedor'])
            ->where('id_categoria_producto', $idCategoria)
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();
    }

    public function listarStockBajo(): Collection
    {
        return Producto::with(['categoria', 'proveedor'])
            ->where('activo', true)
            ->whereColumn('stock_actual', '<=', 'stock_minimo')
            ->orderBy('stock_actual')
            ->get();
    }

    public function obtener(int $id): Producto
    {
        return Producto::with(['categoria', 'proveedor'])->findOrFail($id);
    }

    public function crear(array $datos): Producto
    {
        return Producto::create($datos)->load(['categoria', 'proveedor']);
    }

    public function actualizar(int $id, array $datos): Producto
    {
        $item = Producto::findOrFail($id);
        $item->update($datos);
        return $item->fresh()->load(['categoria', 'proveedor']);
    }

    public function desactivar(int $id): Producto
    {
        $item = Producto::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): Producto
    {
        $item = Producto::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        Producto::findOrFail($id)->delete();
    }
}