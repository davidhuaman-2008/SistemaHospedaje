<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoDocumento extends Model
{
    protected $table = 'tipos_documento';
    protected $primaryKey = 'id_documento';

    protected $fillable = [
        'nombre', 'abreviatura', 'longitud', 'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'longitud' => 'integer',
    ];
}