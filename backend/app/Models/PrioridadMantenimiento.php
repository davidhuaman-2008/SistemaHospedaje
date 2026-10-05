<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrioridadMantenimiento extends Model
{
    protected $table = 'prioridades_mantenimiento';
    protected $primaryKey = 'id_prioridad';

    protected $fillable = [
        'nombre', 'slug', 'color', 'orden', 'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'orden' => 'integer',
    ];

    public function mantenimientos(): HasMany
    {
        return $this->hasMany(Mantenimiento::class, 'id_prioridad', 'id_prioridad');
    }
}