<?php

namespace App\Http\Controllers;

use App\Services\ClienteService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClienteController extends Controller
{
    public function __construct(private ClienteService $service) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->listar());
    }

    public function activos(): JsonResponse
    {
        return response()->json($this->service->listarActivos());
    }

    public function buscar(Request $request): JsonResponse
    {
        $dni = $request->query('dni');
        if (!$dni) {
            return response()->json(['existe' => false, 'cliente' => null]);
        }

        $cliente = $this->service->buscarPorDni($dni);

        return response()->json([
            'existe' => $cliente !== null,
            'cliente' => $cliente,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->obtener($id));
    }

    public function store(Request $request): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido' => 'nullable|string|max:100',
            'id_tipo_documento' => 'nullable|exists:tipos_documento,id_documento',
            'numero_documento' => 'nullable|string|max:30|unique:clientes,numero_documento',
            'celular' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:150',
            'fecha_nacimiento' => 'nullable|date',
            'fecha_aniversario' => 'nullable|date',
            'direccion' => 'nullable|string|max:255',
            'id_nivel' => 'nullable|exists:clientes_niveles,id_nivel',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Cliente creado',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'apellido' => 'nullable|string|max:100',
            'id_tipo_documento' => 'nullable|exists:tipos_documento,id_documento',
            'numero_documento' => 'nullable|string|max:30|unique:clientes,numero_documento,' . $id . ',id_cliente',
            'celular' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:150',
            'fecha_nacimiento' => 'nullable|date',
            'fecha_aniversario' => 'nullable|date',
            'direccion' => 'nullable|string|max:255',
            'id_nivel' => 'nullable|exists:clientes_niveles,id_nivel',
            'activo' => 'boolean',
        ]);

        return response()->json([
            'mensaje' => 'Cliente actualizado',
            'data' => $this->service->actualizar($id, $datos),
        ]);
    }

    public function desactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Cliente desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    public function reactivar(int $id): JsonResponse
    {
        return response()->json([
            'mensaje' => 'Cliente reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Cliente eliminado']);
    }

    public function visitas(int $id): JsonResponse
    {
        return response()->json($this->service->listarVisitas($id));
    }
}