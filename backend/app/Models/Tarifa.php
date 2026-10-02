<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tarifa extends Model
{
    protected $table = 'tarifas';
    protected $primaryKey = 'id_tarifa';

    protected $fillable = [
        'id_tipo',
        'horas',
        'monto',
        'precio_hora_extra',
        'max_horas_extra',
        'precio_turno_adicional',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'horas' => 'integer',
        'max_horas_extra' => 'integer',
        'monto' => 'decimal:2',
        'precio_hora_extra' => 'decimal:2',
        'precio_turno_adicional' => 'decimal:2',
    ];

    public function tipo(): BelongsTo
    {
        return $this->belongsTo(TipoHabitacion::class, 'id_tipo', 'id_tipo');
    }
}