<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReservaConsumo extends Model
{
    protected $table = 'reserva_consumos';
    protected $primaryKey = 'id_consumo';

    protected $fillable = [
        'id_reserva', 'id_producto', 'cantidad',
        'precio_unitario', 'subtotal', 'pagado', 'id_metodo_pago',
        'id_usuario', 'fecha_consumo', 'observaciones',
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'precio_unitario' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'pagado' => 'boolean',
        'fecha_consumo' => 'datetime',
    ];

    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class, 'id_reserva', 'id_reserva');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
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