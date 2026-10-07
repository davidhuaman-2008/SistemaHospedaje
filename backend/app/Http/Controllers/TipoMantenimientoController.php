<?php

namespace App\Http\Controllers;

use App\Services\TipoMantenimientoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TipoMantenimientoController extends Controller
{
    // Inyecta el Service que maneja los tipos de mantenimiento.
    public function __construct(private TipoMantenimientoService $service) {}

    // GET /tipos-mantenimiento → lista TODOS (activos e inactivos).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /tipos-mantenimiento/activos → solo los activos.
    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    // GET /tipos-mantenimiento/{id} → uno por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /tipos-mantenimiento → crea un tipo nuevo.
    public function store(Request $request): JsonResponse
    {
        // `nombre` y `slug` únicos. `icono` y `color` opcionales.
        $datos = $request->validate([
            'nombre' => 'required|string|max:60|unique:tipos_mantenimiento,nombre',
            'slug' => 'required|string|max:60|unique:tipos_mantenimiento,slug',
            'descripcion' => 'nullable|string|max:255',
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Tipo de mantenimiento creado',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    // PUT /tipos-mantenimiento/{id} → actualiza. `unique` ignora el propio ID.
    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:60|unique:tipos_mantenimiento,nombre,' . $id . ',id_tipo_mantenimiento',
            'slug' => 'sometimes|string|max:60|unique:tipos_mantenimiento,slug,' . $id . ',id_tipo_mantenimiento',
            'descripcion' => 'nullable|string|max:255',
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Tipo actualizado',
            'data' => $this->service->actualizar($id, $datos),
        ]);
    }

    // PATCH /tipos-mantenimiento/{id}/desactivar → soft delete.
    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /tipos-mantenimiento/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /tipos-mantenimiento/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        // El Service puede proteger la eliminación si hay reportes asociados.
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Tipo eliminado']);
    }
}
