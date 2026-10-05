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

    public function listarStockBajo(): Collection
    {
        return Producto::with(['categoria', 'proveedor'])
            ->whereColumn('stock_actual', '<=', 'stock_minimo')
            ->orderBy('stock_actual')
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
        $producto = Producto::findOrFail($id);
        $producto->update($datos);
        return $producto->fresh()->load(['categoria', 'proveedor']);
    }

    public function desactivar(int $id): Producto
    {
        $producto = Producto::findOrFail($id);
        $producto->update(['activo' => false]);
        return $producto;
    }

    public function reactivar(int $id): Producto
    {
        $producto = Producto::findOrFail($id);
        $producto->update(['activo' => true]);
        return $producto;
    }

    public function eliminar(int $id): void
    {
        Producto::findOrFail($id)->delete();
    }
}