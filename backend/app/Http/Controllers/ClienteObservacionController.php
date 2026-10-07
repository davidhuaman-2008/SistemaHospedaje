<?php

namespace App\Http\Controllers;

use App\Services\ClienteObservacionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClienteObservacionController extends Controller
{
    // Inyecta el Service que maneja las observaciones/alertas de clientes.
    public function __construct(private ClienteObservacionService $service) {}

    // GET /cliente-observaciones → lista TODAS las observaciones del sistema.
    public function index(): JsonResponse
    {
        return response()->json($this->service->listarTodas());
    }

    // GET /clientes/{id}/observaciones → solo las de un cliente.
    public function porCliente(int $idCliente): JsonResponse
    {
        return response()->json($this->service->listarPorCliente($idCliente));
    }

    // GET /cliente-observaciones/{id} → una observación por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /clientes/{id}/observaciones → crea una observación al cliente.
    public function store(Request $request, int $idCliente): JsonResponse
    {
        // Valida que el tipo y la gravedad existan en sus tablas.
        $datos = $request->validate([
            'id_tipo_observacion' => 'required|exists:tipos_observacion,id_tipo_observacion',
            'id_gravedad' => 'required|exists:gravedades_observacion,id_gravedad',
            'motivo' => 'required|string|max:255',
            'monto_deuda' => 'nullable|numeric|min:0',
        ]);

        // El id_cliente viene de la URL, no del body.
        $datos['id_cliente'] = $idCliente;
        // El usuario que la crea sale del token autenticado (Sanctum).
        $datos['id_usuario_creacion'] = $request->user()->id;

        return response()->json([
            'mensaje' => 'Observación registrada',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    // PATCH /cliente-observaciones/{id}/resolver → marca la observación como resuelta.
    public function resolver(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Observación resuelta',
            'data' => $this->service->resolver($id),
        ]);
    }

    // DELETE /cliente-observaciones/{id} → elimina la observación.
    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Observación eliminada']);
    }
}
