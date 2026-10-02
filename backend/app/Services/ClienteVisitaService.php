<?php

namespace App\Services;

use App\Models\ClienteVisita;
use App\Models\Cliente;
use App\Models\ClienteNivel;
use Illuminate\Support\Collection;

class ClienteVisitaService
{
    public function listarPorCliente(int $idCliente): Collection
    {
        return ClienteVisita::where('id_cliente', $idCliente)
            ->orderByDesc('fecha_entrada')
            ->get();
    }

    public function obtener(int $id): ClienteVisita
    {
        return ClienteVisita::findOrFail($id);
    }

    public function crear(array $datos): ClienteVisita
    {
        $visita = ClienteVisita::create($datos);

        // Actualizar contadores del cliente
        $cliente = Cliente::find($datos['id_cliente']);
        if ($cliente) {
            $monto = (float) ($datos['monto_gastado'] ?? 0);
            $cliente->visitas = $cliente->visitas + 1;
            $cliente->ultima_visita = now()->toDateString();
            $cliente->total_gastado = $cliente->total_gastado + $monto;
            $cliente->save();

            // Recalcular nivel de fidelización
            $this->recalcularNivel($cliente);
        }

        return $visita;
    }

    public function actualizar(int $id, array $datos): ClienteVisita
    {
        $item = ClienteVisita::findOrFail($id);
        $item->update($datos);
        return $item->fresh();
    }

    public function eliminar(int $id): void
    {
        ClienteVisita::findOrFail($id)->delete();
    }

    /**
     * Recalcula el nivel de fidelización del cliente según sus visitas.
     * Bronce: 0-4, Plata: 5-9, Oro: 10-19, VIP: 20+
     */
    private function recalcularNivel(Cliente $cliente): void
    {
        $nivel = ClienteNivel::where('activo', true)
            ->where('visitas_min', '<=', $cliente->visitas)
            ->where(function ($q) use ($cliente) {
                $q->whereNull('visitas_max')
                  ->orWhere('visitas_max', '>=', $cliente->visitas);
            })
            ->orderByDesc('visitas_min')
            ->first();

        if ($nivel && $cliente->id_nivel !== $nivel->id_nivel) {
            $cliente->update(['id_nivel' => $nivel->id_nivel]);
        }
    }
}