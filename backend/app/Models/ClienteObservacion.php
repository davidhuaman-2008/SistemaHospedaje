<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClienteObservacion extends Model
{
    protected $table = 'cliente_observaciones';
    protected $primaryKey = 'id_observacion';

    protected $fillable = [
        'id_cliente', 'id_tipo_observacion', 'id_gravedad',
        'motivo', 'monto_deuda', 'resuelto', 'fecha_resolucion',
        'id_usuario_creacion',
    ];

    protected $casts = [
        'resuelto' => 'boolean',
        'monto_deuda' => 'decimal:2',
        'fecha_resolucion' => 'datetime',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente', 'id_cliente');
    }

    public function tipo(): BelongsTo
    {
        return $this->belongsTo(TipoObservacion::class, 'id_tipo_observacion', 'id_tipo_observacion');
    }

    public function gravedad(): BelongsTo
    {
        return $this->belongsTo(GravedadObservacion::class, 'id_gravedad', 'id_gravedad');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_creacion', 'id');
    }
}