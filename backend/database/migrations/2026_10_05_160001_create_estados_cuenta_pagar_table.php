<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('estados_cuenta_pagar', function (Blueprint $table) {
            $table->id('id_estado_cuenta');
            $table->string('nombre', 50)->unique();
            $table->string('slug', 50)->unique();
            $table->string('descripcion', 255)->nullable();
            $table->string('color', 20)->nullable();
            $table->string('icono', 50)->nullable();
            $table->boolean('es_estado_final')->default(false);
            $table->integer('orden')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('estados_cuenta_pagar');
    }
};