<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaProductoSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        DB::table('categorias_producto')->insert([
            ['nombre' => 'Bebidas', 'slug' => 'bebidas', 'descripcion' => 'Gaseosas, aguas, cervezas', 'icono' => 'cup-soda', 'color' => '#0ea5e9', 'orden' => 1, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Licores', 'slug' => 'licores', 'descripcion' => 'Vinos, piscos, chilcanos', 'icono' => 'wine', 'color' => '#7c3aed', 'orden' => 2, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Golosinas', 'slug' => 'golosinas', 'descripcion' => 'Papas, piqueos, galletas', 'icono' => 'cookie', 'color' => '#f59e0b', 'orden' => 3, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Snacks', 'slug' => 'snacks', 'descripcion' => 'Snacks varios', 'icono' => 'popcorn', 'color' => '#ef4444', 'orden' => 4, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Cuidado Personal', 'slug' => 'cuidado-personal', 'descripcion' => 'Preservativos, lubricantes', 'icono' => 'heart', 'color' => '#ec4899', 'orden' => 5, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Aseo', 'slug' => 'aseo', 'descripcion' => 'Shampoo, desodorante, jabón', 'icono' => 'spray-can', 'color' => '#06b6d4', 'orden' => 6, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Peluches', 'slug' => 'peluches', 'descripcion' => 'Peluches y baby dolkers', 'icono' => 'teddy-bear', 'color' => '#a855f7', 'orden' => 7, 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
        ]);

        $this->command->info('✓ Categorías de productos insertadas: 7 registros');
    }
}