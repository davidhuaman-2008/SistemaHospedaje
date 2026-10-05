<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mantenimiento', function (Blueprint $table) {
            $table->id('id_mantenimiento');
            $table->foreignId('id_habitacion')
                ->constrained('habitaciones', 'id_habitacion')
                ->cascadeOnDelete();
            $table->foreignId('id_tipo_mantenimiento')
                ->constrained('tipos_mantenimiento', 'id_tipo_mantenimiento');
            $table->foreignId('id_prioridad')
                ->constrained('prioridades_mantenimiento', 'id_prioridad');
            $table->foreignId('id_usuario_reporta')
                ->constrained('usuarios', 'id');
            $table->foreignId('id_usuario_asignado')
                ->nullable()
                ->constrained('usuarios', 'id')
                ->nullOnDelete();
            $table->text('descripcion');
            $table->enum('estado', ['REPORTADO', 'EN_PROCESO', 'RESUELTO', 'CANCELADO'])
                ->default('REPORTADO');
            $table->dateTime('fecha_reporte');
            $table->dateTime('fecha_inicio')->nullable();
            $table->dateTime('fecha_resolucion')->nullable();
            $table->text('observaciones')->nullable();
            $table->text('motivo_cancelacion')->nullable();
            $table->timestamps();

            $table->index('id_habitacion');
            $table->index('estado');
            $table->index(['id_habitacion', 'estado']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mantenimiento');
    }
};