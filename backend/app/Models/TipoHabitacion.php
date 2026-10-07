<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function habitaciones(): HasMany
    {
        return $this->hasMany(Habitacion::class, 'id_tipo', 'id_tipo');
    }

    public function tarifas(): HasMany
    {
        return $this->hasMany(Tarifa::class, 'id_tipo', 'id_tipo');
    }

    public function paquetesDecoracion(): HasMany
    {
        return $this->hasMany(PaqueteDecoracion::class, 'id_tipo_habitacion', 'id_tipo');
    }

    public function promociones(): HasMany
    {
        return $this->hasMany(Promocion::class, 'id_tipo_habitacion', 'id_tipo');
    }
}