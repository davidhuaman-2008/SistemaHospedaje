<?php

namespace App\Services;

use App\Models\Cliente;
use App\Models\ClienteVisita;
use Illuminate\Support\Collection;

class ClienteService
{
    public function listar(): Collection
    {
        return Cliente::with(['tipoDocumento', 'nivel'])
            ->orderByDesc('id_cliente')
            ->get();
    }

    public function listarActivos(): Collection
    {
        return Cliente::with(['tipoDocumento', 'nivel'])
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();
    }

    public function buscarPorDni(string $dni): ?Cliente
    {
        return Cliente::with(['tipoDocumento', 'nivel', 'observacionesPendientes'])
            ->where('numero_documento', $dni)
            ->first();
    }

    public function obtener(int $id): Cliente
    {
        return Cliente::with([
            'tipoDocumento',
            'nivel',
            'visitas',
            'observaciones.tipo',
            'observaciones.gravedad',
        ])->findOrFail($id);
    }

    public function crear(array $datos): Cliente
    {
        // Asignar nivel Bronce por defecto si no viene
        if (!isset($datos['id_nivel'])) {
            $bronce = \App\Models\ClienteNivel::where('nombre', 'Bronce')->first();
            if ($bronce) {
                $datos['id_nivel'] = $bronce->id_nivel;
            }
        }

        return Cliente::create($datos)->load(['tipoDocumento', 'nivel']);
    }

    public function actualizar(int $id, array $datos): Cliente
    {
        $item = Cliente::findOrFail($id);
        $item->update($datos);
        return $item->fresh()->load(['tipoDocumento', 'nivel']);
    }

    public function desactivar(int $id): Cliente
    {
        $item = Cliente::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): Cliente
    {
        $item = Cliente::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        Cliente::findOrFail($id)->delete();
    }

    public function listarVisitas(int $idCliente): Collection
    {
        return ClienteVisita::where('id_cliente', $idCliente)
            ->orderByDesc('fecha_entrada')
            ->get();
    }
}