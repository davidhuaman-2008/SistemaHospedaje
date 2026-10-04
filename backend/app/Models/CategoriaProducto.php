<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoriaProducto extends Model
{
    protected $table = 'categorias_producto';
    protected $primaryKey = 'id_categoria_producto';

    protected $fillable = [
        'nombre', 'slug', 'descripcion', 'icono', 'color', 'orden', 'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'orden' => 'integer',
    ];

    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class, 'id_categoria_producto', 'id_categoria_producto');
    }
}