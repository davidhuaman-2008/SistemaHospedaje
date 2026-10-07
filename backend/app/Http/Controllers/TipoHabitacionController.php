<?php

namespace App\Http\Controllers;

use App\Services\TipoHabitacionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TipoHabitacionController extends Controller
{
    // Inyecta el Service que maneja los tipos de habitación.
    public function __construct(
        private TipoHabitacionService $service
    ) {}

    // GET /tipos-habitacion → lista TODOS (activos e inactivos).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /tipos-habitacion/activos → solo los activos.
    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    // GET /tipos-habitacion/{id} → uno por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /tipos-habitacion → crea un tipo nuevo.
    public function store(Request $request): JsonResponse
    {
        // `nombre` y `slug` únicos. `capacidad` y `camas` opcionales.
        $datos = $request->validate([
            'nombre' => 'required|string|max:50|unique:tipos_habitacion,nombre',
            'slug' => 'required|string|max:50|unique:tipos_habitacion,slug',
            'descripcion' => 'nullable|string|max:255',
            'capacidad' => 'nullable|integer|min:1',
            'camas' => 'nullable|integer|min:1',
            'tiene_jacuzzi' => 'boolean',
            'activo' => 'boolean',
        ]);

        $item = $this->service->crear($datos);
        return response()->json([
            'mensaje' => 'Tipo de habitación creado',
            'data' => $item,
        ], 201);
    }

    // PUT /tipos-habitacion/{id} → actualiza. `unique` ignora el propio ID.
    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:tipos_habitacion,nombre,' . $id . ',id_tipo',
            'slug' => 'sometimes|string|max:50|unique:tipos_habitacion,slug,' . $id . ',id_tipo',
            'descripcion' => 'nullable|string|max:255',
            'capacidad' => 'nullable|integer|min:1',
            'camas' => 'nullable|integer|min:1',
            'tiene_jacuzzi' => 'boolean',
            'activo' => 'boolean',
        ]);

        $item = $this->service->actualizar($id, $datos);
        return response()->json([
            'mensaje' => 'Tipo de habitación actualizado',
            'data' => $item,
        ]);
    }

    // PATCH /tipos-habitacion/{id}/desactivar → soft delete.
    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo de habitación desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /tipos-habitacion/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo de habitación reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /tipos-habitacion/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        // El Service puede proteger la eliminación si hay habitaciones o tarifas asociadas.
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Tipo de habitación eliminado']);
    }
}
