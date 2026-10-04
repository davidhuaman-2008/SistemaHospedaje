<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\EstadoReserva;
use App\Models\Habitacion;
use App\Models\Limpieza;
use App\Models\OcupacionHabitacion;
use App\Models\PagoReserva;
use App\Models\RegistroEstadia;
use App\Models\Reserva;
use App\Models\Tarifa;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReservaTestSeeder extends Seeder
{
    /**
     * Crea 10 reservas de prueba en habitaciones DISPONIBLES.
     * NO toca las ocupadas (103, 308) ni las que están en limpieza (101, 102).
     * NO toca la 208 (inactiva).
     */
    public function run(): void
    {
        $ahora = Carbon::now();

        // =====================================================================
        // 1. Detectar habitaciones OCUPADAS (no las tocamos)
        // =====================================================================
        $habitacionesOcupadas = OcupacionHabitacion::where('estado', 'ACTIVA')
            ->pluck('id_habitacion')
            ->toArray();

        $this->command->info('Habitaciones ocupadas: ' . implode(', ', $habitacionesOcupadas));

        // =====================================================================
        // 2. Detectar habitaciones en LIMPIEZA (no las tocamos)
        // =====================================================================
        $habitacionesLimpieza = Limpieza::whereIn('estado', ['PENDIENTE', 'EN_PROCESO'])
            ->pluck('id_habitacion')
            ->toArray();

        $this->command->info('Habitaciones en limpieza: ' . implode(', ', $habitacionesLimpieza));

        // =====================================================================
        // 3. Detectar la habitación INACTIVA (208)
        // =====================================================================
        $habitacionesInactivas = Habitacion::where('activo', false)
            ->pluck('id_habitacion')
            ->toArray();

        $this->command->info('Habitaciones inactivas: ' . implode(', ', $habitacionesInactivas));

        // =====================================================================
        // 4. Calcular habitaciones DISPONIBLES
        // =====================================================================
        $noDisponibles = array_merge(
            $habitacionesOcupadas,
            $habitacionesLimpieza,
            $habitacionesInactivas
        );

        $disponibles = Habitacion::where('activo', true)
            ->whereNotIn('id_habitacion', $noDisponibles)
            ->orderBy('id_piso')
            ->orderBy('orden')
            ->get();

        $this->command->info("Habitaciones disponibles: {$disponibles->count()}");
        $this->command->info('');

        if ($disponibles->count() < 10) {
            $this->command->warn("⚠️ Solo hay {$disponibles->count()} habitaciones disponibles. Necesitamos 10.");
            return;
        }

        // =====================================================================
        // 5. Escenarios con diferentes tiempos de entrada
        // =====================================================================
        // Cada escenario:
        //   - horas_base: horas contratadas (debe coincidir con una tarifa)
        //   - minutos_atras: minutos retrocedidos desde AHORA
        //   - descripcion: para logs
        //
        // Estados resultantes:
        //   - minutos_transcurridos = horas_base*60 → apenas empezó
        //   - minutos_transcurridos < horas_base*60 - 30 → ocupada normal
        //   - minutos_transcurridos entre (base*60 - 30) y base*60 → POR VENCER
        //   - minutos_transcurridos > base*60 → VENCIDA (con posible extensión)

        $escenarios = [
            // [horas_base, minutos_atras, descripcion]
            [4,  30,   'Apenas entró (30m de 4h)'],
            [6,  90,   'Normal temprano (1h 30m de 6h)'],
            [8,  240,  'Normal medio (4h de 8h)'],
            [8,  450,  'Normal avanzada (7h 30m de 8h)'],
            [8,  470,  'POR VENCER (7h 50m de 8h)'],          // ← Amarillo
            [6,  365,  'Excedido 5m de 6h (dentro tolerancia)'],
            [4,  270,  'Excedido 30m de 4h (en el límite)'],
            [8,  620,  'Excedido 2h 20m de 8h'],
            [4,  300,  'Excedido 1h de 4h'],
            [6,  540,  'Excedido 3h de 6h (turno adicional)'],
        ];

        $idUsuario = 1;
        $idMetodoPago = 1; // Efectivo
        $estadoActiva = EstadoReserva::where('slug', 'activa')->firstOrFail();

        $creadas = 0;

        // =====================================================================
        // 6. Crear las 10 reservas
        // =====================================================================
        foreach ($disponibles as $habitacion) {
            if ($creadas >= 10) break;

            [$horasBase, $minutosAtras, $descripcion] = $escenarios[$creadas];

            // Buscar tarifa para el tipo + horas
            $tarifa = Tarifa::where('id_tipo', $habitacion->id_tipo)
                ->where('horas', $horasBase)
                ->where('activo', true)
                ->first();

            if (!$tarifa) {
                $this->command->warn("Habitación {$habitacion->numero}: no hay tarifa de {$horasBase}h, saltando...");
                continue;
            }

            // Calcular fechas
            $entrada = $ahora->copy()->subMinutes($minutosAtras);
            $salidaPrevista = $entrada->copy()->addHours($horasBase);

            // Buscar o crear cliente de prueba (uno distinto por habitación)
            $numeroDoc = '777700' . str_pad($creadas + 1, 2, '0', STR_PAD_LEFT);
            $cliente = Cliente::firstOrCreate(
                ['numero_documento' => $numeroDoc],
                [
                    'nombre' => 'CLIENTE TEST ' . str_pad($creadas + 1, 2, '0', STR_PAD_LEFT),
                    'apellido' => 'PRUEBA',
                    'celular' => '999888' . str_pad($creadas + 1, 3, '0', STR_PAD_LEFT),
                    'activo' => true,
                ]
            );

            // Crear reserva
            $reserva = Reserva::create([
                'codigo_reserva' => 'WK-TEST' . str_pad($creadas + 1, 2, '0', STR_PAD_LEFT),
                'tipo_reserva' => 'NORMAL',
                'id_estado' => $estadoActiva->id_estado,
                'id_cliente' => $cliente->id_cliente,
                'id_habitacion' => $habitacion->id_habitacion,
                'id_tarifa' => $tarifa->id_tarifa,
                'id_usuario_creacion' => $idUsuario,
                'cantidad_personas' => 2,
                'fecha_entrada' => $entrada,
                'fecha_salida_prevista' => $salidaPrevista,
                'horas_base' => $horasBase,
                'horas_extra' => 0,
                'horas_totales' => $horasBase,
                'monto_habitacion' => $tarifa->monto,
                'monto_horas_extra' => 0,
                'monto_consumos' => 0,
                'monto_ajustes' => 0,
                'descuento' => 0,
                'descuento_porcentaje' => 0,
                'total' => $tarifa->monto,
                'pagado' => $tarifa->monto,
                'saldo' => 0,
                'vuelto_entregado' => 0,
                'telefono' => $cliente->celular,
                'notas' => $descripcion,
            ]);

            // Ocupación
            OcupacionHabitacion::create([
                'id_habitacion' => $habitacion->id_habitacion,
                'id_reserva' => $reserva->id_reserva,
                'fecha_inicio' => $entrada,
                'fecha_fin' => $salidaPrevista,
                'estado' => 'ACTIVA',
            ]);

            // Registro estadía
            RegistroEstadia::create([
                'id_reserva' => $reserva->id_reserva,
                'fecha_entrada' => $entrada,
                'id_usuario_checkin' => $idUsuario,
            ]);

            // Pago inicial
            PagoReserva::create([
                'id_reserva' => $reserva->id_reserva,
                'id_metodo_pago' => $idMetodoPago,
                'monto' => $tarifa->monto,
                'es_adelanto' => true,
                'fecha_pago' => $entrada,
                'id_usuario' => $idUsuario,
            ]);

            $creadas++;
            $this->command->info("✓ {$habitacion->numero} ({$habitacion->tipo->nombre}) → {$descripcion}");
        }

        $this->command->info('');
        $this->command->info("✓ Total: {$creadas} reservas creadas");
    }
}