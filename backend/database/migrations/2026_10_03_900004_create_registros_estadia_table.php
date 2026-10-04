<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registros_estadia', function (Blueprint $table) {
            $table->id('id_registro');

            $table->foreignId('id_reserva')
                  ->unique()
                  ->constrained('reservas', 'id_reserva')
                  ->onDelete('cascade');

            $table->dateTime('fecha_entrada');
            $table->dateTime('fecha_salida')->nullable();
            $table->integer('horas_reales')->nullable();

            $table->foreignId('id_usuario_checkin')
                  ->constrained('usuarios', 'id')
                  ->onDelete('restrict');

            $table->foreignId('id_usuario_checkout')
                  ->nullable()
                  ->constrained('usuarios', 'id')
                  ->onDelete('set null');

            $table->decimal('monto_final', 10, 2)->nullable();
            $table->text('observaciones')->nullable();

            $table->timestamps();

            $table->index('id_reserva');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registros_estadia');
    }
};