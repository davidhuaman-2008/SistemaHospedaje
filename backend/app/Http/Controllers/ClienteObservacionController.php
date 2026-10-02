<?php

namespace App\Http\Controllers;

use App\Services\ClienteObservacionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClienteObservacionController extends Controller
{
    public function __construct(private ClienteObservacionService $service) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->listarTodas());
    }

    public function porCliente(int $idCliente): JsonResponse
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
            'id_tipo_observacion' => 'required|exists:tipos_observacion,id_tipo_observacion',
            'id_gravedad' => 'required|exists:gravedades_observacion,id_gravedad',
            'motivo' => 'required|string|max:255',
            'monto_deuda' => 'nullable|numeric|min:0',
        ]);

        $datos['id_cliente'] = $idCliente;
        $datos['id_usuario_creacion'] = $request->user()->id;

        return response()->json([
            'mensaje' => 'Observación registrada',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    public function resolver(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Observación resuelta',
            'data' => $this->service->resolver($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Observación eliminada']);
    }
}