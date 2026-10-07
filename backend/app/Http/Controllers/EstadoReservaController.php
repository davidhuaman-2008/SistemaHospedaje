<?php

namespace App\Http\Controllers;

use App\Models\EstadoReserva;
use Illuminate\Http\JsonResponse;

class EstadoReservaController extends Controller
{
    // GET /estados-reserva → lista TODOS los estados ordenados por `orden`.
    public function index(): JsonResponse
    {
        return response()->json(EstadoReserva::orderBy('orden')->get());
    }

    // GET /estados-reserva/activos → solo los que tienen activo = true.
    public function activos(): JsonResponse
    {
        return response()->json(
            EstadoReserva::where('activo', true)->orderBy('orden')->get()
        );
    }
}
