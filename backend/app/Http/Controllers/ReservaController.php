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
}