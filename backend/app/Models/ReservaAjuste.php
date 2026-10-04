<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReservaAjuste extends Model
{
    protected $table = 'reserva_ajustes';
    protected $primaryKey = 'id_ajuste';

    protected $fillable = [
        'id_reserva', 'tipo', 'monto_anterior', 'monto_nuevo',
        'diferencia', 'id_usuario', 'fecha_ajuste', 'notas',
    ];

    protected $casts = [
        'monto_anterior' => 'decimal:2',
        'monto_nuevo' => 'decimal:2',
        'diferencia' => 'decimal:2',
        'fecha_ajuste' => 'datetime',
    ];

    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class, 'id_reserva', 'id_reserva');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id');
    }
}