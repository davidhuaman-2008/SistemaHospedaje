<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoCuentaPagar extends Model
{
    protected $table = 'estados_cuenta_pagar';
    protected $primaryKey = 'id_estado_cuenta';

    protected $fillable = [
        'nombre', 'slug', 'descripcion', 'color', 'icono',
        'es_estado_final', 'orden', 'activo',
    ];

    protected $casts = [
        'es_estado_final' => 'boolean',
        'activo' => 'boolean',
        'orden' => 'integer',
    ];

    public function cuentas(): HasMany
    {
        return $this->hasMany(CuentaPagar::class, 'id_estado_cuenta', 'id_estado_cuenta');
    }
}