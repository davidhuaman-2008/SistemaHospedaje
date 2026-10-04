<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = now();

        // id_categoria_producto: 1=Bebidas, 2=Licores, 3=Golosinas, 4=Snacks, 5=Cuidado Personal, 6=Aseo, 7=Peluches
        // id_proveedor: 1=DistriBebidas, 2=GoloMax, 3=ImportLima, 4=LicorPremium, 5=AseoLimpio

        DB::table('productos')->insert([
            // Bebidas
            ['nombre' => 'Coca-Cola 500ml', 'id_categoria_producto' => 1, 'id_proveedor' => 1, 'precio_compra' => 2.00, 'precio_venta' => 4.00, 'stock_actual' => 24, 'stock_minimo' => 10, 'unidad_medida' => 'botella', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Coca-Cola 1L', 'id_categoria_producto' => 1, 'id_proveedor' => 1, 'precio_compra' => 3.50, 'precio_venta' => 6.00, 'stock_actual' => 12, 'stock_minimo' => 10, 'unidad_medida' => 'botella', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Inca Kola 500ml', 'id_categoria_producto' => 1, 'id_proveedor' => 1, 'precio_compra' => 2.00, 'precio_venta' => 4.00, 'stock_actual' => 18, 'stock_minimo' => 10, 'unidad_medida' => 'botella', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Agua Mineral 600ml', 'id_categoria_producto' => 1, 'id_proveedor' => 1, 'precio_compra' => 0.80, 'precio_venta' => 2.00, 'stock_actual' => 30, 'stock_minimo' => 10, 'unidad_medida' => 'botella', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Cerveza Pilsen 650ml', 'id_categoria_producto' => 1, 'id_proveedor' => 1, 'precio_compra' => 4.50, 'precio_venta' => 8.00, 'stock_actual' => 15, 'stock_minimo' => 10, 'unidad_medida' => 'botella', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Cerveza Cusqueña 650ml', 'id_categoria_producto' => 1, 'id_proveedor' => 1, 'precio_compra' => 5.00, 'precio_venta' => 9.00, 'stock_actual' => 12, 'stock_minimo' => 10, 'unidad_medida' => 'botella', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Cerveza Trigo 650ml', 'id_categoria_producto' => 1, 'id_proveedor' => 1, 'precio_compra' => 5.50, 'precio_venta' => 10.00, 'stock_actual' => 8, 'stock_minimo' => 10, 'unidad_medida' => 'botella', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],

            // Licores
            ['nombre' => 'Vino Queirolo 750ml', 'id_categoria_producto' => 2, 'id_proveedor' => 4, 'precio_compra' => 18.00, 'precio_venta' => 35.00, 'stock_actual' => 6, 'stock_minimo' => 10, 'unidad_medida' => 'botella', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Vino Tabernero 750ml', 'id_categoria_producto' => 2, 'id_proveedor' => 4, 'precio_compra' => 15.00, 'precio_venta' => 30.00, 'stock_actual' => 8, 'stock_minimo' => 10, 'unidad_medida' => 'botella', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Vino Tú y Yo 750ml', 'id_categoria_producto' => 2, 'id_proveedor' => 4, 'precio_compra' => 12.00, 'precio_venta' => 25.00, 'stock_actual' => 5, 'stock_minimo' => 10, 'unidad_medida' => 'botella', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Chilcano 1L', 'id_categoria_producto' => 2, 'id_proveedor' => 4, 'precio_compra' => 22.00, 'precio_venta' => 45.00, 'stock_actual' => 4, 'stock_minimo' => 10, 'unidad_medida' => 'botella', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],

            // Golosinas
            ['nombre' => 'Papas Lays Clásicas', 'id_categoria_producto' => 3, 'id_proveedor' => 2, 'precio_compra' => 1.50, 'precio_venta' => 3.00, 'stock_actual' => 20, 'stock_minimo' => 10, 'unidad_medida' => 'unidad', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Galletas Tentación', 'id_categoria_producto' => 3, 'id_proveedor' => 2, 'precio_compra' => 1.00, 'precio_venta' => 2.50, 'stock_actual' => 25, 'stock_minimo' => 10, 'unidad_medida' => 'unidad', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],

            // Snacks
            ['nombre' => 'Piqueo Snax', 'id_categoria_producto' => 4, 'id_proveedor' => 2, 'precio_compra' => 1.20, 'precio_venta' => 3.00, 'stock_actual' => 18, 'stock_minimo' => 10, 'unidad_medida' => 'unidad', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],

            // Cuidado personal
            ['nombre' => 'Preservativos Pack x3', 'id_categoria_producto' => 5, 'id_proveedor' => 3, 'precio_compra' => 3.00, 'precio_venta' => 8.00, 'stock_actual' => 15, 'stock_minimo' => 10, 'unidad_medida' => 'pack', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Lubricante 50ml', 'id_categoria_producto' => 5, 'id_proveedor' => 3, 'precio_compra' => 4.00, 'precio_venta' => 10.00, 'stock_actual' => 12, 'stock_minimo' => 10, 'unidad_medida' => 'unidad', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],

            // Aseo
            ['nombre' => 'Shampoo 30ml', 'id_categoria_producto' => 6, 'id_proveedor' => 5, 'precio_compra' => 0.80, 'precio_venta' => 2.50, 'stock_actual' => 40, 'stock_minimo' => 10, 'unidad_medida' => 'unidad', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
            ['nombre' => 'Desodorante Personal', 'id_categoria_producto' => 6, 'id_proveedor' => 5, 'precio_compra' => 5.00, 'precio_venta' => 12.00, 'stock_actual' => 10, 'stock_minimo' => 10, 'unidad_medida' => 'unidad', 'activo' => true, 'created_at' => $ahora, 'updated_at' => $ahora],
        ]);

        $this->command->info('✓ Productos insertados: 19 registros');
    }
}