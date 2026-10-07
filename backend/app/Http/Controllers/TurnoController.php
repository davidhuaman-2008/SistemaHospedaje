<?php

namespace App\Http\Controllers;

use App\Models\Turno;
use App\Services\TurnoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TurnoController extends Controller
{
    // Inyecta el Service que maneja los turnos del personal.
    // ⚠️ La propiedad se llama `turnoService` (no `service`).
    public function __construct(
        private TurnoService $turnoService
    ) {}

    // GET /turnos → lista TODOS los turnos.
    public function index()
    {
        return response()->json(
            $this->turnoService->listar()
        );
    }

    // POST /turnos → crea un turno nuevo.
    public function store(Request $request)
    {
        // ⚠️ `hora_inicio` y `hora_fin` son `required` pero sin formato específico.
        $datos = $request->validate([
            'nombre' => 'required|string|max:50',
            'hora_inicio' => 'required',
            'hora_fin' => 'required',
            'descripcion' => 'nullable|string|max:255',
            'activo' => 'boolean',
        ]);

        $turno = $this->turnoService->crear($datos);

        // ⚠️ Respuesta usa `turno` en lugar de `data`. Inconsistencia menor.
        return response()->json([
            'mensaje' => 'Turno creado',
            'turno' => $turno,
        ], 201);
    }

    // GET /turnos/{id} → un turno por ID.
    // ⚠️ Usa Route Model Binding → Laravel resuelve `Turno $turno` automáticamente.
    public function show(Turno $turno)
    {
        return response()->json($turno);
    }

    // PUT /turnos/{id} → actualiza.
    // ⚠️ También usa Route Model Binding.
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

    // DELETE /turnos/{id} → elimina físicamente.
    // ⚠️ También usa Route Model Binding.
    public function destroy(Turno $turno)
    {
        $this->turnoService->eliminar($turno);

        return response()->json([
            'mensaje' => 'Turno eliminado',
        ]);
    }

    // PATCH /turnos/{id}/desactivar → soft delete.
    // ⚠️ Este SÍ usa `int $id` (no Route Model Binding).
    public function desactivar(int $id): JsonResponse
    {
        $turno = $this->turnoService->desactivar($id);
        return response()->json([
            'mensaje' => 'Turno desactivado',
            'data' => $turno,
        ]);
    }

    // PATCH /turnos/{id}/reactivar → activo = true.
    // ⚠️ Este también usa `int $id`.
    public function reactivar(int $id): JsonResponse
    {
        $turno = $this->turnoService->reactivar($id);
        return response()->json([
            'mensaje' => 'Turno reactivado',
            'data' => $turno,
        ]);
    }
}
