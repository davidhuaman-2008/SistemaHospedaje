<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\Reserva;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * ReservaTestCleaner — Borra SOLO las reservas de prueba (WK-TEST*)
 * y sus clientes asociados (7777XXXX).
 *
 * ⚠️ NO toca reservas reales.
 */
class ReservaTestCleaner extends Seeder
{
    public function run(): void
    {
        $reservasTest = Reserva::where('codigo_reserva', 'LIKE', 'WK-TEST%')
            ->pluck('id_reserva')->toArray();

        if (empty($reservasTest)) {
            $this->command->info("No hay reservas de test para borrar.");
            return;
        }

        $totalReservas = count($reservasTest);
        $this->command->info("Borrando {$totalReservas} reservas de test...");

        DB::transaction(function () use ($reservasTest) {
            // Orden importante por FKs
            DB::table('pagos_reserva')->whereIn('id_reserva', $reservasTest)->delete();
            DB::table('registros_estadia')->whereIn('id_reserva', $reservasTest)->delete();
            DB::table('reserva_consumos')->whereIn('id_reserva', $reservasTest)->delete();
            DB::table('reserva_ajustes')->whereIn('id_reserva', $reservasTest)->delete();
            DB::table('extensiones_reserva')->whereIn('id_reserva', $reservasTest)->delete();
            DB::table('cliente_visitas')->whereIn('id_reserva', $reservasTest)->delete();
            DB::table('ocupacion_habitacion')->whereIn('id_reserva', $reservasTest)->delete();
            DB::table('limpieza')->whereIn('id_reserva', $reservasTest)->delete();

            Reserva::whereIn('id_reserva', $reservasTest)->delete();

            // Borrar clientes de test (7777XXXX)
            Cliente::where('numero_documento', 'LIKE', '7777%')
                ->whereNotIn('id_cliente', function ($q) {
                    $q->select('id_cliente')->from('reservas');
                })
                ->delete();
        });

        $this->command->info("✅ {$totalReservas} reservas y sus dependencias eliminadas.");
    }
}