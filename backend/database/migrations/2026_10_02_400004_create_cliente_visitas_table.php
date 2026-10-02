<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cliente_visitas', function (Blueprint $table) {
            $table->id('id_visita');
            $table->foreignId('id_cliente')
                  ->constrained('clientes', 'id_cliente')
                  ->onDelete('cascade');
            $table->unsignedBigInteger('id_reserva')->nullable();
            $table->unsignedBigInteger('id_habitacion')->nullable();
            $table->dateTime('fecha_entrada');
            $table->dateTime('fecha_salida')->nullable();
            $table->decimal('monto_gastado', 10, 2)->default(0);
            $table->timestamps();

            $table->index('id_cliente');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cliente_visitas');
    }
};