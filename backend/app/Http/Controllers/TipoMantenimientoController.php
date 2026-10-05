<?php

namespace App\Http\Controllers;

use App\Services\TipoMantenimientoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TipoMantenimientoController extends Controller
{
    public function __construct(private TipoMantenimientoService $service) {}

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
            'nombre' => 'required|string|max:60|unique:tipos_mantenimiento,nombre',
            'slug' => 'required|string|max:60|unique:tipos_mantenimiento,slug',
            'descripcion' => 'nullable|string|max:255',
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Tipo de mantenimiento creado',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:60|unique:tipos_mantenimiento,nombre,' . $id . ',id_tipo_mantenimiento',
            'slug' => 'sometimes|string|max:60|unique:tipos_mantenimiento,slug,' . $id . ',id_tipo_mantenimiento',
            'descripcion' => 'nullable|string|max:255',
            'icono' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'orden' => 'nullable|integer',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Tipo actualizado',
            'data' => $this->service->actualizar($id, $datos),
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Tipo eliminado']);
    }
}