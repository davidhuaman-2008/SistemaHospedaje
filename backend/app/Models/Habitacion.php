<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Habitacion extends Model
{
    protected $table = 'habitaciones';
    protected $primaryKey = 'id_habitacion';

    protected $fillable = [
        'id_piso', 'id_tipo', 'numero', 'orden', 'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'orden' => 'integer',
    ];

    public function piso(): BelongsTo
    {
        return $this->belongsTo(Piso::class, 'id_piso', 'id_piso');
    }

    public function tipo(): BelongsTo
    {
        return $this->belongsTo(TipoHabitacion::class, 'id_tipo', 'id_tipo');
    }
}