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

    public function crear(array $datos): Usuario
    {
        $datos['password'] = Hash::make($datos['password']);
        return Usuario::create($datos);
    }

    public function actualizar(Usuario $usuario, array $datos): Usuario
    {
        if (isset($datos['password']) && $datos['password']) {
            $datos['password'] = Hash::make($datos['password']);
        } else {
            unset($datos['password']);
        }

        $usuario->update($datos);
        return $usuario->fresh(['rol', 'turno']);
    }

    public function eliminar(Usuario $usuario): void
    {
        $usuario->delete();
    }

    public function desactivar(int $id): Usuario
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->update(['activo' => false]);
        return $usuario->fresh();
    }

    public function reactivar(int $id): Usuario
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->update(['activo' => true]);
        return $usuario->fresh();
    }
}