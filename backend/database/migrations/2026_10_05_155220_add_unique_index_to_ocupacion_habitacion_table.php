<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ocupacion_habitacion', function (Blueprint $table) {
            $table->unique(
                ['id_habitacion', 'fecha_inicio', 'fecha_fin', 'estado'],
                'ocupacion_habitacion_unique_rango'
            );
        });
    }

    public function down(): void
    {
        Schema::table('ocupacion_habitacion', function (Blueprint $table) {
            $table->dropUnique('ocupacion_habitacion_unique_rango');
        });
    }
};