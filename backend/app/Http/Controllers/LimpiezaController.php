<?php

namespace App\Http\Controllers;

use App\Services\LimpiezaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class LimpiezaController extends Controller
{
    public function __construct(private LimpiezaService $service) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    public function pendientes(): JsonResponse
    {
        return response()->json([
            'pendientes' => $this->service->listarPendientes(),
            'completadas_hoy' => $this->service->listarCompletadasHoy(),
            'total_pendientes' => $this->service->contarPendientes(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'id_habitacion' => 'required|exists:habitaciones,id_habitacion',
            'id_reserva' => 'nullable|exists:reservas,id_reserva',
            'tipo' => 'nullable|in:NORMAL,PROFUNDA',
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            return response()->json([
                'mensaje' => 'Limpieza creada',
                'data' => $this->service->crear($datos),
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function iniciar(int $id): JsonResponse
    {
        try {
            $limpieza = $this->service->iniciar($id, Auth::id());
            return response()->json([
                'mensaje' => 'Limpieza iniciada',
                'data' => $limpieza,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function finalizar(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            $limpieza = $this->service->finalizar($id, Auth::id(), $datos['observaciones'] ?? null);
            return response()->json([
                'mensaje' => 'Limpieza finalizada. Habitación disponible.',
                'data' => $limpieza,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    /**
     * PATCH /api/limpieza/finalizar-todas
     * Finaliza TODAS las limpiezas activas (Limpieza Rápida).
     */
    public function finalizarTodas(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            $resultado = $this->service->finalizarTodas(
                Auth::id(),
                $datos['observaciones'] ?? null
            );

            return response()->json([
                'mensaje' => "{$resultado['total']} limpiezas finalizadas",
                'data' => $resultado,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }
}
