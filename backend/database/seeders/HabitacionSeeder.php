<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HabitacionSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        // Formato: [numero, id_piso, id_tipo, orden, activo]
        // Tipos: 1=Simple, 2=Estándar, 3=Premium, 4=Safari, 5=Marina,
        //        6=Romántica, 7=Jacuzzi VIP, 8=Jacuzzi Estelar
        // Pisos: 1, 2, 3, 4

        $habitaciones = [
            // --- PISO 1 (7 habitaciones) ---
            ['101', 1, 2, 1, true],
            ['102', 1, 2, 2, true],
            ['103', 1, 4, 3, true],
            ['104', 1, 5, 4, true],
            ['105', 1, 4, 5, true],
            ['106', 1, 2, 6, true],
            ['107', 1, 1, 7, true],

            // --- PISO 2 (9 habitaciones, 208 inactiva) ---
            ['201', 2, 3, 1, true],
            ['202', 2, 1, 2, true],
            ['203', 2, 2, 3, true],
            ['204', 2, 2, 4, true],
            ['205', 2, 6, 5, true],
            ['206', 2, 2, 6, true],
            ['207', 2, 2, 7, true],
            ['208', 2, 2, 8, false],   // INACTIVA (almacén/recepción)
            ['209', 2, 7, 9, true],

            // --- PISO 3 (8 habitaciones) ---
            ['301', 3, 7, 1, true],
            ['302', 3, 3, 2, true],
            ['303', 3, 1, 3, true],
            ['304', 3, 2, 4, true],
            ['305', 3, 2, 5, true],
            ['306', 3, 6, 6, true],
            ['307', 3, 2, 7, true],
            ['308', 3, 8, 8, true],

            // --- PISO 4 (8 habitaciones) ---
            ['401', 4, 7, 1, true],
            ['402', 4, 3, 2, true],
            ['403', 4, 1, 3, true],
            ['404', 4, 2, 4, true],
            ['405', 4, 2, 5, true],
            ['406', 4, 5, 6, true],
            ['407', 4, 3, 7, true],
            ['408', 4, 6, 8, true],
        ];

        foreach ($habitaciones as $h) {
            DB::table('habitaciones')->insert([
                'numero' => $h[0],
                'id_piso' => $h[1],
                'id_tipo' => $h[2],
                'orden' => $h[3],
                'activo' => $h[4],
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ]);
        }

        $this->command->info('✓ Habitaciones insertadas: ' . count($habitaciones));
        $this->command->info('  - Activas: 31');
        $this->command->info('  - Inactivas: 1 (208)');
    }
}