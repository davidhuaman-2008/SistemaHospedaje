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
        $turno->update($datos);

        return $turno->fresh();
    }

    public function eliminar(Turno $turno): void
    {
        $turno->delete();
    }
}
