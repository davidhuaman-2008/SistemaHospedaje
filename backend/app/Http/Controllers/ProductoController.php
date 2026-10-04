<?php

namespace App\Http\Controllers;

use App\Services\ProductoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductoController extends Controller
{
    public function __construct(private ProductoService $service) {}

    public function index(Request $request): JsonResponse
    {
        if ($request->has('id_categoria')) {
            return response()->json($this->service->listarPorCategoria((int) $request->id_categoria));
        }
        return response()->json($this->service->listar());
    }

    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    public function stockBajo(): JsonResponse
    {
        return response()->json($this->service->listarStockBajo());
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
            'id_categoria_producto' => 'nullable|exists:categorias_producto,id_categoria_producto',
            'id_proveedor' => 'nullable|exists:proveedores,id_proveedor',
            'codigo_barra' => 'nullable|string|max:50',
            'precio_compra' => 'nullable|numeric|min:0',
            'precio_venta' => 'required|numeric|min:0',
            'stock_actual' => 'nullable|integer|min:0',
            'stock_minimo' => 'nullable|integer|min:0',
            'unidad_medida' => 'nullable|string|max:20',
            'imagen' => 'nullable|string|max:255',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Producto creado',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'descripcion' => 'nullable|string|max:255',
            'id_categoria_producto' => 'nullable|exists:categorias_producto,id_categoria_producto',
            'id_proveedor' => 'nullable|exists:proveedores,id_proveedor',
            'codigo_barra' => 'nullable|string|max:50',
            'precio_compra' => 'nullable|numeric|min:0',
            'precio_venta' => 'sometimes|numeric|min:0',
            'stock_actual' => 'nullable|integer|min:0',
            'stock_minimo' => 'nullable|integer|min:0',
            'unidad_medida' => 'nullable|string|max:20',
            'imagen' => 'nullable|string|max:255',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Producto actualizado',
            'data' => $this->service->actualizar($id, $datos),
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Producto desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Producto reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Producto eliminado']);
    }
}