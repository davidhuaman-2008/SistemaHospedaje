<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Limpieza extends Model
{
    protected $table = 'limpieza';
    protected $primaryKey = 'id_limpieza';

    protected $fillable = [
        'id_habitacion', 'id_reserva', 'id_usuario_asignado',
        'estado', 'tipo', 'fecha_solicitud', 'fecha_inicio', 'fecha_fin',
        'observaciones',
    ];

    protected $casts = [
        'fecha_solicitud' => 'datetime',
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

    public function usuarioAsignado(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_asignado', 'id');
    }
}