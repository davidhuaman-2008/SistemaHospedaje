<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categorias_movimiento', function (Blueprint $table) {
            $table->id('id_categoria');
            $table->string('nombre', 50);
            $table->enum('tipo', ['Ingreso', 'Egreso']);
            $table->string('descripcion', 255)->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->unique(['nombre', 'tipo']);
            $table->index('tipo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categorias_movimiento');
    }
};