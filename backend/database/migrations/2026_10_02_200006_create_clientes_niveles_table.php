<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clientes_niveles', function (Blueprint $table) {
            $table->id('id_nivel');
            $table->string('nombre', 50)->unique();
            $table->integer('visitas_min')->default(0);
            $table->integer('visitas_max')->nullable();
            $table->decimal('descuento', 5, 2)->default(0);
            $table->string('color', 20)->nullable();
            $table->string('icono', 50)->nullable();
            $table->text('beneficios')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clientes_niveles');
    }
};