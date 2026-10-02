<?php

namespace App\Http\Controllers;

use App\Services\GravedadObservacionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GravedadObservacionController extends Controller
{
    public function __construct(private GravedadObservacionService $service) {}

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
            'nombre' => 'required|string|max:30|unique:gravedades_observacion,nombre',
            'slug' => 'required|string|max:30|unique:gravedades_observacion,slug',
            'color' => 'nullable|string|max:20',
            'prioridad' => 'required|integer|min:1',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Gravedad creada',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:30|unique:gravedades_observacion,nombre,' . $id . ',id_gravedad',
            'slug' => 'sometimes|string|max:30|unique:gravedades_observacion,slug,' . $id . ',id_gravedad',
            'color' => 'nullable|string|max:20',
            'prioridad' => 'sometimes|integer|min:1',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Gravedad actualizada',
            'data' => $this->service->actualizar($id, $datos),
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Gravedad desactivada',
            'data' => $this->service->desactivar($id),
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Gravedad reactivada',
            'data' => $this->service->reactivar($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Gravedad eliminada']);
    }
}