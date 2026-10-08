<?php

namespace App\Services;

use App\Models\Cliente;
use App\Models\Configuracion;
use Carbon\Carbon;

/**
 * Servicio centralizado de descuentos automaticos + manuales.
 *
 * R1: NADA hardcodeado. Los porcentajes vienen de la tabla `configuraciones`.
 * Los descuentos por nivel vienen de `clientes_niveles.descuento`.
 *
 * Reglas:
 * - NO acumulativos por defecto (se aplica SOLO EL MAYOR)
 * - Si `descuento_aplica_a = 'suma'`, se suman con tope de 100%
 * - Descuentos MANUALES: el recepcionista puede activar manualmente un descuento
 *   (aniversario/cumpleanos) si el cliente presenta constancia. Se registra en BD.
 */
class DescuentoService
{
    /**
     * Retorna las configuraciones de descuentos para que el frontend las consuma.
     */
    public function obtenerConfiguraciones(): array
    {
        return [
            'descuento_cumpleanos_porcentaje' => (float) Configuracion::obtener('descuento_cumpleanos_porcentaje', 10),
            'descuento_aniversario_porcentaje' => (float) Configuracion::obtener('descuento_aniversario_porcentaje', 15),
            'descuento_cumpleanos_activo' => (bool) Configuracion::obtener('descuento_cumpleanos_activo', true),
            'descuento_aniversario_activo' => (bool) Configuracion::obtener('descuento_aniversario_activo', true),
            'descuento_aplica_a' => (string) Configuracion::obtener('descuento_aplica_a', 'mayor'),
        ];
    }

    /**
     * Retorna las opciones de descuento MANUAL disponibles para el frontend.
     */
    public function obtenerManuales(): array
    {
        $habilitado = (bool) Configuracion::obtener('descuento_manual_habilitado', true);
        $motivoRequerido = (bool) Configuracion::obtener('descuento_manual_motivo_requerido', true);
        $maxPorcentaje = (float) Configuracion::obtener('descuento_manual_max_porcentaje', 20);

        $opciones = [];

        if ($habilitado) {
            // Cumpleanos NO se ofrece como manual porque ya se aplica automatico
            // si la fecha de nacimiento coincide con hoy. Solo ofrecemos aniversario
            // (requiere verificacion de constancia fisica).
            $opciones[] = [
                'tipo' => 'aniversario',
                'label' => 'Aniversario',
                'emoji' => '💍',
                'porcentaje' => (float) Configuracion::obtener('descuento_aniversario_porcentaje', 15),
                'descripcion' => 'Aplicar si el cliente presenta constancia de matrimonio con fecha de hoy',
            ];
        }

        return [
            'habilitado' => $habilitado,
            'motivo_requerido' => $motivoRequerido,
            'max_porcentaje' => $maxPorcentaje,
            'opciones' => $opciones,
        ];
    }

    /**
     * Calcula el descuento automatico a aplicar sobre el monto de habitacion.
     *
     * @param Cliente|null $cliente  Cliente existente O cliente virtual (recien creado en el form)
     * @param Carbon $fechaEntrada   Fecha/hora de entrada de la reserva
     * @param float $montoHabitacion Monto base de la habitacion (sin descuento)
     * @param array $manualesAplicar Opcional: ['aniversario' => true, 'cumpleanos' => true]
     *                                para forzar descuentos manuales
     * @return array{porcentaje: float, motivo: string|null, monto: float, tipo: string|null}
     */
    public function calcular(
        ?Cliente $cliente,
        Carbon $fechaEntrada,
        float $montoHabitacion,
        array $manualesAplicar = []
    ): array {
        $opciones = [];
        $config = $this->obtenerConfiguraciones();

        // ====================================================================
        // 1. Descuento por NIVEL
        // ====================================================================
        if ($cliente && $cliente->nivel && (float) $cliente->nivel->descuento > 0) {
            $opciones[] = [
                'porcentaje' => (float) $cliente->nivel->descuento,
                'motivo' => 'Nivel ' . $cliente->nivel->nombre,
                'tipo' => 'nivel',
            ];
        }

        if ($cliente) {
            // ================================================================
            // 2. Descuento por CUMPLEANOS
            // ================================================================
            $manualCumple = !empty($manualesAplicar['cumpleanos']);
            $automaticoCumple = $config['descuento_cumpleanos_activo']
                && $cliente->fecha_nacimiento
                && $this->mismaFechaDiaMes(Carbon::parse($cliente->fecha_nacimiento), $fechaEntrada);

            if ($automaticoCumple || $manualCumple) {
                $opciones[] = [
                    'porcentaje' => $config['descuento_cumpleanos_porcentaje'],
                    'motivo' => 'Cumpleanos' . ($manualCumple && !$automaticoCumple ? ' (manual)' : ''),
                    'tipo' => 'cumpleanos',
                ];
            }

            // ================================================================
            // 3. Descuento por ANIVERSARIO
            // ================================================================
            $manualAniv = !empty($manualesAplicar['aniversario']);
            $automaticoAniv = $config['descuento_aniversario_activo']
                && $cliente->casado
                && $cliente->fecha_aniversario
                && $this->mismaFechaDiaMes(Carbon::parse($cliente->fecha_aniversario), $fechaEntrada);

            if ($automaticoAniv || $manualAniv) {
                $opciones[] = [
                    'porcentaje' => $config['descuento_aniversario_porcentaje'],
                    'motivo' => 'Aniversario' . ($manualAniv && !$automaticoAniv ? ' (manual)' : ''),
                    'tipo' => 'aniversario',
                ];
            }
        } else {
            // Sin cliente: solo aplicar manuales si el recepcionista los activo
            if (!empty($manualesAplicar['cumpleanos'])) {
                $opciones[] = [
                    'porcentaje' => $config['descuento_cumpleanos_porcentaje'],
                    'motivo' => 'Cumpleanos (manual)',
                    'tipo' => 'cumpleanos',
                ];
            }
            if (!empty($manualesAplicar['aniversario'])) {
                $opciones[] = [
                    'porcentaje' => $config['descuento_aniversario_porcentaje'],
                    'motivo' => 'Aniversario (manual)',
                    'tipo' => 'aniversario',
                ];
            }
        }

        // ====================================================================
        // Sin descuentos
        // ====================================================================
        if (empty($opciones)) {
            return [
                'porcentaje' => 0.0,
                'motivo' => null,
                'monto' => 0.0,
                'tipo' => null,
            ];
        }

        // ====================================================================
        // Combinar segun configuracion
        // ====================================================================
        $maxPorcentajeManual = (float) Configuracion::obtener('descuento_manual_max_porcentaje', 20);

        if ($config['descuento_aplica_a'] === 'suma') {
            $porcentajeTotal = array_sum(array_column($opciones, 'porcentaje'));
            $porcentajeTotal = min(100.0, $porcentajeTotal);
            $motivos = array_column($opciones, 'motivo');
            $motivo = implode(' + ', $motivos);
            // Tipo: si hay manuales, marcar el primero manual
            $tipoFinal = null;
            foreach ($opciones as $o) {
                if (in_array($o['tipo'], ['aniversario', 'cumpleanos'])) {
                    $tipoFinal = $o['tipo'];
                    break;
                }
            }
            if ($tipoFinal === null) $tipoFinal = $opciones[0]['tipo'] ?? null;
        } else {
            // "mayor" (default): solo el mayor
            usort($opciones, fn($a, $b) => $b['porcentaje'] <=> $a['porcentaje']);
            $mejor = $opciones[0];
            $porcentajeTotal = (float) $mejor['porcentaje'];
            $motivo = $mejor['motivo'];
            $tipoFinal = $mejor['tipo'] ?? null;
        }

        // Aplicar tope maximo para descuentos manuales
        if ($porcentajeTotal > $maxPorcentajeManual) {
            $porcentajeTotal = $maxPorcentajeManual;
        }

        $montoDescuento = round($montoHabitacion * ($porcentajeTotal / 100), 2);

        return [
            'porcentaje' => $porcentajeTotal,
            'motivo' => $motivo,
            'monto' => $montoDescuento,
            'tipo' => $tipoFinal,
        ];
    }

    /**
     * Compara si dos fechas coinciden en dia + mes (ignora el anio).
     */
    private function mismaFechaDiaMes(Carbon $a, Carbon $b): bool
    {
        return $a->day === $b->day && $a->month === $b->month;
    }
}