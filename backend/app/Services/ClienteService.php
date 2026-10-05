<?php

namespace App\Services;

use App\Models\Cliente;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ClienteService
{
    public function listar(): Collection
    {
        return Cliente::with(['tipoDocumento', 'nivel'])
            ->orderByDesc('id_cliente')
            ->get()
            ->map(function ($cliente) {
                // Agregar conteo de observaciones pendientes para la tabla
                $cliente->observaciones_pendientes_count = $cliente->observacionesPendientes()->count();
                return $cliente;
            });
    }

    public function listarActivos(): Collection
    {
        return Cliente::with(['tipoDocumento', 'nivel'])
            ->where('activo', true)
            ->orderBy('nombre')
            ->get()
            ->map(function ($cliente) {
                $cliente->observaciones_pendientes_count = $cliente->observacionesPendientes()->count();
                return $cliente;
            });
    }

    public function buscarPorDni(string $dni): ?Cliente
    {
        $cliente = Cliente::with([
            'tipoDocumento',
            'nivel',
            'observacionesPendientes.tipo',
            'observacionesPendientes.gravedad',
            'observacionesPendientes.usuario',
        ])
            ->where('numero_documento', $dni)
            ->first();

        if (!$cliente) {
            return null;
        }

        // Buscar reserva activa (estado 'activa')
        $reservaActiva = \App\Models\Reserva::with(['habitacion.tipo', 'habitacion.piso', 'tarifa'])
            ->where('id_cliente', $cliente->id_cliente)
            ->whereHas('estado', function ($q) {
                $q->where('slug', 'activa');
            })
            ->latest('id_reserva')
            ->first();

        // Adjuntar como atributo dinámico
        $cliente->setAttribute('reserva_activa', $reservaActiva);

        return $cliente;
    }

    public function obtener(int $id): Cliente
    {
        return Cliente::with([
            'tipoDocumento',
            'nivel',
            'observacionesPendientes.tipo',
            'observacionesPendientes.gravedad',
            'observacionesPendientes.usuario',
        ])
            ->findOrFail($id);
    }

    public function crear(array $datos): Cliente
    {
        return Cliente::create($datos)->load(['tipoDocumento', 'nivel']);
    }

    public function actualizar(int $id, array $datos): Cliente
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->update($datos);
        return $cliente->fresh()->load(['tipoDocumento', 'nivel']);
    }

    public function desactivar(int $id): Cliente
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->update(['activo' => false]);
        return $cliente;
    }

    public function reactivar(int $id): Cliente
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->update(['activo' => true]);
        return $cliente;
    }

    public function eliminar(int $id): void
    {
        Cliente::findOrFail($id)->delete();
    }

    /**
     * Recalcula el nivel del cliente según sus visitas.
     */
    public function recalcularNivel(int $idCliente): void
    {
        $cliente = Cliente::findOrFail($idCliente);
        $nivel = DB::table('clientes_niveles')
            ->where('activo', true)
            ->where('visitas_min', '<=', $cliente->visitas)
            ->where(function ($q) use ($cliente) {
                $q->whereNull('visitas_max')
                  ->orWhere('visitas_max', '>=', $cliente->visitas);
            })
            ->orderByDesc('visitas_min')
            ->first();

        if ($nivel) {
            $cliente->update(['id_nivel' => $nivel->id_nivel]);
        }
    }
}