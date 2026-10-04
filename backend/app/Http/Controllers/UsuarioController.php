<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Services\UsuarioService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UsuarioController extends Controller
{
    public function __construct(private UsuarioService $usuarioService) {}

    public function index()
    {
        return response()->json($this->usuarioService->listar());
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'nombre_usuario' => 'required|string|max:50|unique:usuarios,nombre_usuario',
            'password' => 'required|string|min:6',
            'id_rol' => 'required|exists:roles,id',
            'id_turno' => 'nullable|exists:turnos,id',
            'activo' => 'boolean',
        ]);

        $usuario = $this->usuarioService->crear($datos);

        return response()->json([
            'mensaje' => 'Usuario creado',
            'usuario' => $usuario->load(['rol', 'turno']),
        ], 201);
    }

    public function show(Usuario $usuario)
    {
        return response()->json($usuario->load(['rol', 'turno']));
    }

    public function update(Request $request, Usuario $usuario)
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'apellido' => 'sometimes|string|max:100',
            'nombre_usuario' => 'sometimes|string|max:50|unique:usuarios,nombre_usuario,' . $usuario->id,
            'password' => 'sometimes|string|min:6',
            'id_rol' => 'sometimes|exists:roles,id',
            'id_turno' => 'nullable|exists:turnos,id',
            'activo' => 'sometimes|boolean',
        ]);

        $usuario = $this->usuarioService->actualizar($usuario, $datos);

        return response()->json([
            'mensaje' => 'Usuario actualizado',
            'usuario' => $usuario,
        ]);
    }

    public function destroy(Usuario $usuario)
    {
        $this->usuarioService->eliminar($usuario);

        return response()->json([
            'mensaje' => 'Usuario eliminado',
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        $usuario = $this->usuarioService->desactivar($id);
        return response()->json([
            'mensaje' => 'Usuario desactivado',
            'data' => $usuario,
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        $usuario = $this->usuarioService->reactivar($id);
        return response()->json([
            'mensaje' => 'Usuario reactivado',
            'data' => $usuario,
        ]);
    }
}