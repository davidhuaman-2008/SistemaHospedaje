<?php

namespace App\Services;

use App\Models\Rol;

class RolService
{
    public function listar()
    {
        return Rol::orderBy('id')->get();
    }

    public function crear(array $datos): Rol
    {
        return Rol::create($datos);
    }

    public function actualizar(Rol $rol, array $datos): Rol
    {
        $rol->update($datos);

        return $rol->fresh();
    }

    public function eliminar(Rol $rol): void
    {
        $rol->delete();
    }
}
