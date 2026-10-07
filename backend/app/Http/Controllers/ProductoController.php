<?php

namespace App\Http\Controllers;

use App\Services\ProductoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductoController extends Controller
{
    // Inyecta el Service que maneja los productos.
    public function __construct(private ProductoService $service) {}

    // GET /productos → lista TODOS, o filtra por categoría si viene ?id_categoria=X.
    public function index(Request $request): JsonResponse
    {
        // Si el frontend manda ?id_categoria=3, filtra. Si no, lista todo.
        if ($request->has('id_categoria')) {
            return response()->json($this->service->listarPorCategoria((int) $request->id_categoria));
        }
        return response()->json($this->service->listar());
    }

    // GET /productos/activos → solo los activos.
    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    // GET /productos/stock-bajo → solo los que tienen stock_actual <= stock_minimo.
    public function stockBajo(): JsonResponse
    {
        return response()->json($this->service->listarStockBajo());
    }

    // GET /productos/por-categoria/{idCategoria} → filtrados por categoría (ruta).
    public function porCategoria(int $idCategoria): JsonResponse
    {
        return response()->json($this->service->listarPorCategoria($idCategoria));
    }

    // GET /productos/{id} → uno por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /productos → crea un producto nuevo.
    public function store(Request $request): JsonResponse
    {
        // Valida. `precio_venta` es obligatorio. `stock_minimo` por defecto será 10.
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

    // PUT /productos/{id} → actualiza. `precio_venta` es el único required si viene.
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

    // PATCH /productos/{id}/desactivar → soft delete.
    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Producto desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /productos/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Producto reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /productos/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Producto eliminado']);
    }
}
