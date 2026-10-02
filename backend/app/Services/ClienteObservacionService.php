<?php

namespace App\Services;

use App\Models\ClienteObservacion;
use Illuminate\Support\Collection;

class ClienteObservacionService
{
    public function listarPorCliente(int $idCliente): Collection
    {
        return ClienteObservacion::with(['tipo', 'gravedad', 'usuario'])
            ->where('id_cliente', $idCliente)
            ->orderByDesc('id_observacion')
            ->get();
    }

    public function listarTodas(): Collection
    {
        return ClienteObservacion::with(['cliente', 'tipo', 'gravedad', 'usuario'])
            ->orderByDesc('id_observacion')
            ->get();
    }

    public function obtener(int $id): ClienteObservacion
    {
        return ClienteObservacion::with(['cliente', 'tipo', 'gravedad', 'usuario'])
            ->findOrFail($id);
    }

    public function crear(array $datos): ClienteObservacion
    {
        return ClienteObservacion::create($datos)
            ->load(['tipo', 'gravedad', 'usuario']);
    }

    public function resolver(int $id): ClienteObservacion
    {
        $item = ClienteObservacion::findOrFail($id);
        $item->update([
            'resuelto' => true,
            'fecha_resolucion' => now(),
        ]);
        return $item->fresh()->load(['tipo', 'gravedad', 'usuario']);
    }

    public function eliminar(int $id): void
    {
        ClienteObservacion::findOrFail($id)->delete();
    }
}