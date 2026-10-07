<?php

namespace App\Http\Controllers;

use App\Services\MetodoPagoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MetodoPagoController extends Controller
{
    // Inyecta el Service que maneja los métodos de pago.
    public function __construct(
        private MetodoPagoService $service
    ) {}

    // GET /metodos-pago → lista TODOS (activos e inactivos).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /metodos-pago/activos → solo los activos.
    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    // GET /metodos-pago/de-caja → solo los que entran a caja (R39).
    public function deCaja(): JsonResponse
    {
        return response()->json($this->service->listarDeCaja());
    }

    // GET /metodos-pago/de-duenia → solo los que van a la cuenta de la dueña.
    public function deDuenia(): JsonResponse
    {
        return response()->json($this->service->listarDeDuenia());
    }

    // GET /metodos-pago/{id} → uno por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /metodos-pago → crea un método nuevo.
    public function store(Request $request): JsonResponse
    {
        // `nombre` único. `es_de_caja` OBLIGATORIO (define R39).
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

    // PUT /metodos-pago/{id} → actualiza. `unique` ignora el propio ID.
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

    // PATCH /metodos-pago/{id}/desactivar → soft delete.
    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Método de pago desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /metodos-pago/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Método de pago reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /metodos-pago/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Método de pago eliminado']);
    }
}
