<?php

namespace App\Http\Controllers;

use App\Services\PromocionClienteService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PromocionClienteController extends Controller
{
    // Inyecta el Service que maneja las promociones asignadas a clientes.
    public function __construct(private PromocionClienteService $service) {}

    // GET /promociones-cliente → lista TODAS las asignaciones del sistema.
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /clientes/{idCliente}/promociones → solo las de un cliente.
    public function porCliente(int $idCliente): JsonResponse
    {
        return response()->json($this->service->listarPorCliente($idCliente));
    }

    // GET /promociones/{idPromocion}/clientes → solo las de una promoción.
    public function porPromocion(int $idPromocion): JsonResponse
    {
        return response()->json($this->service->listarPorPromocion($idPromocion));
    }

    // GET /promociones-cliente/{id} → una asignación por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /promociones-cliente → asigna una promoción a un cliente.
    public function store(Request $request): JsonResponse
    {
        // Valida que la promoción y el cliente existan en sus tablas.
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

    // PATCH /promociones-cliente/{id}/usar → marca la promo como usada.
    public function marcarUsado(int $id): JsonResponse
    {
        // El Service setea `usado = true` y guarda `fecha_uso = now()`.
        return response()->json([
            'mensaje' => 'Promoción marcada como usada',
            'data' => $this->service->marcarUsado($id),
        ]);
    }

    // DELETE /promociones-cliente/{id} → elimina la asignación.
    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Asignación eliminada']);
    }
}
