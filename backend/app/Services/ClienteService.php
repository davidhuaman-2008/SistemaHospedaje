<?php

namespace App\Services;

use App\Models\Cliente;
use Illuminate\Support\Collection;

class ClienteService
{
    public function __construct(
        private ClienteVisitaService $visitaService,
    ) {}

    public function listar(): Collection
    {
        return Cliente::with(['tipoDocumento', 'nivel'])
            ->withCount(['observacionesPendientes'])
            ->orderByDesc('id_cliente')
            ->get();
    }

    public function listarActivos(): Collection
    {
        return Cliente::with(['tipoDocumento', 'nivel'])
            ->withCount(['observacionesPendientes'])
            ->where('activo', true)
            ->orderBy('nombre')
            ->get();
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

        $reservaActiva = \App\Models\Reserva::with(['habitacion.tipo', 'habitacion.piso', 'tarifa'])
            ->where('id_cliente', $cliente->id_cliente)
            ->whereHas('estado', function ($q) {
                $q->where('slug', 'activa');
            })
            ->latest('id_reserva')
            ->first();

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
            ->withCount(['observacionesPendientes'])
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
     * Recalcula el nivel del cliente segun sus visitas.
     * Delega en ClienteVisitaService para no duplicar la logica.
     */
    public function recalcularNivel(int $idCliente): void
    {
        $cliente = Cliente::findOrFail($idCliente);
        $this->visitaService->recalcularNivel($cliente);
    }
}