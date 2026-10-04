<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PagoReserva extends Model
{
    protected $table = 'pagos_reserva';
    protected $primaryKey = 'id_pago';

    protected $fillable = [
        'id_reserva', 'id_metodo_pago', 'monto', 'es_adelanto', 'fecha_pago',
        'id_usuario', 'observaciones',
        'anulado', 'id_usuario_anulacion', 'fecha_anulacion', 'motivo_anulacion',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'es_adelanto' => 'boolean',
        'fecha_pago' => 'datetime',
        'anulado' => 'boolean',
        'fecha_anulacion' => 'datetime',
    ];

    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class, 'id_reserva', 'id_reserva');
    }

    public function metodoPago(): BelongsTo
    {
        return $this->belongsTo(MetodoPago::class, 'id_metodo_pago', 'id_metodo');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id');
    }
}