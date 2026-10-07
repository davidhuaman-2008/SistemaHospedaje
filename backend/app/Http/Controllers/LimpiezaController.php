<?php

namespace App\Http\Controllers;

use App\Services\LimpiezaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class LimpiezaController extends Controller
{
    // Inyecta el Service que maneja la cola de limpieza.
    public function __construct(private LimpiezaService $service) {}

    // GET /limpieza → lista TODAS las limpiezas (histórico completo).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /limpieza/pendientes → resumen para la pantalla de limpieza.
    public function pendientes(): JsonResponse
    {
        // Devuelve 3 cosas en un solo JSON (optimización para el frontend):
        //   - pendientes: tareas PENDIENTE + EN_PROCESO
        //   - completadas_hoy: las que se terminaron hoy
        //   - total_pendientes: contador para el badge del sidebar
        return response()->json([
            'pendientes' => $this->service->listarPendientes(),
            'completadas_hoy' => $this->service->listarCompletadasHoy(),
            'total_pendientes' => $this->service->contarPendientes(),
        ]);
    }

    // POST /limpieza → crea una tarea de limpieza MANUALMENTE.
    public function store(Request $request): JsonResponse
    {
        // `id_habitacion` es obligatorio. `id_reserva` y `tipo` son opcionales.
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
            // Ejemplo: la habitación ya tiene una limpieza pendiente.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // PATCH /limpieza/{id}/iniciar → PENDIENTE → EN_PROCESO.
    public function iniciar(int $id): JsonResponse
    {
        try {
            // El Service auto-asigna la limpieza al usuario que la inicia.
            $limpieza = $this->service->iniciar($id, Auth::id());
            return response()->json([
                'mensaje' => 'Limpieza iniciada',
                'data' => $limpieza,
            ]);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo: la limpieza ya está EN_PROCESO o COMPLETADA.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // PATCH /limpieza/{id}/finalizar → EN_PROCESO → COMPLETADA.
    public function finalizar(Request $request, int $id): JsonResponse
    {
        // Las observaciones son opcionales al finalizar.
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
            // Ejemplo: intentar finalizar una limpieza que no está en proceso.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    /**
     * PATCH /api/limpieza/finalizar-todas
     * Finaliza TODAS las limpiezas activas (Limpieza Rápida).
     */
    public function finalizarTodas(Request $request): JsonResponse
    {
        // Observaciones opcionales que se aplican a TODAS las limpiezas finalizadas.
        $datos = $request->validate([
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            // El Service itera sobre todas las PENDIENTES + EN_PROCESO y las cierra.
            $resultado = $this->service->finalizarTodas(
                Auth::id(),
                $datos['observaciones'] ?? null
            );

            // Respuesta con el total de limpiezas cerradas + detalle.
            return response()->json([
                'mensaje' => "{$resultado['total']} limpiezas finalizadas",
                'data' => $resultado,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }
}
