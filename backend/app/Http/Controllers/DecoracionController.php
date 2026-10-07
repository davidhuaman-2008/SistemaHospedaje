<?php

namespace App\Http\Controllers;

use App\Services\DecoracionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DecoracionController extends Controller
{
    // Inyecta el Service que maneja las decoraciones aplicadas a reservas.
    public function __construct(private DecoracionService $service) {}

    // GET /decoraciones → lista TODAS las decoraciones.
    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    // GET /decoraciones/activas → solo programadas + en-proceso.
    public function activas(): JsonResponse
    {
        return response()->json($this->service->listarActivas());
    }

    // GET /decoraciones/proximas → las que se vienen pronto.
    public function proximas(): JsonResponse
    {
        return response()->json($this->service->listarProximas());
    }

    // GET /decoraciones/por-reserva/{idReserva} → las de una reserva.
    public function porReserva(int $idReserva): JsonResponse
    {
        return response()->json($this->service->listarPorReserva($idReserva));
    }

    // GET /decoraciones/por-proveedor/{idProveedor} → las de un proveedor.
    public function porProveedor(int $idProveedor): JsonResponse
    {
        return response()->json($this->service->listarPorProveedor($idProveedor));
    }

    // GET /decoraciones/{id} → una decoración con sus relaciones.
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    // POST /decoraciones → aplica una decoración a una reserva.
    public function store(Request $request): JsonResponse
    {
        // Valida. `id_reserva` e `id_paquete` son obligatorios y deben existir.
        $datos = $request->validate([
            'id_reserva' => 'required|exists:reservas,id_reserva',
            'id_paquete' => 'required|exists:paquetes_decoracion,id_paquete',
            'fecha_programada' => 'nullable|date',
            'adelanto' => 'nullable|numeric|min:0',
            'frase_personalizada' => 'nullable|string|max:500',
            'musica' => 'nullable|string|max:100',
            'notas' => 'nullable|string',
        ]);

        try {
            // El Service calcula precio, ganancias, crea CuentaPagar y devuelve la decoración.
            $decoracion = $this->service->crear($datos, Auth::id());
            return response()->json([
                'mensaje' => 'Decoracion creada correctamente',
                'data' => $decoracion,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo de error: reserva sin anticipación de 24h, o reserva ya decorada.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // PUT /decoraciones/{id} → actualiza datos personalizables.
    public function update(Request $request, int $id): JsonResponse
    {
        // Solo permite editar los campos personalizables.
        // NO se puede cambiar de reserva ni de paquete.
        $datos = $request->validate([
            'fecha_programada' => 'nullable|date',
            'frase_personalizada' => 'nullable|string|max:500',
            'musica' => 'nullable|string|max:100',
            'notas' => 'nullable|string',
        ]);

        try {
            return response()->json([
                'mensaje' => 'Decoracion actualizada',
                'data' => $this->service->actualizar($id, $datos),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // PATCH /decoraciones/{id}/estado → cambia el estado (programada → en-proceso → finalizada).
    public function cambiarEstado(Request $request, int $id): JsonResponse
    {
        // Solo permite 3 estados. `cancelada` se maneja por `anular()`.
        $datos = $request->validate([
            'estado' => 'required|in:programada,en-proceso,finalizada',
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            return response()->json([
                'mensaje' => 'Estado actualizado',
                'data' => $this->service->cambiarEstado($id, $datos['estado'], $datos['observaciones'] ?? null),
            ]);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo: intentar saltar de programada a finalizada sin pasar por en-proceso.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // POST /decoraciones/{id}/adelanto → registra un adelanto al proveedor.
    public function registrarAdelanto(Request $request, int $id): JsonResponse
    {
        // Valida que el monto sea positivo y que el método de pago exista.
        $datos = $request->validate([
            'monto' => 'required|numeric|min:0.01',
            'id_metodo_pago' => 'required|exists:metodos_pago,id_metodo',
        ]);

        try {
            return response()->json([
                'mensaje' => 'Adelanto registrado',
                'data' => $this->service->registrarAdelanto(
                    $id,
                    (float) $datos['monto'],       // cast explícito a float
                    (int) $datos['id_metodo_pago'], // cast explícito a int
                    Auth::id()                      // quién lo registra
                ),
            ]);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo: adelanto mayor al saldo pendiente.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // PATCH /decoraciones/{id}/anular → anula la decoración (guarda motivo).
    public function anular(Request $request, int $id): JsonResponse
    {
        // El motivo es OBLIGATORIO (queda en auditoría).
        $datos = $request->validate([
            'motivo' => 'required|string|max:255',
        ]);

        try {
            return response()->json([
                'mensaje' => 'Decoracion anulada',
                'data' => $this->service->anular($id, Auth::id(), $datos['motivo']),
            ]);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo: intentar anular una decoración ya finalizada.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }

    // DELETE /decoraciones/{id} → elimina físicamente (solo si no tiene pagos).
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->service->eliminar($id);
            return response()->json(['mensaje' => 'Decoracion eliminada']);
        } catch (\InvalidArgumentException $e) {
            // Ejemplo: no se puede eliminar si ya tiene pagos registrados.
            return response()->json(['mensaje' => $e->getMessage()], 422);
        }
    }
}
