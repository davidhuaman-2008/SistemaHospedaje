<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoriaMovimiento extends Model
{
    protected $table = 'categorias_movimiento';
    protected $primaryKey = 'id_categoria';

    protected $fillable = [
        'nombre', 'tipo', 'descripcion', 'orden', 'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'orden' => 'integer',
    ];
}