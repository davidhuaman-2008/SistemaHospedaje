<?php

namespace App\Http\Controllers;

use App\Services\ProveedorService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProveedorController extends Controller
{
    // Inyecta el Service que maneja los proveedores.
    public function __construct(private ProveedorService $service) {}

    // GET /proveedores → lista TODOS (activos e inactivos).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /proveedores/activos → solo los activos.
    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    // GET /proveedores/{id} → uno por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /proveedores → crea un proveedor nuevo.
    public function store(Request $request): JsonResponse
    {
        // Solo `razon_social` es obligatoria. El resto es opcional.
        $datos = $request->validate([
            'razon_social' => 'required|string|max:100',
            'nombre_comercial' => 'nullable|string|max:100',
            'ruc' => 'nullable|string|max:20',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:150',
            'direccion' => 'nullable|string|max:255',
            'contacto' => 'nullable|string|max:100',
            'tipo' => 'nullable|string|max:30',
            'notas' => 'nullable|string',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Proveedor creado',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    // PUT /proveedores/{id} → actualiza.
    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'razon_social' => 'sometimes|string|max:100',
            'nombre_comercial' => 'nullable|string|max:100',
            'ruc' => 'nullable|string|max:20',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:150',
            'direccion' => 'nullable|string|max:255',
            'contacto' => 'nullable|string|max:100',
            'tipo' => 'nullable|string|max:30',
            'notas' => 'nullable|string',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Proveedor actualizado',
            'data' => $this->service->actualizar($id, $datos),
        ]);
    }

    // PATCH /proveedores/{id}/desactivar → soft delete.
    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Proveedor desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /proveedores/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Proveedor reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /proveedores/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Proveedor eliminado']);
    }
}
