<?php

namespace App\Services;

use App\Models\Configuracion;
use App\Models\ExtensionReserva;
use App\Models\Reserva;
use App\Models\Tarifa;
use Carbon\Carbon;

class ExtensionService
{
    /**
     * Calcula las opciones de extensión para una reserva,
     * teniendo en cuenta las extensiones YA aplicadas.
     */
    public function calcular(Reserva $reserva): array
    {
        $tarifa = Tarifa::find($reserva->id_tarifa);
        if (!$tarifa) {
            return $this->respuestaVacia();
        }

        // ============ TOLERANCIA ============
        $tolerancia = Configuracion::obtener('tolerancia_extension_minutos', 30);

        // ============ TIEMPO REAL ============
        $entrada = Carbon::parse($reserva->fecha_entrada);
        $ahora = Carbon::now();
        $minutosTranscurridos = (int) round(abs($entrada->diffInMinutes($ahora)));

        $minutosBase = $reserva->horas_base * 60;
        $minutosExcesoTotal = max(0, $minutosTranscurridos - $minutosBase);

        // ============ EXTENSIONES YA APLICADAS ============
        $extensiones = ExtensionReserva::where('id_reserva', $reserva->id_reserva)->get();

        $horasExtraYaAplicadas = $extensiones->sum('horas_extra');
        $montoYaAplicado = (float) $extensiones->sum('monto');
        $montoYaPagado = (float) $extensiones
            ->where('pagado_inmediato', true)
            ->sum('monto');
        $montoCargadoACuenta = (float) $extensiones
            ->where('cargado_a_cuenta', true)
            ->sum('monto');
        $turnosAdicionalesAplicados = $extensiones
            ->where('es_turno_adicional', true)
            ->count();

        // ============ PENDIENTE DE APLICAR ============
        // Minutos de exceso ya cubiertos por extensiones aplicadas
        $minutosYaCubiertos = $horasExtraYaAplicadas * 60;
        // Si hubo turno adicional, también suma horas
        if ($turnosAdicionalesAplicados > 0) {
            $minutosYaCubiertos += $turnosAdicionalesAplicados * ($tarifa->horas * 60);
        }

        $minutosExcesoPendiente = max(0, $minutosExcesoTotal - $minutosYaCubiertos);

        // ============ ¿ESTÁ DENTRO DE TOLERANCIA? ============
        // Considerando las extensiones ya aplicadas
        $dentroTolerancia = $minutosExcesoPendiente <= $tolerancia;

        // ============ HORAS SUGERIDAS NUEVAS ============
        $horasExtraSugeridasNuevas = 0;
        if (!$dentroTolerancia) {
            $minutosACobrar = $minutosExcesoPendiente - $tolerancia;
            $horasExtraSugeridasNuevas = (int) ceil($minutosACobrar / 60);
        }

        // ============ PRECIOS (desde tarifa) ============
        $precioHoraExtra = (float) $tarifa->precio_hora_extra;
        $maxHorasExtra = (int) $tarifa->max_horas_extra;
        $precioTurnoAdicional = (float) $tarifa->precio_turno_adicional;

        // ============ ¿EXCEDE EL MÁXIMO? ============
        $excedeMaximo = $horasExtraSugeridasNuevas > $maxHorasExtra;

        // ============ GENERAR OPCIONES NUEVAS ============
        $opciones = $this->generarOpciones(
            $horasExtraSugeridasNuevas,
            $maxHorasExtra,
            $precioHoraExtra,
            $precioTurnoAdicional,
            $excedeMaximo,
            $dentroTolerancia
        );

        return [
            // Tiempo base
            'horas_base' => $reserva->horas_base,
            'minutos_transcurridos' => $minutosTranscurridos,
            'minutos_base' => $minutosBase,

            // Exceso total (desde la entrada)
            'minutos_exceso_total' => $minutosExcesoTotal,
            'horas_exceso_total' => round($minutosExcesoTotal / 60, 2),

            // Extensiones ya aplicadas (historial)
            'horas_extra_ya_aplicadas' => $horasExtraYaAplicadas,
            'monto_ya_aplicado' => $montoYaAplicado,
            'monto_ya_pagado' => $montoYaPagado,             // pagado inmediato
            'monto_cargado_a_cuenta' => $montoCargadoACuenta, // pendiente de cobro
            'turnos_adicionales_aplicados' => $turnosAdicionalesAplicados,

            // Pendiente
            'minutos_exceso_pendiente' => $minutosExcesoPendiente,
            'minutos_ya_cubiertos' => $minutosYaCubiertos,
            'horas_extra_sugeridas_nuevas' => $horasExtraSugeridasNuevas,
            'monto_sugerido_nuevo' => $horasExtraSugeridasNuevas * $precioHoraExtra,

            // Config
            'tolerancia_minutos' => $tolerancia,
            'dentro_tolerancia' => $dentroTolerancia,
            'excede_maximo' => $excedeMaximo,
            'max_horas_extra' => $maxHorasExtra,
            'precio_hora_extra' => $precioHoraExtra,
            'precio_turno_adicional' => $precioTurnoAdicional,

            // Opciones nuevas
            'opciones' => $opciones,
        ];
    }

    private function generarOpciones(
        int $horasSugeridas,
        int $maxHoras,
        float $precioHora,
        float $precioTurno,
        bool $excedeMaximo,
        bool $dentroTolerancia
    ): array {
        if ($dentroTolerancia) {
            return [];
        }

        $opciones = [];

        // Opción: no cobrar
        $opciones[] = [
            'horas' => 0,
            'monto' => 0,
            'es_turno_adicional' => false,
            'label' => 'No cobrar (con observación)',
            'sugerida' => false,
        ];

        // Opciones de horas extra (hasta maxHoras)
        for ($h = 1; $h <= $maxHoras; $h++) {
            $opciones[] = [
                'horas' => $h,
                'monto' => $h * $precioHora,
                'es_turno_adicional' => false,
                'label' => $h === $maxHoras
                    ? "{$h} horas extra (máximo)"
                    : "{$h} hora" . ($h > 1 ? 's' : '') . " extra",
                'sugerida' => !$excedeMaximo && $h === $horasSugeridas,
            ];
        }

        // Si excede el máximo → opciones especiales
        if ($excedeMaximo) {
            // Cobrar las horas reales (excede máximo)
            $opciones[] = [
                'horas' => $horasSugeridas,
                'monto' => $horasSugeridas * $precioHora,
                'es_turno_adicional' => false,
                'label' => "{$horasSugeridas} horas extra (excede máximo)",
                'sugerida' => false,
                'advertencia' => true,
            ];

            // Turno adicional completo (recomendado)
            $opciones[] = [
                'horas' => 0,
                'monto' => $precioTurno,
                'es_turno_adicional' => true,
                'label' => 'Turno adicional completo (recomendado)',
                'sugerida' => true,
            ];
        }

        return $opciones;
    }

    private function respuestaVacia(): array
    {
        return [
            'horas_base' => 0,
            'minutos_transcurridos' => 0,
            'minutos_base' => 0,
            'minutos_exceso_total' => 0,
            'horas_exceso_total' => 0,
            'horas_extra_ya_aplicadas' => 0,
            'monto_ya_aplicado' => 0,
            'monto_ya_pagado' => 0,
            'monto_cargado_a_cuenta' => 0,
            'turnos_adicionales_aplicados' => 0,
            'minutos_exceso_pendiente' => 0,
            'minutos_ya_cubiertos' => 0,
            'horas_extra_sugeridas_nuevas' => 0,
            'monto_sugerido_nuevo' => 0,
            'tolerancia_minutos' => 30,
            'dentro_tolerancia' => true,
            'excede_maximo' => false,
            'max_horas_extra' => 3,
            'precio_hora_extra' => 0,
            'precio_turno_adicional' => 0,
            'opciones' => [],
        ];
    }
}