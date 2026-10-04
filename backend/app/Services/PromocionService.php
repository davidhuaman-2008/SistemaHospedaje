<?php

namespace App\Services;

use App\Models\Promocion;
use Illuminate\Support\Collection;

class PromocionService
{
    public function listar(): Collection
    {
        return Promocion::with(['categoria', 'tipoHabitacion'])
            ->orderByDesc('id_promocion')
            ->get();
    }

    public function listarActivas(): Collection
    {
        return Promocion::with(['categoria', 'tipoHabitacion'])
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();
    }

    public function listarVigentes(): Collection
    {
        $hoy = now()->toDateString();
        return Promocion::with(['categoria', 'tipoHabitacion'])
            ->where('activo', true)
            ->where(function ($q) use ($hoy) {
                $q->whereNull('fecha_inicio')
                  ->orWhere('fecha_inicio', '<=', $hoy);
            })
            ->where(function ($q) use ($hoy) {
                $q->whereNull('fecha_fin')
                  ->orWhere('fecha_fin', '>=', $hoy);
            })
            ->get();
    }

    public function listarPorCategoria(int $idCategoria): Collection
    {
        return Promocion::with(['categoria', 'tipoHabitacion'])
            ->where('id_categoria_promocion', $idCategoria)
            ->where('activo', true)
            ->get();
    }

    public function obtener(int $id): Promocion
    {
        return Promocion::with(['categoria', 'tipoHabitacion'])->findOrFail($id);
    }

    public function crear(array $datos): Promocion
    {
        return Promocion::create($datos)->load(['categoria', 'tipoHabitacion']);
    }

    public function actualizar(int $id, array $datos): Promocion
    {
        $item = Promocion::findOrFail($id);
        $item->update($datos);
        return $item->fresh()->load(['categoria', 'tipoHabitacion']);
    }

    public function desactivar(int $id): Promocion
    {
        $item = Promocion::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): Promocion
    {
        $item = Promocion::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        Promocion::findOrFail($id)->delete();
    }
}