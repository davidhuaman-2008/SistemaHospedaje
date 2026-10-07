<?php

namespace App\Http\Controllers;

use App\Services\PaqueteDecoracionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PaqueteDecoracionController extends Controller
{
    // Inyecta el Service que maneja el catálogo de paquetes de decoración.
    public function __construct(private PaqueteDecoracionService $service) {}

    // GET /paquetes-decoracion → lista TODOS (activos e inactivos).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /paquetes-decoracion/activos → solo los activos.
    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    // GET /paquetes-decoracion/por-tipo-habitacion/{idTipo} → filtrados por tipo.
    public function porTipoHabitacion(int $idTipo): JsonResponse
    {
        return response()->json($this->service->listarPorTipoHabitacion($idTipo));
    }

    // GET /paquetes-decoracion/{id} → uno por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /paquetes-decoracion → crea un paquete nuevo.
    public function store(Request $request): JsonResponse
    {
        // Valida. `precio_total`, `ganancia_local` y `ganancia_proveedor` son obligatorios.
        $datos = $request->validate([
            'nombre' => 'required|string|max:100',
            'slug' => 'nullable|string|max:100|unique:paquetes_decoracion,slug',
            'descripcion' => 'nullable|string|max:255',
            'precio_total' => 'required|numeric|min:0',
            'ganancia_local' => 'required|numeric|min:0',
            'ganancia_proveedor' => 'required|numeric|min:0',
            'id_proveedor' => 'nullable|exists:proveedores,id_proveedor',
            'id_tipo_habitacion' => 'nullable|exists:tipos_habitacion,id_tipo',
            'imagen' => 'nullable|string|max:255',
            'horas_incluidas' => 'integer|min:1',
            'incluye_jacuzzi' => 'boolean',
            'incluye_vino' => 'boolean',
            'incluye_decoracion' => 'boolean',
            'incluye_sexshop' => 'boolean',
            'incluye_netflix' => 'boolean',
            'activo' => 'boolean',
        ]);

        try {
            // El Service valida la fórmula: precio_total = ganancia_local + ganancia_proveedor.
            $item = $this->service->crear($datos);
            return response()->json([
                'mensaje' => 'Paquete de decoración creado',
                'data' => $item,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo: la fórmula no cuadra (precio_total ≠ local + proveedor).
            return response()->json([
                'mensaje' => 'Error de validación',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    // PUT /paquetes-decoracion/{id} → actualiza. `unique` ignora el propio ID.
    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'slug' => 'sometimes|string|max:100|unique:paquetes_decoracion,slug,' . $id . ',id_paquete',
            'descripcion' => 'nullable|string|max:255',
            'precio_total' => 'sometimes|numeric|min:0',
            'ganancia_local' => 'sometimes|numeric|min:0',
            'ganancia_proveedor' => 'sometimes|numeric|min:0',
            'id_proveedor' => 'nullable|exists:proveedores,id_proveedor',
            'id_tipo_habitacion' => 'nullable|exists:tipos_habitacion,id_tipo',
            'imagen' => 'nullable|string|max:255',
            'horas_incluidas' => 'sometimes|integer|min:1',
            'incluye_jacuzzi' => 'boolean',
            'incluye_vino' => 'boolean',
            'incluye_decoracion' => 'boolean',
            'incluye_sexshop' => 'boolean',
            'incluye_netflix' => 'boolean',
            'activo' => 'boolean',
        ]);

        try {
            $item = $this->service->actualizar($id, $datos);
            return response()->json([
                'mensaje' => 'Paquete actualizado',
                'data' => $item,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'mensaje' => 'Error de validación',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    // PATCH /paquetes-decoracion/{id}/desactivar → soft delete.
    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Paquete desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /paquetes-decoracion/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Paquete reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /paquetes-decoracion/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Paquete eliminado']);
    }
}
