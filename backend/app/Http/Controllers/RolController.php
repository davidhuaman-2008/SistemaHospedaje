<?php

namespace App\Http\Controllers;

use App\Services\RolService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RolController extends Controller
{
    public function __construct(
        private RolService $rolService
    ) {}

    public function index(): JsonResponse
    {
        return response()->json(
            $this->rolService->listar()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:50|unique:roles,nombre',
            'descripcion' => 'nullable|string|max:255',
            'activo' => 'boolean',
        ]);

        $rol = $this->rolService->crear($datos);

        return response()->json([
            'mensaje' => 'Rol creado',
            'data' => $rol,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->rolService->obtener($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:roles,nombre,' . $id,
            'descripcion' => 'nullable|string|max:255',
            'activo' => 'sometimes|boolean',
        ]);

        $rol = $this->rolService->actualizar($id, $datos);

        return response()->json([
            'mensaje' => 'Rol actualizado',
            'data' => $rol,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->rolService->eliminar($id);

        return response()->json([
            'mensaje' => 'Rol eliminado',
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        $rol = $this->rolService->desactivar($id);
        return response()->json([
            'mensaje' => 'Rol desactivado',
            'data' => $rol,
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        $rol = $this->rolService->reactivar($id);
        return response()->json([
            'mensaje' => 'Rol reactivado',
            'data' => $rol,
        ]);
    }
}