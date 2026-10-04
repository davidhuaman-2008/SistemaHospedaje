<?php

namespace Database\Seeders;

use App\Models\Proveedor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaqueteDecoracionSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        $proveedor = Proveedor::firstOrCreate(
            ['razon_social' => 'Decoraciones & Fantasía SAC'],
            [
                'nombre_comercial' => 'DecoFantasía',
                'ruc' => '20901234572',
                'telefono' => '989-666-777',
                'email' => 'ventas@decofantasia.pe',
                'direccion' => 'Av. Las Flores 789, Lima',
                'contacto' => 'Patricia Vega',
                'tipo' => 'Servicios',
                'notas' => 'Proveedor de paquetes de decoración temáticos',
                'activo' => true,
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ]
        );

        $idProveedor = $proveedor->id_proveedor;

        // Tipos de habitación: 1=Simple, 2=Estándar, 3=Premium, 4=Safari,
        //                      5=Marina, 6=Romántica, 7=Jacuzzi VIP, 8=Jacuzzi Estelar

        $paquetes = [
            ['nombre' => 'Paquete Romántico N°1 - Suite VIP', 'slug' => 'romantico-1-suite-vip', 'descripcion' => 'Decoración romántica clásica para Suite VIP', 'precio_total' => 199.00, 'ganancia_local' => 30.00, 'ganancia_proveedor' => 169.00, 'id_tipo_habitacion' => 7, 'horas_incluidas' => 8, 'incluye_jacuzzi' => true, 'incluye_vino' => true, 'incluye_decoracion' => true, 'incluye_sexshop' => false, 'incluye_netflix' => false],
            ['nombre' => 'Paquete Romántico N°2 - Suite VIP', 'slug' => 'romantico-2-suite-vip', 'descripcion' => 'Decoración romántica premium para Suite VIP', 'precio_total' => 219.00, 'ganancia_local' => 35.00, 'ganancia_proveedor' => 184.00, 'id_tipo_habitacion' => 7, 'horas_incluidas' => 8, 'incluye_jacuzzi' => true, 'incluye_vino' => true, 'incluye_decoracion' => true, 'incluye_sexshop' => true, 'incluye_netflix' => false],
            ['nombre' => 'Paquete Estelar N°3 - Suite Estelar', 'slug' => 'estelar-3-suite-estelar', 'descripcion' => 'Decoración con ambiente estelar nocturno', 'precio_total' => 259.00, 'ganancia_local' => 40.00, 'ganancia_proveedor' => 219.00, 'id_tipo_habitacion' => 8, 'horas_incluidas' => 12, 'incluye_jacuzzi' => true, 'incluye_vino' => true, 'incluye_decoracion' => true, 'incluye_sexshop' => false, 'incluye_netflix' => true],
            ['nombre' => 'Paquete Romántico N°4 - Temática Romántica', 'slug' => 'romantico-4-tematica', 'descripcion' => 'Decoración temática romántica estándar', 'precio_total' => 159.00, 'ganancia_local' => 25.00, 'ganancia_proveedor' => 134.00, 'id_tipo_habitacion' => 6, 'horas_incluidas' => 8, 'incluye_jacuzzi' => false, 'incluye_vino' => true, 'incluye_decoracion' => true, 'incluye_sexshop' => false, 'incluye_netflix' => false],
            ['nombre' => 'Paquete Fantasía N°5 - Temática Safari', 'slug' => 'fantasia-5-safari', 'descripcion' => 'Decoración con temática safari/africana', 'precio_total' => 159.00, 'ganancia_local' => 25.00, 'ganancia_proveedor' => 134.00, 'id_tipo_habitacion' => 4, 'horas_incluidas' => 8, 'incluye_jacuzzi' => false, 'incluye_vino' => false, 'incluye_decoracion' => true, 'incluye_sexshop' => true, 'incluye_netflix' => false],
            ['nombre' => 'Paquete Aniversario N°6 - Suite Estelar Completo', 'slug' => 'aniversario-6-estelar-completo', 'descripcion' => 'Paquete completo para aniversarios en Suite Estelar', 'precio_total' => 299.00, 'ganancia_local' => 45.00, 'ganancia_proveedor' => 254.00, 'id_tipo_habitacion' => 8, 'horas_incluidas' => 12, 'incluye_jacuzzi' => true, 'incluye_vino' => true, 'incluye_decoracion' => true, 'incluye_sexshop' => true, 'incluye_netflix' => true],
        ];

        foreach ($paquetes as $p) {
            DB::table('paquetes_decoracion')->insert(array_merge($p, [
                'id_proveedor' => $idProveedor,
                'imagen' => null,
                'activo' => true,
                'created_at' => $ahora,
            ]));
        }

        $this->command->info('✓ Paquetes de decoración insertados: ' . count($paquetes));
    }
}