<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paquetes_decoracion', function (Blueprint $table) {
            $table->id('id_paquete');
            $table->string('nombre', 100);
            $table->string('slug', 100)->unique();
            $table->string('descripcion', 255)->nullable();

            $table->decimal('precio_total', 10, 2);
            $table->decimal('ganancia_local', 10, 2)->default(0);
            $table->decimal('ganancia_proveedor', 10, 2)->default(0);

            $table->foreignId('id_proveedor')
                  ->nullable()
                  ->constrained('proveedores', 'id_proveedor')
                  ->onDelete('set null');

            $table->string('imagen', 255)->nullable();

            $table->enum('categoria_servicio', ['Romántico', 'Fantasía', 'Aniversario', 'Premium'])
                  ->default('Romántico');

            $table->integer('horas_incluidas')->default(8);

            $table->boolean('incluye_jacuzzi')->default(false);
            $table->boolean('incluye_vino')->default(false);
            $table->boolean('incluye_decoracion')->default(true);
            $table->boolean('incluye_sexshop')->default(false);
            $table->boolean('incluye_netflix')->default(false);

            $table->boolean('activo')->default(true);

            $table->timestamp('created_at')->nullable();

            $table->index('id_proveedor');
            $table->index('categoria_servicio');
            $table->index('activo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paquetes_decoracion');
    }
};