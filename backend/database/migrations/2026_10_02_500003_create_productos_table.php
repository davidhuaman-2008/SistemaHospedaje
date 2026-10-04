<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id('id_producto');
            $table->string('nombre', 100);
            $table->string('descripcion', 255)->nullable();
            $table->foreignId('id_categoria_producto')
                  ->nullable()
                  ->constrained('categorias_producto', 'id_categoria_producto')
                  ->onDelete('set null');
            $table->foreignId('id_proveedor')
                  ->nullable()
                  ->constrained('proveedores', 'id_proveedor')
                  ->onDelete('set null');
            $table->string('codigo_barra', 50)->nullable();
            $table->decimal('precio_compra', 10, 2)->default(0);
            $table->decimal('precio_venta', 10, 2);
            $table->integer('stock_actual')->default(0);
            $table->integer('stock_minimo')->default(10);
            $table->string('unidad_medida', 20)->nullable();
            $table->string('imagen', 255)->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->index('id_categoria_producto');
            $table->index('id_proveedor');
            $table->index('stock_actual');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};