<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoMantenimiento extends Model
{
    protected $table = 'tipos_mantenimiento';
    protected $primaryKey = 'id_tipo_mantenimiento';

    protected $fillable = [
        'nombre', 'slug', 'descripcion', 'icono', 'color', 'orden', 'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'orden' => 'integer',
    ];

    public function mantenimientos(): HasMany
    {
        return $this->hasMany(Mantenimiento::class, 'id_tipo_mantenimiento', 'id_tipo_mantenimiento');
    }
}