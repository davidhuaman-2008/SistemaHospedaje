<?php

namespace App\Http\Controllers;

use App\Services\ReservaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ReservaController extends Controller
{
    public function __construct(private ReservaService $service) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function walkIn(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'id_cliente' => 'required|exists:clientes,id_cliente',
            'id_habitacion' => 'required|exists:habitaciones,id_habitacion',
            'id_tarifa' => 'required|exists:tarifas,id_tarifa',
            'cantidad_personas' => 'nullable|integer|min:1',
            'fecha_entrada' => 'nullable|date',
            'adelanto' => 'nullable|numeric|min:0',
            'id_metodo_pago' => 'nullable|exists:metodos_pago,id_metodo',
            'pagos' => 'nullable|array',
            'pagos.*.id_metodo_pago' => 'required_with:pagos|exists:metodos_pago,id_metodo',
            'pagos.*.monto' => 'required_with:pagos|numeric|min:0.01',
            'telefono' => 'nullable|string|max:20',
            'notas' => 'nullable|string',
            'observaciones' => 'nullable|string',
        ]);

        try {
            $reserva = $this->service->crearWalkIn($datos, Auth::id());
            return response()->json([
                'mensaje' => 'Walk-in registrado',
                'data' => $reserva,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'id_cliente' => 'required|exists:clientes,id_cliente',
            'id_habitacion' => 'required|exists:habitaciones,id_habitacion',
            'id_tarifa' => 'required|exists:tarifas,id_tarifa',
            'cantidad_personas' => 'nullable|integer|min:1',
            'fecha_entrada' => 'required|date|after:now',
            'adelanto' => 'nullable|numeric|min:0',
            'id_metodo_pago' => 'nullable|exists:metodos_pago,id_metodo',
            'pagos' => 'nullable|array',
            'pagos.*.id_metodo_pago' => 'required_with:pagos|exists:metodos_pago,id_metodo',
            'pagos.*.monto' => 'required_with:pagos|numeric|min:0.01',
            'telefono' => 'nullable|string|max:20',
            'notas' => 'nullable|string',
            'observaciones' => 'nullable|string',
        ]);

        try {
            $reserva = $this->service->crearReserva($datos, Auth::id());
            return response()->json([
                'mensaje' => 'Reserva creada',
                'data' => $reserva,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function checkIn(int $id): JsonResponse
    {
        try {
            $reserva = $this->service->checkIn($id, Auth::id());
            return response()->json([
                'mensaje' => 'Check-in realizado',
                'data' => $reserva,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function checkOut(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'monto_final' => 'nullable|numeric|min:0',
        ]);

        try {
            $reserva = $this->service->checkOut($id, Auth::id(), $datos['monto_final'] ?? null);
            return response()->json([
                'mensaje' => 'Check-out realizado',
                'data' => $reserva,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function cancelar(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'motivo' => 'required|string|max:255',
        ]);

        try {
            $reserva = $this->service->cancelar($id, Auth::id(), $datos['motivo']);
            return response()->json(['mensaje' => 'Reserva cancelada', 'data' => $reserva]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function anular(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'motivo' => 'required|string|max:255',
        ]);

        try {
            $reserva = $this->service->anular($id, Auth::id(), $datos['motivo']);
            return response()->json(['mensaje' => 'Reserva anulada', 'data' => $reserva]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function cambiarHabitacion(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'id_nueva_habitacion' => 'required|exists:habitaciones,id_habitacion',
            'modo_diferencia' => 'nullable|in:AHORA,AL_FINAL',
            'id_metodo_pago' => 'nullable|exists:metodos_pago,id_metodo',
        ]);

        try {
            $reserva = $this->service->cambiarHabitacion(
                $id,
                $datos['id_nueva_habitacion'],
                Auth::id(),
                $datos['modo_diferencia'] ?? 'AL_FINAL',
                $datos['id_metodo_pago'] ?? null
            );
            return response()->json(['mensaje' => 'Habitación cambiada', 'data' => $reserva]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function agregarConsumo(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'id_producto' => 'required|exists:productos,id_producto',
            'cantidad' => 'required|integer|min:1',
            'pagado' => 'boolean',
            'id_metodo_pago' => 'nullable|exists:metodos_pago,id_metodo',
            'observaciones' => 'nullable|string',
        ]);

        try {
            $consumo = $this->service->agregarConsumo(
                $id,
                $datos['id_producto'],
                $datos['cantidad'],
                $datos['pagado'] ?? false,
                Auth::id(),
                $datos['id_metodo_pago'] ?? null,
                $datos['observaciones'] ?? null
            );

            $reserva = $this->service->obtener($id);

            return response()->json([
                'mensaje' => 'Consumo agregado',
                'consumo' => $consumo,
                'reserva' => $reserva,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function eliminarConsumo(int $idReserva, int $idConsumo): JsonResponse
    {
        try {
            $this->service->eliminarConsumo($idConsumo, Auth::id());
            return response()->json(['mensaje' => 'Consumo eliminado']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function calculoExtension(int $id): JsonResponse
    {
        $reserva = $this->service->obtener($id);
        $service = app(\App\Services\ExtensionService::class);
        return response()->json($service->calcular($reserva));
    }

    public function agregarExtension(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'horas_extra' => 'required|integer|min:0',
            'cargar_a_cuenta' => 'boolean',
            'id_metodo_pago' => 'nullable|exists:metodos_pago,id_metodo',
            'es_turno_adicional' => 'boolean',
            'observaciones' => 'nullable|string',
        ]);

        try {
            $reserva = $this->service->agregarExtension(
                $id,
                $datos['horas_extra'],
                $datos['cargar_a_cuenta'] ?? true,
                Auth::id(),
                $datos['id_metodo_pago'] ?? null,
                $datos['es_turno_adicional'] ?? false,
                $datos['observaciones'] ?? null
            );
            return response()->json([
                'mensaje' => 'Extensión aplicada',
                'data' => $reserva,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function listarExtensiones(int $id): JsonResponse
    {
        return response()->json($this->service->listarExtensiones($id));
    }
    /**
     * POST /api/reservas/{id}/pagos
     * Agrega un pago adicional a una reserva.
     */
    public function agregarPago(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'id_metodo_pago' => 'required|exists:metodos_pago,id_metodo',
            'monto' => 'required|numeric|min:0.01',
            'observaciones' => 'nullable|string|max:255',
        ]);

        try {
            $reserva = $this->service->agregarPago($id, $datos, $request->user()->id);
            return response()->json([
                'mensaje' => 'Pago registrado',
                'data' => $reserva,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    /**
     * DELETE /api/reservas/{id}/pagos/{idPago}
     * Anula un pago especifico.
     */
    public function anularPago(Request $request, int $id, int $idPago): JsonResponse
    {
        $datos = $request->validate([
            'motivo' => 'required|string|max:255',
        ]);

        try {
            $reserva = $this->service->anularPago($idPago, $request->user()->id, $datos['motivo']);
            return response()->json([
                'mensaje' => 'Pago anulado',
                'data' => $reserva,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/reservas/{id}/entregar-vuelto
     * Entrega el vuelto al cliente (registra pago negativo).
     */
    public function entregarVuelto(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'monto' => 'required|numeric|min:0.01',
            'id_metodo_pago' => 'required|exists:metodos_pago,id_metodo',
        ]);

        try {
            $reserva = $this->service->entregarVuelto(
                $id,
                (float) $datos['monto'],
                (int) $datos['id_metodo_pago'],
                $request->user()->id
            );

            return response()->json([
                'mensaje' => 'Vuelto entregado',
                'data' => $reserva,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    /**
     * PATCH /api/reservas/{id}/check-out-con-vuelto
     * Check-out con decisión sobre el vuelto pendiente.
     */
    public function checkOutConVuelto(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'monto_final' => 'nullable|numeric|min:0',
            'decision_tipo' => 'required|in:ENTREGADO,NO_RECLAMADO,OTRO',
            'id_metodo_pago' => 'nullable|exists:metodos_pago,id_metodo',
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            $reserva = $this->service->checkOutConVuelto(
                $id,
                Auth::id(),
                $datos['monto_final'] ?? null,
                $datos['decision_tipo'],
                $datos['id_metodo_pago'] ?? null,
                $datos['observaciones'] ?? null
            );

            return response()->json([
                'mensaje' => 'Check-out realizado con decisión de vuelto',
                'data' => $reserva,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    /**
     * PATCH /api/reservas/{id}/check-out-con-deuda
     * Check-out con decisión sobre deuda pendiente.
     */
    public function checkOutConDeuda(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'monto_final' => 'nullable|numeric|min:0',
            'decision_tipo' => 'required|in:PAGO,NO_PAGO',
            'monto_pago' => 'nullable|numeric|min:0.01',
            'id_metodo_pago' => 'nullable|exists:metodos_pago,id_metodo',
            'id_gravedad' => 'nullable|exists:gravedades_observacion,id_gravedad',
            'motivo' => 'nullable|string|max:255',
        ]);

        try {
            $reserva = $this->service->checkOutConDeuda(
                $id,
                Auth::id(),
                $datos['monto_final'] ?? null,
                $datos['decision_tipo'],
                $datos['monto_pago'] ?? null,
                $datos['id_metodo_pago'] ?? null,
                $datos['id_gravedad'] ?? null,
                $datos['motivo'] ?? null
            );

            return response()->json([
                'mensaje' => 'Check-out realizado con decisión de deuda',
                'data' => $reserva,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /api/reservas/{id}/consumos-multiple
     * Agrega MÚLTIPLES consumos con soporte para pagos parciales/mixtos.
     */
    public function agregarConsumosMultiple(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'consumos' => 'required|array|min:1',
            'consumos.*.id_producto' => 'required|exists:productos,id_producto',
            'consumos.*.cantidad' => 'required|integer|min:1',
            'pagos' => 'nullable|array',
            'pagos.*.id_metodo_pago' => 'required_with:pagos|exists:metodos_pago,id_metodo',
            'pagos.*.monto' => 'required_with:pagos|numeric|min:0.01',
            'cargar_a_cuenta' => 'boolean',
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            $reserva = $this->service->agregarConsumosMultiple(
                $id,
                $datos['consumos'],
                $datos['pagos'] ?? [],
                $datos['cargar_a_cuenta'] ?? true,
                Auth::id(),
                $datos['observaciones'] ?? null
            );

            return response()->json([
                'mensaje' => 'Consumos agregados correctamente',
                'data' => $reserva,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // ========================================================================
    // MODULO 09B — RESERVAS FUTURAS
    // ========================================================================

    public function reservasDisponibles(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'fecha' => 'required|date',
            'horas' => 'required|integer|min:1|max:24',
        ]);

        $inicio = \Carbon\Carbon::parse($datos['fecha']);
        $fin = $inicio->copy()->addHours((int) $datos['horas']);

        $libres = $this->service->listarDisponiblesEnRango($inicio, $fin, (int) $datos['horas']);
        $conflicto = $this->service->listarConConflictoEnRango($inicio, $fin);

        return response()->json([
            'fecha_inicio' => $inicio->toIso8601String(),
            'fecha_fin' => $fin->toIso8601String(),
            'horas' => (int) $datos['horas'],
            'total_libres' => $libres->count(),
            'total_conflicto' => $conflicto->count(),
            'libres' => $libres,
            'con_conflicto' => $conflicto,
        ]);
    }

    public function proximas(): JsonResponse
    {
        $reservas = $this->service->listarProximasConAlerta();
        return response()->json([
            'total' => $reservas->count(),
            'reservas' => $reservas,
        ]);
    }

    public function hoy(): JsonResponse
    {
        $reservas = $this->service->listarHoy();
        return response()->json([
            'total' => $reservas->count(),
            'reservas' => $reservas,
        ]);
    }

    public function proximasCheckIn(): JsonResponse
    {
        $reservas = $this->service->listarProximasCheckIn();
        return response()->json([
            'total' => $reservas->count(),
            'reservas' => $reservas,
        ]);
    }
    // ========================================================================
    // FILTRADO — Reservas (RES-) vs Estadias (WK-)
    // ========================================================================

    /**
     * GET /api/reservas/solo-reservas
     * Devuelve SOLO reservas futuras (codigo RES-).
     */
    public function soloReservas(): JsonResponse
    {
        return response()->json($this->service->listarSoloReservas());
    }

    /**
     * GET /api/reservas/solo-walk-ins
     * Devuelve SOLO estadias walk-in (codigo WK-).
     */
    public function soloWalkIns(): JsonResponse
    {
        return response()->json($this->service->listarSoloWalkIns());
    }

    /**
     * GET /api/reservas/historial
     * Devuelve el historial completo (todas las reservas + walk-ins).
     */
    public function historial(): JsonResponse
    {
        return response()->json($this->service->listarHistorialCompleto());
    }
    // ========================================================================
    // CHECK-IN DE RESERVA FUTURA
    // ========================================================================

    /**
     * GET /api/reservas/{id}/info-check-in
     * Devuelve toda la info necesaria para la pantalla de check-in.
     */
    public function infoCheckIn(int $id): JsonResponse
    {
        try {
            return response()->json($this->service->obtenerInfoCheckIn($id));
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['mensaje' => 'Reserva no encontrada'], 404);
        }
    }

    /**
     * POST /api/reservas/{id}/check-in-validado
     * Hace el check-in con validaciones (disponibilidad, estado, etc).
     */
    public function checkInValidado(int $id): JsonResponse
    {
        try {
            $reserva = $this->service->checkInValidado($id, Auth::id());
            return response()->json([
                'mensaje' => 'Check-in realizado correctamente',
                'data' => $reserva,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }}
