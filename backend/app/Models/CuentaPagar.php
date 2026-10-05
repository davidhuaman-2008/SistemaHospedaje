<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CuentaPagar extends Model
{
    protected $table = 'cuentas_por_pagar';
    protected $primaryKey = 'id_cuenta';

    protected $fillable = [
        'id_proveedor', 'id_estado_cuenta', 'id_reserva', 'id_decoracion',
        'concepto', 'monto', 'monto_pagado', 'saldo',
        'fecha_emision', 'fecha_vencimiento',
        'id_usuario_creacion', 'id_usuario_anulacion',
        'fecha_anulacion', 'motivo_anulacion', 'notas',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'monto_pagado' => 'decimal:2',
        'saldo' => 'decimal:2',
        'fecha_emision' => 'datetime',
        'fecha_vencimiento' => 'datetime',
        'fecha_anulacion' => 'datetime',
    ];

    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor', 'id_proveedor');
    }

    public function estado(): BelongsTo
    {
        return $this->belongsTo(EstadoCuentaPagar::class, 'id_estado_cuenta', 'id_estado_cuenta');
    }

    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class, 'id_reserva', 'id_reserva');
    }

    public function usuarioCreacion(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_creacion', 'id');
    }

    public function usuarioAnulacion(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_anulacion', 'id');
    }

    public function pagos(): HasMany
    {
        return $this->hasMany(PagoProveedor::class, 'id_cuenta', 'id_cuenta');
    }
}