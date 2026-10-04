<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categorias_producto', function (Blueprint $table) {
            $table->id('id_categoria_producto');
            $table->string('nombre', 50)->unique();
            $table->string('slug', 50)->unique();
            $table->string('descripcion', 255)->nullable();
            $table->string('icono', 50)->nullable();
            $table->string('color', 20)->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categorias_producto');
    }
};