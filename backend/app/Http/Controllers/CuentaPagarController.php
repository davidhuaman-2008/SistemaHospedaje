<?php

namespace App\Http\Controllers;

use App\Services\CuentaPagarService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CuentaPagarController extends Controller
{
    // Inyecta el Service que maneja las cuentas por pagar a proveedores.
    public function __construct(private CuentaPagarService $service) {}

    // GET /cuentas-por-pagar → lista TODAS las cuentas.
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /cuentas-por-pagar/pendientes → solo las que tienen saldo > 0.
    public function pendientes(): JsonResponse
    {
        return response()->json($this->service->listarPendientes());
    }

    // GET /cuentas-por-pagar/por-proveedor/{idProveedor} → filtradas por proveedor.
    public function porProveedor(int $idProveedor): JsonResponse
    {
        return response()->json($this->service->listarPorProveedor($idProveedor));
    }

    // GET /cuentas-por-pagar/vencidas → solo las que pasaron su fecha_vencimiento.
    public function vencidas(): JsonResponse
    {
        return response()->json($this->service->listarVencidas());
    }

    // GET /cuentas-por-pagar/{id} → una cuenta con sus pagos.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /cuentas-por-pagar → crea una cuenta por pagar manualmente.
    public function store(Request $request): JsonResponse
    {
        // Valida. `id_proveedor` es obligatorio y debe existir.
        // `fecha_vencimiento` no puede ser anterior a `fecha_emision`.
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

        // Pasa el ID del usuario autenticado (Auth::id()) al Service.
        return response()->json([
            'mensaje' => 'Cuenta creada',
            'data' => $this->service->crear($datos, Auth::id()),
        ], 201);
    }

    // PUT /cuentas-por-pagar/{id} → actualiza datos básicos.
    public function update(Request $request, int $id): JsonResponse
    {
        // Solo permite editar concepto, fecha_vencimiento y notas.
        // NO se puede cambiar el monto ni el proveedor.
        $datos = $request->validate([
            'concepto' => 'sometimes|string|max:255',
            'fecha_vencimiento' => 'nullable|date',
            'notas' => 'nullable|string',
        ]);

        // try/catch para capturar reglas de negocio del Service.
        // Si el Service lanza InvalidArgumentException → responde 422 con el motivo.
        try {
            return response()->json([
                'mensaje' => 'Cuenta actualizada',
                'data' => $this->service->actualizar($id, $datos),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // PATCH /cuentas-por-pagar/{id}/anular → anula la cuenta (no la borra).
    public function anular(Request $request, int $id): JsonResponse
    {
        // El motivo es OBLIGATORIO (queda en auditoría).
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

    // POST /cuentas-por-pagar/{id}/pagos → registra un pago al proveedor.
    public function registrarPago(Request $request, int $id): JsonResponse
    {
        // Valida. `monto` debe ser positivo. `id_metodo_pago` debe existir.
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
            // Ejemplo de error: el monto excede el saldo pendiente.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // DELETE /cuentas-por-pagar/{id}/pagos/{idPago} → anula un pago.
    public function anularPago(Request $request, int $id, int $idPago): JsonResponse
    {
        // El motivo es OBLIGATORIO.
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
