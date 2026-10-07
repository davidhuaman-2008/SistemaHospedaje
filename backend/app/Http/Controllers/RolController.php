<?php

namespace App\Http\Controllers;

use App\Services\RolService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RolController extends Controller
{
    // Inyecta el Service que maneja los roles del sistema.
    // Nota: la propiedad se llama `rolService` (no `service`) → es una inconsistencia menor.
    public function __construct(
        private RolService $rolService
    ) {}

    // GET /roles → lista TODOS los roles (activos e inactivos).
    public function index(): JsonResponse
    {
        return response()->json(
            $this->rolService->listar()
        );
    }

    // POST /roles → crea un rol nuevo.
    public function store(Request $request): JsonResponse
    {
        // `nombre` único. `activo` opcional (default true).
        $datos = $request->validate([
            'nombre' => 'required|string|max:50|unique:roles,nombre',
            'descripcion' => 'nullable|string|max:255',
            'activo' => 'boolean',
        ]);

        $rol = $this->rolService->crear($datos);

        return response()->json([
            'mensaje' => 'Rol creado',
            'data' => $rol,
        ], 201);
    }

    // GET /roles/{id} → un rol por ID.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->rolService->obtener($id));
    }

    // PUT /roles/{id} → actualiza. `unique` ignora el propio ID.
    public function update(Request $request, int $id): JsonResponse
    {
        // ⚠️ Nota técnica: el `unique` excluye el ID pero NO la columna.
        // En otros controllers se usa: unique:tabla,columna,{id},columna_pk
        // Acá solo: unique:roles,nombre,{id} → funciona porque Laravel asume
        // que la PK es `id` por defecto.
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:roles,nombre,' . $id,
            'descripcion' => 'nullable|string|max:255',
            'activo' => 'sometimes|boolean',
        ]);

        $rol = $this->rolService->actualizar($id, $datos);

        return response()->json([
            'mensaje' => 'Rol actualizado',
            'data' => $rol,
        ]);
    }

    // DELETE /roles/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        // El Service debe validar que no haya usuarios con este rol.
        $this->rolService->eliminar($id);

        return response()->json([
            'mensaje' => 'Rol eliminado',
        ]);
    }

    // PATCH /roles/{id}/desactivar → soft delete (activo = false).
    public function desactivar(int $id): JsonResponse
    {
        // El Service valida que no haya usuarios activos con este rol.
        $rol = $this->rolService->desactivar($id);
        return response()->json([
            'mensaje' => 'Rol desactivado',
            'data' => $rol,
        ]);
    }

    // PATCH /roles/{id}/reactivar → activo = true.
    public function reactivar(int $id): JsonResponse
    {
        $rol = $this->rolService->reactivar($id);
        return response()->json([
            'mensaje' => 'Rol reactivado',
            'data' => $rol,
        ]);
    }
}
