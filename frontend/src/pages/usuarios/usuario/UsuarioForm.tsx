import { useState } from "react"
import { toast } from "sonner"
import { usuarioService } from "@/services/usuarioService"
import type { Usuario, Rol, Turno, CrearUsuarioRequest } from "@/types"

interface Props {
  usuario: Usuario | null
  roles: Rol[]
  turnos: Turno[]
  onGuardado: () => Promise<void> | void
  onCancelar: () => void
}

export default function UsuarioForm({ usuario, roles, turnos, onGuardado, onCancelar }: Props) {
  const editando = usuario !== null

  const [form, setForm] = useState({
    nombre: usuario?.nombre ?? "",
    apellido: usuario?.apellido ?? "",
    nombre_usuario: usuario?.nombre_usuario ?? "",
    password: "",
    id_rol: usuario ? String(usuario.id_rol) : "",
    id_turno: usuario?.id_turno ? String(usuario.id_turno) : "",
  })

  const [errores, setErrores] = useState<Record<string, string>>({})

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {}

    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio"
    if (!form.apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio"
    if (!form.nombre_usuario.trim()) nuevosErrores.nombre_usuario = "El usuario es obligatorio"
    if (!editando && !form.password.trim()) nuevosErrores.password = "La contraseÃƒÂ±a es obligatoria"
    if (!editando && form.password.length > 0 && form.password.length < 6) {
      nuevosErrores.password = "La contraseÃƒÂ±a debe tener al menos 6 caracteres"
    }
    if (!form.id_rol) nuevosErrores.id_rol = "SeleccionÃƒÂ¡ un rol"

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const guardar = async () => {
    if (!validar()) {
      toast.error("RevisÃƒÂ¡ los campos marcados en rojo")
      return
    }

    try {
      if (editando && usuario) {
        await usuarioService.actualizar(usuario.id, {
          nombre: form.nombre,
          apellido: form.apellido,
          nombre_usuario: form.nombre_usuario,
          id_rol: Number(form.id_rol),
          id_turno: form.id_turno ? Number(form.id_turno) : null,
        })
        toast.success("Usuario actualizado correctamente")
      } else {
        const datos: CrearUsuarioRequest = {
          nombre: form.nombre,
          apellido: form.apellido,
          nombre_usuario: form.nombre_usuario,
          password: form.password,
          id_rol: Number(form.id_rol),
          id_turno: form.id_turno ? Number(form.id_turno) : null,
          activo: true,
        }
        await usuarioService.crear(datos)
        toast.success("Usuario creado correctamente")
      }
      await onGuardado()
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { errors?: Record<string, string[]>; message?: string } }
      }
      const erroresBackend = axiosError.response?.data?.errors

      if (erroresBackend) {
        const nuevos: Record<string, string> = {}
        for (const campo in erroresBackend) {
          nuevos[campo] = erroresBackend[campo][0]
        }
        setErrores(nuevos)
        toast.error("RevisÃƒÂ¡ los campos marcados")
      } else {
        toast.error("Error al guardar el usuario")
      }
      console.error(error)
    }
  }

  const inputClass = (campo: string) =>
    `bg-slate-800 p-3 rounded border ${
      errores[campo] ? "border-red-500" : "border-slate-800"
    }`

  return (
    <div className="bg-slate-900 rounded-xl p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">
        {editando ? "Editar Usuario" : "Crear Usuario"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className={`w-full ${inputClass("nombre")}`}
          />
          {errores.nombre && (
            <p className="text-red-400 text-xs mt-1">{errores.nombre}</p>
          )}
        </div>

        <div>
          <input
            placeholder="Apellido"
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
            className={`w-full ${inputClass("apellido")}`}
          />
          {errores.apellido && (
            <p className="text-red-400 text-xs mt-1">{errores.apellido}</p>
          )}
        </div>

        <div>
          <input
            placeholder="Usuario"
            value={form.nombre_usuario}
            onChange={(e) => setForm({ ...form, nombre_usuario: e.target.value })}
            className={`w-full ${inputClass("nombre_usuario")}`}
          />
          {errores.nombre_usuario && (
            <p className="text-red-400 text-xs mt-1">{errores.nombre_usuario}</p>
          )}
        </div>

        {!editando && (
          <div>
            <input
              type="password"
              placeholder="ContraseÃƒÂ±a"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full ${inputClass("password")}`}
            />
            {errores.password && (
              <p className="text-red-400 text-xs mt-1">{errores.password}</p>
            )}
          </div>
        )}

        <div>
          <select
            value={form.id_rol}
            onChange={(e) => setForm({ ...form, id_rol: e.target.value })}
            className={`w-full ${inputClass("id_rol")}`}
          >
            <option value="">Seleccione rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>
          {errores.id_rol && (
            <p className="text-red-400 text-xs mt-1">{errores.id_rol}</p>
          )}
        </div>

        <div>
          <select
            value={form.id_turno}
            onChange={(e) => setForm({ ...form, id_turno: e.target.value })}
            className={`w-full ${inputClass("id_turno")}`}
          >
            <option value="">Seleccione turno</option>
            {turnos.map((turno) => (
              <option key={turno.id} value={turno.id}>{turno.nombre}</option>
            ))}
          </select>
          {errores.id_turno && (
            <p className="text-red-400 text-xs mt-1">{errores.id_turno}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={guardar}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          {editando ? "Actualizar Usuario" : "Guardar Usuario"}
        </button>
        <button
          onClick={onCancelar}
          className="bg-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}