<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id('id_cliente');
            $table->string('nombre', 100);
            $table->string('apellido', 100)->nullable();
            $table->foreignId('id_tipo_documento')
                  ->nullable()
                  ->constrained('tipos_documento', 'id_documento')
                  ->onDelete('set null');
            $table->string('numero_documento', 30)->unique()->nullable();
            $table->string('celular', 20)->nullable();
            $table->string('email', 150)->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->date('fecha_aniversario')->nullable();
            $table->string('direccion', 255)->nullable();
            $table->integer('visitas')->default(0);
            $table->date('ultima_visita')->nullable();
            $table->decimal('total_gastado', 10, 2)->default(0);
            $table->foreignId('id_nivel')
                  ->nullable()
                  ->constrained('clientes_niveles', 'id_nivel')
                  ->onDelete('set null');
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->index('numero_documento');
            $table->index('id_nivel');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};