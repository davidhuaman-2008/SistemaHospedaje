<?php

namespace App\Http\Controllers;

use App\Services\TarifaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TarifaController extends Controller
{
    // Inyecta el Service que maneja las tarifas (precios por tipo y horas).
    public function __construct(
        private TarifaService $service
    ) {}

    // GET /tarifas → lista TODAS (activas e inactivas).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /tarifas/activos → solo las activas.
    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    // GET /tarifas/por-tipo/{idTipo} → tarifas de un tipo de habitación.
    public function porTipo(int $idTipo): JsonResponse
    {
        // Ej: /tarifas/por-tipo/7 → devuelve las tarifas de "Jacuzzi VIP" (8h, 12h).
        // Es el endpoint que usa el frontend al crear reservas.
        return response()->json($this->service->listarPorTipo($idTipo));
    }

    // GET /tarifas/{id} → una por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /tarifas → crea una tarifa nueva.
    public function store(Request $request): JsonResponse
    {
        // Valida. `id_tipo`, `horas`, `monto`, `precio_hora_extra`
        // y `precio_turno_adicional` son obligatorios.
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

    // PUT /tarifas/{id} → actualiza una tarifa existente.
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

    // PATCH /tarifas/{id}/desactivar → soft delete (activo = false).
    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tarifa desactivada',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /tarifas/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tarifa reactivada',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /tarifas/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        // El Service puede proteger la eliminación si la tarifa está en uso.
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Tarifa eliminada']);
    }
}
