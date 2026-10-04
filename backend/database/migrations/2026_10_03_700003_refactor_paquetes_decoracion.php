<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Quitar FK a categorias_paquete
        Schema::table('paquetes_decoracion', function (Blueprint $table) {
            $table->dropForeign(['id_categoria_paquete']);
            $table->dropColumn('id_categoria_paquete');
        });

        // 2. Agregar FK a tipos_habitacion
        Schema::table('paquetes_decoracion', function (Blueprint $table) {
            $table->unsignedBigInteger('id_tipo_habitacion')->nullable()->after('id_proveedor');
            $table->foreign('id_tipo_habitacion')
                  ->references('id_tipo')
                  ->on('tipos_habitacion')
                  ->onDelete('set null');
        });

        // 3. Mapear los 6 paquetes existentes a tipos de habitación
        $mapa = [
            'romantico-1-suite-vip' => 7,         // Jacuzzi VIP
            'romantico-2-suite-vip' => 7,         // Jacuzzi VIP
            'estelar-3-suite-estelar' => 8,       // Jacuzzi Estelar
            'romantico-4-tematica' => 6,          // Romántica
            'fantasia-5-safari' => 4,             // Safari
            'aniversario-6-estelar-completo' => 8, // Jacuzzi Estelar
        ];

        foreach ($mapa as $slug => $idTipo) {
            DB::table('paquetes_decoracion')
                ->where('slug', $slug)
                ->update(['id_tipo_habitacion' => $idTipo]);
        }

        // 4. Eliminar tabla categorias_paquete
        Schema::dropIfExists('categorias_paquete');
    }

    public function down(): void
    {
        // Recrear categorias_paquete
        Schema::create('categorias_paquete', function (Blueprint $table) {
            $table->id('id_categoria_paquete');
            $table->string('nombre', 50)->unique();
            $table->string('slug', 50)->unique();
            $table->string('descripcion', 255)->nullable();
            $table->string('icono', 50)->nullable();
            $table->string('color', 20)->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        Schema::table('paquetes_decoracion', function (Blueprint $table) {
            $table->dropForeign(['id_tipo_habitacion']);
            $table->dropColumn('id_tipo_habitacion');
        });

        Schema::table('paquetes_decoracion', function (Blueprint $table) {
            $table->unsignedBigInteger('id_categoria_paquete')->nullable();
        });
    }
};