<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservas', function (Blueprint $table) {
            $table->id('id_reserva');
            $table->string('codigo_reserva', 20)->unique();

            $table->enum('tipo_reserva', ['NORMAL', 'CON_DECORACION'])->default('NORMAL');

            $table->foreignId('id_estado')
                  ->constrained('estados_reserva', 'id_estado')
                  ->onDelete('restrict');

            $table->foreignId('id_cliente')
                  ->constrained('clientes', 'id_cliente')
                  ->onDelete('restrict');

            $table->foreignId('id_habitacion')
                  ->constrained('habitaciones', 'id_habitacion')
                  ->onDelete('restrict');

            $table->foreignId('id_tarifa')
                  ->constrained('tarifas', 'id_tarifa')
                  ->onDelete('restrict');

            $table->foreignId('id_usuario_creacion')
                  ->constrained('usuarios', 'id')
                  ->onDelete('restrict');

            $table->integer('cantidad_personas')->default(2);

            $table->dateTime('fecha_entrada');
            $table->dateTime('fecha_salida_prevista');
            $table->dateTime('fecha_salida_real')->nullable();

            $table->integer('horas_base');
            $table->integer('horas_extra')->default(0);
            $table->integer('horas_totales');

            $table->decimal('monto_habitacion', 10, 2);
            $table->decimal('monto_horas_extra', 10, 2)->default(0);
            $table->decimal('descuento', 10, 2)->default(0);
            $table->decimal('descuento_porcentaje', 5, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->decimal('adelanto', 10, 2)->default(0);
            $table->decimal('saldo', 10, 2);

            $table->string('telefono', 20)->nullable();
            $table->text('notas')->nullable();
            $table->text('observaciones')->nullable();

            $table->foreignId('id_usuario_anulacion')
                  ->nullable()
                  ->constrained('usuarios', 'id')
                  ->onDelete('set null');
            $table->dateTime('fecha_anulacion')->nullable();
            $table->string('motivo_anulacion', 255)->nullable();

            $table->timestamps();

            $table->index('id_estado');
            $table->index('id_cliente');
            $table->index('id_habitacion');
            $table->index('tipo_reserva');
            $table->index('fecha_entrada');
            $table->index(['id_habitacion', 'fecha_entrada', 'fecha_salida_prevista']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};