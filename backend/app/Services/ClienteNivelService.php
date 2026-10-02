<?php

namespace App\Services;

use App\Models\ClienteNivel;
use Illuminate\Support\Collection;

class ClienteNivelService
{
    public function listar(): Collection
    {
        return ClienteNivel::orderBy('visitas_min')->get();
    }

    public function listarActivos(): Collection
    {
        return ClienteNivel::where('activo', true)
            ->orderBy('visitas_min')
            ->get();
    }

    public function obtener(int $id): ClienteNivel
    {
        return ClienteNivel::findOrFail($id);
    }

    public function crear(array $datos): ClienteNivel
    {
        return ClienteNivel::create($datos);
    }

    public function actualizar(int $id, array $datos): ClienteNivel
    {
        $item = ClienteNivel::findOrFail($id);
        $item->update($datos);
        return $item->fresh();
    }

    public function desactivar(int $id): ClienteNivel
    {
        $item = ClienteNivel::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): ClienteNivel
    {
        $item = ClienteNivel::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        ClienteNivel::findOrFail($id)->delete();
    }
}