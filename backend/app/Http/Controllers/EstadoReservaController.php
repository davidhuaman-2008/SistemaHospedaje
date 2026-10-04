<?php

namespace App\Http\Controllers;

use App\Models\EstadoReserva;
use Illuminate\Http\JsonResponse;

class EstadoReservaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(EstadoReserva::orderBy('orden')->get());
    }

    public function activos(): JsonResponse
    {
        return response()->json(
            EstadoReserva::where('activo', true)->orderBy('orden')->get()
        );
    }
}