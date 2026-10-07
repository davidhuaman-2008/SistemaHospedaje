<?php

namespace App\Http\Controllers;

use App\Services\TurnoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TurnoController extends Controller
{
    public function __construct(private TurnoService $service) {}

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
            'nombre' => 'required|string|max:50|unique:turnos,nombre',
            'hora_inicio' => 'required',
            'hora_fin' => 'required',
            'descripcion' => 'nullable|string|max:255',
            'activo' => 'boolean',
        ]);

        try {
            return response()->json([
                'mensaje' => 'Turno creado',
                'data' => $this->service->crear($datos),
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:turnos,nombre,' . $id,
            'hora_inicio' => 'sometimes',
            'hora_fin' => 'sometimes',
            'descripcion' => 'nullable|string|max:255',
            'activo' => 'sometimes|boolean',
        ]);

        try {
            return response()->json([
                'mensaje' => 'Turno actualizado',
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
                'mensaje' => 'Turno desactivado',
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
                'mensaje' => 'Turno reactivado',
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
            return response()->json(['mensaje' => 'Turno eliminado']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }
}