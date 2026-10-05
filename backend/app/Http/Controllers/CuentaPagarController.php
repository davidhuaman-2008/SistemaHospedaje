<?php

namespace App\Http\Controllers;

use App\Services\CuentaPagarService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CuentaPagarController extends Controller
{
    public function __construct(private CuentaPagarService $service) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    public function pendientes(): JsonResponse
    {
        return response()->json($this->service->listarPendientes());
    }

    public function porProveedor(int $idProveedor): JsonResponse
    {
        return response()->json($this->service->listarPorProveedor($idProveedor));
    }

    public function vencidas(): JsonResponse
    {
        return response()->json($this->service->listarVencidas());
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'id_proveedor' => 'required|exists:proveedores,id_proveedor',
            'id_reserva' => 'nullable|exists:reservas,id_reserva',
            'id_decoracion' => 'nullable|integer',
            'concepto' => 'required|string|max:255',
            'monto' => 'required|numeric|min:0.01',
            'fecha_emision' => 'nullable|date',
            'fecha_vencimiento' => 'nullable|date|after_or_equal:fecha_emision',
            'notas' => 'nullable|string',
        ]);

        return response()->json([
            'mensaje' => 'Cuenta creada',
            'data' => $this->service->crear($datos, Auth::id()),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'concepto' => 'sometimes|string|max:255',
            'fecha_vencimiento' => 'nullable|date',
            'notas' => 'nullable|string',
        ]);

        try {
            return response()->json([
                'mensaje' => 'Cuenta actualizada',
                'data' => $this->service->actualizar($id, $datos),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function anular(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'motivo' => 'required|string|max:500',
        ]);

        try {
            return response()->json([
                'mensaje' => 'Cuenta anulada',
                'data' => $this->service->anular($id, Auth::id(), $datos['motivo']),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function registrarPago(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'monto' => 'required|numeric|min:0.01',
            'id_metodo_pago' => 'required|exists:metodos_pago,id_metodo',
            'referencia' => 'nullable|string|max:100',
            'observaciones' => 'nullable|string',
        ]);

        try {
            return response()->json([
                'mensaje' => 'Pago registrado',
                'data' => $this->service->registrarPago($id, $datos, Auth::id()),
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    public function anularPago(Request $request, int $id, int $idPago): JsonResponse
    {
        $datos = $request->validate([
            'motivo' => 'required|string|max:500',
        ]);

        try {
            return response()->json([
                'mensaje' => 'Pago anulado',
                'data' => $this->service->anularPago($idPago, Auth::id(), $datos['motivo']),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }
}