<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cliente_observaciones', function (Blueprint $table) {
            $table->id('id_observacion');
            $table->foreignId('id_cliente')
                  ->constrained('clientes', 'id_cliente')
                  ->onDelete('cascade');
            $table->foreignId('id_tipo_observacion')
                  ->constrained('tipos_observacion', 'id_tipo_observacion')
                  ->onDelete('restrict');
            $table->foreignId('id_gravedad')
                  ->constrained('gravedades_observacion', 'id_gravedad')
                  ->onDelete('restrict');
            $table->string('motivo', 255);
            $table->decimal('monto_deuda', 10, 2)->nullable();
            $table->boolean('resuelto')->default(false);
            $table->dateTime('fecha_resolucion')->nullable();
            $table->foreignId('id_usuario_creacion')
                  ->constrained('usuarios', 'id')
                  ->onDelete('restrict');
            $table->timestamps();

            $table->index('id_cliente');
            $table->index('resuelto');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cliente_observaciones');
    }
};