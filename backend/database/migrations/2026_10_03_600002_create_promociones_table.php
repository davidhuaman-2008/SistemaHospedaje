<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promociones', function (Blueprint $table) {
            $table->id('id_promocion');
            $table->string('nombre', 100);
            $table->string('descripcion', 255)->nullable();

            $table->foreignId('id_categoria_promocion')
                  ->nullable()
                  ->constrained('categorias_promocion', 'id_categoria_promocion')
                  ->onDelete('set null');

            $table->enum('tipo', ['PORCENTAJE', 'MONTO_FIJO', 'NOCHE_GRATIS', 'OTRO']);
            $table->decimal('valor', 10, 2)->default(0);

            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->string('dias_semana', 50)->nullable();
            $table->time('hora_inicio')->nullable();
            $table->time('hora_fin')->nullable();

            $table->foreignId('id_tipo_habitacion')
                  ->nullable()
                  ->constrained('tipos_habitacion', 'id_tipo')
                  ->onDelete('set null');

            $table->decimal('monto_minimo', 10, 2)->nullable();

            $table->boolean('requiere_codigo')->default(false);
            $table->string('codigo', 50)->nullable();

            $table->integer('limite_uso')->nullable();
            $table->integer('usos_actuales')->default(0);
            $table->integer('limite_por_cliente')->nullable();

            $table->boolean('acumulable')->default(false);
            $table->boolean('activo')->default(true);

            $table->timestamps();

            $table->index('id_categoria_promocion');
            $table->index('activo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promociones');
    }
};