<?php

namespace App\Http\Controllers;

use App\Services\ClienteVisitaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClienteVisitaController extends Controller
{
    // Inyecta el Service que maneja el historial de visitas.
    public function __construct(private ClienteVisitaService $service) {}

    // GET /clientes/{idCliente}/visitas → lista las visitas de un cliente.
    public function index(int $idCliente): JsonResponse
    {
        return response()->json($this->service->listarPorCliente($idCliente));
    }

    // GET /cliente-visitas/{id} → una visita específica.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /clientes/{idCliente}/visitas → registra una visita manual.
    public function store(Request $request, int $idCliente): JsonResponse
    {
        // Valida. `fecha_salida` no puede ser anterior a `fecha_entrada`.
        $datos = $request->validate([
            'id_reserva' => 'nullable|integer',
            'id_habitacion' => 'nullable|integer',
            'fecha_entrada' => 'required|date',
            'fecha_salida' => 'nullable|date|after_or_equal:fecha_entrada',
            'monto_gastado' => 'nullable|numeric|min:0',
        ]);

        // El id_cliente viene de la URL.
        $datos['id_cliente'] = $idCliente;

        return response()->json([
            'mensaje' => 'Visita registrada',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    // PUT /cliente-visitas/{id} → actualiza una visita.
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

    // DELETE /cliente-visitas/{id} → elimina la visita.
    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Visita eliminada']);
    }
}
