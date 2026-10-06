<?php

namespace App\Console\Commands;

use App\Services\ReservaService;
use Illuminate\Console\Command;

class ProcesarNoShowReservas extends Command
{
    protected $signature = 'reservas:procesar-no-show';
    protected $description = 'Marca como No-Show las reservas que pasaron la tolerancia sin check-in';

    public function handle(ReservaService $service): int
    {
        $this->info('Procesando reservas No-Show...');

        try {
            $total = $service->procesarNoShow();
            $this->info("OK Reservas marcadas como No-Show: {$total}");
            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('Error: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}