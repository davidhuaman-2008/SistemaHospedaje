<?php

namespace App\Http\Controllers;

use App\Services\PrioridadMantenimientoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PrioridadMantenimientoController extends Controller
{
    // Inyecta el Service que maneja las prioridades de mantenimiento.
    public function __construct(private PrioridadMantenimientoService $service) {}

    // GET /prioridades-mantenimiento → lista TODAS (activas e inactivas).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /prioridades-mantenimiento/activos → solo las activas.
    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    // GET /prioridades-mantenimiento/{id} → una por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /prioridades-mantenimiento → crea una prioridad nueva.
    public function store(Request $request): JsonResponse
    {
        // `nombre` y `slug` únicos. `color` y `orden` opcionales.
        $datos = $request->validate([
            'nombre' => 'required|string|max:30|unique:prioridades_mantenimiento,nombre',
            'slug' => 'required|string|max:30|unique:prioridades_mantenimiento,slug',
            'color' => 'nullable|string|max:20',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Prioridad creada',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    // PUT /prioridades-mantenimiento/{id} → actualiza. `unique` ignora el propio ID.
    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:30|unique:prioridades_mantenimiento,nombre,' . $id . ',id_prioridad',
            'slug' => 'sometimes|string|max:30|unique:prioridades_mantenimiento,slug,' . $id . ',id_prioridad',
            'color' => 'nullable|string|max:20',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Prioridad actualizada',
            'data' => $this->service->actualizar($id, $datos),
        ]);
    }

    // PATCH /prioridades-mantenimiento/{id}/desactivar → soft delete.
    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Prioridad desactivada',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /prioridades-mantenimiento/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Prioridad reactivada',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /prioridades-mantenimiento/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Prioridad eliminada']);
    }
}
