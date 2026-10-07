<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('paquetes_decoracion', function (Blueprint $table) {
            $table->decimal('precio_hora_adicional', 10, 2)
                ->default(0)
                ->after('ganancia_proveedor');
        });
    }

    public function down(): void
    {
        Schema::table('paquetes_decoracion', function (Blueprint $table) {
            $table->dropColumn('precio_hora_adicional');
        });
    }
};