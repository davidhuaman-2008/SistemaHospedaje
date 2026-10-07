<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cuentas_por_pagar', function (Blueprint $table) {
            // Agregar FK a decoraciones (antes no existia constraint)
            $table->foreign('id_decoracion')
                ->references('id_decoracion')
                ->on('decoraciones')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('cuentas_por_pagar', function (Blueprint $table) {
            $table->dropForeign(['id_decoracion']);
        });
    }
};