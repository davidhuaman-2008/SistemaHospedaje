<?php

namespace App\Http\Controllers;

use App\Services\EstadoHabitacionService;
use App\Models\Habitacion;
use Illuminate\Http\JsonResponse;

class EstadoHabitacionController extends Controller
{
    public function __construct(private EstadoHabitacionService $service) {}

    public function mapa(): JsonResponse
    {
        return response()->json($this->service->mapa());
    }

    public function show(int $id): JsonResponse
    {
        $habitacion = Habitacion::with(['piso', 'tipo'])->findOrFail($id);
        $estado = $this->service->calcular($habitacion);
        return response()->json([
            'habitacion' => $habitacion,
            'estado' => $estado,
        ]);
    }
}