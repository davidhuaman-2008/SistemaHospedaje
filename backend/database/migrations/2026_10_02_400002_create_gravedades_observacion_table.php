<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gravedades_observacion', function (Blueprint $table) {
            $table->id('id_gravedad');
            $table->string('nombre', 30)->unique();
            $table->string('slug', 30)->unique();
            $table->string('color', 20)->nullable();
            $table->integer('prioridad')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gravedades_observacion');
    }
};