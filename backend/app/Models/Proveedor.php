<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proveedor extends Model
{
    protected $table = 'proveedores';
    protected $primaryKey = 'id_proveedor';

    protected $fillable = [
        'razon_social', 'nombre_comercial', 'ruc', 'telefono', 'email',
        'direccion', 'contacto', 'tipo', 'notas', 'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class, 'id_proveedor', 'id_proveedor');
    }

    public function cuentasPagar(): HasMany
    {
        return $this->hasMany(CuentaPagar::class, 'id_proveedor', 'id_proveedor');
    }

    public function paquetesDecoracion(): HasMany
    {
        return $this->hasMany(PaqueteDecoracion::class, 'id_proveedor', 'id_proveedor');
    }
}