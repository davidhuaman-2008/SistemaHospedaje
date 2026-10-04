<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegistroEstadia extends Model
{
    protected $table = 'registros_estadia';
    protected $primaryKey = 'id_registro';

    protected $fillable = [
        'id_reserva', 'fecha_entrada', 'fecha_salida', 'horas_reales',
        'id_usuario_checkin', 'id_usuario_checkout',
        'monto_final', 'observaciones',
    ];

    protected $casts = [
        'fecha_entrada' => 'datetime',
        'fecha_salida' => 'datetime',
        'horas_reales' => 'integer',
        'monto_final' => 'decimal:2',
    ];

    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class, 'id_reserva', 'id_reserva');
    }

    public function usuarioCheckin(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_checkin', 'id');
    }

    public function usuarioCheckout(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_checkout', 'id');
    }
}