<?php

namespace App\Services;

use App\Models\Turno;

class TurnoService
{
    public function listar()
    {
        return Turno::orderBy('id')->get();
    }

    public function listarActivos()
    {
        return Turno::where('activo', true)->orderBy('id')->get();
    }

    public function obtener(int $id): Turno
    {
        return Turno::findOrFail($id);
    }

    public function crear(array $datos): Turno
    {
        return Turno::create($datos);
    }

    public function actualizar(int $id, array $datos): Turno
    {
        $turno = Turno::findOrFail($id);
        $turno->fill($datos);
        $turno->save();
        return $turno->fresh();
    }

    public function eliminar(int $id): void
    {
        Turno::findOrFail($id)->delete();
    }

    public function desactivar(int $id): Turno
    {
        $turno = Turno::findOrFail($id);
        $turno->activo = false;
        $turno->save();
        return $turno->fresh();
    }

    public function reactivar(int $id): Turno
    {
        $turno = Turno::findOrFail($id);
        $turno->activo = true;
        $turno->save();
        return $turno->fresh();
    }
}