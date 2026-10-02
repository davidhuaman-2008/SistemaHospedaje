<?php

namespace App\Http\Controllers;

use App\Services\TarifaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TarifaController extends Controller
{
    public function __construct(
        private TarifaService $service
    ) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    public function porTipo(int $idTipo): JsonResponse
    {
        return response()->json($this->service->listarPorTipo($idTipo));
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'id_tipo' => 'required|exists:tipos_habitacion,id_tipo',
            'horas' => 'required|integer|min:1',
            'monto' => 'required|numeric|min:0',
            'precio_hora_extra' => 'required|numeric|min:0',
            'max_horas_extra' => 'nullable|integer|min:1',
            'precio_turno_adicional' => 'required|numeric|min:0',
            'activo' => 'boolean',
        ]);

        $item = $this->service->crear($datos);
        return response()->json([
            'mensaje' => 'Tarifa creada',
            'data' => $item,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'id_tipo' => 'sometimes|exists:tipos_habitacion,id_tipo',
            'horas' => 'sometimes|integer|min:1',
            'monto' => 'sometimes|numeric|min:0',
            'precio_hora_extra' => 'sometimes|numeric|min:0',
            'max_horas_extra' => 'nullable|integer|min:1',
            'precio_turno_adicional' => 'sometimes|numeric|min:0',
            'activo' => 'boolean',
        ]);

        $item = $this->service->actualizar($id, $datos);
        return response()->json([
            'mensaje' => 'Tarifa actualizada',
            'data' => $item,
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tarifa desactivada',
            'data' => $this->service->desactivar($id),
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tarifa reactivada',
            'data' => $this->service->reactivar($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Tarifa eliminada']);
    }
}