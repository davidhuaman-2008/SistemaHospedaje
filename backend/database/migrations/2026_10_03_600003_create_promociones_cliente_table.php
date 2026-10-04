<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promociones_cliente', function (Blueprint $table) {
            $table->id('id_promo_cliente');

            $table->foreignId('id_promocion')
                  ->constrained('promociones', 'id_promocion')
                  ->onDelete('cascade');

            $table->foreignId('id_cliente')
                  ->constrained('clientes', 'id_cliente')
                  ->onDelete('cascade');

            $table->string('codigo_personalizado', 50)->nullable();
            $table->date('fecha_vencimiento')->nullable();
            $table->boolean('usado')->default(false);
            $table->dateTime('fecha_uso')->nullable();

            $table->timestamps();

            $table->index('id_cliente');
            $table->index('usado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promociones_cliente');
    }
};