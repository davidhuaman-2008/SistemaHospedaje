<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->string('apellido', 100);
            $table->string('nombre_usuario', 50)->unique();
            $table->string('password');
            $table->foreignId('id_rol')->constrained('roles')->onDelete('restrict');
            $table->foreignId('id_turno')->nullable()->constrained('turnos')->onDelete('set null');
            $table->boolean('activo')->default(true);
            $table->timestamp('ultimo_login')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
