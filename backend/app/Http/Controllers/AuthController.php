<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function login(Request $request)
    {
        $datos = $request->validate([
            'nombre_usuario' => 'required|string',
            'password' => 'required|string',
        ]);

        $resultado = $this->authService->login(
            $datos['nombre_usuario'],
            $datos['password']
        );

        return response()->json([
            'mensaje' => 'Login exitoso',
            'usuario' => $resultado['usuario'],
            'token' => $resultado['token'],
        ]);
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return response()->json([
            'mensaje' => 'Sesión cerrada correctamente',
        ]);
    }

    public function yo(Request $request)
    {
        return response()->json(
            $request->user()->load(['rol', 'turno'])
        );
    }
}