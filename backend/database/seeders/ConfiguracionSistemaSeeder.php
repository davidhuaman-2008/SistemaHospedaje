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
            // ===== RESERVAS =====
            ['clave' => 'tolerancia_extension_minutos', 'valor' => '30', 'tipo' => 'INT', 'descripcion' => 'Minutos de tolerancia antes de cobrar hora extra', 'grupo' => 'reservas'],
            ['clave' => 'buffer_limpieza_minutos', 'valor' => '30', 'tipo' => 'INT', 'descripcion' => 'Buffer entre reservas (limpieza + check-in)', 'grupo' => 'reservas'],
            ['clave' => 'tolerancia_no_show_minutos', 'valor' => '60', 'tipo' => 'INT', 'descripcion' => 'Tiempo para marcar No-Show', 'grupo' => 'reservas'],
            ['clave' => 'horas_antes_bloqueo_reserva', 'valor' => '4', 'tipo' => 'INT', 'descripcion' => 'Horas antes del check-in para bloquear visualmente', 'grupo' => 'reservas'],
            ['clave' => 'horas_antes_decoracion', 'valor' => '24', 'tipo' => 'INT', 'descripcion' => 'Horas de anticipacion minima para reservar con decoracion (proveedor necesita tiempo)', 'grupo' => 'reservas'],
            ['clave' => 'anticipacion_minima_reserva_minutos', 'valor' => '30', 'tipo' => 'INT', 'descripcion' => 'Minutos de anticipacion minima para reservar SIN decoracion', 'grupo' => 'reservas'],

            // ===== DESCUENTOS (R1: nada hardcodeado) =====
            ['clave' => 'descuento_cumpleanos_porcentaje', 'valor' => '10', 'tipo' => 'DECIMAL', 'descripcion' => 'Porcentaje de descuento por cumpleanos', 'grupo' => 'descuentos'],
            ['clave' => 'descuento_aniversario_porcentaje', 'valor' => '15', 'tipo' => 'DECIMAL', 'descripcion' => 'Porcentaje de descuento por aniversario (solo si casado)', 'grupo' => 'descuentos'],
            ['clave' => 'descuento_cumpleanos_activo', 'valor' => 'true', 'tipo' => 'BOOLEAN', 'descripcion' => 'Activar descuento por cumpleanos', 'grupo' => 'descuentos'],
            ['clave' => 'descuento_aniversario_activo', 'valor' => 'true', 'tipo' => 'BOOLEAN', 'descripcion' => 'Activar descuento por aniversario', 'grupo' => 'descuentos'],
            ['clave' => 'descuento_aplica_a', 'valor' => 'mayor', 'tipo' => 'STRING', 'descripcion' => 'Como combinar descuentos: "mayor" (solo el mayor) o "suma" (acumulativo, tope 100%)', 'grupo' => 'descuentos'],

            // ===== COMPROBANTES =====
            ['clave' => 'igv_porcentaje', 'valor' => '18', 'tipo' => 'DECIMAL', 'descripcion' => 'IGV aplicado a comprobantes', 'grupo' => 'comprobantes'],

            // ===== GENERAL =====
            ['clave' => 'moneda_simbolo', 'valor' => 'S/', 'tipo' => 'STRING', 'descripcion' => 'Simbolo de moneda', 'grupo' => 'general'],
        ];

        foreach ($configs as $c) {
            DB::table('configuraciones')->updateOrInsert(
                ['clave' => $c['clave']],
                array_merge($c, ['created_at' => $ahora, 'updated_at' => $ahora])
            );
        }

        $this->command->info('OK Configuraciones insertadas: ' . count($configs));
    }
}