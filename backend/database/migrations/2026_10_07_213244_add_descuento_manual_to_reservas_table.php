<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            // Tipo de descuento manual aplicado: 'aniversario', 'cumpleanos', null
            $table->string('descuento_manual_tipo', 30)->nullable()->after('descuento_porcentaje');
            // Motivo / observacion del recepcionista
            $table->string('descuento_manual_motivo', 255)->nullable()->after('descuento_manual_tipo');
            // Quien lo aplico (auditoria)
            $table->foreignId('descuento_manual_usuario_id')
                ->nullable()
                ->after('descuento_manual_motivo')
                ->constrained('usuarios', 'id')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            $table->dropForeign(['descuento_manual_usuario_id']);
            $table->dropColumn([
                'descuento_manual_tipo',
                'descuento_manual_motivo',
                'descuento_manual_usuario_id',
            ]);
        });
    }
};