<?php

namespace App\Http\Controllers;

use App\Services\ClienteVisitaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClienteVisitaController extends Controller
{
    public function __construct(private ClienteVisitaService $service) {}

    public function index(int $idCliente): JsonResponse
    {
        return response()->json($this->service->listarPorCliente($idCliente));
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function store(Request $request, int $idCliente): JsonResponse
    {
        $datos = $request->validate([
            'id_reserva' => 'nullable|integer',
            'id_habitacion' => 'nullable|integer',
            'fecha_entrada' => 'required|date',
            'fecha_salida' => 'nullable|date|after_or_equal:fecha_entrada',
            'monto_gastado' => 'nullable|numeric|min:0',
        ]);

        $datos['id_cliente'] = $idCliente;

        return response()->json([
            'mensaje' => 'Visita registrada',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'id_reserva' => 'nullable|integer',
            'id_habitacion' => 'nullable|integer',
            'fecha_entrada' => 'sometimes|date',
            'fecha_salida' => 'nullable|date',
            'monto_gastado' => 'nullable|numeric|min:0',
        ]);

        return response()->json([
            'mensaje' => 'Visita actualizada',
            'data' => $this->service->actualizar($id, $datos),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Visita eliminada']);
    }
}