<?php

namespace App\Http\Controllers;

use App\Services\PromocionClienteService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PromocionClienteController extends Controller
{
    public function __construct(private PromocionClienteService $service) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    public function porCliente(int $idCliente): JsonResponse
    {
        return response()->json($this->service->listarPorCliente($idCliente));
    }

    public function porPromocion(int $idPromocion): JsonResponse
    {
        return response()->json($this->service->listarPorPromocion($idPromocion));
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'id_promocion' => 'required|exists:promociones,id_promocion',
            'id_cliente' => 'required|exists:clientes,id_cliente',
            'codigo_personalizado' => 'nullable|string|max:50',
            'fecha_vencimiento' => 'nullable|date',
        ]);

        return response()->json([
            'mensaje' => 'Promoción asignada al cliente',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    public function marcarUsado(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Promoción marcada como usada',
            'data' => $this->service->marcarUsado($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Asignación eliminada']);
    }
}