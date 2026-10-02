<?php

namespace App\Services;

use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function login(string $nombreUsuario, string $password): array
    {
        $usuario = Usuario::with(['rol', 'turno'])
            ->where('nombre_usuario', $nombreUsuario)
            ->first();

        if (! $usuario || ! Hash::check($password, $usuario->password)) {
            throw ValidationException::withMessages([
                'nombre_usuario' => ['Credenciales incorrectas.'],
            ]);
        }

        if (! $usuario->activo) {
            throw ValidationException::withMessages([
                'nombre_usuario' => ['Usuario desactivado. Contacte al administrador.'],
            ]);
        }

        $usuario->update(['ultimo_login' => now()]);

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return [
            'usuario' => $usuario,
            'token' => $token,
        ];
    }

    public function logout(Usuario $usuario): void
    {
        $usuario->currentAccessToken()?->delete();
    }
}