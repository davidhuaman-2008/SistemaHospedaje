<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClienteVisita extends Model
{
    protected $table = 'cliente_visitas';
    protected $primaryKey = 'id_visita';

    protected $fillable = [
        'id_cliente', 'id_reserva', 'id_habitacion',
        'fecha_entrada', 'fecha_salida', 'monto_gastado',
    ];

    protected $casts = [
        'fecha_entrada' => 'datetime',
        'fecha_salida' => 'datetime',
        'monto_gastado' => 'decimal:2',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente', 'id_cliente');
    }
}