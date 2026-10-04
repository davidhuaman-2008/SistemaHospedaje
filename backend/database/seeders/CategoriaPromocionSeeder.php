<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaPromocionSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        DB::table('categorias_promocion')->insert([
            ['nombre' => 'Cumpleaños', 'slug' => 'cumpleanos', 'descripcion' => 'Descuento por cumpleaños del cliente', 'icono' => 'cake', 'color' => '#ec4899', 'orden' => 1, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Aniversario', 'slug' => 'aniversario', 'descripcion' => 'Descuento por aniversario de pareja', 'icono' => 'heart', 'color' => '#ef4444', 'orden' => 2, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Temporada Alta', 'slug' => 'temporada-alta', 'descripcion' => 'Promociones en temporada alta', 'icono' => 'sun', 'color' => '#f59e0b', 'orden' => 3, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Fidelidad', 'slug' => 'fidelidad', 'descripcion' => 'Descuento por nivel de fidelización', 'icono' => 'award', 'color' => '#8b5cf6', 'orden' => 4, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Reactivación', 'slug' => 'reactivacion', 'descripcion' => 'Para clientes inactivos', 'icono' => 'user-plus', 'color' => '#06b6d4', 'orden' => 5, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Referido', 'slug' => 'referido', 'descripcion' => 'Cliente que trae a otro cliente', 'icono' => 'users', 'color' => '#10b981', 'orden' => 6, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Primera Visita', 'slug' => 'primera-visita', 'descripcion' => 'Para clientes nuevos', 'icono' => 'sparkles', 'color' => '#a855f7', 'orden' => 7, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Otros', 'slug' => 'otros', 'descripcion' => 'Otras promociones', 'icono' => 'tag', 'color' => '#64748b', 'orden' => 8, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
        ]);

        $this->command->info('✓ Categorías de promoción insertadas: 8 registros');
    }
}