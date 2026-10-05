<?php

namespace App\Services;

use App\Models\CuentaPagar;
use App\Models\EstadoCuentaPagar;
use App\Models\PagoProveedor;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CuentaPagarService
{
    public function listar(): Collection
    {
        return CuentaPagar::with([
            'proveedor', 'estado', 'reserva', 'usuarioCreacion',
        ])
            ->orderByDesc('id_cuenta')
            ->get();
    }

    public function listarPendientes(): Collection
    {
        return CuentaPagar::with(['proveedor', 'estado', 'reserva'])
            ->whereHas('estado', function ($q) {
                $q->whereIn('slug', ['pendiente', 'parcial']);
            })
            ->orderBy('fecha_vencimiento')
            ->get();
    }

    public function listarPorProveedor(int $idProveedor): Collection
    {
        return CuentaPagar::with(['proveedor', 'estado', 'reserva'])
            ->where('id_proveedor', $idProveedor)
            ->orderByDesc('id_cuenta')
            ->get();
    }

    public function listarVencidas(): Collection
    {
        return CuentaPagar::with(['proveedor', 'estado'])
            ->whereHas('estado', function ($q) {
                $q->whereIn('slug', ['pendiente', 'parcial']);
            })
            ->where('fecha_vencimiento', '<', now())
            ->orderBy('fecha_vencimiento')
            ->get();
    }

    public function obtener(int $id): CuentaPagar
    {
        return CuentaPagar::with([
            'proveedor', 'estado', 'reserva', 'usuarioCreacion', 'usuarioAnulacion',
            'pagos.metodoPago', 'pagos.usuario',
        ])->findOrFail($id);
    }

    /**
     * Crea una cuenta por pagar.
     * El estado inicial es "Pendiente".
     */
    public function crear(array $datos, int $idUsuario): CuentaPagar
    {
        return DB::transaction(function () use ($datos, $idUsuario) {
            $estadoPendiente = EstadoCuentaPagar::where('slug', 'pendiente')->firstOrFail();

            $fechaEmision = isset($datos['fecha_emision'])
                ? Carbon::parse($datos['fecha_emision'])
                : now();

            $fechaVencimiento = isset($datos['fecha_vencimiento'])
                ? Carbon::parse($datos['fecha_vencimiento'])
                : $fechaEmision->copy()->addDays(30);

            $monto = (float) $datos['monto'];

            return CuentaPagar::create([
                'id_proveedor' => $datos['id_proveedor'],
                'id_estado_cuenta' => $estadoPendiente->id_estado_cuenta,
                'id_reserva' => $datos['id_reserva'] ?? null,
                'id_decoracion' => $datos['id_decoracion'] ?? null,
                'concepto' => $datos['concepto'],
                'monto' => $monto,
                'monto_pagado' => 0,
                'saldo' => $monto,
                'fecha_emision' => $fechaEmision,
                'fecha_vencimiento' => $fechaVencimiento,
                'id_usuario_creacion' => $idUsuario,
                'notas' => $datos['notas'] ?? null,
            ])->load(['proveedor', 'estado', 'reserva', 'usuarioCreacion']);
        });
    }

    /**
     * Actualiza una cuenta (solo concepto/notas/fecha_vencimiento).
     * NO se puede cambiar el monto (anular y crear nueva).
     */
    public function actualizar(int $id, array $datos): CuentaPagar
    {
        return DB::transaction(function () use ($id, $datos) {
            $cuenta = CuentaPagar::findOrFail($id);

            // Bloquear si está en estado final
            if ($cuenta->estado->es_estado_final) {
                throw new \InvalidArgumentException(
                    'No se puede editar una cuenta en estado ' . $cuenta->estado->nombre . '.'
                );
            }

            $cuenta->update([
                'concepto' => $datos['concepto'] ?? $cuenta->concepto,
                'fecha_vencimiento' => isset($datos['fecha_vencimiento'])
                    ? Carbon::parse($datos['fecha_vencimiento'])
                    : $cuenta->fecha_vencimiento,
                'notas' => $datos['notas'] ?? $cuenta->notas,
            ]);

            return $cuenta->fresh(['proveedor', 'estado', 'reserva']);
        });
    }

    /**
     * Anula una cuenta. Solo se puede si no tiene pagos activos.
     */
    public function anular(int $id, int $idUsuario, string $motivo): CuentaPagar
    {
        return DB::transaction(function () use ($id, $idUsuario, $motivo) {
            $cuenta = CuentaPagar::findOrFail($id);

            if ($cuenta->estado->es_estado_final) {
                throw new \InvalidArgumentException(
                    'Esta cuenta ya está en estado ' . $cuenta->estado->nombre . '.'
                );
            }

            // Verificar que no tenga pagos activos
            $pagosActivos = $cuenta->pagos()->where('anulado', false)->count();
            if ($pagosActivos > 0) {
                throw new \InvalidArgumentException(
                    "La cuenta tiene {$pagosActivos} pago(s) activo(s). Anulá los pagos primero."
                );
            }

            $estadoAnulada = EstadoCuentaPagar::where('slug', 'anulada')->firstOrFail();

            $cuenta->update([
                'id_estado_cuenta' => $estadoAnulada->id_estado_cuenta,
                'id_usuario_anulacion' => $idUsuario,
                'fecha_anulacion' => now(),
                'motivo_anulacion' => $motivo,
            ]);

            return $cuenta->fresh(['proveedor', 'estado']);
        });
    }

    /**
     * Registra un pago a la cuenta.
     */
    public function registrarPago(int $idCuenta, array $datos, int $idUsuario): CuentaPagar
    {
        return DB::transaction(function () use ($idCuenta, $datos, $idUsuario) {
            $cuenta = CuentaPagar::findOrFail($idCuenta);

            if ($cuenta->estado->es_estado_final) {
                throw new \InvalidArgumentException(
                    'No se puede pagar una cuenta en estado ' . $cuenta->estado->nombre . '.'
                );
            }

            $monto = (float) $datos['monto'];
            if ($monto <= 0) {
                throw new \InvalidArgumentException('El monto debe ser mayor a 0.');
            }

            if ($monto > $cuenta->saldo + 0.01) {
                throw new \InvalidArgumentException(
                    "El monto (S/ {$monto}) excede el saldo pendiente (S/ {$cuenta->saldo})."
                );
            }

            PagoProveedor::create([
                'id_cuenta' => $idCuenta,
                'monto' => $monto,
                'id_metodo_pago' => $datos['id_metodo_pago'],
                'fecha_pago' => now(),
                'id_usuario' => $idUsuario,
                'referencia' => $datos['referencia'] ?? null,
                'observaciones' => $datos['observaciones'] ?? null,
            ]);

            // TODO: Módulo 11 (Caja) — Si el método es_de_caja=true, registrar egreso en movimientos_caja

            $this->recalcular($idCuenta);

            return $cuenta->fresh([
                'proveedor', 'estado', 'reserva',
                'pagos.metodoPago', 'pagos.usuario',
            ]);
        });
    }

    /**
     * Anula un pago. Recalcula la cuenta.
     */
    public function anularPago(int $idPago, int $idUsuario, string $motivo): CuentaPagar
    {
        return DB::transaction(function () use ($idPago, $idUsuario, $motivo) {
            $pago = PagoProveedor::findOrFail($idPago);

            if ($pago->anulado) {
                throw new \InvalidArgumentException('Este pago ya está anulado.');
            }

            $pago->update([
                'anulado' => true,
                'id_usuario_anulacion' => $idUsuario,
                'fecha_anulacion' => now(),
                'motivo_anulacion' => $motivo,
            ]);

            // TODO: Módulo 11 (Caja) — Anular el egreso correspondiente

            $idCuenta = $pago->id_cuenta;
            $this->recalcular($idCuenta);

            return CuentaPagar::with([
                'proveedor', 'estado', 'reserva',
                'pagos.metodoPago', 'pagos.usuario',
            ])->findOrFail($idCuenta);
        });
    }

    /**
     * Recalcula monto_pagado, saldo y estado de una cuenta.
     */
    public function recalcular(int $idCuenta): CuentaPagar
    {
        return DB::transaction(function () use ($idCuenta) {
            $cuenta = CuentaPagar::findOrFail($idCuenta);

            // Si está en estado final (Pagada/Anulada) → no recalcular
            if ($cuenta->estado->es_estado_final) {
                return $cuenta;
            }

            $totalPagado = PagoProveedor::where('id_cuenta', $idCuenta)
                ->where('anulado', false)
                ->sum('monto');

            $saldo = max(0, (float) $cuenta->monto - (float) $totalPagado);

            // Determinar nuevo estado
            $nuevoEstado = $this->determinarEstado($cuenta->monto, $totalPagado);

            $cuenta->update([
                'monto_pagado' => $totalPagado,
                'saldo' => $saldo,
                'id_estado_cuenta' => $nuevoEstado->id_estado_cuenta,
            ]);

            return $cuenta->fresh(['proveedor', 'estado']);
        });
    }

    /**
     * Determina el estado según monto y pagado.
     */
    private function determinarEstado(float $monto, float $totalPagado): EstadoCuentaPagar
    {
        if ($totalPagado <= 0.01) {
            return EstadoCuentaPagar::where('slug', 'pendiente')->firstOrFail();
        }

        if ($totalPagado >= $monto - 0.01) {
            return EstadoCuentaPagar::where('slug', 'pagada')->firstOrFail();
        }

        return EstadoCuentaPagar::where('slug', 'parcial')->firstOrFail();
    }

    /**
     * Método helper para R11 (Módulo 10 Decoraciones).
     * Genera una CuentaPagar automáticamente.
     */
    public function generarDesdeReserva(
        int $idProveedor,
        int $idReserva,
        ?int $idDecoracion,
        string $concepto,
        float $monto,
        int $idUsuario
    ): CuentaPagar {
        return $this->crear([
            'id_proveedor' => $idProveedor,
            'id_reserva' => $idReserva,
            'id_decoracion' => $idDecoracion,
            'concepto' => $concepto,
            'monto' => $monto,
        ], $idUsuario);
    }
}