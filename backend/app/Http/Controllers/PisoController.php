<?php

namespace App\Http\Controllers;

use App\Services\PisoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PisoController extends Controller
{
    // Inyecta el Service que maneja los pisos del hospedaje.
    public function __construct(
        private PisoService $service
    ) {}

    // GET /pisos → lista TODOS (activos e inactivos).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /pisos/activos → solo los activos.
    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    // GET /pisos/{id} → uno por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /pisos → crea un piso nuevo.
    public function store(Request $request): JsonResponse
    {
        // `nombre` único. `orden` para ordenarlo en el frontend.
        $datos = $request->validate([
            'nombre' => 'required|string|max:50|unique:pisos,nombre',
            'descripcion' => 'nullable|string|max:255',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        $item = $this->service->crear($datos);
        return response()->json([
            'mensaje' => 'Piso creado',
            'data' => $item,
        ], 201);
    }

    // PUT /pisos/{id} → actualiza. `unique` ignora el propio ID.
    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:pisos,nombre,' . $id . ',id_piso',
            'descripcion' => 'nullable|string|max:255',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        $item = $this->service->actualizar($id, $datos);
        return response()->json([
            'mensaje' => 'Piso actualizado',
            'data' => $item,
        ]);
    }

    // PATCH /pisos/{id}/desactivar → soft delete.
    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Piso desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /pisos/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Piso reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /pisos/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Piso eliminado']);
    }
}
