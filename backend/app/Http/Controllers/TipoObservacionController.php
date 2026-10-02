<?php

namespace App\Http\Controllers;

use App\Services\TipoObservacionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TipoObservacionController extends Controller
{
    public function __construct(private TipoObservacionService $service) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:50|unique:tipos_observacion,nombre',
            'slug' => 'required|string|max:50|unique:tipos_observacion,slug',
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'descripcion' => 'nullable|string|max:255',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Tipo de observación creado',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:tipos_observacion,nombre,' . $id . ',id_tipo_observacion',
            'slug' => 'sometimes|string|max:50|unique:tipos_observacion,slug,' . $id . ',id_tipo_observacion',
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'descripcion' => 'nullable|string|max:255',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Tipo de observación actualizado',
            'data' => $this->service->actualizar($id, $datos),
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo de observación desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo de observación reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Tipo de observación eliminado']);
    }
}