<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tarifas', function (Blueprint $table) {
            $table->id('id_tarifa');
            $table->foreignId('id_tipo')
                  ->constrained('tipos_habitacion', 'id_tipo')
                  ->onDelete('restrict');
            $table->integer('horas');
            $table->decimal('monto', 10, 2);
            $table->decimal('precio_hora_extra', 10, 2);
            $table->integer('max_horas_extra')->default(3);
            $table->decimal('precio_turno_adicional', 10, 2);
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->unique(['id_tipo', 'horas']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tarifas');
    }
};