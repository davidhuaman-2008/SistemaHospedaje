<?php

namespace App\Services;

use App\Models\Mantenimiento;
use App\Models\Habitacion;
use App\Models\Limpieza;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class MantenimientoService
{
    private const ROLES_PERMITIDOS = ['admin', 'encargado', 'recepcionista'];

    public function listar(): Collection
    {
        return Mantenimiento::with([
            'habitacion.piso', 'habitacion.tipo',
            'tipo', 'prioridad',
            'usuarioReporta', 'usuarioAsignado',
        ])
            ->orderByDesc('id_mantenimiento')
            ->get();
    }

    public function listarPendientes(): Collection
    {
        return Mantenimiento::with([
            'habitacion.piso', 'habitacion.tipo',
            'tipo', 'prioridad',
            'usuarioReporta', 'usuarioAsignado',
        ])
            ->whereIn('estado', ['REPORTADO', 'EN_PROCESO'])
            ->orderByRaw("FIELD(estado, 'EN_PROCESO', 'REPORTADO')")
            ->orderBy('fecha_reporte', 'asc')
            ->get();
    }

    public function listarPorHabitacion(int $idHabitacion): Collection
    {
        return Mantenimiento::with(['tipo', 'prioridad', 'usuarioReporta', 'usuarioAsignado'])
            ->where('id_habitacion', $idHabitacion)
            ->orderByDesc('id_mantenimiento')
            ->get();
    }

    public function obtener(int $id): Mantenimiento
    {
        return Mantenimiento::with([
            'habitacion.piso', 'habitacion.tipo',
            'tipo', 'prioridad',
            'usuarioReporta', 'usuarioAsignado',
        ])
            ->findOrFail($id);
    }

    /**
     * Crea un reporte de mantenimiento.
     * La habitación queda bloqueada hasta que se resuelva.
     */
    public function crear(array $datos, int $idUsuario): Mantenimiento
    {
        return DB::transaction(function () use ($datos, $idUsuario) {
            $this->validarPermiso($idUsuario);

            $habitacion = Habitacion::findOrFail($datos['id_habitacion']);

            // Verificar que no haya otro mantenimiento activo
            $activo = Mantenimiento::where('id_habitacion', $datos['id_habitacion'])
                ->whereIn('estado', ['REPORTADO', 'EN_PROCESO'])
                ->exists();

            if ($activo) {
                throw new \InvalidArgumentException(
                    "La habitación {$habitacion->numero} ya tiene un mantenimiento activo."
                );
            }

            return Mantenimiento::create([
                'id_habitacion' => $datos['id_habitacion'],
                'id_tipo_mantenimiento' => $datos['id_tipo_mantenimiento'],
                'id_prioridad' => $datos['id_prioridad'],
                'id_usuario_reporta' => $idUsuario,
                'id_usuario_asignado' => null,
                'descripcion' => $datos['descripcion'],
                'estado' => 'REPORTADO',
                'fecha_reporte' => now(),
                'observaciones' => $datos['observaciones'] ?? null,
            ])->load([
                'habitacion.piso', 'habitacion.tipo',
                'tipo', 'prioridad',
                'usuarioReporta',
            ]);
        });
    }

    /**
     * Inicia el mantenimiento (REPORTADO → EN_PROCESO).
     * Auto-asigna al usuario que lo inicia.
     */
    public function iniciar(int $id, int $idUsuario): Mantenimiento
    {
        return DB::transaction(function () use ($id, $idUsuario) {
            $this->validarPermiso($idUsuario);

            $mantenimiento = Mantenimiento::findOrFail($id);

            if ($mantenimiento->estado !== 'REPORTADO') {
                throw new \InvalidArgumentException(
                    'Solo se pueden iniciar mantenimientos en estado REPORTADO.'
                );
            }

            $mantenimiento->update([
                'estado' => 'EN_PROCESO',
                'id_usuario_asignado' => $idUsuario,
                'fecha_inicio' => now(),
            ]);

            return $mantenimiento->fresh([
                'habitacion.piso', 'habitacion.tipo',
                'tipo', 'prioridad',
                'usuarioReporta', 'usuarioAsignado',
            ]);
        });
    }

    /**
     * Resuelve el mantenimiento (EN_PROCESO → RESUELTO).
     * Crea automáticamente una LIMPIEZA de la habitación.
     */
    public function resolver(int $id, int $idUsuario, ?string $observaciones = null): Mantenimiento
    {
        return DB::transaction(function () use ($id, $idUsuario, $observaciones) {
            $this->validarPermiso($idUsuario);

            $mantenimiento = Mantenimiento::findOrFail($id);

            if (!in_array($mantenimiento->estado, ['REPORTADO', 'EN_PROCESO'])) {
                throw new \InvalidArgumentException(
                    'Solo se pueden resolver mantenimientos en estado REPORTADO o EN_PROCESO.'
                );
            }

            $mantenimiento->update([
                'estado' => 'RESUELTO',
                'fecha_resolucion' => now(),
                'observaciones' => $observaciones ?? $mantenimiento->observaciones,
            ]);

            // Crear LIMPIEZA automática (después de reparar, hay que limpiar)
            Limpieza::create([
                'id_habitacion' => $mantenimiento->id_habitacion,
                'id_reserva' => null,
                'id_usuario_asignado' => null,
                'estado' => 'PENDIENTE',
                'tipo' => 'NORMAL',
                'fecha_solicitud' => now(),
                'observaciones' => 'Limpieza post-mantenimiento',
            ]);

            return $mantenimiento->fresh([
                'habitacion.piso', 'habitacion.tipo',
                'tipo', 'prioridad',
                'usuarioReporta', 'usuarioAsignado',
            ]);
        });
    }

    /**
     * Cancela el mantenimiento (no era necesario).
     */
    public function cancelar(int $id, int $idUsuario, string $motivo): Mantenimiento
    {
        return DB::transaction(function () use ($id, $idUsuario, $motivo) {
            $this->validarPermiso($idUsuario);

            $mantenimiento = Mantenimiento::findOrFail($id);

            if (in_array($mantenimiento->estado, ['RESUELTO', 'CANCELADO'])) {
                throw new \InvalidArgumentException(
                    'Este mantenimiento ya está cerrado.'
                );
            }

            $mantenimiento->update([
                'estado' => 'CANCELADO',
                'motivo_cancelacion' => $motivo,
                'fecha_resolucion' => now(),
            ]);

            return $mantenimiento->fresh([
                'habitacion.piso', 'habitacion.tipo',
                'tipo', 'prioridad',
                'usuarioReporta', 'usuarioAsignado',
            ]);
        });
    }

    public function eliminar(int $id): void
    {
        Mantenimiento::findOrFail($id)->delete();
    }

    public function contarPendientes(): int
    {
        return Mantenimiento::whereIn('estado', ['REPORTADO', 'EN_PROCESO'])->count();
    }

    /**
     * Verifica si una habitación tiene mantenimiento activo.
     * Usado por EstadoHabitacionService.
     */
    public function tieneMantenimientoActivo(int $idHabitacion): ?Mantenimiento
    {
        return Mantenimiento::where('id_habitacion', $idHabitacion)
            ->whereIn('estado', ['REPORTADO', 'EN_PROCESO'])
            ->with(['tipo', 'prioridad', 'usuarioAsignado'])
            ->first();
    }

    private function validarPermiso(int $idUsuario): void
    {
        $usuario = \App\Models\Usuario::with('rol')->findOrFail($idUsuario);
        $rolNombre = $usuario->rol?->nombre;

        if (!in_array($rolNombre, self::ROLES_PERMITIDOS, true)) {
            throw new \InvalidArgumentException(
                "Tu rol ({$rolNombre}) no tiene permiso para operar mantenimiento."
            );
        }
    }
}