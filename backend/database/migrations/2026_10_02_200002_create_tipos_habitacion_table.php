<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipos_habitacion', function (Blueprint $table) {
            $table->id('id_tipo');
            $table->string('nombre', 50)->unique();
            $table->string('slug', 50)->unique();
            $table->string('descripcion', 255)->nullable();
            $table->integer('capacidad')->default(2);
            $table->integer('camas')->default(1);
            $table->boolean('tiene_jacuzzi')->default(false);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipos_habitacion');
    }
};