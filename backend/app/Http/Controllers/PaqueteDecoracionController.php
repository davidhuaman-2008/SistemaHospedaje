<?php

namespace App\Http\Controllers;

use App\Services\PaqueteDecoracionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PaqueteDecoracionController extends Controller
{
    public function __construct(private PaqueteDecoracionService $service) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    public function porTipoHabitacion(int $idTipo): JsonResponse
    {
        return response()->json($this->service->listarPorTipoHabitacion($idTipo));
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function store(Request $request): JsonResponse
    {
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
            $item = $this->service->crear($datos);
            return response()->json([
                'mensaje' => 'Paquete de decoración creado',
                'data' => $item,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'mensaje' => 'Error de validación',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

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

    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Paquete desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Paquete reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Paquete eliminado']);
    }
}