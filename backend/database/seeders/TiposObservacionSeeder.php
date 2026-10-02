<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TiposObservacionSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        DB::table('tipos_observacion')->insert([
            ['nombre' => 'Deuda', 'slug' => 'deuda', 'icono' => 'dollar-sign', 'color' => '#dc2626', 'descripcion' => 'Cliente con deuda pendiente', 'orden' => 1, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Daño a la habitación', 'slug' => 'dano_habitacion', 'icono' => 'hammer', 'color' => '#ef4444', 'descripcion' => 'Rompió o dañó algo', 'orden' => 2, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Mal comportamiento', 'slug' => 'mal_comportamiento', 'icono' => 'alert-triangle', 'color' => '#f59e0b', 'descripcion' => 'Escándalo, agresión, etc.', 'orden' => 3, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Documento falso', 'slug' => 'documento_falso', 'icono' => 'file-x', 'color' => '#7c3aed', 'descripcion' => 'Presentó documento falso', 'orden' => 4, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Bloqueo permanente', 'slug' => 'bloqueo', 'icono' => 'shield-x', 'color' => '#111827', 'descripcion' => 'No se le da servicio nunca más', 'orden' => 5, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
        ]);

        $this->command->info('✓ Tipos de observación insertados: 5 registros');
    }
}