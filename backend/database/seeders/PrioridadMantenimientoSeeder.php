<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PrioridadMantenimientoSeeder extends Seeder
{
    public function run(): void
    {
        $prioridades = [
            ['Baja', 'baja', '#10b981', 1],
            ['Media', 'media', '#f59e0b', 2],
            ['Alta', 'alta', '#ef4444', 3],
            ['Urgente', 'urgente', '#dc2626', 4],
        ];

        foreach ($prioridades as $p) {
            DB::table('prioridades_mantenimiento')->insert([
                'nombre' => $p[0],
                'slug' => $p[1],
                'color' => $p[2],
                'orden' => $p[3],
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}