<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoHabitacion extends Model
{
    protected $table = 'tipos_habitacion';
    protected $primaryKey = 'id_tipo';

    protected $fillable = [
        'nombre', 'slug', 'descripcion', 'capacidad', 'camas',
        'tiene_jacuzzi', 'activo',
    ];

    protected $casts = [
        'tiene_jacuzzi' => 'boolean',
        'activo' => 'boolean',
        'capacidad' => 'integer',
        'camas' => 'integer',
    ];
}