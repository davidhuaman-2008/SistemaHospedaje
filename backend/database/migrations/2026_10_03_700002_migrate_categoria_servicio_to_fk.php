<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Agregar columna id_categoria_paquete (nullable, sin FK todavía)
        Schema::table('paquetes_decoracion', function (Blueprint $table) {
            $table->unsignedBigInteger('id_categoria_paquete')->nullable()->after('categoria_servicio');
        });

        // 2. Mapear los valores del ENUM a IDs de categorías
        // (los IDs ya deben existir del seeder CategoriaPaqueteSeeder)
        $mapa = [
            'Romántico' => 1,
            'Fantasía' => 2,
            'Aniversario' => 3,
            'Premium' => 4,
        ];

        foreach ($mapa as $nombre => $id) {
            DB::table('paquetes_decoracion')
                ->where('categoria_servicio', $nombre)
                ->update(['id_categoria_paquete' => $id]);
        }

        // 3. Eliminar la columna ENUM vieja
        Schema::table('paquetes_decoracion', function (Blueprint $table) {
            $table->dropIndex(['categoria_servicio']); // quitar índice
        });

        Schema::table('paquetes_decoracion', function (Blueprint $table) {
            $table->dropColumn('categoria_servicio');
        });

        // 4. Agregar la FK
        Schema::table('paquetes_decoracion', function (Blueprint $table) {
            $table->foreign('id_categoria_paquete')
                  ->references('id_categoria_paquete')
                  ->on('categorias_paquete')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('paquetes_decoracion', function (Blueprint $table) {
            $table->dropForeign(['id_categoria_paquete']);
            $table->dropColumn('id_categoria_paquete');
        });

        Schema::table('paquetes_decoracion', function (Blueprint $table) {
            $table->enum('categoria_servicio', ['Romántico', 'Fantasía', 'Aniversario', 'Premium'])
                  ->default('Romántico')
                  ->after('imagen');
        });
    }
};