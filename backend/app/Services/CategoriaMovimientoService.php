<?php

namespace App\Services;

use App\Models\CategoriaMovimiento;
use Illuminate\Support\Collection;

class CategoriaMovimientoService
{
    public function listar(): Collection
    {
        return CategoriaMovimiento::orderBy('orden')->get();
    }

    public function listarActivos(): Collection
    {
        return CategoriaMovimiento::where('activo', true)->orderBy('orden')->get();
    }

    public function listarPorTipo(string $tipo): Collection
    {
        return CategoriaMovimiento::where('activo', true)
            ->where('tipo', $tipo)
            ->orderBy('orden')
            ->get();
    }

    public function obtener(int $id): CategoriaMovimiento
    {
        return CategoriaMovimiento::findOrFail($id);
    }

    public function crear(array $datos): CategoriaMovimiento
    {
        return CategoriaMovimiento::create($datos);
    }

    public function actualizar(int $id, array $datos): CategoriaMovimiento
    {
        $item = CategoriaMovimiento::findOrFail($id);
        $item->update($datos);
        return $item->fresh();
    }

    public function desactivar(int $id): CategoriaMovimiento
    {
        $item = CategoriaMovimiento::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): CategoriaMovimiento
    {
        $item = CategoriaMovimiento::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        CategoriaMovimiento::findOrFail($id)->delete();
    }
}