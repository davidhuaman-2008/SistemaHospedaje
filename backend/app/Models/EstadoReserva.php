<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EstadoReserva extends Model
{
    protected $table = 'estados_reserva';
    protected $primaryKey = 'id_estado';

    protected $fillable = [
        'nombre', 'slug', 'color', 'descripcion', 'orden', 'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'orden' => 'integer',
    ];
}