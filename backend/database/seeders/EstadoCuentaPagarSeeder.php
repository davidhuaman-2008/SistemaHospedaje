<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoCuentaPagarSeeder extends Seeder
{
    public function run(): void
    {
        $estados = [
            ['Pendiente', 'pendiente', 'Deuda sin pagos aún', '#f59e0b', 'clock', false, 1],
            ['Parcial', 'parcial', 'Deuda con pagos parciales', '#3b82f6', 'circle-half', false, 2],
            ['Pagada', 'pagada', 'Deuda totalmente pagada', '#10b981', 'check-circle', true, 3],
            ['Anulada', 'anulada', 'Deuda anulada', '#64748b', 'x-circle', true, 4],
        ];

        foreach ($estados as $e) {
            DB::table('estados_cuenta_pagar')->insert([
                'nombre' => $e[0],
                'slug' => $e[1],
                'descripcion' => $e[2],
                'color' => $e[3],
                'icono' => $e[4],
                'es_estado_final' => $e[5],
                'orden' => $e[6],
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}