<?php

namespace App\Services;

use App\Models\EstadoCuentaPagar;
use Illuminate\Support\Collection;

class EstadoCuentaPagarService
{
    public function listar(): Collection
    {
        return EstadoCuentaPagar::orderBy('orden')->get();
    }

    public function listarActivos(): Collection
    {
        return EstadoCuentaPagar::where('activo', true)->orderBy('orden')->get();
    }

    public function obtener(int $id): EstadoCuentaPagar
    {
        return EstadoCuentaPagar::findOrFail($id);
    }

    public function crear(array $datos): EstadoCuentaPagar
    {
        return EstadoCuentaPagar::create($datos);
    }

    public function actualizar(int $id, array $datos): EstadoCuentaPagar
    {
        $item = EstadoCuentaPagar::findOrFail($id);
        $item->update($datos);
        return $item->fresh();
    }

    public function desactivar(int $id): EstadoCuentaPagar
    {
        $item = EstadoCuentaPagar::findOrFail($id);

        // Validar que no tenga cuentas activas asociadas
        $tieneCuentas = $item->cuentas()->exists();
        if ($tieneCuentas) {
            throw new \InvalidArgumentException(
                'No se puede desactivar un estado con cuentas asociadas.'
            );
        }

        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): EstadoCuentaPagar
    {
        $item = EstadoCuentaPagar::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        $item = EstadoCuentaPagar::findOrFail($id);

        if ($item->cuentas()->exists()) {
            throw new \InvalidArgumentException(
                'No se puede eliminar un estado con cuentas asociadas.'
            );
        }

        $item->delete();
    }
}