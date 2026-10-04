<?php

namespace App\Http\Controllers;

use App\Models\Turno;
use App\Services\TurnoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TurnoController extends Controller
{
    public function __construct(
        private TurnoService $turnoService
    ) {}

    public function index()
    {
        return response()->json(
            $this->turnoService->listar()
        );
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:50',
            'hora_inicio' => 'required',
            'hora_fin' => 'required',
            'descripcion' => 'nullable|string|max:255',
            'activo' => 'boolean',
        ]);

        $turno = $this->turnoService->crear($datos);

        return response()->json([
            'mensaje' => 'Turno creado',
            'turno' => $turno,
        ], 201);
    }

    public function show(Turno $turno)
    {
        return response()->json($turno);
    }

    public function update(Request $request, Turno $turno)
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:50',
            'hora_inicio' => 'sometimes',
            'hora_fin' => 'sometimes',
            'descripcion' => 'nullable|string|max:255',
            'activo' => 'sometimes|boolean',
        ]);

        $turno = $this->turnoService->actualizar($turno, $datos);

        return response()->json([
            'mensaje' => 'Turno actualizado',
            'turno' => $turno,
        ]);
    }

    public function destroy(Turno $turno)
    {
        $this->turnoService->eliminar($turno);

        return response()->json([
            'mensaje' => 'Turno eliminado',
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        $turno = $this->turnoService->desactivar($id);
        return response()->json([
            'mensaje' => 'Turno desactivado',
            'data' => $turno,
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        $turno = $this->turnoService->reactivar($id);
        return response()->json([
            'mensaje' => 'Turno reactivado',
            'data' => $turno,
        ]);
    }
}