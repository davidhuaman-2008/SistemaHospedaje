<?php

namespace App\Http\Controllers;

use App\Services\HabitacionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HabitacionController extends Controller
{
    public function __construct(private HabitacionService $service) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    public function activas(): JsonResponse
    {
        return response()->json($this->service->listarActivas());
    }

    public function porPiso(int $idPiso): JsonResponse
    {
        return response()->json($this->service->listarPorPiso($idPiso));
    }

    public function porTipo(int $idTipo): JsonResponse
    {
        return response()->json($this->service->listarPorTipo($idTipo));
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'id_piso' => 'required|exists:pisos,id_piso',
            'id_tipo' => 'required|exists:tipos_habitacion,id_tipo',
            'numero' => 'required|string|max:10|unique:habitaciones,numero',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Habitación creada',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'id_piso' => 'sometimes|exists:pisos,id_piso',
            'id_tipo' => 'sometimes|exists:tipos_habitacion,id_tipo',
            'numero' => 'sometimes|string|max:10|unique:habitaciones,numero,' . $id . ',id_habitacion',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Habitación actualizada',
            'data' => $this->service->actualizar($id, $datos),
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Habitación desactivada',
            'data' => $this->service->desactivar($id),
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Habitación reactivada',
            'data' => $this->service->reactivar($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Habitación eliminada']);
    }
}