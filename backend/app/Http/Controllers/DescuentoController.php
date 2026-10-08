<?php

namespace App\Http\Controllers;

use App\Services\DescuentoService;
use Illuminate\Http\JsonResponse;

class DescuentoController extends Controller
{
    public function __construct(private DescuentoService $service) {}

    /**
     * GET /api/descuentos/config
     * Devuelve las configuraciones de descuentos automaticos.
     */
    public function config(): JsonResponse
    {
        return response()->json($this->service->obtenerConfiguraciones());
    }

    /**
     * GET /api/descuentos/manuales
     * Devuelve las opciones de descuento manual disponibles.
     */
    public function manuales(): JsonResponse
    {
        return response()->json($this->service->obtenerManuales());
    }
}