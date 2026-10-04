<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reserva_ajustes', function (Blueprint $table) {
            $table->id('id_ajuste');

            $table->foreignId('id_reserva')
                  ->constrained('reservas', 'id_reserva')
                  ->onDelete('cascade');

            $table->enum('tipo', ['CAMBIO_HABITACION', 'AJUSTE_MANUAL']);
            $table->decimal('monto_anterior', 10, 2);
            $table->decimal('monto_nuevo', 10, 2);
            $table->decimal('diferencia', 10, 2);

            $table->foreignId('id_usuario')
                  ->constrained('usuarios', 'id')
                  ->onDelete('restrict');

            $table->dateTime('fecha_ajuste');
            $table->text('notas')->nullable();

            $table->timestamps();

            $table->index('id_reserva');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reserva_ajustes');
    }
};