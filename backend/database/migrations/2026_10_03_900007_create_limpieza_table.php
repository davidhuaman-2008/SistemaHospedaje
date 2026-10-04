<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('limpieza', function (Blueprint $table) {
            $table->id('id_limpieza');

            $table->foreignId('id_habitacion')
                  ->constrained('habitaciones', 'id_habitacion')
                  ->onDelete('cascade');

            $table->foreignId('id_reserva')
                  ->nullable()
                  ->constrained('reservas', 'id_reserva')
                  ->onDelete('set null');

            $table->foreignId('id_usuario_asignado')
                  ->nullable()
                  ->constrained('usuarios', 'id')
                  ->onDelete('set null');

            $table->enum('estado', ['PENDIENTE', 'EN_PROCESO', 'COMPLETADA'])->default('PENDIENTE');
            $table->enum('tipo', ['NORMAL', 'PROFUNDA'])->default('NORMAL');

            $table->dateTime('fecha_solicitud');
            $table->dateTime('fecha_inicio')->nullable();
            $table->dateTime('fecha_fin')->nullable();

            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->index('id_habitacion');
            $table->index('estado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('limpieza');
    }
};