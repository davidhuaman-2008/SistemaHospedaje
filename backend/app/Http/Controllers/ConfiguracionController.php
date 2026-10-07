<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ConfiguracionController extends Controller
{
    // GET /configuraciones → lista TODAS las configuraciones del sistema.
    // Ordenadas por grupo y luego por clave (para agruparlas visualmente).
    public function index(): JsonResponse
    {
        return response()->json(
            Configuracion::orderBy('grupo')->orderBy('clave')->get()
        );
    }

    // GET /configuraciones/grupo/{grupo} → solo las de un grupo.
    // Ejemplo: /configuraciones/grupo/reservas → tolerancias, buffer, etc.
    public function porGrupo(string $grupo): JsonResponse
    {
        return response()->json(
            Configuracion::where('grupo', $grupo)->orderBy('clave')->get()
        );
    }

    // PUT /configuraciones/{clave} → actualiza el valor de UNA configuración.
    // Se identifica por su `clave` (string), NO por ID.
    public function update(Request $request, string $clave): JsonResponse
    {
        // Solo se permite cambiar el valor. La clave no se toca.
        $datos = $request->validate([
            'valor' => 'required|string|max:255',
        ]);

        // Busca por clave. Si no existe → 404 automático.
        $config = Configuracion::where('clave', $clave)->firstOrFail();
        $config->update(['valor' => $datos['valor']]);

        // Devuelve el modelo recargado desde la BD (fresh) para evitar caché.
        return response()->json([
            'mensaje' => 'Configuración actualizada',
            'data' => $config->fresh(),
        ]);
    }
}
