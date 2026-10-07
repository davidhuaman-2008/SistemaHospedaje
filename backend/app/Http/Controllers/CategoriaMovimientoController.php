<?php

namespace App\Http\Controllers;

use App\Services\CategoriaMovimientoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoriaMovimientoController extends Controller
{
    // Laravel inyecta el Service automáticamente.
    public function __construct(
        private CategoriaMovimientoService $service
    ) {}

    // GET /categorias-movimiento  (y opcional ?tipo=Ingreso|Egreso)
    public function index(Request $request): JsonResponse
    {
        // Si viene ?tipo=..., filtra por ese tipo. Si no, lista todo.
        if ($request->has('tipo')) {
            return response()->json($this->service->listarPorTipo($request->tipo));
        }
        return response()->json($this->service->listar());
    }

    // GET /categorias-movimiento/activos
    public function activos(): JsonResponse
    {
        // Solo las que tienen activo = true.
        return response()->json($this->service->listarActivos());
    }

    // GET /categorias-movimiento/{id}
    public function show(int $id): JsonResponse
    {
        // Devuelve una sola categoría.
        return response()->json($this->service->obtener($id));
    }

    // POST /categorias-movimiento
    public function store(Request $request): JsonResponse
    {
        // Valida los campos obligatorios (nombre y tipo).
        $datos = $request->validate([
            'nombre' => 'required|string|max:50',
            'tipo' => 'required|in:Ingreso,Egreso',
            'descripcion' => 'nullable|string|max:255',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        // Crea vía Service y responde 201 (Created).
        $item = $this->service->crear($datos);
        return response()->json([
            'mensaje' => 'Categoría creada',
            'data' => $item,
        ], 201);
    }

    // PUT /categorias-movimiento/{id}
    public function update(Request $request, int $id): JsonResponse
    {
        // 'sometimes' = solo valida los campos que vengan en el body.
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50',
            'tipo' => 'sometimes|in:Ingreso,Egreso',
            'descripcion' => 'nullable|string|max:255',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        // Actualiza y devuelve el item modificado.
        $item = $this->service->actualizar($id, $datos);
        return response()->json([
            'mensaje' => 'Categoría actualizada',
            'data' => $item,
        ]);
    }

    // PATCH /categorias-movimiento/{id}/desactivar
    public function desactivar(int $id): JsonResponse
    {
        // Soft delete: activo = false.
        return response()->json([
            'mensaje' => 'Categoría desactivada',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /categorias-movimiento/{id}/reactivar
    public function reactivar(int $id): JsonResponse
    {
        // Vuelve a poner activo = true.
        return response()->json([
            'mensaje' => 'Categoría reactivada',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /categorias-movimiento/{id}
    public function destroy(int $id): JsonResponse
    {
        // Elimina físicamente y devuelve solo el mensaje.
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Categoría eliminada']);
    }
}
