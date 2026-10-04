<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaqueteDecoracion extends Model
{
    protected $table = 'paquetes_decoracion';
    protected $primaryKey = 'id_paquete';

    public $timestamps = true;
    const UPDATED_AT = null;

    protected $fillable = [
        'nombre', 'slug', 'descripcion',
        'precio_total', 'ganancia_local', 'ganancia_proveedor',
        'id_proveedor', 'id_tipo_habitacion',
        'imagen',
        'horas_incluidas',
        'incluye_jacuzzi', 'incluye_vino', 'incluye_decoracion',
        'incluye_sexshop', 'incluye_netflix', 'activo',
    ];

    protected $casts = [
        'precio_total' => 'decimal:2',
        'ganancia_local' => 'decimal:2',
        'ganancia_proveedor' => 'decimal:2',
        'horas_incluidas' => 'integer',
        'incluye_jacuzzi' => 'boolean',
        'incluye_vino' => 'boolean',
        'incluye_decoracion' => 'boolean',
        'incluye_sexshop' => 'boolean',
        'incluye_netflix' => 'boolean',
        'activo' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor', 'id_proveedor');
    }

    public function tipoHabitacion(): BelongsTo
    {
        return $this->belongsTo(TipoHabitacion::class, 'id_tipo_habitacion', 'id_tipo');
    }
}