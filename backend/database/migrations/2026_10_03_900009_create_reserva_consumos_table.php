<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reserva_consumos', function (Blueprint $table) {
            $table->id('id_consumo');

            $table->foreignId('id_reserva')
                  ->constrained('reservas', 'id_reserva')
                  ->onDelete('cascade');

            $table->foreignId('id_producto')
                  ->constrained('productos', 'id_producto')
                  ->onDelete('restrict');

            $table->integer('cantidad');
            $table->decimal('precio_unitario', 10, 2);
            $table->decimal('subtotal', 10, 2);

            $table->boolean('pagado')->default(false);   // si pagó al momento
            $table->foreignId('id_metodo_pago')
                  ->nullable()
                  ->constrained('metodos_pago', 'id_metodo')
                  ->onDelete('set null');

            $table->foreignId('id_usuario')
                  ->constrained('usuarios', 'id')
                  ->onDelete('restrict');

            $table->dateTime('fecha_consumo');
            $table->text('observaciones')->nullable();

            $table->timestamps();

            $table->index('id_reserva');
            $table->index('id_producto');
            $table->index('pagado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reserva_consumos');
    }
};