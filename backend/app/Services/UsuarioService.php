<?php

namespace App\Services;

use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UsuarioService
{
    public function listar()
    {
        return Usuario::with(['rol', 'turno'])
            ->orderBy('id', 'desc')
            ->get();
    }

    public function listarActivos()
    {
        return Usuario::with(['rol', 'turno'])
            ->where('activo', true)
            ->orderBy('id', 'desc')
            ->get();
    }

    public function obtener(int $id): Usuario
    {
        return Usuario::with(['rol', 'turno'])->findOrFail($id);
    }

    public function crear(array $datos): Usuario
    {
        $datos['password'] = Hash::make($datos['password']);
        $usuario = Usuario::create($datos);
        return $usuario->fresh(['rol', 'turno']);
    }

    public function actualizar(int $id, array $datos): Usuario
    {
        $usuario = Usuario::findOrFail($id);

        if (isset($datos['password']) && $datos['password']) {
            $datos['password'] = Hash::make($datos['password']);
        } else {
            unset($datos['password']);
        }

        $usuario->update($datos);
        return $usuario->fresh(['rol', 'turno']);
    }

    public function eliminar(int $id): void
    {
        Usuario::findOrFail($id)->delete();
    }

    public function desactivar(int $id): Usuario
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->update(['activo' => false]);
        return $usuario->fresh(['rol', 'turno']);
    }

    public function reactivar(int $id): Usuario
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->update(['activo' => true]);
        return $usuario->fresh(['rol', 'turno']);
    }
}