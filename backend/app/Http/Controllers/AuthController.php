<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    // Laravel inyecta el servicio automáticamente (dependency injection).
    public function __construct(private AuthService $authService) {}

    // POST /api/login
    public function login(Request $request)
    {
        // Valida que vengan los dos campos. Si falta algo → 422 automático.
        $datos = $request->validate([
            'nombre_usuario' => 'required|string',
            'password' => 'required|string',
        ]);

        // Toda la lógica real (buscar usuario, verificar password, generar token)
        // vive en AuthService. Aquí solo se delega.
        $resultado = $this->authService->login(
            $datos['nombre_usuario'],
            $datos['password']
        );

        // Devuelve el usuario y el token Bearer que usará el frontend.
        return response()->json([
            'mensaje' => 'Login exitoso',
            'usuario' => $resultado['usuario'],
            'token' => $resultado['token'],
        ]);
    }

    // POST /api/logout (protegida con auth:sanctum)
    public function logout(Request $request)
    {
        // Revoca SOLO el token actual del usuario autenticado.
        $this->authService->logout($request->user());

        return response()->json([
            'mensaje' => 'Sesión cerrada correctamente',
        ]);
    }

    // GET /api/yo (protegida con auth:sanctum)
    public function yo(Request $request)
    {
        // Devuelve el usuario autenticado con sus relaciones rol y turno
        // ya cargadas (eager loading) para el frontend.
        return response()->json(
            $request->user()->load(['rol', 'turno'])
        );
    }
}
