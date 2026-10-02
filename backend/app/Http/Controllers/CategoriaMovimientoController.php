<?php

namespace App\Http\Controllers;

use App\Services\CategoriaMovimientoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoriaMovimientoController extends Controller
{
    public function __construct(
        private CategoriaMovimientoService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        if ($request->has('tipo')) {
            return response()->json($this->service->listarPorTipo($request->tipo));
        }
        return response()->json($this->service->listar());
    }

    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:50',
            'tipo' => 'required|in:Ingreso,Egreso',
            'descripcion' => 'nullable|string|max:255',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        $item = $this->service->crear($datos);
        return response()->json([
            'mensaje' => 'Categoría creada',
            'data' => $item,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50',
            'tipo' => 'sometimes|in:Ingreso,Egreso',
            'descripcion' => 'nullable|string|max:255',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        $item = $this->service->actualizar($id, $datos);
        return response()->json([
            'mensaje' => 'Categoría actualizada',
            'data' => $item,
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Categoría desactivada',
            'data' => $this->service->desactivar($id),
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Categoría reactivada',
            'data' => $this->service->reactivar($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Categoría eliminada']);
    }
}