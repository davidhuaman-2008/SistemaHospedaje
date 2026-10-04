<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Listener temporal para contar queries y medir tiempos
        DB::listen(function ($query) {
            Log::info('QUERY: ' . $query->sql . ' | TIEMPO: ' . $query->time . 'ms');
        });
    }
}