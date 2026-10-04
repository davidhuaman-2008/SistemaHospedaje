<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PromocionSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();
        $hoy = now()->toDateString();
        $finAnio = now()->endOfYear()->toDateString();

        // Categorías: 1=Cumpleaños, 2=Aniversario, 3=Temporada Alta, 4=Fidelidad,
        //             5=Reactivación, 6=Referido, 7=Primera Visita, 8=Otros

        $promociones = [
            [
                'nombre' => 'Descuento Cumpleaños 20%',
                'descripcion' => '20% de descuento en el día del cumpleaños del cliente',
                'id_categoria_promocion' => 1,
                'tipo' => 'PORCENTAJE',
                'valor' => 20.00,
                'fecha_inicio' => $hoy,
                'fecha_fin' => $finAnio,
                'dias_semana' => null,
                'hora_inicio' => null,
                'hora_fin' => null,
                'id_tipo_habitacion' => null,
                'monto_minimo' => null,
                'requiere_codigo' => false,
                'codigo' => null,
                'limite_uso' => null,
                'usos_actuales' => 0,
                'limite_por_cliente' => 1,
                'acumulable' => false,
                'activo' => true,
            ],
            [
                'nombre' => 'Descuento Aniversario 15%',
                'descripcion' => '15% para parejas que celebren su aniversario',
                'id_categoria_promocion' => 2,
                'tipo' => 'PORCENTAJE',
                'valor' => 15.00,
                'fecha_inicio' => $hoy,
                'fecha_fin' => $finAnio,
                'dias_semana' => null,
                'hora_inicio' => null,
                'hora_fin' => null,
                'id_tipo_habitacion' => null,
                'monto_minimo' => null,
                'requiere_codigo' => false,
                'codigo' => null,
                'limite_uso' => null,
                'usos_actuales' => 0,
                'limite_por_cliente' => 1,
                'acumulable' => false,
                'activo' => true,
            ],
            [
                'nombre' => 'Cliente VIP 10%',
                'descripcion' => '10% para clientes nivel VIP',
                'id_categoria_promocion' => 4,
                'tipo' => 'PORCENTAJE',
                'valor' => 10.00,
                'fecha_inicio' => null,
                'fecha_fin' => null,
                'dias_semana' => null,
                'hora_inicio' => null,
                'hora_fin' => null,
                'id_tipo_habitacion' => null,
                'monto_minimo' => null,
                'requiere_codigo' => false,
                'codigo' => null,
                'limite_uso' => null,
                'usos_actuales' => 0,
                'limite_por_cliente' => null,
                'acumulable' => false,
                'activo' => true,
            ],
            [
                'nombre' => 'Cliente Nuevo S/ 10 dscto',
                'descripcion' => 'S/ 10 de descuento para primera visita',
                'id_categoria_promocion' => 7,
                'tipo' => 'MONTO_FIJO',
                'valor' => 10.00,
                'fecha_inicio' => $hoy,
                'fecha_fin' => $finAnio,
                'dias_semana' => null,
                'hora_inicio' => null,
                'hora_fin' => null,
                'id_tipo_habitacion' => null,
                'monto_minimo' => 30.00,
                'requiere_codigo' => false,
                'codigo' => null,
                'limite_uso' => null,
                'usos_actuales' => 0,
                'limite_por_cliente' => 1,
                'acumulable' => true,
                'activo' => true,
            ],
            [
                'nombre' => 'Promo DESC10',
                'descripcion' => '10% con código DESC10',
                'id_categoria_promocion' => 8,
                'tipo' => 'PORCENTAJE',
                'valor' => 10.00,
                'fecha_inicio' => $hoy,
                'fecha_fin' => $finAnio,
                'dias_semana' => null,
                'hora_inicio' => null,
                'hora_fin' => null,
                'id_tipo_habitacion' => null,
                'monto_minimo' => null,
                'requiere_codigo' => true,
                'codigo' => 'DESC10',
                'limite_uso' => 100,
                'usos_actuales' => 0,
                'limite_por_cliente' => 1,
                'acumulable' => false,
                'activo' => true,
            ],
            [
                'nombre' => 'Reactivación 20%',
                'descripcion' => '20% para clientes sin visitas en 60+ días',
                'id_categoria_promocion' => 5,
                'tipo' => 'PORCENTAJE',
                'valor' => 20.00,
                'fecha_inicio' => $hoy,
                'fecha_fin' => $finAnio,
                'dias_semana' => null,
                'hora_inicio' => null,
                'hora_fin' => null,
                'id_tipo_habitacion' => null,
                'monto_minimo' => null,
                'requiere_codigo' => false,
                'codigo' => null,
                'limite_uso' => null,
                'usos_actuales' => 0,
                'limite_por_cliente' => 1,
                'acumulable' => false,
                'activo' => true,
            ],
        ];

        foreach ($promociones as $promo) {
            DB::table('promociones')->insert(array_merge($promo, [
                'created_at' => $ahora,
                'updated_at' => $ahora,
            ]));
        }

        $this->command->info('✓ Promociones insertadas: ' . count($promociones) . ' registros');
    }
}