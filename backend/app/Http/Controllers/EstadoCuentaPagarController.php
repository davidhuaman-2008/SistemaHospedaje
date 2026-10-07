<?php

namespace App\Http\Controllers;

use App\Services\EstadoCuentaPagarService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EstadoCuentaPagarController extends Controller
{
    // Inyecta el Service que maneja los estados de cuenta por pagar.
    public function __construct(private EstadoCuentaPagarService $service) {}

    // GET /estados-cuenta-pagar → lista TODOS (activos e inactivos).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /estados-cuenta-pagar/activos → solo activos.
    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    // GET /estados-cuenta-pagar/{id} → uno por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /estados-cuenta-pagar → crea un estado nuevo.
    public function store(Request $request): JsonResponse
    {
        // `nombre` y `slug` únicos. `es_estado_final` marca si es terminal.
        $datos = $request->validate([
            'nombre' => 'required|string|max:50|unique:estados_cuenta_pagar,nombre',
            'slug' => 'required|string|max:50|unique:estados_cuenta_pagar,slug',
            'descripcion' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:20',
            'icono' => 'nullable|string|max:50',
            'es_estado_final' => 'boolean',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Estado creado',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    // PUT /estados-cuenta-pagar/{id} → actualiza. `unique` ignora el propio ID.
    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:estados_cuenta_pagar,nombre,' . $id . ',id_estado_cuenta',
            'slug' => 'sometimes|string|max:50|unique:estados_cuenta_pagar,slug,' . $id . ',id_estado_cuenta',
            'descripcion' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:20',
            'icono' => 'nullable|string|max:50',
            'es_estado_final' => 'boolean',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Estado actualizado',
            'data' => $this->service->actualizar($id, $datos),
        ]);
    }

    // PATCH /estados-cuenta-pagar/{id}/desactivar → soft delete (con protección).
    public function desactivar(int $id): JsonResponse
    {
        try {
            return response()->json([
                'mensaje' => 'Estado desactivado',
                'data' => $this->service->desactivar($id),
            ]);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo: no se puede desactivar un estado que está en uso.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // PATCH /estados-cuenta-pagar/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Estado reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /estados-cuenta-pagar/{id} → elimina (con protección).
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->service->eliminar($id);
            return response()->json(['mensaje' => 'Estado eliminado']);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo: no se puede eliminar si hay cuentas usándolo.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }
}
