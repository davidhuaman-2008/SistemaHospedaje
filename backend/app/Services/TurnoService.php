<?php

namespace App\Services;

use App\Models\Turno;

class TurnoService
{
    public function listar()
    {
        return Turno::orderBy('id')->get();
    }

    public function crear(array $datos): Turno
    {
        return Turno::create($datos);
    }

    public function actualizar(Turno $turno, array $datos): Turno
    {
        $turno->fill($datos);
        $turno->save();

        return Turno::find($turno->id);
    }

    public function eliminar(Turno $turno): void
    {
        $turno->delete();
    }

    public function desactivar(int $id): Turno
    {
        $turno = Turno::findOrFail($id);
        $turno->activo = false;
        $turno->save();
        return $turno;
    }

    public function reactivar(int $id): Turno
    {
        $turno = Turno::findOrFail($id);
        $turno->activo = true;
        $turno->save();
        return $turno;
    }
}