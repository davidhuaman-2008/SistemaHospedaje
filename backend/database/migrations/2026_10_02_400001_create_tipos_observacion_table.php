<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipos_observacion', function (Blueprint $table) {
            $table->id('id_tipo_observacion');
            $table->string('nombre', 50)->unique();
            $table->string('slug', 50)->unique();
            $table->string('icono', 50)->nullable();
            $table->string('color', 20)->nullable();
            $table->string('descripcion', 255)->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipos_observacion');
    }
};