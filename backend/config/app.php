<?php

return [
'name' => env('APP_NAME', 'Hospedaje'),

'env' => env('APP_ENV', 'production'),

'debug' => (bool) env('APP_DEBUG', false),

'url' => env('APP_URL', 'http://localhost'),

'timezone' => 'America/Lima',   // ← cambiar de 'UTC' a 'America/Lima'

'locale' => env('APP_LOCALE', 'es'),   // ← cambiar 'en' a 'es'

'fallback_locale' => env('APP_FALLBACK_LOCALE', 'es'),

'faker_locale' => env('APP_FAKER_LOCALE', 'es_PE'),

    'cipher' => 'AES-256-CBC',

    'key' => env('APP_KEY'),

    'previous_keys' => [
        ...array_filter(
            explode(',', (string) env('APP_PREVIOUS_KEYS', ''))
        ),
    ],

    /*
    |--------------------------------------------------------------------------
    | Maintenance Mode Driver
    |--------------------------------------------------------------------------
    |
    | These configuration options determine the driver used to determine and
    | manage Laravel's "maintenance mode" status. The "cache" driver will
    | allow maintenance mode to be controlled across multiple machines.
    |
    | Supported drivers: "file", "cache"
    |
    */

    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],

];
