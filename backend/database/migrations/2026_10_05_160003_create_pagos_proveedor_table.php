<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pagos_proveedor', function (Blueprint $table) {
            $table->id('id_pago_proveedor');

            $table->foreignId('id_cuenta')
                ->constrained('cuentas_por_pagar', 'id_cuenta')
                ->cascadeOnDelete();

            $table->decimal('monto', 10, 2);

            $table->foreignId('id_metodo_pago')
                ->constrained('metodos_pago', 'id_metodo');

            $table->dateTime('fecha_pago');

            $table->foreignId('id_usuario')
                ->constrained('usuarios', 'id');

            $table->string('referencia', 100)->nullable();
            $table->text('observaciones')->nullable();

            $table->boolean('anulado')->default(false);

            $table->foreignId('id_usuario_anulacion')
                ->nullable()
                ->constrained('usuarios', 'id')
                ->nullOnDelete();

            $table->dateTime('fecha_anulacion')->nullable();
            $table->text('motivo_anulacion')->nullable();
            $table->timestamps();

            $table->index('id_cuenta');
            $table->index('anulado');
            $table->index('fecha_pago');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pagos_proveedor');
    }
};