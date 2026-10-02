<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClienteNivel extends Model
{
    protected $table = 'clientes_niveles';
    protected $primaryKey = 'id_nivel';

    protected $fillable = [
        'nombre', 'visitas_min', 'visitas_max', 'descuento',
        'color', 'icono', 'beneficios', 'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'visitas_min' => 'integer',
        'visitas_max' => 'integer',
        'descuento' => 'decimal:2',
    ];
}