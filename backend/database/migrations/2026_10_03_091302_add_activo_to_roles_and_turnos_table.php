<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Agregar 'activo' a roles si falta
        if (!Schema::hasColumn('roles', 'activo')) {
            Schema::table('roles', function (Blueprint $table) {
                $table->boolean('activo')->default(true)->after('descripcion');
            });
        }

        // Agregar 'activo' a turnos si falta
        if (!Schema::hasColumn('turnos', 'activo')) {
            Schema::table('turnos', function (Blueprint $table) {
                $table->boolean('activo')->default(true)->after('descripcion');
            });
        }
    }

    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn('activo');
        });

        Schema::table('turnos', function (Blueprint $table) {
            $table->dropColumn('activo');
        });
    }
};