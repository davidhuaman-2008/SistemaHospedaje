<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('configuraciones', function (Blueprint $table) {
            $table->id('id_configuracion');
            $table->string('clave', 100)->unique();
            $table->string('valor', 255);
            $table->string('tipo', 20)->default('INT');  // INT, DECIMAL, STRING, BOOLEAN
            $table->string('descripcion', 255)->nullable();
            $table->string('grupo', 50)->default('general');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configuraciones');
    }
};