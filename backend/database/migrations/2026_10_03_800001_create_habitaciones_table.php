<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('habitaciones', function (Blueprint $table) {
            $table->id('id_habitacion');

            $table->foreignId('id_piso')
                  ->constrained('pisos', 'id_piso')
                  ->onDelete('restrict');

            $table->foreignId('id_tipo')
                  ->constrained('tipos_habitacion', 'id_tipo')
                  ->onDelete('restrict');

            $table->string('numero', 10)->unique();
            $table->integer('orden')->default(0);
            $table->boolean('activo')->default(true);

            $table->timestamps();

            $table->index('id_piso');
            $table->index('id_tipo');
            $table->index('activo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habitaciones');
    }
};