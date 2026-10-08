<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Bronce: 0%
        DB::table('clientes_niveles')
            ->where('nombre', 'Bronce')
            ->update(['descuento' => 0.00]);

        // Plata: 5%
        DB::table('clientes_niveles')
            ->where('nombre', 'Plata')
            ->update(['descuento' => 5.00]);

        // Oro: 8% (antes 10%)
        DB::table('clientes_niveles')
            ->where('nombre', 'Oro')
            ->update(['descuento' => 8.00]);

        // VIP: 12% (antes 15%)
        DB::table('clientes_niveles')
            ->where('nombre', 'VIP')
            ->update(['descuento' => 12.00]);
    }

    public function down(): void
    {
        // Revertir
        DB::table('clientes_niveles')
            ->where('nombre', 'Bronce')->update(['descuento' => 0.00]);
        DB::table('clientes_niveles')
            ->where('nombre', 'Plata')->update(['descuento' => 5.00]);
        DB::table('clientes_niveles')
            ->where('nombre', 'Oro')->update(['descuento' => 10.00]);
        DB::table('clientes_niveles')
            ->where('nombre', 'VIP')->update(['descuento' => 15.00]);
    }
};