<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ConfiguracionController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Configuracion::orderBy('grupo')->orderBy('clave')->get()
        );
    }

    public function porGrupo(string $grupo): JsonResponse
    {
        return response()->json(
            Configuracion::where('grupo', $grupo)->orderBy('clave')->get()
        );
    }

    public function update(Request $request, string $clave): JsonResponse
    {
        $datos = $request->validate([
            'valor' => 'required|string|max:255',
        ]);

        $config = Configuracion::where('clave', $clave)->firstOrFail();
        $config->update(['valor' => $datos['valor']]);

        return response()->json([
            'mensaje' => 'Configuración actualizada',
            'data' => $config->fresh(),
        ]);
    }
}