<?php

namespace App\Http\Controllers;

use App\Services\ClienteNivelService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClienteNivelController extends Controller
{
    // Inyecta el Service que maneja toda la lógica de niveles de cliente.
    public function __construct(
        private ClienteNivelService $service
    ) {}

    // GET /clientes-niveles → lista TODOS (activos e inactivos).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /clientes-niveles/activos → solo los que tienen activo = true.
    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    // GET /clientes-niveles/{id} → devuelve un nivel por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /clientes-niveles → crea un nivel nuevo.
    public function store(Request $request): JsonResponse
    {
        // Valida. `nombre` es único. `descuento` es porcentaje (0-100).
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

    // PUT /clientes-niveles/{id} → actualiza. `unique` ignora el propio ID.
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

    // PATCH /clientes-niveles/{id}/desactivar → soft delete.
    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Nivel de cliente desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /clientes-niveles/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Nivel de cliente reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /clientes-niveles/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Nivel de cliente eliminado']);
    }
}
