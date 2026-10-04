<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConfiguracionSistemaSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        $configs = [
            ['clave' => 'tolerancia_extension_minutos', 'valor' => '30', 'tipo' => 'INT', 'descripcion' => 'Minutos de tolerancia antes de cobrar hora extra', 'grupo' => 'reservas'],
            ['clave' => 'buffer_limpieza_minutos', 'valor' => '30', 'tipo' => 'INT', 'descripcion' => 'Buffer entre reservas (limpieza)', 'grupo' => 'reservas'],
            ['clave' => 'tolerancia_no_show_minutos', 'valor' => '60', 'tipo' => 'INT', 'descripcion' => 'Tiempo para marcar No-Show', 'grupo' => 'reservas'],
            ['clave' => 'igv_porcentaje', 'valor' => '18', 'tipo' => 'DECIMAL', 'descripcion' => 'IGV aplicado a comprobantes', 'grupo' => 'comprobantes'],
            ['clave' => 'moneda_simbolo', 'valor' => 'S/', 'tipo' => 'STRING', 'descripcion' => 'Símbolo de moneda', 'grupo' => 'general'],
        ];

        foreach ($configs as $c) {
            DB::table('configuraciones')->updateOrInsert(
                ['clave' => $c['clave']],
                array_merge($c, ['created_at' => $ahora, 'updated_at' => $ahora])
            );
        }

        $this->command->info('✓ Configuraciones insertadas: ' . count($configs));
    }
}