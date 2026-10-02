<?php

namespace App\Http\Controllers;

use App\Services\ClienteNivelService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClienteNivelController extends Controller
{
    public function __construct(
        private ClienteNivelService $service
    ) {}

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
            'nombre' => 'required|string|max:50|unique:clientes_niveles,nombre',
            'visitas_min' => 'required|integer|min:0',
            'visitas_max' => 'nullable|integer|min:0',
            'descuento' => 'required|numeric|min:0|max:100',
            'color' => 'nullable|string|max:20',
            'icono' => 'nullable|string|max:50',
            'beneficios' => 'nullable|string',
            'activo' => 'boolean',
        ]);

        $item = $this->service->crear($datos);
        return response()->json([
            'mensaje' => 'Nivel de cliente creado',
            'data' => $item,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:clientes_niveles,nombre,' . $id . ',id_nivel',
            'visitas_min' => 'sometimes|integer|min:0',
            'visitas_max' => 'nullable|integer|min:0',
            'descuento' => 'sometimes|numeric|min:0|max:100',
            'color' => 'nullable|string|max:20',
            'icono' => 'nullable|string|max:50',
            'beneficios' => 'nullable|string',
            'activo' => 'boolean',
        ]);

        $item = $this->service->actualizar($id, $datos);
        return response()->json([
            'mensaje' => 'Nivel de cliente actualizado',
            'data' => $item,
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Nivel de cliente desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Nivel de cliente reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Nivel de cliente eliminado']);
    }
}