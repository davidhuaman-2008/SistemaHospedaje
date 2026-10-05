<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoMantenimientoSeeder extends Seeder
{
    public function run(): void
    {
        $tipos = [
            ['Eléctrico', 'electrico', 'Problemas eléctricos: tomacorrientes, luces, cables', 'zap', '#f59e0b', 1],
            ['Plomería', 'plomeria', 'Fugas de agua, inodoros, duchas, caños', 'droplets', '#06b6d4', 2],
            ['Jacuzzi', 'jacuzzi', 'Jacuzzi no funciona, no calienta, fugas', 'bath', '#7c3aed', 3],
            ['Muebles', 'muebles', 'Camas, roperos, mesas rotas o dañadas', 'sofa', '#a855f7', 4],
            ['Pintura', 'pintura', 'Paredes manchadas, descascaradas, retoques', 'paintbrush', '#ec4899', 5],
            ['Aire Acondicionado', 'aire-acondicionado', 'Aire no enfría, no calienta, hace ruido', 'wind', '#0ea5e9', 6],
            ['Cerraduras', 'cerraduras', 'Puertas que no cierran, chapas, llaves', 'key', '#64748b', 7],
            ['Otro', 'otro', 'Otros problemas no clasificados', 'wrench', '#6b7280', 8],
        ];

        foreach ($tipos as $t) {
            DB::table('tipos_mantenimiento')->insert([
                'nombre' => $t[0],
                'slug' => $t[1],
                'descripcion' => $t[2],
                'icono' => $t[3],
                'color' => $t[4],
                'orden' => $t[5],
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}