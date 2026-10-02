<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TarifaSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        // 15 tarifas reales del hospedaje
        // id_tipo: 1=Simple, 2=Estándar, 3=Premium, 4=Safari,
        //          5=Marina, 6=Romántica, 7=Jacuzzi VIP, 8=Jacuzzi Estelar
        $tarifas = [
            // Simple
            ['id_tipo' => 1, 'horas' => 4,  'monto' => 25,  'precio_hora_extra' => 5,  'max_horas_extra' => 3, 'precio_turno_adicional' => 25],

            // Estándar
            ['id_tipo' => 2, 'horas' => 6,  'monto' => 40,  'precio_hora_extra' => 5,  'max_horas_extra' => 3, 'precio_turno_adicional' => 40],
            ['id_tipo' => 2, 'horas' => 12, 'monto' => 45,  'precio_hora_extra' => 5,  'max_horas_extra' => 3, 'precio_turno_adicional' => 45],

            // Premium
            ['id_tipo' => 3, 'horas' => 8,  'monto' => 55,  'precio_hora_extra' => 5,  'max_horas_extra' => 3, 'precio_turno_adicional' => 55],
            ['id_tipo' => 3, 'horas' => 12, 'monto' => 70,  'precio_hora_extra' => 5,  'max_horas_extra' => 3, 'precio_turno_adicional' => 70],

            // Safari
            ['id_tipo' => 4, 'horas' => 8,  'monto' => 70,  'precio_hora_extra' => 10, 'max_horas_extra' => 3, 'precio_turno_adicional' => 70],
            ['id_tipo' => 4, 'horas' => 12, 'monto' => 90,  'precio_hora_extra' => 10, 'max_horas_extra' => 3, 'precio_turno_adicional' => 90],

            // Marina
            ['id_tipo' => 5, 'horas' => 8,  'monto' => 60,  'precio_hora_extra' => 10, 'max_horas_extra' => 3, 'precio_turno_adicional' => 60],
            ['id_tipo' => 5, 'horas' => 12, 'monto' => 80,  'precio_hora_extra' => 10, 'max_horas_extra' => 3, 'precio_turno_adicional' => 80],

            // Romántica
            ['id_tipo' => 6, 'horas' => 8,  'monto' => 60,  'precio_hora_extra' => 10, 'max_horas_extra' => 3, 'precio_turno_adicional' => 60],
            ['id_tipo' => 6, 'horas' => 12, 'monto' => 80,  'precio_hora_extra' => 10, 'max_horas_extra' => 3, 'precio_turno_adicional' => 80],

            // Jacuzzi VIP
            ['id_tipo' => 7, 'horas' => 8,  'monto' => 100, 'precio_hora_extra' => 10, 'max_horas_extra' => 3, 'precio_turno_adicional' => 100],
            ['id_tipo' => 7, 'horas' => 12, 'monto' => 135, 'precio_hora_extra' => 10, 'max_horas_extra' => 3, 'precio_turno_adicional' => 135],

            // Jacuzzi Estelar
            ['id_tipo' => 8, 'horas' => 8,  'monto' => 135, 'precio_hora_extra' => 10, 'max_horas_extra' => 3, 'precio_turno_adicional' => 135],
            ['id_tipo' => 8, 'horas' => 12, 'monto' => 165, 'precio_hora_extra' => 10, 'max_horas_extra' => 3, 'precio_turno_adicional' => 165],
        ];

        foreach ($tarifas as $tarifa) {
            DB::table('tarifas')->insert(array_merge($tarifa, [
                'activo' => true,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ]));
        }

        $this->command->info('✓ Tarifas insertadas: 15 registros');
    }
}