<?php

use App\Providers\AppServiceProvider;

// Array de Service Providers que Laravel carga al arrancar.
// Cada provider registra servicios en el contenedor de dependencias
// y/o ejecuta lógica de arranque (boot).
return [
    AppServiceProvider::class,
];
