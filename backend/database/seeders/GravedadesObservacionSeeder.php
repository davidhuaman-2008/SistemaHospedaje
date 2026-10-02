<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GravedadesObservacionSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        DB::table('gravedades_observacion')->insert([
            ['nombre' => 'Baja', 'slug' => 'baja', 'color' => '#16a34a', 'prioridad' => 1, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Media', 'slug' => 'media', 'color' => '#f59e0b', 'prioridad' => 2, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Alta', 'slug' => 'alta', 'color' => '#dc2626', 'prioridad' => 3, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Crítica', 'slug' => 'critica', 'color' => '#7f1d1d', 'prioridad' => 4, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
        ]);

        $this->command->info('✓ Gravedades insertadas: 4 registros');
    }
}