<?php

namespace App\Http\Controllers;

use App\Services\GravedadObservacionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GravedadObservacionController extends Controller
{
    // Inyecta el Service que maneja las gravedades de observaciones.
    public function __construct(private GravedadObservacionService $service) {}

    // GET /gravedades-observacion → lista TODAS (activas e inactivas).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /gravedades-observacion/activos → solo las activas.
    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    // GET /gravedades-observacion/{id} → una por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /gravedades-observacion → crea una gravedad nueva.
    public function store(Request $request): JsonResponse
    {
        // `nombre` y `slug` únicos. `prioridad` es un entero ≥ 1.
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

    // PUT /gravedades-observacion/{id} → actualiza. `unique` ignora el propio ID.
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

    // PATCH /gravedades-observacion/{id}/desactivar → soft delete.
    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Gravedad desactivada',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /gravedades-observacion/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Gravedad reactivada',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /gravedades-observacion/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Gravedad eliminada']);
    }
}
