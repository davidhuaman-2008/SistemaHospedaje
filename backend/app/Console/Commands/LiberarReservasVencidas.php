<?php

namespace App\Console\Commands;

use App\Models\Decoracion;
use App\Models\EstadoReserva;
use App\Models\OcupacionHabitacion;
use App\Models\Reserva;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class LiberarReservasVencidas extends Command
{
    protected $signature = 'reservas:liberar-vencidas';
    protected $description = 'Marca como no-show y libera reservas que pasaron su fecha de entrada sin check-in';

    public function handle(): int
    {
        $this->info('Buscando reservas vencidas sin check-in...');

        return DB::transaction(function () {
            $ahora = Carbon::now();

            // Buscar reservas confirmadas/pendientes sin check-in cuya fecha de salida prevista ya paso
            $reservas = Reserva::with(['registroEstadia', 'estado'])
                ->whereHas('estado', function ($q) {
                    $q->whereIn('slug', ['confirmada', 'pendiente']);
                })
                ->whereDoesntHave('registroEstadia')
                ->where('fecha_salida_prevista', '<', $ahora)
                ->get();

            if ($reservas->isEmpty()) {
                $this->info('OK No hay reservas vencidas para liberar.');
                return self::SUCCESS;
            }

            $estadoNoShow = EstadoReserva::where('slug', 'no-show')->first();

            if (!$estadoNoShow) {
                $this->error('ERROR: No existe el estado No-Show en la BD.');
                return self::FAILURE;
            }

            $contador = 0;

            foreach ($reservas as $reserva) {
                // Cambiar estado a no-show
                $reserva->update([
                    'id_estado' => $estadoNoShow->id_estado,
                    'observaciones' => ($reserva->observaciones ?? '') . ' [No-Show automatico: fecha vencida sin check-in]',
                ]);

                // Liberar la ocupacion
                OcupacionHabitacion::where('id_reserva', $reserva->id_reserva)
                    ->where('estado', 'ACTIVA')
                    ->update(['estado' => 'LIBERADA']);

                // Si tiene decoracion activa, cancelarla tambien
                Decoracion::where('id_reserva', $reserva->id_reserva)
                    ->whereIn('estado', ['programada', 'en-proceso'])
                    ->update([
                        'estado' => 'cancelada',
                        'motivo_anulacion' => 'Reserva vencida sin check-in',
                        'fecha_anulacion' => $ahora,
                    ]);

                $contador++;
                $this->line("  - Reserva {$reserva->codigo_reserva} (Habitacion {$reserva->id_habitacion}) liberada");
            }

            $this->info("OK Reservas liberadas: {$contador}");

            return self::SUCCESS;
        });
    }
}