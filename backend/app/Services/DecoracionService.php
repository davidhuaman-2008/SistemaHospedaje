<?php

namespace App\Services;

use App\Models\Configuracion;
use App\Models\CuentaPagar;
use App\Models\Decoracion;
use App\Models\PaqueteDecoracion;
use App\Models\Reserva;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DecoracionService
{
    public function __construct(
        private CuentaPagarService $cuentaPagarService,
    ) {}

    public function listar(): Collection
    {
        return Decoracion::with([
            'reserva.cliente', 'reserva.habitacion.tipo',
            'paquete', 'proveedor', 'cuentaPagar', 'usuarioCreacion',
        ])
            ->orderByDesc('id_decoracion')
            ->get();
    }

    public function listarActivas(): Collection
    {
        return Decoracion::with([
            'reserva.cliente', 'reserva.habitacion.tipo',
            'paquete', 'proveedor', 'cuentaPagar',
        ])
            ->whereIn('estado', ['programada', 'en-proceso'])
            ->orderBy('fecha_programada')
            ->get();
    }

    public function listarProximas(): Collection
    {
        $hoy = Carbon::today();
        $manana = Carbon::tomorrow();

        return Decoracion::with(['reserva.cliente', 'reserva.habitacion.tipo', 'paquete', 'proveedor'])
            ->whereIn('estado', ['programada', 'en-proceso'])
            ->whereBetween('fecha_programada', [$hoy->copy()->startOfDay(), $manana->copy()->endOfDay()])
            ->orderBy('fecha_programada')
            ->get();
    }

    public function listarPorReserva(int $idReserva): Collection
    {
        return Decoracion::with(['paquete', 'proveedor', 'cuentaPagar'])
            ->where('id_reserva', $idReserva)
            ->orderByDesc('id_decoracion')
            ->get();
    }

    public function listarPorProveedor(int $idProveedor): Collection
    {
        return Decoracion::with(['reserva.cliente', 'reserva.habitacion.tipo', 'paquete', 'cuentaPagar'])
            ->where('id_proveedor', $idProveedor)
            ->orderByDesc('fecha_programada')
            ->get();
    }

    public function obtener(int $id): Decoracion
    {
        return Decoracion::with([
            'reserva.cliente', 'reserva.habitacion.tipo', 'reserva.habitacion.piso',
            'paquete.proveedor', 'proveedor',
            'cuentaPagar.pagos.metodoPago',
            'usuarioCreacion', 'usuarioAnulacion',
        ])->findOrFail($id);
    }

    /**
     * Crea una decoracion para una reserva.
     * Toma los valores del paquete (snapshot).
     * Crea CuentaPagar automatica al proveedor.
     */
    public function crear(array $datos, int $idUsuario): Decoracion
    {
        return DB::transaction(function () use ($datos, $idUsuario) {
            $reserva = Reserva::with('habitacion')->findOrFail($datos['id_reserva']);

            // Verificar que no haya otra decoracion activa
            $existente = Decoracion::where('id_reserva', $reserva->id_reserva)
                ->whereIn('estado', ['programada', 'en-proceso'])
                ->exists();

            if ($existente) {
                throw new \InvalidArgumentException(
                    'Esta reserva ya tiene una decoracion activa. Anulala antes de crear una nueva.'
                );
            }

            $paquete = PaqueteDecoracion::with('proveedor')->findOrFail($datos['id_paquete']);

            // Calcular horas extra (si la reserva tiene mas horas que el paquete)
            $horasSolicitadas = (int) $reserva->horas_base;
            $horasIncluidas = (int) $paquete->horas_incluidas;
            $horasExtra = max(0, $horasSolicitadas - $horasIncluidas);
            $precioHoraAdicional = (float) $paquete->precio_hora_adicional;
            $montoExtra = $horasExtra * $precioHoraAdicional;

            // Precio base del paquete (8h)
            $precioTotal = (float) $paquete->precio_total + $montoExtra;
            $gananciaLocal = (float) $paquete->ganancia_local + $montoExtra; // el extra va al hospedaje
            $gananciaProveedor = (float) $paquete->ganancia_proveedor; // el proveedor cobra lo mismo

            if (abs($precioTotal - ($gananciaLocal + $gananciaProveedor)) > 0.01) {
                throw new \InvalidArgumentException(
                    "Error en el paquete: precio_total != ganancia_local + ganancia_proveedor"
                );
            }

            $adelanto = (float) ($datos['adelanto'] ?? 0);
            $saldo = max(0, $gananciaProveedor - $adelanto);

            $fechaProgramada = isset($datos['fecha_programada'])
                ? Carbon::parse($datos['fecha_programada'])
                : Carbon::parse($reserva->fecha_entrada);

            // 5h antes de la fecha programada es cuando el proveedor debe empezar
            $horasAntes = Configuracion::obtener('horas_antes_decoracion', 5);
            $fechaInicioPreparacion = $fechaProgramada->copy()->subHours($horasAntes);

            $decoracion = Decoracion::create([
                'id_reserva' => $reserva->id_reserva,
                'id_paquete' => $paquete->id_paquete,
                'id_proveedor' => $paquete->id_proveedor,
                'estado' => 'programada',
                'fecha_programada' => $fechaProgramada,
                'fecha_inicio_preparacion' => $fechaInicioPreparacion,
                'precio_total' => $precioTotal,
                'ganancia_local' => $gananciaLocal,
                'ganancia_proveedor' => $gananciaProveedor,
                'adelanto' => $adelanto,
                'saldo' => $saldo,
                'frase_personalizada' => $datos['frase_personalizada'] ?? null,
                'musica' => $datos['musica'] ?? null,
                'notas' => $datos['notas'] ?? null,
                'id_usuario_creacion' => $idUsuario,
            ]);

            // Crear CuentaPagar automatica al proveedor
            if ($paquete->id_proveedor && $gananciaProveedor > 0) {
                $cuenta = $this->cuentaPagarService->crear([
                    'id_proveedor' => $paquete->id_proveedor,
                    'id_reserva' => $reserva->id_reserva,
                    'id_decoracion' => $decoracion->id_decoracion,
                    'concepto' => 'Decoracion: ' . $paquete->nombre . ' - Reserva ' . $reserva->codigo_reserva,
                    'monto' => $gananciaProveedor,
                    'fecha_emision' => $fechaProgramada->toDateString(),
                    'fecha_vencimiento' => $fechaProgramada->copy()->addDays(15)->toDateString(),
                    'notas' => 'Generado automaticamente desde decoracion #' . $decoracion->id_decoracion,
                ], $idUsuario);

                $decoracion->update(['id_cuenta_pagar' => $cuenta->id_cuenta]);
            }

            return $decoracion->fresh(['reserva.cliente', 'reserva.habitacion.tipo', 'paquete', 'proveedor', 'cuentaPagar']);
        });
    }

    public function actualizar(int $id, array $datos): Decoracion
    {
        $decoracion = Decoracion::findOrFail($id);

        if (in_array($decoracion->estado, ['finalizada', 'cancelada'])) {
            throw new \InvalidArgumentException(
                'No se puede editar una decoracion ' . $decoracion->estado . '.'
            );
        }

        $decoracion->update([
            'frase_personalizada' => $datos['frase_personalizada'] ?? $decoracion->frase_personalizada,
            'musica' => $datos['musica'] ?? $decoracion->musica,
            'notas' => $datos['notas'] ?? $decoracion->notas,
            'fecha_programada' => isset($datos['fecha_programada'])
                ? Carbon::parse($datos['fecha_programada'])
                : $decoracion->fecha_programada,
        ]);

        return $decoracion->fresh(['reserva.cliente', 'paquete', 'proveedor', 'cuentaPagar']);
    }

    /**
     * Cambia el estado: programada -> en-proceso -> finalizada
     */
    public function cambiarEstado(int $id, string $nuevoEstado, ?string $observaciones = null): Decoracion
    {
        return DB::transaction(function () use ($id, $nuevoEstado, $observaciones) {
            $decoracion = Decoracion::findOrFail($id);

            if (!array_key_exists($nuevoEstado, Decoracion::estados())) {
                throw new \InvalidArgumentException('Estado invalido: ' . $nuevoEstado);
            }

            $updateData = ['estado' => $nuevoEstado];

            if ($nuevoEstado === 'en-proceso' && !$decoracion->fecha_inicio) {
                $updateData['fecha_inicio'] = now();
            }

            if ($nuevoEstado === 'finalizada' && !$decoracion->fecha_fin) {
                $updateData['fecha_fin'] = now();
            }

            if ($observaciones) {
                $updateData['notas'] = ($decoracion->notas ? $decoracion->notas . "\n" : '') . $observaciones;
            }

            $decoracion->update($updateData);

            return $decoracion->fresh(['reserva.cliente', 'paquete', 'proveedor', 'cuentaPagar']);
        });
    }

    /**
     * Registra un adelanto al proveedor (reduce el saldo).
     */
    public function registrarAdelanto(int $id, float $monto, int $idMetodoPago, int $idUsuario): Decoracion
    {
        return DB::transaction(function () use ($id, $monto, $idMetodoPago, $idUsuario) {
            $decoracion = Decoracion::findOrFail($id);

            if ($monto <= 0) {
                throw new \InvalidArgumentException('El monto debe ser mayor a 0.');
            }

            if ($monto > $decoracion->saldo + 0.01) {
                throw new \InvalidArgumentException(
                    "El monto (S/ {$monto}) excede el saldo pendiente (S/ {$decoracion->saldo})."
                );
            }

            // Registrar el pago en la CuentaPagar (esto ya maneja el saldo de la cuenta)
            if ($decoracion->id_cuenta_pagar) {
                $this->cuentaPagarService->registrarPago(
                    $decoracion->id_cuenta_pagar,
                    [
                        'monto' => $monto,
                        'id_metodo_pago' => $idMetodoPago,
                        'observaciones' => 'Adelanto de decoracion #' . $decoracion->id_decoracion,
                    ],
                    $idUsuario
                );
            }

            // Actualizar el adelanto y saldo de la decoracion
            $decoracion->adelanto = (float) $decoracion->adelanto + $monto;
            $decoracion->saldo = max(0, (float) $decoracion->ganancia_proveedor - (float) $decoracion->adelanto);
            $decoracion->save();

            return $decoracion->fresh(['reserva.cliente', 'paquete', 'proveedor', 'cuentaPagar']);
        });
    }

    /**
     * Anula la decoracion. Cancela la CuentaPagar si no tiene pagos.
     */
    public function anular(int $id, int $idUsuario, string $motivo): Decoracion
    {
        return DB::transaction(function () use ($id, $idUsuario, $motivo) {
            $decoracion = Decoracion::findOrFail($id);

            if (in_array($decoracion->estado, ['finalizada', 'cancelada'])) {
                throw new \InvalidArgumentException(
                    'Esta decoracion ya esta ' . $decoracion->estado . '.'
                );
            }

            $decoracion->update([
                'estado' => 'cancelada',
                'id_usuario_anulacion' => $idUsuario,
                'fecha_anulacion' => now(),
                'motivo_anulacion' => $motivo,
            ]);

            // Anular CuentaPagar si no tiene pagos activos
            if ($decoracion->id_cuenta_pagar) {
                $cuenta = CuentaPagar::find($decoracion->id_cuenta_pagar);
                if ($cuenta && !$cuenta->estado->es_estado_final) {
                    $pagosActivos = $cuenta->pagos()->where('anulado', false)->count();
                    if ($pagosActivos === 0) {
                        $this->cuentaPagarService->anular(
                            $cuenta->id_cuenta,
                            $idUsuario,
                            'Anulada por cancelacion de decoracion: ' . $motivo
                        );
                    }
                }
            }

            return $decoracion->fresh(['reserva.cliente', 'paquete', 'proveedor', 'cuentaPagar']);
        });
    }

    public function eliminar(int $id): void
    {
        DB::transaction(function () use ($id) {
            $decoracion = Decoracion::findOrFail($id);

            if (in_array($decoracion->estado, ['en-proceso', 'finalizada'])) {
                throw new \InvalidArgumentException(
                    'No se puede eliminar una decoracion ' . $decoracion->estado . '.'
                );
            }

            if ($decoracion->id_cuenta_pagar) {
                $cuenta = CuentaPagar::find($decoracion->id_cuenta_pagar);
                if ($cuenta && !$cuenta->estado->es_estado_final) {
                    $pagosActivos = $cuenta->pagos()->where('anulado', false)->count();
                    if ($pagosActivos === 0) {
                        $this->cuentaPagarService->anular(
                            $cuenta->id_cuenta,
                            auth()->id() ?? 1,
                            'Eliminada desde decoracion'
                        );
                    }
                }
            }

            $decoracion->delete();
        });
    }
}