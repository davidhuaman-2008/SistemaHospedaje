<?php

namespace App\Services;

use App\Models\Tarifa;
use Illuminate\Support\Collection;

class TarifaService
{
    public function listar(): Collection
    {
        return Tarifa::with('tipo')->orderBy('id_tipo')->orderBy('horas')->get();
    }

    public function listarActivos(): Collection
    {
        return Tarifa::with('tipo')
            ->where('activo', true)
            ->orderBy('id_tipo')
            ->orderBy('horas')
            ->get();
    }

    public function listarPorTipo(int $idTipo): Collection
    {
        return Tarifa::where('id_tipo', $idTipo)
            ->where('activo', true)
            ->orderBy('horas')
            ->get();
    }

    public function obtener(int $id): Tarifa
    {
        return Tarifa::with('tipo')->findOrFail($id);
    }

    public function crear(array $datos): Tarifa
    {
        return Tarifa::create($datos)->load('tipo');
    }

    public function actualizar(int $id, array $datos): Tarifa
    {
        $item = Tarifa::findOrFail($id);
        $item->update($datos);
        return $item->fresh()->load('tipo');
    }

    public function desactivar(int $id): Tarifa
    {
        $item = Tarifa::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): Tarifa
    {
        $item = Tarifa::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        Tarifa::findOrFail($id)->delete();
    }
}