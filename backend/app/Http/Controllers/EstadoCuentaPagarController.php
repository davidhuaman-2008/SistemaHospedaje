<?php

namespace App\Http\Controllers;

use App\Services\EstadoCuentaPagarService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EstadoCuentaPagarController extends Controller
{
    public function __construct(private EstadoCuentaPagarService $service) {}

    public function index(): JsonResponse
    {
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
            'nombre' => 'required|string|max:50|unique:estados_cuenta_pagar,nombre',
            'slug' => 'required|string|max:50|unique:estados_cuenta_pagar,slug',
            'descripcion' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:20',
            'icono' => 'nullable|string|max:50',
            'es_estado_final' => 'boolean',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Estado creado',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:estados_cuenta_pagar,nombre,' . $id . ',id_estado_cuenta',
            'slug' => 'sometimes|string|max:50|unique:estados_cuenta_pagar,slug,' . $id . ',id_estado_cuenta',
            'descripcion' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:20',
            'icono' => 'nullable|string|max:50',
            'es_estado_final' => 'boolean',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Estado actualizado',
            'data' => $this->service->actualizar($id, $datos),
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        try {
            return response()->json([
                'mensaje' => 'Estado desactivado',
                'data' => $this->service->desactivar($id),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Estado reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->service->eliminar($id);
            return response()->json(['mensaje' => 'Estado eliminado']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }
}