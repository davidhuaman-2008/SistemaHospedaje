<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Decoracion extends Model
{
    protected $table = 'decoraciones';
    protected $primaryKey = 'id_decoracion';

    protected $fillable = [
        'id_reserva', 'id_paquete', 'id_proveedor', 'estado',
        'fecha_programada', 'fecha_inicio_preparacion', 'fecha_inicio', 'fecha_fin',
        'precio_total', 'ganancia_local', 'ganancia_proveedor', 'adelanto', 'saldo',
        'frase_personalizada', 'musica', 'notas',
        'id_cuenta_pagar',
        'id_usuario_creacion', 'id_usuario_anulacion', 'fecha_anulacion', 'motivo_anulacion',
    ];

    protected $casts = [
        'fecha_programada' => 'datetime',
        'fecha_inicio_preparacion' => 'datetime',
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
        'precio_total' => 'decimal:2',
        'ganancia_local' => 'decimal:2',
        'ganancia_proveedor' => 'decimal:2',
        'adelanto' => 'decimal:2',
        'saldo' => 'decimal:2',
        'fecha_anulacion' => 'datetime',
    ];

    public function reserva(): BelongsTo
    {
        return $this->belongsTo(Reserva::class, 'id_reserva', 'id_reserva');
    }

    public function paquete(): BelongsTo
    {
        return $this->belongsTo(PaqueteDecoracion::class, 'id_paquete', 'id_paquete');
    }

    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor', 'id_proveedor');
    }

    public function cuentaPagar(): BelongsTo
    {
        return $this->belongsTo(CuentaPagar::class, 'id_cuenta_pagar', 'id_cuenta');
    }

    public function usuarioCreacion(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_creacion', 'id');
    }

    public function usuarioAnulacion(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_anulacion', 'id');
    }

    /**
     * Estados disponibles (hardcoded)
     */
    public static function estados(): array
    {
        return [
            'programada' => ['nombre' => 'Programada', 'color' => '#f59e0b', 'icono' => 'calendar-clock'],
            'en-proceso' => ['nombre' => 'En proceso', 'color' => '#eab308', 'icono' => 'loader'],
            'finalizada' => ['nombre' => 'Finalizada', 'color' => '#10b981', 'icono' => 'check-check'],
            'cancelada' => ['nombre' => 'Cancelada', 'color' => '#64748b', 'icono' => 'x-circle'],
        ];
    }

    /**
     * Accessor para obtener el estado con su metadata.
     */
    public function getEstadoInfoAttribute(): array
    {
        $estados = self::estados();
        return $estados[$this->estado] ?? $estados['programada'];
    }
}