<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function reservas(): HasMany
    {
        return $this->hasMany(Reserva::class, 'id_estado', 'id_estado');
    }
}