<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Promocion extends Model
{
    protected $table = 'promociones';
    protected $primaryKey = 'id_promocion';

    protected $fillable = [
        'nombre', 'descripcion', 'id_categoria_promocion', 'tipo', 'valor',
        'fecha_inicio', 'fecha_fin', 'dias_semana', 'hora_inicio', 'hora_fin',
        'id_tipo_habitacion', 'monto_minimo',
        'requiere_codigo', 'codigo',
        'limite_uso', 'usos_actuales', 'limite_por_cliente',
        'acumulable', 'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'requiere_codigo' => 'boolean',
        'acumulable' => 'boolean',
        'valor' => 'decimal:2',
        'monto_minimo' => 'decimal:2',
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'limite_uso' => 'integer',
        'usos_actuales' => 'integer',
        'limite_por_cliente' => 'integer',
    ];

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(CategoriaPromocion::class, 'id_categoria_promocion', 'id_categoria_promocion');
    }

    public function tipoHabitacion(): BelongsTo
    {
        return $this->belongsTo(TipoHabitacion::class, 'id_tipo_habitacion', 'id_tipo');
    }

    public function promocionesCliente(): HasMany
    {
        return $this->hasMany(PromocionCliente::class, 'id_promocion', 'id_promocion');
    }
}