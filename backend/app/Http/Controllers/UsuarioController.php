<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Services\UsuarioService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UsuarioController extends Controller
{
    // ⚠️ Property inyectada: `$usuarioService` (no `$service`).
    public function __construct(private UsuarioService $usuarioService) {}

    // GET /usuarios → lista TODOS los usuarios.
    public function index()
    {
        return response()->json($this->usuarioService->listar());
    }

    // POST /usuarios → crea un usuario nuevo.
    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'nombre_usuario' => 'required|string|max:50|unique:usuarios,nombre_usuario',
            'password' => 'required|string|min:6',
            'id_rol' => 'required|exists:roles,id',
            'id_turno' => 'nullable|exists:turnos,id',
            'activo' => 'boolean',
        ]);

        // El Service se encarga de hashear el password.
        $usuario = $this->usuarioService->crear($datos);

        // ⚠️ Respuesta usa `usuario` en lugar de `data`.
        // Carga las relaciones rol y turno con eager loading.
        return response()->json([
            'mensaje' => 'Usuario creado',
            'usuario' => $usuario->load(['rol', 'turno']),
        ], 201);
    }

    // GET /usuarios/{id} → un usuario con sus relaciones.
    // ⚠️ Route Model Binding (Usuario $usuario).
    public function show(Usuario $usuario)
    {
        // Carga rol y turno con eager loading.
        return response()->json($usuario->load(['rol', 'turno']));
    }

    // PUT /usuarios/{id} → actualiza un usuario.
    // ⚠️ Route Model Binding + `unique` excluyendo el propio ID.
    public function update(Request $request, Usuario $usuario)
    {
        $datos = $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'apellido' => 'sometimes|string|max:100',
            'nombre_usuario' => 'sometimes|string|max:50|unique:usuarios,nombre_usuario,' . $usuario->id,
            'password' => 'sometimes|string|min:6',
            'id_rol' => 'sometimes|exists:roles,id',
            'id_turno' => 'nullable|exists:turnos,id',
            'activo' => 'sometimes|boolean',
        ]);

        // El Service se encarga de hashear el password si viene.
        $usuario = $this->usuarioService->actualizar($usuario, $datos);

        return response()->json([
            'mensaje' => 'Usuario actualizado',
            'usuario' => $usuario,
        ]);
    }

    // DELETE /usuarios/{id} → elimina físicamente.
    // ⚠️ Route Model Binding.
    public function destroy(Usuario $usuario)
    {
        $this->usuarioService->eliminar($usuario);

        return response()->json([
            'mensaje' => 'Usuario eliminado',
        ]);
    }

    // PATCH /usuarios/{id}/desactivar → soft delete (activo = false).
    // ⚠️ Este SÍ usa `int $id` (no Route Model Binding).
    public function desactivar(int $id): JsonResponse
    {
        $usuario = $this->usuarioService->desactivar($id);
        return response()->json([
            'mensaje' => 'Usuario desactivado',
            'data' => $usuario,
        ]);
    }

    // PATCH /usuarios/{id}/reactivar → activo = true.
    // ⚠️ Este también usa `int $id`.
    public function reactivar(int $id): JsonResponse
    {
        $usuario = $this->usuarioService->reactivar($id);
        return response()->json([
            'mensaje' => 'Usuario reactivado',
            'data' => $usuario,
        ]);
    }
}
