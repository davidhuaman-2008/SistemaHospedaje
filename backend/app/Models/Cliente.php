<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cliente extends Model
{
    protected $table = 'clientes';
    protected $primaryKey = 'id_cliente';

    protected $fillable = [
        'nombre', 'apellido', 'id_tipo_documento', 'numero_documento',
        'celular', 'email', 'fecha_nacimiento', 'fecha_aniversario',
        'direccion', 'visitas', 'ultima_visita', 'total_gastado',
        'id_nivel', 'activo',
    ];


    protected $casts = [
        'activo' => 'boolean',
        'visitas' => 'integer',
        'total_gastado' => 'decimal:2',
        'fecha_nacimiento' => 'date',
        'fecha_aniversario' => 'date',
        'ultima_visita' => 'date',
    ];

    public function tipoDocumento(): BelongsTo
    {
        return $this->belongsTo(TipoDocumento::class, 'id_tipo_documento', 'id_documento');
    }

    public function nivel(): BelongsTo
    {
        return $this->belongsTo(ClienteNivel::class, 'id_nivel', 'id_nivel');
    }

    public function visitas(): HasMany
    {
        return $this->hasMany(ClienteVisita::class, 'id_cliente', 'id_cliente');
    }

    public function observaciones(): HasMany
    {
        return $this->hasMany(ClienteObservacion::class, 'id_cliente', 'id_cliente');
    }

    public function observacionesPendientes(): HasMany
    {
        return $this->hasMany(ClienteObservacion::class, 'id_cliente', 'id_cliente')
                    ->where('resuelto', false);
    }
}