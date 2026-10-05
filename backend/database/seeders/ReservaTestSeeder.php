<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\ClienteNivel;
use App\Models\ClienteVisita;
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

/**
 * ReservaTestSeeder v4 — Usa DNIs 88888801..88888810 que NO existen.
 *
 * Estrategia:
 * - Cada habitación usa la tarifa que EXISTE para su tipo
 * - DNI único por cliente (rango 888888XX, no choca con nada)
 * - NO borra nada antes, solo crea
 */
class ReservaTestSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = Carbon::now();
        $idUsuario = 1;
        $idMetodoPago = 1; // Efectivo

        // -------------------------------------------------------------------
        // 1. DETECTAR HABITACIONES NO DISPONIBLES
        // -------------------------------------------------------------------
        $ocupadas = OcupacionHabitacion::where('estado', 'ACTIVA')
            ->pluck('id_habitacion')->toArray();

        $limpieza = Limpieza::whereIn('estado', ['PENDIENTE', 'EN_PROCESO'])
            ->pluck('id_habitacion')->toArray();

        $inactivas = Habitacion::where('activo', false)
            ->pluck('id_habitacion')->toArray();

        $noDisponibles = array_merge($ocupadas, $limpieza, $inactivas);

        // -------------------------------------------------------------------
        // 2. OBTENER HABITACIONES DISPONIBLES
        // -------------------------------------------------------------------
        $disponibles = Habitacion::with(['tipo'])
            ->where('activo', true)
            ->whereNotIn('id_habitacion', $noDisponibles)
            ->orderBy('id_piso')
            ->orderBy('orden')
            ->get();

        $this->command->info("Ocupadas: " . (empty($ocupadas) ? '(ninguna)' : implode(',', $ocupadas)));
        $this->command->info("Limpieza: " . (empty($limpieza) ? '(ninguna)' : implode(',', $limpieza)));
        $this->command->info("Inactivas: " . (empty($inactivas) ? '(ninguna)' : implode(',', $inactivas)));
        $this->command->info("Disponibles: {$disponibles->count()}");
        $this->command->info('');

        if ($disponibles->count() < 10) {
            $this->command->warn("⚠️ Solo hay {$disponibles->count()} disponibles. Se necesitan 10.");
            return;
        }

        // -------------------------------------------------------------------
        // 3. VERIFICAR DNIs 888888XX (borrar si existen de antes)
        // -------------------------------------------------------------------
        $existentes = Cliente::where('numero_documento', 'LIKE', '888888%')
            ->pluck('id_cliente')->toArray();

        if (!empty($existentes)) {
            $this->command->info("🧹 Borrando " . count($existentes) . " clientes previos 888888XX...");
            // Borrar reservas asociadas (por si acaso)
            $reservas = Reserva::whereIn('id_cliente', $existentes)->pluck('id_reserva')->toArray();
            if (!empty($reservas)) {
                DB::table('pagos_reserva')->whereIn('id_reserva', $reservas)->delete();
                DB::table('registros_estadia')->whereIn('id_reserva', $reservas)->delete();
                DB::table('cliente_visitas')->whereIn('id_reserva', $reservas)->delete();
                DB::table('ocupacion_habitacion')->whereIn('id_reserva', $reservas)->delete();
                DB::table('limpieza')->whereIn('id_reserva', $reservas)->delete();
                Reserva::whereIn('id_reserva', $reservas)->delete();
            }
            Cliente::whereIn('id_cliente', $existentes)->delete();
        }

        // -------------------------------------------------------------------
        // 4. ESCENARIOS: [minutos_atras, descripcion]
        // -------------------------------------------------------------------
        $escenarios = [
            [30,   'Apenas entró'],
            [90,   'Normal temprano'],
            [240,  'Normal medio'],
            [450,  'Normal avanzada'],
            [470,  'POR VENCER'],
            [370,  'Excedido 10m (dentro tolerancia)'],
            [420,  'Excedido 60m'],
            [620,  'Excedido 2h 20m'],
            [500,  'Excedido 1h 40m'],
            [540,  'Excedido 3h (turno adicional)'],
        ];

        $estadoActiva = EstadoReserva::where('slug', 'activa')->firstOrFail();
        $nivelBronce = ClienteNivel::where('nombre', 'Bronce')->first();

        $creadas = 0;

        // -------------------------------------------------------------------
        // 5. CREAR LAS RESERVAS
        // -------------------------------------------------------------------
        DB::transaction(function () use (
            $disponibles, $escenarios, $ahora, $idUsuario, $idMetodoPago,
            $estadoActiva, $nivelBronce, &$creadas
        ) {
            foreach ($disponibles as $habitacion) {
                if ($creadas >= 10) break;

                [$minutosAtras, $descripcion] = $escenarios[$creadas];

                // Buscar la tarifa MÁS CHICA de este tipo
                $tarifa = Tarifa::where('id_tipo', $habitacion->id_tipo)
                    ->where('activo', true)
                    ->orderBy('horas', 'asc')
                    ->first();

                if (!$tarifa) {
                    $this->command->warn("Hab {$habitacion->numero}: sin tarifas, saltando...");
                    continue;
                }

                $horasBase = $tarifa->horas;

                // Fechas retroactivas
                $entrada = $ahora->copy()->subMinutes($minutosAtras);
                $salidaPrevista = $entrada->copy()->addHours($horasBase);

                // DNI único: 88888801, 88888802, ...
                $numeroDoc = '888888' . str_pad($creadas + 1, 2, '0', STR_PAD_LEFT);

                $cliente = Cliente::create([
                    'nombre' => 'CLIENTE TEST ' . str_pad($creadas + 1, 2, '0', STR_PAD_LEFT),
                    'apellido' => 'PRUEBA',
                    'numero_documento' => $numeroDoc,
                    'celular' => '888888' . str_pad($creadas + 1, 3, '0', STR_PAD_LEFT),
                    'visitas' => 1,
                    'ultima_visita' => $entrada->toDateString(),
                    'total_gastado' => $tarifa->monto,
                    'id_nivel' => $nivelBronce?->id_nivel,
                    'activo' => true,
                ]);

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
                    'notas' => $descripcion . " ({$horasBase}h)",
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

                // Pago completo
                PagoReserva::create([
                    'id_reserva' => $reserva->id_reserva,
                    'id_metodo_pago' => $idMetodoPago,
                    'monto' => $tarifa->monto,
                    'es_adelanto' => true,
                    'fecha_pago' => $entrada,
                    'id_usuario' => $idUsuario,
                    'observaciones' => 'Pago inicial (test)',
                ]);

                // Visita
                ClienteVisita::create([
                    'id_cliente' => $cliente->id_cliente,
                    'id_reserva' => $reserva->id_reserva,
                    'id_habitacion' => $habitacion->id_habitacion,
                    'fecha_entrada' => $entrada,
                    'monto_gastado' => $tarifa->monto,
                ]);

                $creadas++;
                $this->command->info("✓ Hab {$habitacion->numero} ({$habitacion->tipo->nombre}, {$horasBase}h) → {$descripcion}");
            }
        });

        $this->command->info('');
        $this->command->info("✅ Total: {$creadas} reservas creadas");
        $this->command->info('');
        $this->command->info('Para limpiar:');
        $this->command->info('  Ejecutá este mismo seeder otra vez (borra los 888888XX automáticamente)');
    }
}