<?php

namespace App\Services;

use App\Models\Rol;

class RolService
{
    public function listar()
    {
        return Rol::orderBy('id')->get();
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
        Rol::findOrFail($id)->delete();
    }

    public function desactivar(int $id): Rol
    {
        $rol = Rol::findOrFail($id);
        $rol->activo = false;
        $rol->save();
        return $rol;
    }

    public function reactivar(int $id): Rol
    {
        $rol = Rol::findOrFail($id);
        $rol->activo = true;
        $rol->save();
        return $rol;
    }
}