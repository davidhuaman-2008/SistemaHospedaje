<?php

namespace App\Http\Controllers;

use App\Services\PromocionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PromocionController extends Controller
{
    // Inyecta el Service que maneja el catálogo de promociones.
    public function __construct(private PromocionService $service) {}

    // GET /promociones → lista TODAS (activas e inactivas).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /promociones/activas → solo las que tienen activo = true.
    public function activas(): JsonResponse
    {
        return response()->json($this->service->listarActivas());
    }

    // GET /promociones/vigentes → solo las vigentes HOY (fecha_inicio <= hoy <= fecha_fin).
    public function vigentes(): JsonResponse
    {
        return response()->json($this->service->listarVigentes());
    }

    // GET /promociones/por-categoria/{id} → filtradas por categoría.
    public function porCategoria(int $idCategoria): JsonResponse
    {
        return response()->json($this->service->listarPorCategoria($idCategoria));
    }

    // GET /promociones/{id} → una por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /promociones → crea una promoción nueva.
    public function store(Request $request): JsonResponse
    {
        // Valida. `tipo` está restringido a 4 opciones. `valor` es obligatorio.
        $datos = $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:255',
            'id_categoria_promocion' => 'nullable|exists:categorias_promocion,id_categoria_promocion',
            'tipo' => 'required|in:PORCENTAJE,MONTO_FIJO,NOCHE_GRATIS,OTRO',
            'valor' => 'required|numeric|min:0',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'dias_semana' => 'nullable|string|max:50',
            'hora_inicio' => 'nullable|date_format:H:i',
            'hora_fin' => 'nullable|date_format:H:i',
            'id_tipo_habitacion' => 'nullable|exists:tipos_habitacion,id_tipo',
            'monto_minimo' => 'nullable|numeric|min:0',
            'requiere_codigo' => 'boolean',
            'codigo' => 'nullable|string|max:50',
            'limite_uso' => 'nullable|integer|min:1',
            'limite_por_cliente' => 'nullable|integer|min:1',
            'acumulable' => 'boolean',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Promoción creada',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    // PUT /promociones/{id} → actualiza (sin `after_or_equal` en fecha_fin).
    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'descripcion' => 'nullable|string|max:255',
            'id_categoria_promocion' => 'nullable|exists:categorias_promocion,id_categoria_promocion',
            'tipo' => 'sometimes|in:PORCENTAJE,MONTO_FIJO,NOCHE_GRATIS,OTRO',
            'valor' => 'sometimes|numeric|min:0',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date',
            'dias_semana' => 'nullable|string|max:50',
            'hora_inicio' => 'nullable|date_format:H:i',
            'hora_fin' => 'nullable|date_format:H:i',
            'id_tipo_habitacion' => 'nullable|exists:tipos_habitacion,id_tipo',
            'monto_minimo' => 'nullable|numeric|min:0',
            'requiere_codigo' => 'boolean',
            'codigo' => 'nullable|string|max:50',
            'limite_uso' => 'nullable|integer|min:1',
            'limite_por_cliente' => 'nullable|integer|min:1',
            'acumulable' => 'boolean',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Promoción actualizada',
            'data' => $this->service->actualizar($id, $datos),
        ]);
    }

    // PATCH /promociones/{id}/desactivar → soft delete.
    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Promoción desactivada',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /promociones/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Promoción reactivada',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /promociones/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Promoción eliminada']);
    }
}
