<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MetodoPago extends Model
{
    protected $table = 'metodos_pago';
    protected $primaryKey = 'id_metodo';

    protected $fillable = [
        'nombre', 'descripcion', 'es_de_caja', 'icono', 'color',
        'orden', 'activo',
    ];

    protected $casts = [
        'es_de_caja' => 'boolean',
        'activo' => 'boolean',
        'orden' => 'integer',
    ];
}