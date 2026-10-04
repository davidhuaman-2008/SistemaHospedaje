<?php

namespace App\Services;

use App\Models\PromocionCliente;
use Illuminate\Support\Collection;

class PromocionClienteService
{
    public function listar(): Collection
    {
        return PromocionCliente::with(['promocion', 'cliente'])
            ->orderByDesc('id_promo_cliente')
            ->get();
    }

    public function listarPorCliente(int $idCliente): Collection
    {
        return PromocionCliente::with(['promocion', 'cliente'])
            ->where('id_cliente', $idCliente)
            ->orderByDesc('id_promo_cliente')
            ->get();
    }

    public function listarPorPromocion(int $idPromocion): Collection
    {
        return PromocionCliente::with(['promocion', 'cliente'])
            ->where('id_promocion', $idPromocion)
            ->get();
    }

    public function obtener(int $id): PromocionCliente
    {
        return PromocionCliente::with(['promocion', 'cliente'])->findOrFail($id);
    }

    public function crear(array $datos): PromocionCliente
    {
        return PromocionCliente::create($datos)->load(['promocion', 'cliente']);
    }

    public function marcarUsado(int $id): PromocionCliente
    {
        $item = PromocionCliente::findOrFail($id);
        $item->update([
            'usado' => true,
            'fecha_uso' => now(),
        ]);
        return $item->fresh();
    }

    public function eliminar(int $id): void
    {
        PromocionCliente::findOrFail($id)->delete();
    }
}