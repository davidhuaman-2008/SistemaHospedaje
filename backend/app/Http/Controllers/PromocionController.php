<?php

namespace App\Http\Controllers;

use App\Services\PromocionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PromocionController extends Controller
{
    public function __construct(private PromocionService $service) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    public function activas(): JsonResponse
    {
        return response()->json($this->service->listarActivas());
    }

    public function vigentes(): JsonResponse
    {
        return response()->json($this->service->listarVigentes());
    }

    public function porCategoria(int $idCategoria): JsonResponse
    {
        return response()->json($this->service->listarPorCategoria($idCategoria));
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function store(Request $request): JsonResponse
    {
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

    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Promoción desactivada',
            'data' => $this->service->desactivar($id),
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Promoción reactivada',
            'data' => $this->service->reactivar($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Promoción eliminada']);
    }
}