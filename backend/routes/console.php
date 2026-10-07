<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Procesar No-Show de reservas cada minuto
Schedule::command('reservas:procesar-no-show')->everyMinute();

// Liberar reservas vencidas sin check-in (cada minuto)
Schedule::command('reservas:liberar-vencidas')->everyMinute();