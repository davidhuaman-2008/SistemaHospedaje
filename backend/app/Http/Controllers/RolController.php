<?php

namespace App\Http\Controllers;

use App\Models\Rol;
use App\Services\RolService;
use Illuminate\Http\Request;

class RolController extends Controller
{
    public function __construct(
        private RolService $rolService
    ) {}

    public function index()
    {
        return response()->json(
            $this->rolService->listar()
        );
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:50|unique:roles,nombre',
            'descripcion' => 'nullable|string|max:255',
        ]);

        $rol = $this->rolService->crear($datos);

        return response()->json([
            'mensaje' => 'Rol creado',
            'rol' => $rol,
        ], 201);
    }

    public function show(Rol $rol)
    {
        return response()->json($rol);
    }

    public function update(Request $request, Rol $rol)
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50|unique:roles,nombre,' . $rol->id,
            'descripcion' => 'nullable|string|max:255',
        ]);

        $rol = $this->rolService->actualizar($rol, $datos);

        return response()->json([
            'mensaje' => 'Rol actualizado',
            'rol' => $rol,
        ]);
    }

    public function destroy(Rol $rol)
    {
        $this->rolService->eliminar($rol);

        return response()->json([
            'mensaje' => 'Rol eliminado',
        ]);
    }
}
