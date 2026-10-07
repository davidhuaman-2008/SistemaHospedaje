<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// Crea la app en la raíz del proyecto y la configura.
return Application::configure(basePath: dirname(__DIR__))

    // Registra los archivos de rutas de la aplicación.
    ->withRouting(
        web: __DIR__.'/../routes/web.php',        // rutas web (no se usan, es API pura)
        api: __DIR__.'/../routes/api.php',        // ← aquí viven los 400+ endpoints
        commands: __DIR__.'/../routes/console.php', // comandos artisan + schedules
        health: '/up',                            // endpoint de health check
    )

    // Middleware global (vacío por defecto → se puede agregar CORS, etc.).
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })

    // Manejo de excepciones (vacío por defecto).
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })

    // Construye y devuelve la app lista.
    ->create();
