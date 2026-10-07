<?php

namespace App\Http\Controllers;

use App\Services\ClienteService;
use App\Services\ClienteVisitaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClienteController extends Controller
{
    // Inyecta DOS servicios: uno para clientes y otro para visitas.
    public function __construct(
        private ClienteService $service,
        private ClienteVisitaService $visitaService,
    ) {}

    // GET /clientes
    public function index(): JsonResponse
    {
        // Lista TODOS los clientes (activos e inactivos).
        return response()->json($this->service->listar());
    }

    // GET /clientes/activos
    public function activos(): JsonResponse
    {
        // Solo clientes con activo = true.
        return response()->json($this->service->listarActivos());
    }

    // GET /clientes/buscar?dni=X
    // Endpoint especial: la búsqueda por DNI para el módulo de recepción.
    public function buscar(Request $request): JsonResponse
    {
        $dni = $request->query('dni');

        // Si no mandan DNI, responde con "no existe" (evita error 500).
        if (!$dni) {
            return response()->json([
                'existe' => false,
                'cliente' => null,
                'reserva_activa' => null,
            ]);
        }

        // El Service busca por DNI y adjunta `reserva_activa` como atributo dinámico.
        $cliente = $this->service->buscarPorDni($dni);

        // Extrae el atributo ANTES de serializar.
        // (Regla R-D20: NO usar $appends porque rompe la serialización de colecciones.)
        $reservaActiva = $cliente ? $cliente->getAttribute('reserva_activa') : null;

        // Devuelve un JSON con 3 campos separados:
        //   - existe: booleano
        //   - cliente: el cliente completo (o null)
        //   - reserva_activa: la reserva activa si tiene (o null)
        return response()->json([
            'existe' => $cliente !== null,
            'cliente' => $cliente,
            'reserva_activa' => $reservaActiva,
        ]);
    }

    // GET /clientes/{id}
    public function show(int $id): JsonResponse
    {
        // Devuelve un solo cliente.
        return response()->json($this->service->obtener($id));
    }

    // POST /clientes
    public function store(Request $request): JsonResponse
    {
        // Valida. `numero_documento` debe ser único en la tabla clientes.
        // Los campos FK se validan con `exists` para que apunten a filas reales.
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

        // Crea y responde 201 (Created).
        return response()->json([
            'mensaje' => 'Cliente creado',
            'data' => $this->service->crear($datos),
        ], 201);
    }

    // PUT /clientes/{id}
    public function update(Request $request, int $id): JsonResponse
    {
        // Igual que store, pero `unique` ignora el propio ID (columna PK: id_cliente).
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

    // PATCH /clientes/{id}/desactivar
    public function desactivar(int $id): JsonResponse
    {
        // Soft delete: activo = false.
        return response()->json([
            'mensaje' => 'Cliente desactivado',
            'data' => $this->service->desactivar($id),
        ]);
    }

    // PATCH /clientes/{id}/reactivar
    public function reactivar(int $id): JsonResponse
    {
        // Vuelve a activo = true.
        return response()->json([
            'mensaje' => 'Cliente reactivado',
            'data' => $this->service->reactivar($id),
        ]);
    }

    // DELETE /clientes/{id}
    public function destroy(int $id): JsonResponse
    {
        // Elimina físicamente y devuelve solo el mensaje.
        $this->service->eliminar($id);
        return response()->json(['mensaje' => 'Cliente eliminado']);
    }

    // GET /clientes/{id}/visitas
    public function visitas(int $id): JsonResponse
    {
        // Usa el SEGUNDO servicio (ClienteVisitaService) para listar las visitas del cliente.
        return response()->json($this->visitaService->listarPorCliente($id));
    }
}
