<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Configuracion extends Model
{
    protected $table = 'configuraciones';
    protected $primaryKey = 'id_configuracion';

    protected $fillable = [
        'clave', 'valor', 'tipo', 'descripcion', 'grupo',
    ];

    /**
     * Obtiene un valor de configuración casteado según su tipo.
     */
    public static function obtener(string $clave, mixed $default = null): mixed
    {
        $config = static::where('clave', $clave)->first();
        if (!$config) return $default;

        return match ($config->tipo) {
            'INT' => (int) $config->valor,
            'DECIMAL' => (float) $config->valor,
            'BOOLEAN' => filter_var($config->valor, FILTER_VALIDATE_BOOLEAN),
            default => $config->valor,
        };
    }

    /**
     * Establece un valor de configuración.
     */
    public static function establecer(string $clave, mixed $valor): void
    {
        static::where('clave', $clave)->update(['valor' => (string) $valor]);
    }
}