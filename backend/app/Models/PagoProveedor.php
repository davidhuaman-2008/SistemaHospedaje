<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PagoProveedor extends Model
{
    protected $table = 'pagos_proveedor';
    protected $primaryKey = 'id_pago_proveedor';

    protected $fillable = [
        'id_cuenta', 'monto', 'id_metodo_pago', 'fecha_pago', 'id_usuario',
        'referencia', 'observaciones',
        'anulado', 'id_usuario_anulacion', 'fecha_anulacion', 'motivo_anulacion',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'fecha_pago' => 'datetime',
        'anulado' => 'boolean',
        'fecha_anulacion' => 'datetime',
    ];

    public function cuenta(): BelongsTo
    {
        return $this->belongsTo(CuentaPagar::class, 'id_cuenta', 'id_cuenta');
    }

    public function metodoPago(): BelongsTo
    {
        return $this->belongsTo(MetodoPago::class, 'id_metodo_pago', 'id_metodo');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id');
    }

    public function usuarioAnulacion(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_anulacion', 'id');
    }
}