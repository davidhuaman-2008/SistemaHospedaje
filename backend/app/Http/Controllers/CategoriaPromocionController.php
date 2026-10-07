<?php

namespace App\Http\Controllers;

use App\Services\CategoriaPromocionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoriaPromocionController extends Controller
{
    // Laravel inyecta el Service automáticamente.
    public function __construct(private CategoriaPromocionService $service) {}

    // GET /categorias-promocion
    public function index(): JsonResponse
    {
        // Lista TODAS las categorías (activas e inactivas).
        return response()->json($this->service->listar());
    }

    // GET /categorias-promocion/activos
    public function activos(): JsonResponse
    {
        // Solo las que tienen activo = true.
        return response()->json($this->service->listarActivos());
    }

    // GET /categorias-promocion/{id}
    public function show(int $id): JsonResponse
    {
        // Devuelve una sola categoría.
        return response()->json($this->service->obtener($id));
    }

    // POST /categorias-promocion
    public function store(Request $request): JsonResponse
    {
        // Valida. `nombre` y `slug` deben ser únicos en la tabla.
        $datos = $request->validate([
            'nombre' => 'required|string|max:50|unique:categorias_promocion,nombre',
            'slug' => 'required|string|max:50|unique:categorias_promocion,slug',
            'descripcion' => 'nullable|string|max:255',
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        // Crea y responde 201 (Created).
        return response()->json([
            'mensaje' => 'Categoría creada',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    // PUT /categorias-promocion/{id}
    public function update(Request $request, int $id): JsonResponse
    {
        // Igual que store, pero ignora el propio ID en la validación `unique`.
        // El último parámetro (`id_categoria_promocion`) es la columna PK.
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:categorias_promocion,nombre,' . $id . ',id_categoria_promocion',
            'slug' => 'sometimes|string|max:50|unique:categorias_promocion,slug,' . $id . ',id_categoria_promocion',
            'descripcion' => 'nullable|string|max:255',
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Categoría actualizada',
            'data' => $this->service->actualizar($id, $datos),
        ]);
    }

    // PATCH /categorias-promocion/{id}/desactivar
    public function desactivar(int $id): JsonResponse
    {
        // Soft delete: activo = false.
        return response()->json([
            'mensaje' => 'Categoría desactivada',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /categorias-promocion/{id}/reactivar
    public function reactivar(int $id): JsonResponse
    {
        // Vuelve a activo = true.
        return response()->json([
            'mensaje' => 'Categoría reactivada',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /categorias-promocion/{id}
    public function destroy(int $id): JsonResponse
    {
        // Elimina físicamente y devuelve solo el mensaje.
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Categoría eliminada']);
    }
}
