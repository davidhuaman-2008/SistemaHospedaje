<?php

namespace App\Services;

use App\Models\TipoDocumento;
use Illuminate\Support\Collection;

class TipoDocumentoService
{
    public function listar(): Collection
    {
        return TipoDocumento::orderBy('nombre')->get();
    }

    public function listarActivos(): Collection
    {
        return TipoDocumento::where('activo', true)->orderBy('nombre')->get();
    }

    public function obtener(int $id): TipoDocumento
    {
        return TipoDocumento::findOrFail($id);
    }

    public function crear(array $datos): TipoDocumento
    {
        return TipoDocumento::create($datos);
    }

    public function actualizar(int $id, array $datos): TipoDocumento
    {
        $item = TipoDocumento::findOrFail($id);
        $item->update($datos);
        return $item->fresh();
    }

    public function desactivar(int $id): TipoDocumento
    {
        $item = TipoDocumento::findOrFail($id);
        $item->update(['activo' => false]);
        return $item;
    }

    public function reactivar(int $id): TipoDocumento
    {
        $item = TipoDocumento::findOrFail($id);
        $item->update(['activo' => true]);
        return $item;
    }

    public function eliminar(int $id): void
    {
        TipoDocumento::findOrFail($id)->delete();
    }
}