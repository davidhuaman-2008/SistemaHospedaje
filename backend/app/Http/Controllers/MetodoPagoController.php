<?php

namespace App\Http\Controllers;

use App\Services\MetodoPagoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MetodoPagoController extends Controller
{
    public function __construct(
        private MetodoPagoService $service
    ) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    public function deCaja(): JsonResponse
    {
        return response()->json($this->service->listarDeCaja());
    }

    public function deDuenia(): JsonResponse
    {
        return response()->json($this->service->listarDeDuenia());
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:50|unique:metodos_pago,nombre',
            'descripcion' => 'nullable|string|max:255',
            'es_de_caja' => 'required|boolean',
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        $item = $this->service->crear($datos);
        return response()->json([
            'mensaje' => 'Método de pago creado',
            'data' => $item,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:metodos_pago,nombre,' . $id . ',id_metodo',
            'descripcion' => 'nullable|string|max:255',
            'es_de_caja' => 'boolean',
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        $item = $this->service->actualizar($id, $datos);
        return response()->json([
            'mensaje' => 'Método de pago actualizado',
            'data' => $item,
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Método de pago desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Método de pago reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Método de pago eliminado']);
    }
}