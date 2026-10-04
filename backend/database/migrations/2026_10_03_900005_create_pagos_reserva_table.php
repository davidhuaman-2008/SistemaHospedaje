<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pagos_reserva', function (Blueprint $table) {
            $table->id('id_pago');

            $table->foreignId('id_reserva')
                  ->constrained('reservas', 'id_reserva')
                  ->onDelete('cascade');

            $table->foreignId('id_metodo_pago')
                  ->constrained('metodos_pago', 'id_metodo')
                  ->onDelete('restrict');

            $table->decimal('monto', 10, 2);
            $table->boolean('es_adelanto')->default(false);
            $table->dateTime('fecha_pago');

            $table->foreignId('id_usuario')
                  ->constrained('usuarios', 'id')
                  ->onDelete('restrict');

            $table->text('observaciones')->nullable();

            $table->boolean('anulado')->default(false);
            $table->foreignId('id_usuario_anulacion')
                  ->nullable()
                  ->constrained('usuarios', 'id')
                  ->onDelete('set null');
            $table->dateTime('fecha_anulacion')->nullable();
            $table->string('motivo_anulacion', 255)->nullable();

            $table->timestamps();

            $table->index('id_reserva');
            $table->index('id_metodo_pago');
            $table->index('anulado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos_reserva');
    }
};