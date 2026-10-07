<?php

// ⚠️ CAMBIO: `User` → `Usuario` (el modelo real del proyecto).
use App\Models\Usuario;

return [

    // Guard y broker por defecto (por env).
    'defaults' => [
        'guard' => env('AUTH_GUARD', 'web'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    // Guards de autenticación.
    // En este proyecto el guard `web` NO se usa (todo va por Sanctum).
    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
    ],

    // Providers (fuente de datos de usuarios).
    // El driver `eloquent` usa el modelo Usuario.
    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => env('AUTH_MODEL', Usuario::class),  // ← CAMBIO
        ],
    ],

    // Configuración de reset de contraseña (NO se usa, porque no hay flujo de reset).
    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    // Tiempo de expiración de la confirmación de contraseña (3h).
    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

];
