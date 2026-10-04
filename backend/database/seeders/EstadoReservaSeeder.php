<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoReservaSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        DB::table('estados_reserva')->insert([
            ['nombre' => 'Pendiente', 'slug' => 'pendiente', 'color' => '#fbbf24', 'descripcion' => 'Reserva pendiente de confirmación', 'orden' => 1, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Confirmada', 'slug' => 'confirmada', 'color' => '#3b82f6', 'descripcion' => 'Reserva confirmada', 'orden' => 2, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Activa', 'slug' => 'activa', 'color' => '#ef4444', 'descripcion' => 'Cliente ya está en la habitación', 'orden' => 3, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Finalizada', 'slug' => 'finalizada', 'color' => '#10b981', 'descripcion' => 'Estadía completada', 'orden' => 4, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Cancelada', 'slug' => 'cancelada', 'color' => '#64748b', 'descripcion' => 'Reserva cancelada', 'orden' => 5, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'No-Show', 'slug' => 'no-show', 'color' => '#7c3aed', 'descripcion' => 'Cliente no llegó', 'orden' => 6, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Anulada', 'slug' => 'anulada', 'color' => '#991b1b', 'descripcion' => 'Registro anulado (no cuenta para SUNAT)', 'orden' => 7, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
        ]);

        $this->command->info('✓ Estados de reserva insertados: 7');
    }
}