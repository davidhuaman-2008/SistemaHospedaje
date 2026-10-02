<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConfiguracionBaseSeeder extends Seeder
{
    public function run(): void
    {
        // ===== PISOS =====
        DB::table('pisos')->insert([
            ['nombre' => 'Piso 1', 'orden' => 1, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Piso 2', 'orden' => 2, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Piso 3', 'orden' => 3, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Piso 4', 'orden' => 4, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ===== TIPOS DE HABITACIÓN =====
        DB::table('tipos_habitacion')->insert([
            ['nombre' => 'Simple',           'slug' => 'simple',                'capacidad' => 2, 'camas' => 1, 'tiene_jacuzzi' => false, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Estándar',         'slug' => 'estandar',              'capacidad' => 2, 'camas' => 1, 'tiene_jacuzzi' => false, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Premium',          'slug' => 'premium',               'capacidad' => 2, 'camas' => 1, 'tiene_jacuzzi' => false, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Safari',           'slug' => 'safari',                'capacidad' => 2, 'camas' => 1, 'tiene_jacuzzi' => false, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Marina',           'slug' => 'marina',                'capacidad' => 2, 'camas' => 1, 'tiene_jacuzzi' => false, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Romántica',        'slug' => 'romantica',             'capacidad' => 2, 'camas' => 1, 'tiene_jacuzzi' => false, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Jacuzzi VIP',      'slug' => 'jacuzzi-suite-vip',     'capacidad' => 3, 'camas' => 1, 'tiene_jacuzzi' => true,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Jacuzzi Estelar',  'slug' => 'jacuzzi-suite-estelar', 'capacidad' => 3, 'camas' => 1, 'tiene_jacuzzi' => true,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ===== TIPOS DE DOCUMENTO =====
        DB::table('tipos_documento')->insert([
            ['nombre' => 'DNI',                  'abreviatura' => 'DNI', 'longitud' => 8,    'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'RUC',                  'abreviatura' => 'RUC', 'longitud' => 11,   'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Carné de Extranjería', 'abreviatura' => 'CE',  'longitud' => 12,   'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Pasaporte',            'abreviatura' => 'PAS', 'longitud' => null, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ===== MÉTODOS DE PAGO =====
        DB::table('metodos_pago')->insert([
            ['nombre' => 'Efectivo',                 'es_de_caja' => true,  'icono' => 'banknote',         'color' => '#16a34a', 'orden' => 1,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Tarjeta (POS)',            'es_de_caja' => true,  'icono' => 'credit-card',      'color' => '#2563eb', 'orden' => 2,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Yape Hospedaje',           'es_de_caja' => true,  'icono' => 'smartphone',       'color' => '#7c3aed', 'orden' => 3,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Yape Dueña',               'es_de_caja' => false, 'icono' => 'smartphone',       'color' => '#f59e0b', 'orden' => 4,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Plin Hospedaje',           'es_de_caja' => true,  'icono' => 'smartphone',       'color' => '#06b6d4', 'orden' => 5,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Plin Dueña',               'es_de_caja' => false, 'icono' => 'smartphone',       'color' => '#f59e0b', 'orden' => 6,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Depósito Hospedaje',       'es_de_caja' => true,  'icono' => 'building',         'color' => '#0891b2', 'orden' => 7,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Depósito Dueña',           'es_de_caja' => false, 'icono' => 'building',         'color' => '#f59e0b', 'orden' => 8,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Transferencia Hospedaje',  'es_de_caja' => true,  'icono' => 'arrow-right-left', 'color' => '#7c3aed', 'orden' => 9,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Transferencia Dueña',      'es_de_caja' => false, 'icono' => 'arrow-right-left', 'color' => '#f59e0b', 'orden' => 10, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ===== CATEGORÍAS DE MOVIMIENTO =====
        DB::table('categorias_movimiento')->insert([
            // Ingresos (9)
            ['nombre' => 'Alquiler habitación',        'tipo' => 'Ingreso', 'orden' => 1,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Extensión de estadía',       'tipo' => 'Ingreso', 'orden' => 2,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Turno adicional',            'tipo' => 'Ingreso', 'orden' => 3,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Consumo frigobar',           'tipo' => 'Ingreso', 'orden' => 4,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Decoración (ganancia local)', 'tipo' => 'Ingreso', 'orden' => 5,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Servicios adicionales',      'tipo' => 'Ingreso', 'orden' => 6,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Propinas',                   'tipo' => 'Ingreso', 'orden' => 7,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Hallazgos',                  'tipo' => 'Ingreso', 'orden' => 8,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Ajuste positivo',            'tipo' => 'Ingreso', 'orden' => 9,  'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            // Egresos (14)
            ['nombre' => 'Pago a proveedor',           'tipo' => 'Egreso',  'orden' => 10, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Compra de insumos',          'tipo' => 'Egreso',  'orden' => 11, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Pago al personal',           'tipo' => 'Egreso',  'orden' => 12, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Desayuno',                   'tipo' => 'Egreso',  'orden' => 13, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Transporte',                 'tipo' => 'Egreso',  'orden' => 14, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Mantenimiento',              'tipo' => 'Egreso',  'orden' => 15, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Servicios básicos',          'tipo' => 'Egreso',  'orden' => 16, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Publicidad',                 'tipo' => 'Egreso',  'orden' => 17, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Ajuste negativo',            'tipo' => 'Egreso',  'orden' => 18, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Retiro a caja fuerte',       'tipo' => 'Egreso',  'orden' => 19, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Devolución a cliente',       'tipo' => 'Egreso',  'orden' => 20, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Compra de decoración',       'tipo' => 'Egreso',  'orden' => 21, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Productos de limpieza',      'tipo' => 'Egreso',  'orden' => 22, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Otros egresos',              'tipo' => 'Egreso',  'orden' => 23, 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ===== NIVELES DE CLIENTE =====
        DB::table('clientes_niveles')->insert([
            ['nombre' => 'Bronce', 'visitas_min' => 0,  'visitas_max' => 4,    'descuento' => 0.00,  'color' => '#cd7f32', 'icono' => 'award', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Plata',  'visitas_min' => 5,  'visitas_max' => 9,    'descuento' => 5.00,  'color' => '#c0c0c0', 'icono' => 'award', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Oro',    'visitas_min' => 10, 'visitas_max' => 19,   'descuento' => 10.00, 'color' => '#ffd700', 'icono' => 'award', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'VIP',    'visitas_min' => 20, 'visitas_max' => null, 'descuento' => 15.00, 'color' => '#9b59b6', 'icono' => 'crown', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        $this->command->info('✓ Configuración Base insertada: 53 registros');
    }
}