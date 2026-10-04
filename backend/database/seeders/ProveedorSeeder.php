<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProveedorSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        DB::table('proveedores')->insert([
            [
                'razon_social' => 'Distribuidora de Bebidas del Sur SAC',
                'nombre_comercial' => 'DistriBebidas Sur',
                'ruc' => '20481234567',
                'telefono' => '984-111-222',
                'email' => 'ventas@distribebidas.pe',
                'direccion' => 'Av. Los Sauces 123, Lima',
                'contacto' => 'Carlos Mendoza',
                'tipo' => 'Productos',
                'activo' => true,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ],
            [
                'razon_social' => 'Comercializadora de Golosinas EIRL',
                'nombre_comercial' => 'GoloMax',
                'ruc' => '20591234568',
                'telefono' => '985-222-333',
                'email' => 'pedidos@golomax.pe',
                'direccion' => 'Jr. Comercio 456, Lima',
                'contacto' => 'María Quispe',
                'tipo' => 'Productos',
                'activo' => true,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ],
            [
                'razon_social' => 'Importaciones y Distribuciones Lima SAC',
                'nombre_comercial' => 'ImportLima',
                'ruc' => '20601234569',
                'telefono' => '986-333-444',
                'email' => 'contacto@importlima.pe',
                'direccion' => 'Av. Aviación 789, Lima',
                'contacto' => 'Jorge Ramírez',
                'tipo' => 'Productos',
                'activo' => true,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ],
            [
                'razon_social' => 'Distribuidora de Licores Premium SAC',
                'nombre_comercial' => 'LicorPremium',
                'ruc' => '20701234570',
                'telefono' => '987-444-555',
                'email' => 'ventas@licorpremium.pe',
                'direccion' => 'Calle Los Pinos 321, Lima',
                'contacto' => 'Ana Torres',
                'tipo' => 'Productos',
                'activo' => true,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ],
            [
                'razon_social' => 'Distribuidora de Productos de Aseo SAC',
                'nombre_comercial' => 'AseoLimpio',
                'ruc' => '20801234571',
                'telefono' => '988-555-666',
                'email' => 'pedidos@aseolimpio.pe',
                'direccion' => 'Av. Universitaria 654, Lima',
                'contacto' => 'Luis Fernández',
                'tipo' => 'Productos',
                'activo' => true,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ],
        ]);

        $this->command->info('✓ Proveedores insertados: 5 registros');
    }
}