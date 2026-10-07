<?php

namespace App\Http\Controllers;

use App\Services\TipoObservacionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TipoObservacionController extends Controller
{
    // Inyecta el Service que maneja los tipos de observación.
    public function __construct(private TipoObservacionService $service) {}

    // GET /tipos-observacion → lista TODOS (activos e inactivos).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /tipos-observacion/activos → solo los activos.
    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    // GET /tipos-observacion/{id} → uno por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /tipos-observacion → crea un tipo nuevo.
    public function store(Request $request): JsonResponse
    {
        // `nombre` y `slug` únicos. `icono` y `color` opcionales.
        $datos = $request->validate([
            'nombre' => 'required|string|max:50|unique:tipos_observacion,nombre',
            'slug' => 'required|string|max:50|unique:tipos_observacion,slug',
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'descripcion' => 'nullable|string|max:255',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Tipo de observación creado',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    // PUT /tipos-observacion/{id} → actualiza. `unique` ignora el propio ID.
    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:tipos_observacion,nombre,' . $id . ',id_tipo_observacion',
            'slug' => 'sometimes|string|max:50|unique:tipos_observacion,slug,' . $id . ',id_tipo_observacion',
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'descripcion' => 'nullable|string|max:255',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Tipo de observación actualizado',
            'data' => $this->service->actualizar($id, $datos),
        ]);
    }

    // PATCH /tipos-observacion/{id}/desactivar → soft delete.
    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo de observación desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /tipos-observacion/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo de observación reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /tipos-observacion/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        // El Service puede proteger la eliminación si hay observaciones asociadas.
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Tipo de observación eliminado']);
    }
}
