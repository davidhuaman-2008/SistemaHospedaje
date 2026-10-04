<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Renombrar adelanto → pagado
        Schema::table('reservas', function (Blueprint $table) {
            if (Schema::hasColumn('reservas', 'adelanto')) {
                $table->renameColumn('adelanto', 'pagado');
            }
        });

        // Renombrar vuelto → vuelto_entregado
        Schema::table('reservas', function (Blueprint $table) {
            if (Schema::hasColumn('reservas', 'vuelto')) {
                $table->renameColumn('vuelto', 'vuelto_entregado');
            }
        });

        // Agregar monto_habitacion ya existe. Agregar los demás:
        Schema::table('reservas', function (Blueprint $table) {
            if (!Schema::hasColumn('reservas', 'monto_consumos')) {
                $table->decimal('monto_consumos', 10, 2)->default(0)->after('monto_horas_extra');
            }
            if (!Schema::hasColumn('reservas', 'monto_ajustes')) {
                $table->decimal('monto_ajustes', 10, 2)->default(0)->after('monto_consumos');
            }
        });
    }

    public function down(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            $table->dropColumn(['monto_consumos', 'monto_ajustes']);
        });

        Schema::table('reservas', function (Blueprint $table) {
            $table->renameColumn('pagado', 'adelanto');
            $table->renameColumn('vuelto_entregado', 'vuelto');
        });
    }
};