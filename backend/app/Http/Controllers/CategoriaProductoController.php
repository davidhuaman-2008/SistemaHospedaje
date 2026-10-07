<?php

namespace App\Http\Controllers;

use App\Services\CategoriaProductoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoriaProductoController extends Controller
{
    // Laravel inyecta el Service automáticamente.
    public function __construct(private CategoriaProductoService $service) {}

    // GET /categorias-producto
    public function index(): JsonResponse
    {
        // Lista TODAS las categorías (activas e inactivas).
        return response()->json($this->service->listar());
    }

    // GET /categorias-producto/activos
    public function activos(): JsonResponse
    {
        // Solo las categorías con activo = true.
        return response()->json($this->service->listarActivos());
    }

    // GET /categorias-producto/{id}
    public function show(int $id): JsonResponse
    {
        // Devuelve una sola categoría.
        return response()->json($this->service->obtener($id));
    }

    // POST /categorias-producto
    public function store(Request $request): JsonResponse
    {
        // Valida los campos. `nombre` y `slug` deben ser únicos en la tabla.
        $datos = $request->validate([
            'nombre' => 'required|string|max:50|unique:categorias_producto,nombre',
            'slug' => 'required|string|max:50|unique:categorias_producto,slug',
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

    // PUT /categorias-producto/{id}
    public function update(Request $request, int $id): JsonResponse
    {
        // Igual que store, pero ignora el propio ID en la validación `unique`.
        // El último parámetro (`id_categoria_producto`) es la columna PK.
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:categorias_producto,nombre,' . $id . ',id_categoria_producto',
            'slug' => 'sometimes|string|max:50|unique:categorias_producto,slug,' . $id . ',id_categoria_producto',
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

    // PATCH /categorias-producto/{id}/desactivar
    public function desactivar(int $id): JsonResponse
    {
        // Soft delete: activo = false.
        return response()->json([
            'mensaje' => 'Categoría desactivada',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /categorias-producto/{id}/reactivar
    public function reactivar(int $id): JsonResponse
    {
        // Vuelve a activo = true.
        return response()->json([
            'mensaje' => 'Categoría reactivada',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /categorias-producto/{id}
    public function destroy(int $id): JsonResponse
    {
        // Elimina físicamente y devuelve solo el mensaje.
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Categoría eliminada']);
    }
}
