<?php

namespace App\Http\Controllers;

use App\Services\ReservaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ReservaController extends Controller
{
    // Inyecta el Service que maneja toda la lógica de reservas.
    public function __construct(private ReservaService $service) {}

    // ========================================================================
    // CRUD BÁSICO
    // ========================================================================

    // GET /reservas → lista TODAS las reservas (WK-, RES-, DEC-).
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /reservas/{id} → una reserva con todas sus relaciones.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // ========================================================================
    // CREACIÓN: WALK-IN vs RESERVA FUTURA
    // ========================================================================

    // POST /reservas/walk-in → cliente físico que llega ahora.
    public function walkIn(Request $request): JsonResponse
    {
        // Valida. `id_cliente`, `id_habitacion` e `id_tarifa` son obligatorios.
        // `pagos[]` es para pago mixto (varios métodos).
        $datos = $request->validate([
            'id_cliente' => 'required|exists:clientes,id_cliente',
            'id_habitacion' => 'required|exists:habitaciones,id_habitacion',
            'id_tarifa' => 'required|exists:tarifas,id_tarifa',
            'cantidad_personas' => 'nullable|integer|min:1',
            'fecha_entrada' => 'nullable|date',
            'adelanto' => 'nullable|numeric|min:0',
            'id_metodo_pago' => 'nullable|exists:metodos_pago,id_metodo',
            // Pago mixto: array de pagos con método y monto.
            'pagos' => 'nullable|array',
            'pagos.*.id_metodo_pago' => 'required_with:pagos|exists:metodos_pago,id_metodo',
            'pagos.*.monto' => 'required_with:pagos|numeric|min:0.01',
            'telefono' => 'nullable|string|max:20',
            'notas' => 'nullable|string',
            'observaciones' => 'nullable|string',
        ]);

        try {
            // Crea la reserva con estado ACTIVA + check-in automático.
            // Genera código WK-XXXXXX.
            // Crea el pago inicial (único o mixto).
            // Registra la visita al cliente (sube su nivel).
            $reserva = $this->service->crearWalkIn($datos, Auth::id());
            return response()->json([
                'mensaje' => 'Walk-in registrado',
                'data' => $reserva,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo: cliente ya tiene reserva activa (R-CLI-7).
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // POST /reservas → reserva futura (cliente reserva para después).
    public function store(Request $request): JsonResponse
    {
        // Diferencia clave con walkIn: `fecha_entrada` es OBLIGATORIA y debe ser futura.
        // También acepta `con_decoracion` (boolean).
        $datos = $request->validate([
            'id_cliente' => 'required|exists:clientes,id_cliente',
            'id_habitacion' => 'required|exists:habitaciones,id_habitacion',
            'id_tarifa' => 'required|exists:tarifas,id_tarifa',
            'cantidad_personas' => 'nullable|integer|min:1',
            'fecha_entrada' => 'required|date|after:now',  // ← debe ser futura
            'con_decoracion' => 'nullable|boolean',
            'adelanto' => 'nullable|numeric|min:0',
            'id_metodo_pago' => 'nullable|exists:metodos_pago,id_metodo',
            'pagos' => 'nullable|array',
            'pagos.*.id_metodo_pago' => 'required_with:pagos|exists:metodos_pago,id_metodo',
            'pagos.*.monto' => 'required_with:pagos|numeric|min:0.01',
            'telefono' => 'nullable|string|max:20',
            'notas' => 'nullable|string',
            'observaciones' => 'nullable|string',
            'descuento_manual_aniversario' => 'nullable|boolean',
            'descuento_manual_cumpleanos' => 'nullable|boolean',
            'descuento_manual_motivo' => 'nullable|string|max:255',
        ]);

        try {
            // Crea la reserva con estado CONFIRMADA.
            // Genera código RES-XXXXXX o DEC-XXXXXX (si con_decoracion).
            // Bloquea el rango en `ocupacion_habitacion`.
            // Si con_decoracion → crea la decoración + CuentaPagar al proveedor.
            $reserva = $this->service->crearReserva($datos, Auth::id());
            return response()->json([
                'mensaje' => 'Reserva creada',
                'data' => $reserva,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            // Ejemplos:
            // - La habitación no está disponible en ese rango.
            // - Falta la anticipación mínima (30 min o 24h para decoración).
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // ========================================================================
    // CICLO DE VIDA DE LA RESERVA
    // ========================================================================

    // PATCH /reservas/{id}/check-in → activa una reserva confirmada.
    public function checkIn(int $id): JsonResponse
    {
        try {
            // Cambia estado a ACTIVA. Crea `registro_estadia`.
            // Registra la visita al cliente.
            $reserva = $this->service->checkIn($id, Auth::id());
            return response()->json([
                'mensaje' => 'Check-in realizado',
                'data' => $reserva,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // PATCH /reservas/{id}/check-out → finaliza la estadía.
    public function checkOut(Request $request, int $id): JsonResponse
    {
        // `monto_final` es opcional. Si no viene, usa el `total` de la reserva.
        $datos = $request->validate([
            'monto_final' => 'nullable|numeric|min:0',
        ]);

        try {
            // Cambia estado a FINALIZADA.
            // Crea LIMPIEZA automática para la habitación.
            // Libera la ocupación.
            $reserva = $this->service->checkOut($id, Auth::id(), $datos['monto_final'] ?? null);
            return response()->json([
                'mensaje' => 'Check-out realizado',
                'data' => $reserva,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // PATCH /reservas/{id}/cancelar → el cliente canceló.
    public function cancelar(Request $request, int $id): JsonResponse
    {
        // Motivo OBLIGATORIO (queda en auditoría).
        $datos = $request->validate([
            'motivo' => 'required|string|max:255',
        ]);

        try {
            // Cambia estado a CANCELADA.
            // Libera la ocupación.
            // NO anula los pagos (el cliente pierde el adelanto).
            $reserva = $this->service->cancelar($id, Auth::id(), $datos['motivo']);
            return response()->json(['mensaje' => 'Reserva cancelada', 'data' => $reserva]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // PATCH /reservas/{id}/anular → error del recepcionista.
    public function anular(Request $request, int $id): JsonResponse
    {
        // Motivo OBLIGATORIO.
        $datos = $request->validate([
            'motivo' => 'required|string|max:255',
        ]);

        try {
            // Cambia estado a ANULADA.
            // ANULA TODOS los pagos asociados (no se cobra al cliente).
            // Libera la ocupación.
            // No cuenta para SUNAT.
            $reserva = $this->service->anular($id, Auth::id(), $datos['motivo']);
            return response()->json(['mensaje' => 'Reserva anulada', 'data' => $reserva]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // ========================================================================
    // CAMBIO DE HABITACIÓN
    // ========================================================================

    // PATCH /reservas/{id}/cambiar-habitacion
    public function cambiarHabitacion(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'id_nueva_habitacion' => 'required|exists:habitaciones,id_habitacion',
            // Modo de manejo de la diferencia de precio:
            'modo_diferencia' => 'nullable|in:AHORA,AL_FINAL',
            'id_metodo_pago' => 'nullable|exists:metodos_pago,id_metodo',
        ]);

        try {
            // Al cambiar:
            // - La hab. VIEJA va a LIMPIEZA.
            // - El tiempo NO se resetea (regla RG5).
            // - Crea `reserva_ajuste` con la diferencia.
            // - Si modo=AHORA y diferencia positiva → registra pago.
            // - Si modo=AHORA y diferencia negativa → ajusta `pagado`.
            $reserva = $this->service->cambiarHabitacion(
                $id,
                $datos['id_nueva_habitacion'],
                Auth::id(),
                $datos['modo_diferencia'] ?? 'AL_FINAL',  // default
                $datos['id_metodo_pago'] ?? null
            );
            return response()->json(['mensaje' => 'Habitación cambiada', 'data' => $reserva]);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo: la nueva habitación no está disponible en ese rango.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // ========================================================================
    // CONSUMOS
    // ========================================================================

    // POST /reservas/{id}/consumos → agrega UN consumo.
    public function agregarConsumo(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'id_producto' => 'required|exists:productos,id_producto',
            'cantidad' => 'required|integer|min:1',
            'pagado' => 'boolean',  // true → paga ahora, false → suma a la cuenta
            'id_metodo_pago' => 'nullable|exists:metodos_pago,id_metodo',
            'observaciones' => 'nullable|string',
        ]);

        try {
            // Si pagado=true → registra pago + NO suma a monto_consumos.
            // Si pagado=false → suma a monto_consumos.
            // Descuenta stock (regla R41).
            $consumo = $this->service->agregarConsumo(
                $id,
                $datos['id_producto'],
                $datos['cantidad'],
                $datos['pagado'] ?? false,
                Auth::id(),
                $datos['id_metodo_pago'] ?? null,
                $datos['observaciones'] ?? null
            );

            // Devuelve la reserva actualizada para que el frontend recargue.
            $reserva = $this->service->obtener($id);

            return response()->json([
                'mensaje' => 'Consumo agregado',
                'consumo' => $consumo,
                'reserva' => $reserva,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo: no hay stock suficiente.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // DELETE /reservas/{id}/consumos/{idConsumo} → elimina un consumo.
    public function eliminarConsumo(int $idReserva, int $idConsumo): JsonResponse
    {
        try {
            // Devuelve stock al inventario.
            // Revierte montos de la reserva.
            $this->service->eliminarConsumo($idConsumo, Auth::id());
            return response()->json(['mensaje' => 'Consumo eliminado']);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // ========================================================================
    // EXTENSIONES DE TIEMPO
    // ========================================================================

    // GET /reservas/{id}/calculo-extension → previsualiza el cobro de horas extra.
    public function calculoExtension(int $id): JsonResponse
    {
        // Carga la reserva.
        $reserva = $this->service->obtener($id);

        // Usa el ExtensionService directamente (con app() helper).
        $service = app(\App\Services\ExtensionService::class);

        // Devuelve el cálculo (opciones de horas extra, montos, si excede máximo).
        return response()->json($service->calcular($reserva));
    }

    // POST /reservas/{id}/extensiones → aplica una extensión.
    public function agregarExtension(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'horas_extra' => 'required|integer|min:0',
            'cargar_a_cuenta' => 'boolean',  // true → suma a la cuenta, false → pago ahora
            'id_metodo_pago' => 'nullable|exists:metodos_pago,id_metodo',
            'es_turno_adicional' => 'boolean',  // true → cobra turno completo
            'observaciones' => 'nullable|string',
        ]);

        try {
            // Registra en `extensiones_reserva`.
            // Actualiza `reserva.horas_extra` y `monto_horas_extra`.
            // Si cargar_a_cuenta → no paga ahora.
            // Si NO cargar_a_cuenta → registra pago inmediato.
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
            // Ejemplo: excede el máximo de horas extra.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // GET /reservas/{id}/extensiones → historial de extensiones.
    public function listarExtensiones(int $id): JsonResponse
    {
        return response()->json($this->service->listarExtensiones($id));
    }

    // ========================================================================
    // PAGOS Y VUELTOS
    // ========================================================================

    // POST /reservas/{id}/pagos → agrega un pago adicional.
    public function agregarPago(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'id_metodo_pago' => 'required|exists:metodos_pago,id_metodo',
            'monto' => 'required|numeric|min:0.01',
            'observaciones' => 'nullable|string|max:255',
        ]);

        try {
            // Recalcula `pagado` y `saldo` de la reserva.
            $reserva = $this->service->agregarPago($id, $datos, $request->user()->id);
            return response()->json([
                'mensaje' => 'Pago registrado',
                'data' => $reserva,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // DELETE /reservas/{id}/pagos/{idPago} → anula un pago específico.
    public function anularPago(Request $request, int $id, int $idPago): JsonResponse
    {
        $datos = $request->validate([
            'motivo' => 'required|string|max:255',
        ]);

        try {
            // Marca `anulado = true` + guarda motivo.
            // Recalcula `pagado` y `saldo`.
            $reserva = $this->service->anularPago($idPago, $request->user()->id, $datos['motivo']);
            return response()->json([
                'mensaje' => 'Pago anulado',
                'data' => $reserva,
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // POST /reservas/{id}/entregar-vuelto → entrega vuelto (registra pago NEGATIVO).
    public function entregarVuelto(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'monto' => 'required|numeric|min:0.01',
            'id_metodo_pago' => 'required|exists:metodos_pago,id_metodo',
        ]);

        try {
            // Registra un pago con monto NEGATIVO (R-DINERO-1).
            // `pagado` = SUM(pagos) → baja.
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
            // Ejemplo: no hay vuelto pendiente.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // PATCH /reservas/{id}/check-out-con-vuelto → check-out con decisión sobre vuelto.
    public function checkOutConVuelto(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'monto_final' => 'nullable|numeric|min:0',
            // Decisión: ENTREGADO, NO_RECLAMADO, OTRO.
            'decision_tipo' => 'required|in:ENTREGADO,NO_RECLAMADO,OTRO',
            'id_metodo_pago' => 'nullable|exists:metodos_pago,id_metodo',
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            // Ejecuta check-out + maneja el vuelto pendiente según decisión:
            // - ENTREGADO → registra pago negativo (vuelto).
            // - NO_RECLAMADO → deja el vuelto como saldo a favor del cliente.
            // - OTRO → requiere observación.
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

    // PATCH /reservas/{id}/check-out-con-deuda → check-out con decisión sobre deuda.
    public function checkOutConDeuda(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'monto_final' => 'nullable|numeric|min:0',
            // Decisión: PAGO (cobrar ahora) o NO_PAGO (queda como deuda).
            'decision_tipo' => 'required|in:PAGO,NO_PAGO',
            'monto_pago' => 'nullable|numeric|min:0.01',
            'id_metodo_pago' => 'nullable|exists:metodos_pago,id_metodo',
            'id_gravedad' => 'nullable|exists:gravedades_observacion,id_gravedad',
            'motivo' => 'nullable|string|max:255',
        ]);

        try {
            // Ejecuta check-out + maneja la deuda:
            // - PAGO → registra pago ahora.
            // - NO_PAGO → crea observación de tipo "Deuda" con gravedad y motivo.
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

    // ========================================================================
    // CONSUMOS MÚLTIPLES
    // ========================================================================

    // POST /reservas/{id}/consumos-multiple → agrega N consumos en una sola operación.
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
            // Transacción atómica: valida stock de TODOS antes de crear.
            // Si `cargar_a_cuenta = false` y hay saldo → error 422.
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
    // MÓDULO 09B — RESERVAS FUTURAS
    // ========================================================================

    // GET /reservas/disponibles?fecha=X&horas=Y
    // Devuelve habitaciones libres + con conflicto en un rango.
    public function reservasDisponibles(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'fecha' => 'required|date',
            'horas' => 'required|integer|min:1|max:24',
            'con_decoracion' => 'nullable|boolean',
        ]);

        // Calcula el rango de la reserva.
        $inicio = \Carbon\Carbon::parse($datos['fecha']);
        $fin = $inicio->copy()->addHours((int) $datos['horas']);

        // Si es con decoración, el proveedor necesita X horas antes.
        $horasAntesDecoracion = ($datos['con_decoracion'] ?? false)
            ? \App\Models\Configuracion::obtener('horas_antes_decoracion', 5)
            : 0;

        // Lista libres + con conflicto (ambas con datos del por qué no están libres).
        $libres = $this->service->listarDisponiblesEnRango($inicio, $fin, (int) $datos['horas'], $horasAntesDecoracion);
        $conflicto = $this->service->listarConConflictoEnRango($inicio, $fin, $horasAntesDecoracion);

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

    // GET /reservas/proximas → reservas dentro de la ventana de bloqueo (4h).
    public function proximas(): JsonResponse
    {
        $reservas = $this->service->listarProximasConAlerta();
        return response()->json([
            'total' => $reservas->count(),
            'reservas' => $reservas,
        ]);
    }

    // GET /reservas/hoy → reservas con fecha_entrada HOY.
    public function hoy(): JsonResponse
    {
        $reservas = $this->service->listarHoy();
        return response()->json([
            'total' => $reservas->count(),
            'reservas' => $reservas,
        ]);
    }

    // GET /reservas/proximas-check-in → reservas listas para check-in.
    public function proximasCheckIn(): JsonResponse
    {
        $reservas = $this->service->listarProximasCheckIn();
        return response()->json([
            'total' => $reservas->count(),
            'reservas' => $reservas,
        ]);
    }

    // ========================================================================
    // FILTRADO POR TIPO DE RESERVA
    // ========================================================================

    // GET /reservas/solo-reservas → solo códigos RES-.
    public function soloReservas(): JsonResponse
    {
        return response()->json($this->service->listarSoloReservas());
    }

    // GET /reservas/solo-walk-ins → solo códigos WK-.
    public function soloWalkIns(): JsonResponse
    {
        return response()->json($this->service->listarSoloWalkIns());
    }

    // GET /reservas/historial → historial completo (todas).
    public function historial(): JsonResponse
    {
        return response()->json($this->service->listarHistorialCompleto());
    }

    // ========================================================================
    // CHECK-IN DE RESERVA FUTURA
    // ========================================================================

    // GET /reservas/{id}/info-check-in → info completa para la pantalla.
    public function infoCheckIn(int $id): JsonResponse
    {
        try {
            // Devuelve: reserva, cliente, habitación, pagos, si puede hacer check-in, minutos tarde, etc.
            return response()->json($this->service->obtenerInfoCheckIn($id));
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // 404 si la reserva no existe.
            return response()->json(['mensaje' => 'Reserva no encontrada'], 404);
        }
    }

    // POST /reservas/{id}/check-in-validado → check-in con validaciones completas.
    public function checkInValidado(int $id): JsonResponse
    {
        try {
            // Valida: estado, que no tenga check-in previo, que la hab. no esté ocupada por otra.
            // MANTIENE la fecha_entrada ORIGINAL (regla 09B-15).
            // Crea registro_estadia con fecha original.
            // Registra la visita al cliente.
            $reserva = $this->service->checkInValidado($id, Auth::id());
            return response()->json([
                'mensaje' => 'Check-in realizado correctamente',
                'data' => $reserva,
            ]);
        } catch (\InvalidArgumentException $e) {
            // Ejemplos: la hab. está ocupada, o la reserva ya tiene check-in.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // GET /reservas/solo-decoraciones → solo códigos DEC-.
    public function soloDecoraciones(): JsonResponse
    {
        return response()->json($this->service->listarSoloDecoraciones());
    }
}
