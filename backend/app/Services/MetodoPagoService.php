<?php

namespace App\Services;

use App\Models\MetodoPago;
use Illuminate\Support\Collection;

class MetodoPagoService
{
    public function listar(): Collection
    {
        return MetodoPago::orderBy('orden')->get();
    }

    public function listarActivos(): Collection
    {
        return MetodoPago::where('activo', true)->orderBy('orden')->get();
    }

    public function listarDeCaja(): Collection
    {
        return MetodoPago::where('activo', true)
            ->where('es_de_caja', true)
            ->orderBy('orden')
            ->get();
    }

    public function listarDeDuenia(): Collection
    {
        return MetodoPago::where('activo', true)
            ->where('es_de_caja', false)
            ->orderBy('orden')
            ->get();
    }

    public function obtener(int $id): MetodoPago
    {
        return MetodoPago::findOrFail($id);
    }

    public function crear(array $datos): MetodoPago
    {
        return MetodoPago::create($datos);
    }

    public function actualizar(int $id, array $datos): MetodoPago
    {
        $item = MetodoPago::findOrFail($id);
        $item->update($datos);
        return $item->fresh();
    }

    public function desactivar(int $id): MetodoPago
    {
        $item = MetodoPago::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): MetodoPago
    {
        $item = MetodoPago::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        MetodoPago::findOrFail($id)->delete();
    }
}