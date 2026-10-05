<?php

namespace App\Services;

use App\Models\Limpieza;
use App\Models\Habitacion;
use App\Models\Usuario;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class LimpiezaService
{
    /**
     * Roles que pueden iniciar/finalizar limpieza.
     */
    private const ROLES_PERMITIDOS = ['admin', 'encargado', 'limpieza'];

    /**
     * Lista todas las limpiezas.
     */
    public function listar(): Collection
    {
        return Limpieza::with(['habitacion.piso', 'habitacion.tipo', 'usuarioAsignado.rol', 'reserva'])
            ->orderByDesc('id_limpieza')
            ->get();
    }

    /**
     * Lista pendientes + en proceso, ordenadas por antigüedad.
     */
    public function listarPendientes(): Collection
    {
        return Limpieza::with(['habitacion.piso', 'habitacion.tipo', 'usuarioAsignado.rol', 'reserva'])
            ->whereIn('estado', ['PENDIENTE', 'EN_PROCESO'])
            ->orderBy('fecha_solicitud', 'asc')
            ->get();
    }

    /**
     * Lista completadas HOY.
     */
    public function listarCompletadasHoy(): Collection
    {
        return Limpieza::with(['habitacion.piso', 'habitacion.tipo', 'usuarioAsignado.rol', 'reserva'])
            ->where('estado', 'COMPLETADA')
            ->whereDate('fecha_fin', Carbon::today())
            ->orderByDesc('fecha_fin')
            ->get();
    }

    public function obtener(int $id): Limpieza
    {
        return Limpieza::with(['habitacion.piso', 'habitacion.tipo', 'usuarioAsignado.rol', 'reserva'])
            ->findOrFail($id);
    }

    /**
     * Crea una limpieza manual (ej: profunda).
     */
    public function crear(array $datos): Limpieza
    {
        $habitacion = Habitacion::findOrFail($datos['id_habitacion']);

        // Validar que la habitación esté DISPONIBLE
        // (no se puede crear limpieza manual en habitación ocupada)
        $estado = app(EstadoHabitacionService::class)->calcular($habitacion);

        if ($estado['estado'] !== 'Disponible') {
            throw new \InvalidArgumentException(
                "Solo se puede crear limpieza manual en habitaciones disponibles. " .
                "La habitación {$habitacion->numero} está en estado: {$estado['estado']}."
            );
        }

        return Limpieza::create([
            'id_habitacion' => $datos['id_habitacion'],
            'id_reserva' => $datos['id_reserva'] ?? null,
            'id_usuario_asignado' => null,
            'estado' => 'PENDIENTE',
            'tipo' => $datos['tipo'] ?? 'NORMAL',
            'fecha_solicitud' => now(),
            'observaciones' => $datos['observaciones'] ?? null,
        ])->load(['habitacion.piso', 'habitacion.tipo']);
    }

    /**
     * Inicia una limpieza (PENDIENTE → EN_PROCESO).
     * Valida que el usuario tenga rol permitido.
     * Auto-asigna al usuario que la inicia.
     */
    public function iniciar(int $id, int $idUsuario): Limpieza
    {
        $this->validarPermiso($idUsuario);

        $limpieza = Limpieza::findOrFail($id);

        if ($limpieza->estado !== 'PENDIENTE') {
            throw new \InvalidArgumentException(
                'Solo se pueden iniciar limpiezas en estado PENDIENTE.'
            );
        }

        $limpieza->update([
            'estado' => 'EN_PROCESO',
            'id_usuario_asignado' => $idUsuario,
            'fecha_inicio' => now(),
        ]);

        return $limpieza->fresh(['habitacion.piso', 'habitacion.tipo', 'usuarioAsignado.rol']);
    }

    /**
     * Finaliza una limpieza (EN_PROCESO → COMPLETADA).
     * Valida que el usuario tenga rol permitido.
     * La habitación vuelve a estar disponible automáticamente.
     */
    public function finalizar(int $id, int $idUsuario, ?string $observaciones = null): Limpieza
    {
        $this->validarPermiso($idUsuario);

        $limpieza = Limpieza::findOrFail($id);

        if ($limpieza->estado !== 'EN_PROCESO') {
            throw new \InvalidArgumentException(
                'Solo se pueden finalizar limpiezas en estado EN_PROCESO.'
            );
        }

        $limpieza->update([
            'estado' => 'COMPLETADA',
            'fecha_fin' => now(),
            'observaciones' => $observaciones ?? $limpieza->observaciones,
        ]);

        return $limpieza->fresh(['habitacion.piso', 'habitacion.tipo', 'usuarioAsignado.rol']);
    }

    /**
     * Cuenta de pendientes para badge del sidebar.
     */
    public function contarPendientes(): int
    {
        return Limpieza::whereIn('estado', ['PENDIENTE', 'EN_PROCESO'])->count();
    }

    /**
     * Valida que el usuario tenga un rol permitido para operar limpieza.
     */
    private function validarPermiso(int $idUsuario): void
    {
        $usuario = Usuario::with('rol')->findOrFail($idUsuario);
        $rolNombre = $usuario->rol?->nombre;

        if (!in_array($rolNombre, self::ROLES_PERMITIDOS, true)) {
            throw new \InvalidArgumentException(
                "Tu rol ({$rolNombre}) no tiene permiso para operar limpieza. " .
                "Solo admin, encargado y personal de limpieza pueden hacerlo."
            );
        }
    }

    /**
     * Finaliza TODAS las limpiezas pendientes/en proceso de una vez.
     * Usado para "Limpieza Rápida" cuando el personal ya limpió todo.
     */
    public function finalizarTodas(int $idUsuario, ?string $observaciones = null): array
    {
        $this->validarPermiso($idUsuario);

        $limpiezas = Limpieza::whereIn('estado', ['PENDIENTE', 'EN_PROCESO'])->get();

        if ($limpiezas->isEmpty()) {
            throw new \InvalidArgumentException('No hay limpiezas pendientes para finalizar.');
        }

        $ids = [];
        foreach ($limpiezas as $l) {
            $l->update([
                'estado' => 'COMPLETADA',
                'fecha_fin' => now(),
                'id_usuario_asignado' => $l->id_usuario_asignado ?: $idUsuario,
                'observaciones' => $observaciones ?? 'Limpieza rápida masiva',
            ]);
            $ids[] = $l->id_limpieza;
        }

        return [
            'total' => count($ids),
            'ids' => $ids,
        ];
    }
}
