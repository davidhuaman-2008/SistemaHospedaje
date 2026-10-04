<?php

namespace App\Services;

use App\Models\PaqueteDecoracion;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class PaqueteDecoracionService
{
    public function listar(): Collection
    {
        return PaqueteDecoracion::with(['proveedor', 'tipoHabitacion'])
            ->orderBy('id_paquete')
            ->get();
    }

    public function listarActivos(): Collection
    {
        return PaqueteDecoracion::with(['proveedor', 'tipoHabitacion'])
            ->where('activo', true)
            ->orderBy('id_tipo_habitacion')
            ->orderBy('precio_total')
            ->get();
    }

    public function listarPorTipoHabitacion(int $idTipo): Collection
    {
        return PaqueteDecoracion::with(['proveedor', 'tipoHabitacion'])
            ->where('id_tipo_habitacion', $idTipo)
            ->where('activo', true)
            ->orderBy('precio_total')
            ->get();
    }

    public function obtener(int $id): PaqueteDecoracion
    {
        return PaqueteDecoracion::with(['proveedor', 'tipoHabitacion'])->findOrFail($id);
    }

    public function crear(array $datos): PaqueteDecoracion
    {
        if (empty($datos['slug'])) {
            $datos['slug'] = Str::slug($datos['nombre']);
        }

        $this->validarFormula($datos);

        return PaqueteDecoracion::create($datos)->load(['proveedor', 'tipoHabitacion']);
    }

    public function actualizar(int $id, array $datos): PaqueteDecoracion
    {
        $item = PaqueteDecoracion::findOrFail($id);

        if (isset($datos['nombre']) && empty($datos['slug'])) {
            $datos['slug'] = Str::slug($datos['nombre']);
        }

        $datosCombinados = array_merge($item->toArray(), $datos);
        $this->validarFormula($datosCombinados);

        $item->fill($datos);
        $item->save();

        return $item->fresh()->load(['proveedor', 'tipoHabitacion']);
    }

    public function desactivar(int $id): PaqueteDecoracion
    {
        $item = PaqueteDecoracion::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): PaqueteDecoracion
    {
        $item = PaqueteDecoracion::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        PaqueteDecoracion::findOrFail($id)->delete();
    }

    private function validarFormula(array $datos): void
    {
        $total = (float) ($datos['precio_total'] ?? 0);
        $local = (float) ($datos['ganancia_local'] ?? 0);
        $proveedor = (float) ($datos['ganancia_proveedor'] ?? 0);

        if (abs($total - ($local + $proveedor)) > 0.01) {
            throw new \InvalidArgumentException(
                "Error en la fórmula: precio_total ({$total}) debe ser igual a ganancia_local ({$local}) + ganancia_proveedor ({$proveedor})"
            );
        }
    }
}