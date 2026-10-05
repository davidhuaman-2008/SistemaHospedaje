<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cuentas_por_pagar', function (Blueprint $table) {
            $table->id('id_cuenta');

            $table->foreignId('id_proveedor')
                ->constrained('proveedores', 'id_proveedor')
                ->restrictOnDelete();

            $table->foreignId('id_estado_cuenta')
                ->constrained('estados_cuenta_pagar', 'id_estado_cuenta');

            $table->foreignId('id_reserva')
                ->nullable()
                ->constrained('reservas', 'id_reserva')
                ->nullOnDelete();

            // FK a decoraciones (Módulo 10 futuro) — se crea como nullable sin constraint
            // porque la tabla aún no existe. Se agrega constraint después.
            $table->unsignedBigInteger('id_decoracion')->nullable();

            $table->string('concepto', 255);
            $table->decimal('monto', 10, 2);
            $table->decimal('monto_pagado', 10, 2)->default(0);
            $table->decimal('saldo', 10, 2);
            $table->dateTime('fecha_emision');
            $table->dateTime('fecha_vencimiento')->nullable();

            $table->foreignId('id_usuario_creacion')
                ->constrained('usuarios', 'id');

            $table->foreignId('id_usuario_anulacion')
                ->nullable()
                ->constrained('usuarios', 'id')
                ->nullOnDelete();

            $table->dateTime('fecha_anulacion')->nullable();
            $table->text('motivo_anulacion')->nullable();
            $table->text('notas')->nullable();
            $table->timestamps();

            $table->index('id_proveedor');
            $table->index('id_estado_cuenta');
            $table->index('fecha_vencimiento');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cuentas_por_pagar');
    }
};