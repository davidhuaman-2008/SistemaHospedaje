<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Reserva extends Model
{
    protected $table = 'reservas';
    protected $primaryKey = 'id_reserva';

    protected $fillable = [
        'codigo_reserva', 'tipo_reserva', 'id_estado',
        'id_cliente', 'id_habitacion', 'id_tarifa', 'id_usuario_creacion',
        'cantidad_personas',
        'fecha_entrada', 'fecha_salida_prevista', 'fecha_salida_real',
        'horas_base', 'horas_extra', 'horas_totales',
        'monto_habitacion', 'monto_horas_extra', 'monto_consumos', 'monto_ajustes',
        'descuento', 'descuento_porcentaje',
        'total', 'pagado', 'saldo',
        'vuelto_entregado',
        'telefono', 'notas', 'observaciones',
        'id_usuario_anulacion', 'fecha_anulacion', 'motivo_anulacion',
    ];

    protected $casts = [
        'cantidad_personas' => 'integer',
        'fecha_entrada' => 'datetime',
        'fecha_salida_prevista' => 'datetime',
        'fecha_salida_real' => 'datetime',
        'horas_base' => 'integer',
        'horas_extra' => 'integer',
        'horas_totales' => 'integer',
        'monto_habitacion' => 'decimal:2',
        'monto_horas_extra' => 'decimal:2',
        'monto_consumos' => 'decimal:2',
        'monto_ajustes' => 'decimal:2',
        'descuento' => 'decimal:2',
        'descuento_porcentaje' => 'decimal:2',
        'total' => 'decimal:2',
        'pagado' => 'decimal:2',
        'saldo' => 'decimal:2',
        'vuelto_entregado' => 'decimal:2',
        'fecha_anulacion' => 'datetime',
    ];

    public function estado(): BelongsTo
    {
        return $this->belongsTo(EstadoReserva::class, 'id_estado', 'id_estado');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente', 'id_cliente');
    }

    public function habitacion(): BelongsTo
    {
        return $this->belongsTo(Habitacion::class, 'id_habitacion', 'id_habitacion');
    }

    public function tarifa(): BelongsTo
    {
        return $this->belongsTo(Tarifa::class, 'id_tarifa', 'id_tarifa');
    }

    public function usuarioCreacion(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_creacion', 'id');
    }

    public function usuarioAnulacion(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_anulacion', 'id');
    }

    public function ocupaciones(): HasMany
    {
        return $this->hasMany(OcupacionHabitacion::class, 'id_reserva', 'id_reserva');
    }

    public function pagos(): HasMany
    {
        return $this->hasMany(PagoReserva::class, 'id_reserva', 'id_reserva');
    }

    public function registroEstadia(): HasOne
    {
        return $this->hasOne(RegistroEstadia::class, 'id_reserva', 'id_reserva');
    }

    public function consumos(): HasMany
    {
        return $this->hasMany(ReservaConsumo::class, 'id_reserva', 'id_reserva');
    }

    public function ajustes(): HasMany
    {
        return $this->hasMany(ReservaAjuste::class, 'id_reserva', 'id_reserva');
    }

    /**
     * Calcula el vuelto final: pagado - total
     * Positivo = a devolver
     * Negativo = a cobrar
     */
    public function getVueltoFinalAttribute(): float
    {
        return round((float) $this->pagado - (float) $this->total, 2);
    }

    /**
     * Recalcula el total sumando todos los conceptos.
     */
    public function recalcularTotal(): void
    {
        $this->total = round(
            (float) $this->monto_habitacion
            + (float) $this->monto_horas_extra
            + (float) $this->monto_consumos
            + (float) $this->monto_ajustes
            - (float) $this->descuento,
            2
        );
        $this->saldo = max(0, round((float) $this->total - (float) $this->pagado, 2));
    }
}