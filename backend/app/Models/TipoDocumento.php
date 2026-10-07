<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function clientes(): HasMany
    {
        return $this->hasMany(Cliente::class, 'id_tipo_documento', 'id_documento');
    }
}