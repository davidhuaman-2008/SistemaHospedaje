<?php

namespace App\Services;

use App\Models\Rol;
use InvalidArgumentException;

class RolService
{
    public function listar()
    {
        return Rol::orderBy('id')->get();
    }

    public function listarActivos()
    {
        return Rol::where('activo', true)->orderBy('id')->get();
    }

    public function obtener(int $id): Rol
    {
        return Rol::findOrFail($id);
    }

    public function crear(array $datos): Rol
    {
        return Rol::create($datos);
    }

    public function actualizar(int $id, array $datos): Rol
    {
        $rol = Rol::findOrFail($id);
        $rol->fill($datos);
        $rol->save();
        return $rol->fresh();
    }

    public function eliminar(int $id): void
    {
        $rol = Rol::findOrFail($id);

        // R53: no eliminar si hay usuarios asociados.
        if ($rol->usuarios()->exists()) {
            throw new InvalidArgumentException(
                'No se puede eliminar el rol porque tiene usuarios asociados. Desactívelo en su lugar.'
            );
        }

        $rol->delete();
    }

    public function desactivar(int $id): Rol
    {
        $rol = Rol::findOrFail($id);

        // No desactivar si hay usuarios activos con este rol.
        if ($rol->usuarios()->where('activo', true)->exists()) {
            throw new InvalidArgumentException(
                'No se puede desactivar el rol porque tiene usuarios activos. Reasigne o desactive a esos usuarios primero.'
            );
        }

        $rol->activo = false;
        $rol->save();
        return $rol->fresh();
    }

    public function reactivar(int $id): Rol
    {
        $rol = Rol::findOrFail($id);
        $rol->activo = true;
        $rol->save();
        return $rol->fresh();
    }
}