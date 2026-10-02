<?php

namespace App\Http\Controllers;

use App\Services\TipoHabitacionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TipoHabitacionController extends Controller
{
    public function __construct(
        private TipoHabitacionService $service
    ) {}

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
            'nombre' => 'required|string|max:50|unique:tipos_habitacion,nombre',
            'slug' => 'required|string|max:50|unique:tipos_habitacion,slug',
            'descripcion' => 'nullable|string|max:255',
            'capacidad' => 'nullable|integer|min:1',
            'camas' => 'nullable|integer|min:1',
            'tiene_jacuzzi' => 'boolean',
            'activo' => 'boolean',
        ]);

        $item = $this->service->crear($datos);
        return response()->json([
            'mensaje' => 'Tipo de habitación creado',
            'data' => $item,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:tipos_habitacion,nombre,' . $id . ',id_tipo',
            'slug' => 'sometimes|string|max:50|unique:tipos_habitacion,slug,' . $id . ',id_tipo',
            'descripcion' => 'nullable|string|max:255',
            'capacidad' => 'nullable|integer|min:1',
            'camas' => 'nullable|integer|min:1',
            'tiene_jacuzzi' => 'boolean',
            'activo' => 'boolean',
        ]);

        $item = $this->service->actualizar($id, $datos);
        return response()->json([
            'mensaje' => 'Tipo de habitación actualizado',
            'data' => $item,
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo de habitación desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo de habitación reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Tipo de habitación eliminado']);
    }
}