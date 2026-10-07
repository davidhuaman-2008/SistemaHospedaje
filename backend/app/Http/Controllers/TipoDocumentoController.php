<?php

namespace App\Http\Controllers;

use App\Services\TipoDocumentoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TipoDocumentoController extends Controller
{
    // Inyecta el Service que maneja los tipos de documento.
    public function __construct(
        private TipoDocumentoService $service
    ) {}

    // GET /tipos-documento → lista TODOS (activos e inactivos).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /tipos-documento/activos → solo los activos.
    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    // GET /tipos-documento/{id} → uno por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /tipos-documento → crea uno nuevo.
    public function store(Request $request): JsonResponse
    {
        // `nombre` y `abreviatura` únicos. `longitud` opcional.
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

    // PUT /tipos-documento/{id} → actualiza. `unique` ignora el propio ID.
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

    // PATCH /tipos-documento/{id}/desactivar → soft delete.
    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo de documento desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /tipos-documento/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Tipo de documento reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /tipos-documento/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        // El Service puede proteger la eliminación si el tipo está en uso.
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Tipo de documento eliminado']);
    }
}
