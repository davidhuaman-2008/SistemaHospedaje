<?php

namespace App\Http\Controllers;

use App\Services\RolService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RolController extends Controller
{
    public function __construct(private RolService $service) {}

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
            'nombre' => 'required|string|max:50|unique:roles,nombre',
            'descripcion' => 'nullable|string|max:255',
            'activo' => 'boolean',
        ]);

        try {
            return response()->json([
                'mensaje' => 'Rol creado',
                'data' => $this->service->crear($datos),
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:roles,nombre,' . $id,
            'descripcion' => 'nullable|string|max:255',
            'activo' => 'sometimes|boolean',
        ]);

        try {
            return response()->json([
                'mensaje' => 'Rol actualizado',
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
                'mensaje' => 'Rol desactivado',
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
                'mensaje' => 'Rol reactivado',
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
            return response()->json(['mensaje' => 'Rol eliminado']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }
}