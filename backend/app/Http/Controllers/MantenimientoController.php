<?php

namespace App\Http\Controllers;

use App\Services\MantenimientoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class MantenimientoController extends Controller
{
    public function __construct(private MantenimientoService $service) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    public function pendientes(): JsonResponse
    {
        return response()->json([
            'pendientes' => $this->service->listarPendientes(),
            'total_pendientes' => $this->service->contarPendientes(),
        ]);
    }

    public function porHabitacion(int $idHabitacion): JsonResponse
    {
        return response()->json($this->service->listarPorHabitacion($idHabitacion));
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'id_habitacion' => 'required|exists:habitaciones,id_habitacion',
            'id_tipo_mantenimiento' => 'required|exists:tipos_mantenimiento,id_tipo_mantenimiento',
            'id_prioridad' => 'required|exists:prioridades_mantenimiento,id_prioridad',
            'descripcion' => 'required|string|max:1000',
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            $mantenimiento = $this->service->crear($datos, Auth::id());
            return response()->json([
                'mensaje' => 'Mantenimiento reportado',
                'data' => $mantenimiento,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function iniciar(int $id): JsonResponse
    {
        try {
            $mantenimiento = $this->service->iniciar($id, Auth::id());
            return response()->json([
                'mensaje' => 'Mantenimiento iniciado',
                'data' => $mantenimiento,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function resolver(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            $mantenimiento = $this->service->resolver($id, Auth::id(), $datos['observaciones'] ?? null);
            return response()->json([
                'mensaje' => 'Mantenimiento resuelto. Se creó limpieza automática.',
                'data' => $mantenimiento,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function cancelar(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'motivo' => 'required|string|max:500',
        ]);

        try {
            $mantenimiento = $this->service->cancelar($id, Auth::id(), $datos['motivo']);
            return response()->json([
                'mensaje' => 'Mantenimiento cancelado',
                'data' => $mantenimiento,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Mantenimiento eliminado']);
    }
}