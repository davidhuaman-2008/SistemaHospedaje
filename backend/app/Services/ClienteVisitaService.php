<?php

namespace App\Services;

use App\Models\Cliente;
use App\Models\ClienteNivel;
use App\Models\ClienteVisita;
use Carbon\Carbon;

class ClienteVisitaService
{
    /**
     * Registra la visita de un cliente.
     * - Incrementa visitas
     * - Actualiza ultima_visita
     * - Suma total_gastado
     * - Recalcula nivel (R34)
     */
    public function registrar(int $idCliente, ?int $idReserva, ?int $idHabitacion, float $monto): void
    {
        // 1. Crear fila en cliente_visitas
        ClienteVisita::create([
            'id_cliente' => $idCliente,
            'id_reserva' => $idReserva,
            'id_habitacion' => $idHabitacion,
            'fecha_entrada' => Carbon::now(),
            'monto_gastado' => $monto,
        ]);

        // 2. Actualizar cliente
        $cliente = Cliente::findOrFail($idCliente);
        $cliente->visitas = $cliente->visitas + 1;
        $cliente->ultima_visita = Carbon::now()->toDateString();
        $cliente->total_gastado = $cliente->total_gastado + $monto;
        $cliente->save();

        // 3. Recalcular nivel
        $this->recalcularNivel($cliente);
    }

    /**
     * Recalcula el nivel según las visitas actuales (R34).
     * Bronce: 0-4, Plata: 5-9, Oro: 10-19, VIP: 20+
     */
    public function recalcularNivel(Cliente $cliente): void
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
            $cliente->id_nivel = $nivel->id_nivel;
            $cliente->save();
        }
    }
}