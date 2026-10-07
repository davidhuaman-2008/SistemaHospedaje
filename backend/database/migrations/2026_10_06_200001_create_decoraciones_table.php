<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('decoraciones', function (Blueprint $table) {
            $table->id('id_decoracion');
            $table->foreignId('id_reserva')->constrained('reservas', 'id_reserva')->cascadeOnDelete();
            $table->foreignId('id_paquete')->constrained('paquetes_decoracion', 'id_paquete');
            $table->foreignId('id_proveedor')->nullable()->constrained('proveedores', 'id_proveedor')->nullOnDelete();

            // Estados hardcodeados: programada, en-proceso, finalizada, cancelada
            $table->enum('estado', ['programada', 'en-proceso', 'finalizada', 'cancelada'])
                ->default('programada');

            // Fechas del flujo
            $table->dateTime('fecha_programada');         // cuando el cliente la quiere
            $table->dateTime('fecha_inicio_preparacion')->nullable(); // 5h antes de fecha_programada
            $table->dateTime('fecha_inicio')->nullable(); // cuando el proveedor empieza
            $table->dateTime('fecha_fin')->nullable();    // cuando el proveedor termina

            // Dinero (copia del paquete al momento de crear, NO se actualiza)
            $table->decimal('precio_total', 10, 2);
            $table->decimal('ganancia_local', 10, 2);
            $table->decimal('ganancia_proveedor', 10, 2);
            $table->decimal('adelanto', 10, 2)->default(0);
            $table->decimal('saldo', 10, 2);

            // Personalizacion
            $table->text('frase_personalizada')->nullable();
            $table->string('musica', 100)->nullable();
            $table->text('notas')->nullable();

            // Cuenta por pagar al proveedor
            $table->foreignId('id_cuenta_pagar')->nullable()
                ->constrained('cuentas_por_pagar', 'id_cuenta')->nullOnDelete();

            // Auditoria
            $table->foreignId('id_usuario_creacion')->constrained('usuarios', 'id');
            $table->foreignId('id_usuario_anulacion')->nullable()->constrained('usuarios', 'id')->nullOnDelete();
            $table->dateTime('fecha_anulacion')->nullable();
            $table->string('motivo_anulacion', 255)->nullable();

            $table->timestamps();

            $table->index('id_reserva');
            $table->index('estado');
            $table->index('fecha_programada');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('decoraciones');
    }
};