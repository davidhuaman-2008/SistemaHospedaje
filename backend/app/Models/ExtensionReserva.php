<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExtensionReserva extends Model
{
    protected $table = 'extensiones_reserva';
    protected $primaryKey = 'id_extension';

    protected $fillable = [
        'id_reserva', 'horas_extra', 'monto', 'es_turno_adicional',
        'minutos_exceso', 'precio_hora_extra_aplicado', 'tolerancia_minutos',
        'pagado_inmediato', 'cargado_a_cuenta', 'id_metodo_pago',
        'id_usuario', 'fecha_extension', 'observaciones',
    ];

    protected $casts = [
        'horas_extra' => 'integer',
        'monto' => 'decimal:2',
        'es_turno_adicional' => 'boolean',
        'minutos_exceso' => 'integer',
        'precio_hora_extra_aplicado' => 'decimal:2',
        'tolerancia_minutos' => 'integer',
        'pagado_inmediato' => 'boolean',
        'cargado_a_cuenta' => 'boolean',
        'fecha_extension' => 'datetime',
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