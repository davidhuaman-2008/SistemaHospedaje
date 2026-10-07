<?php

namespace App\Http\Controllers;

use App\Services\HabitacionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HabitacionController extends Controller
{
    // Inyecta el Service que maneja las habitaciones.
    public function __construct(private HabitacionService $service) {}

    // GET /habitaciones → lista TODAS (activas e inactivas).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /habitaciones/activas → solo las activas.
    public function activas(): JsonResponse
    {
        return response()->json($this->service->listarActivas());
    }

    // GET /habitaciones/por-piso/{idPiso} → filtradas por piso.
    public function porPiso(int $idPiso): JsonResponse
    {
        return response()->json($this->service->listarPorPiso($idPiso));
    }

    // GET /habitaciones/por-tipo/{idTipo} → filtradas por tipo.
    public function porTipo(int $idTipo): JsonResponse
    {
        return response()->json($this->service->listarPorTipo($idTipo));
    }

    // GET /habitaciones/{id} → una por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /habitaciones → crea una habitación nueva.
    public function store(Request $request): JsonResponse
    {
        // Valida que el piso y el tipo existan. `numero` es único.
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

    // PUT /habitaciones/{id} → actualiza. `unique` ignora el propio ID.
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

    // PATCH /habitaciones/{id}/desactivar → soft delete.
    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Habitación desactivada',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /habitaciones/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Habitación reactivada',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /habitaciones/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Habitación eliminada']);
    }
}
