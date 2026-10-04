<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromocionCliente extends Model
{
    protected $table = 'promociones_cliente';
    protected $primaryKey = 'id_promo_cliente';

    protected $fillable = [
        'id_promocion', 'id_cliente', 'codigo_personalizado',
        'fecha_vencimiento', 'usado', 'fecha_uso',
    ];

    protected $casts = [
        'usado' => 'boolean',
        'fecha_vencimiento' => 'date',
        'fecha_uso' => 'datetime',
    ];

    public function promocion(): BelongsTo
    {
        return $this->belongsTo(Promocion::class, 'id_promocion', 'id_promocion');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente', 'id_cliente');
    }
}