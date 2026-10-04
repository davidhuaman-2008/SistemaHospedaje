<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OcupacionHabitacion extends Model
{
    protected $table = 'ocupacion_habitacion';
    protected $primaryKey = 'id_ocupacion';

    protected $fillable = [
        'id_habitacion', 'id_reserva', 'fecha_inicio', 'fecha_fin', 'estado',
    ];

    protected $casts = [
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
    ];

    public function habitacion(): BelongsTo
    {
        return $this->belongsTo(Habitacion::class, 'id_habitacion', 'id_habitacion');
    }

    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class, 'id_reserva', 'id_reserva');
    }
}