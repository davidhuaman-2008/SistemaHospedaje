<?php

namespace App\Http\Controllers;

use App\Services\UsuarioService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UsuarioController extends Controller
{
    public function __construct(private UsuarioService $service) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function store(Request $request): JsonResponse
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

        try {
            return response()->json([
                'mensaje' => 'Usuario creado',
                'data' => $this->service->crear($datos),
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'apellido' => 'sometimes|string|max:100',
            'nombre_usuario' => 'sometimes|string|max:50|unique:usuarios,nombre_usuario,' . $id,
            'password' => 'sometimes|string|min:6',
            'id_rol' => 'sometimes|exists:roles,id',
            'id_turno' => 'nullable|exists:turnos,id',
            'activo' => 'sometimes|boolean',
        ]);

        try {
            return response()->json([
                'mensaje' => 'Usuario actualizado',
                'data' => $this->service->actualizar($id, $datos),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function desactivar(int $id): JsonResponse
    {
        try {
            return response()->json([
                'mensaje' => 'Usuario desactivado',
                'data' => $this->service->desactivar($id),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function reactivar(int $id): JsonResponse
    {
        try {
            return response()->json([
                'mensaje' => 'Usuario reactivado',
                'data' => $this->service->reactivar($id),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->service->eliminar($id);
            return response()->json(['mensaje' => 'Usuario eliminado']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }
}