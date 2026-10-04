<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoriaPromocion extends Model
{
    protected $table = 'categorias_promocion';
    protected $primaryKey = 'id_categoria_promocion';

    protected $fillable = [
        'nombre', 'slug', 'descripcion', 'icono', 'color', 'orden', 'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'orden' => 'integer',
    ];

    public function promociones(): HasMany
    {
        return $this->hasMany(Promocion::class, 'id_categoria_promocion', 'id_categoria_promocion');
    }
}