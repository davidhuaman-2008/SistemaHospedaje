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

    /**
     * Lista todas las visitas de un cliente.
     */
    public function listarPorCliente(int $idCliente): \Illuminate\Support\Collection
    {
        return ClienteVisita::where('id_cliente', $idCliente)
            ->orderByDesc('fecha_entrada')
            ->get();
    }

    /**
     * Obtiene una visita por ID.
     */
    public function obtener(int $id): ClienteVisita
    {
        return ClienteVisita::findOrFail($id);
    }

    /**
     * Crea una visita MANUAL (boton "+ Visita" en el CRUD).
     * - Crea la fila en cliente_visitas
     * - Incrementa visitas, actualiza ultima_visita, suma total_gastado
     * - Recalcula nivel
     */
    public function crear(array $datos): ClienteVisita
    {
        return \DB::transaction(function () use ($datos) {
            $idCliente = $datos['id_cliente'];
            $monto = (float) ($datos['monto_gastado'] ?? 0);

            $visita = ClienteVisita::create([
                'id_cliente' => $idCliente,
                'id_reserva' => $datos['id_reserva'] ?? null,
                'id_habitacion' => $datos['id_habitacion'] ?? null,
                'fecha_entrada' => $datos['fecha_entrada'] ?? Carbon::now(),
                'fecha_salida' => $datos['fecha_salida'] ?? null,
                'monto_gastado' => $monto,
            ]);

            // Actualizar contadores del cliente
            $cliente = Cliente::findOrFail($idCliente);
            $cliente->visitas = $cliente->visitas + 1;
            $cliente->ultima_visita = Carbon::now()->toDateString();
            $cliente->total_gastado = (float) $cliente->total_gastado + $monto;
            $cliente->save();

            $this->recalcularNivel($cliente);

            return $visita->fresh();
        });
    }

    /**
     * Actualiza una visita existente.
     * NO recalcula contadores (es solo edicion de metadata).
     */
    public function actualizar(int $id, array $datos): ClienteVisita
    {
        $visita = ClienteVisita::findOrFail($id);
        $visita->update($datos);
        return $visita->fresh();
    }

    /**
     * Elimina una visita y revierte los contadores del cliente.
     */
    public function eliminar(int $id): void
    {
        \DB::transaction(function () use ($id) {
            $visita = ClienteVisita::findOrFail($id);
            $idCliente = $visita->id_cliente;
            $monto = (float) $visita->monto_gastado;

            // Revertir contadores
            $cliente = Cliente::findOrFail($idCliente);
            $cliente->visitas = max(0, $cliente->visitas - 1);
            $cliente->total_gastado = max(0, (float) $cliente->total_gastado - $monto);
            $cliente->save();

            $this->recalcularNivel($cliente);

            $visita->delete();
        });
    }}