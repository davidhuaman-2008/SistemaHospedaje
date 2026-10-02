<?php

namespace App\Http\Controllers;

use App\Services\TipoDocumentoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TipoDocumentoController extends Controller
{
    public function __construct(
        private TipoDocumentoService $service
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
            'nombre' => 'required|string|max:50|unique:tipos_documento,nombre',
            'abreviatura' => 'required|string|max:10|unique:tipos_documento,abreviatura',
            'longitud' => 'nullable|integer|min:1',
            'activo' => 'boolean',
        ]);

        $item = $this->service->crear($datos);
        return response()->json([
            'mensaje' => 'Tipo de documento creado',
            'data' => $item,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:tipos_documento,nombre,' . $id . ',id_documento',
            'abreviatura' => 'sometimes|string|max:10|unique:tipos_documento,abreviatura,' . $id . ',id_documento',
            'longitud' => 'nullable|integer|min:1',
            'activo' => 'boolean',
        ]);

        $item = $this->service->actualizar($id, $datos);
        return response()->json([
            'mensaje' => 'Tipo de documento actualizado',
            'data' => $item,
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo de documento desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo de documento reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Tipo de documento eliminado']);
    }
}