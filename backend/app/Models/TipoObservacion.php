<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoObservacion extends Model
{
    protected $table = 'tipos_observacion';
    protected $primaryKey = 'id_tipo_observacion';

    protected $fillable = [
        'nombre', 'slug', 'icono', 'color', 'descripcion', 'orden', 'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'orden' => 'integer',
    ];
}