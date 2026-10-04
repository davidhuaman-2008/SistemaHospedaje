<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ocupacion_habitacion', function (Blueprint $table) {
            $table->id('id_ocupacion');

            $table->foreignId('id_habitacion')
                  ->constrained('habitaciones', 'id_habitacion')
                  ->onDelete('cascade');

            $table->foreignId('id_reserva')
                  ->constrained('reservas', 'id_reserva')
                  ->onDelete('cascade');

            $table->dateTime('fecha_inicio');
            $table->dateTime('fecha_fin');

            $table->enum('estado', ['ACTIVA', 'LIBERADA', 'CANCELADA'])->default('ACTIVA');

            $table->timestamps();

            $table->index('id_habitacion');
            $table->index('id_reserva');
            $table->index(['id_habitacion', 'fecha_inicio', 'fecha_fin', 'estado'], 'idx_busqueda_disponibilidad');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ocupacion_habitacion');
    }
};