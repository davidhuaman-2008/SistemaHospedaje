<?php

namespace App\Http\Controllers;

use App\Services\MantenimientoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class MantenimientoController extends Controller
{
    // Inyecta el Service que maneja las reparaciones de habitaciones.
    public function __construct(private MantenimientoService $service) {}

    // GET /mantenimiento → lista TODOS los reportes (histórico completo).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /mantenimiento/pendientes → resumen para la pantalla de mantenimiento.
    public function pendientes(): JsonResponse
    {
        // Devuelve 2 bloques en un solo JSON:
        //   - pendientes: reportes REPORTADO + EN_PROCESO
        //   - total_pendientes: contador para badge del sidebar
        return response()->json([
            'pendientes' => $this->service->listarPendientes(),
            'total_pendientes' => $this->service->contarPendientes(),
        ]);
    }

    // GET /mantenimiento/habitacion/{idHabitacion} → historial de una habitación.
    public function porHabitacion(int $idHabitacion): JsonResponse
    {
        return response()->json($this->service->listarPorHabitacion($idHabitacion));
    }

    // GET /mantenimiento/{id} → un reporte con sus relaciones.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /mantenimiento → reporta un problema nuevo.
    public function store(Request $request): JsonResponse
    {
        // Valida. `id_habitacion`, `id_tipo_mantenimiento` y `id_prioridad`
        // deben existir en sus tablas. `descripcion` es obligatoria.
        $datos = $request->validate([
            'id_habitacion' => 'required|exists:habitaciones,id_habitacion',
            'id_tipo_mantenimiento' => 'required|exists:tipos_mantenimiento,id_tipo_mantenimiento',
            'id_prioridad' => 'required|exists:prioridades_mantenimiento,id_prioridad',
            'descripcion' => 'required|string|max:1000',
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            // El Service valida que no haya otro reporte activo y que la hab. esté Disponible.
            $mantenimiento = $this->service->crear($datos, Auth::id());
            return response()->json([
                'mensaje' => 'Mantenimiento reportado',
                'data' => $mantenimiento,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo: la habitación ya tiene un reporte activo, o está ocupada.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // PATCH /mantenimiento/{id}/iniciar → REPORTADO → EN_PROCESO.
    public function iniciar(int $id): JsonResponse
    {
        try {
            // El Service auto-asigna el reporte al usuario que lo inicia.
            $mantenimiento = $this->service->iniciar($id, Auth::id());
            return response()->json([
                'mensaje' => 'Mantenimiento iniciado',
                'data' => $mantenimiento,
            ]);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo: el reporte ya está EN_PROCESO o RESUELTO.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // PATCH /mantenimiento/{id}/resolver → EN_PROCESO → RESUELTO.
    public function resolver(Request $request, int $id): JsonResponse
    {
        // Observaciones opcionales al resolver.
        $datos = $request->validate([
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            // IMPORTANTE: el Service crea automáticamente una LIMPIEZA
            // para esa habitación (después de reparar hay que limpiar).
            $mantenimiento = $this->service->resolver($id, Auth::id(), $datos['observaciones'] ?? null);
            return response()->json([
                'mensaje' => 'Mantenimiento resuelto. Se creó limpieza automática.',
                'data' => $mantenimiento,
            ]);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo: intentar resolver un reporte que no está EN_PROCESO.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // PATCH /mantenimiento/{id}/cancelar → cancela el reporte con un motivo.
    public function cancelar(Request $request, int $id): JsonResponse
    {
        // El motivo es OBLIGATORIO (queda en auditoría).
        $datos = $request->validate([
            'motivo' => 'required|string|max:500',
        ]);

        try {
            // El Service guarda `motivo_cancelacion`.
            $mantenimiento = $this->service->cancelar($id, Auth::id(), $datos['motivo']);
            return response()->json([
                'mensaje' => 'Mantenimiento cancelado',
                'data' => $mantenimiento,
            ]);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo: intentar cancelar un reporte ya resuelto.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // DELETE /mantenimiento/{id} → elimina físicamente.
    public function destroy(int $id): JsonResponse
    {
        // Este método NO tiene try/catch porque eliminar no tiene reglas de negocio.
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Mantenimiento eliminado']);
    }
}
