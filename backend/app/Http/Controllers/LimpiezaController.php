<?php

namespace App\Http\Controllers;

use App\Models\Limpieza;
use Illuminate\Http\JsonResponse;

class LimpiezaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Limpieza::with(['habitacion', 'usuarioAsignado'])
                ->orderByDesc('id_limpieza')
                ->get()
        );
    }

    public function pendientes(): JsonResponse
    {
        return response()->json(
            Limpieza::with(['habitacion'])
                ->whereIn('estado', ['PENDIENTE', 'EN_PROCESO'])
                ->orderBy('fecha_solicitud')
                ->get()
        );
    }

    public function finalizar(int $id): JsonResponse
    {
        $limpieza = Limpieza::findOrFail($id);
        $limpieza->update([
            'estado' => 'COMPLETADA',
            'fecha_fin' => now(),
            'id_usuario_asignado' => auth()->id(),
        ]);
        return response()->json([
            'mensaje' => 'Limpieza finalizada',
            'data' => $limpieza->fresh(),
        ]);
    }

    public function iniciar(int $id): JsonResponse
    {
        $limpieza = Limpieza::findOrFail($id);
        $limpieza->update([
            'estado' => 'EN_PROCESO',
            'fecha_inicio' => now(),
            'id_usuario_asignado' => auth()->id(),
        ]);
        return response()->json([
            'mensaje' => 'Limpieza iniciada',
            'data' => $limpieza->fresh(),
        ]);
    }
}