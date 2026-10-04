<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('extensiones_reserva', function (Blueprint $table) {
            $table->id('id_extension');

            $table->foreignId('id_reserva')
                  ->constrained('reservas', 'id_reserva')
                  ->onDelete('cascade');

            $table->integer('horas_extra');
            $table->decimal('monto', 10, 2);
            $table->boolean('es_turno_adicional')->default(false);

            // Auditoría del cálculo
            $table->integer('minutos_exceso');
            $table->decimal('precio_hora_extra_aplicado', 10, 2);
            $table->integer('tolerancia_minutos');

            // Pago
            $table->boolean('pagado_inmediato')->default(false);
            $table->boolean('cargado_a_cuenta')->default(true);
            $table->foreignId('id_metodo_pago')
                  ->nullable()
                  ->constrained('metodos_pago', 'id_metodo')
                  ->onDelete('set null');

            $table->foreignId('id_usuario')
                  ->constrained('usuarios', 'id')
                  ->onDelete('restrict');

            $table->dateTime('fecha_extension');
            $table->text('observaciones')->nullable();

            $table->timestamps();

            $table->index('id_reserva');
            $table->index('fecha_extension');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('extensiones_reserva');
    }
};