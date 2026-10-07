<?php

namespace App\Http\Controllers;

use App\Services\EstadoHabitacionService;
use App\Models\Habitacion;
use Illuminate\Http\JsonResponse;

class EstadoHabitacionController extends Controller
{
    // Inyecta el Service que calcula el estado en vivo de cada habitación.
    public function __construct(private EstadoHabitacionService $service) {}

    // GET /habitaciones-mapa → devuelve las 32 habitaciones con su estado calculado.
    public function mapa(): JsonResponse
    {
        return response()->json($this->service->mapa());
    }

    // GET /habitaciones-mapa/{id} → una habitación con su estado calculado.
    public function show(int $id): JsonResponse
    {
        // Carga la habitación con sus relaciones piso y tipo (eager loading).
        // findOrFail → si no existe, devuelve 404 automáticamente.
        $habitacion = Habitacion::with(['piso', 'tipo'])->findOrFail($id);

        // Calcula el estado en vivo (Disponible, Ocupada, Por vencer, Vencida, etc.).
        $estado = $this->service->calcular($habitacion);

        // Devuelve la habitación completa + su estado calculado.
        return response()->json([
            'habitacion' => $habitacion,
            'estado' => $estado,
        ]);
    }
}
