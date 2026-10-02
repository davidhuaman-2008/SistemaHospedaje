<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GravedadObservacion extends Model
{
    protected $table = 'gravedades_observacion';
    protected $primaryKey = 'id_gravedad';

    protected $fillable = [
        'nombre', 'slug', 'color', 'prioridad', 'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'prioridad' => 'integer',
    ];
}