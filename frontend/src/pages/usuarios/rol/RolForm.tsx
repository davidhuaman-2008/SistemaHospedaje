import { useState } from "react"
import { toast } from "sonner"
import { rolService } from "@/services/rolService"
import type { Rol } from "@/types"

interface Props {
  rol: Rol | null
  onGuardado: () => Promise<void> | void
  onCancelar: () => void
}

export default function RolForm({ rol, onGuardado, onCancelar }: Props) {
  const editando = rol !== null

  const [form, setForm] = useState({
    nombre: rol?.nombre ?? "",
    descripcion: rol?.descripcion ?? "",
  })

  const [errores, setErrores] = useState<Record<string, string>>({})

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {}

    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio"

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const guardar = async () => {
    if (!validar()) {
      toast.error("RevisÃƒÂ¡ los campos marcados en rojo")
      return
    }

    try {
      if (editando && rol) {
        await rolService.actualizar(rol.id, {
          nombre: form.nombre,
          descripcion: form.descripcion,
        })
        toast.success("Rol actualizado correctamente")
      } else {
        await rolService.crear({
          nombre: form.nombre,
          descripcion: form.descripcion,
        })
        toast.success("Rol creado correctamente")
      }
      await onGuardado()
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { errors?: Record<string, string[]> } }
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
        toast.error("Error al guardar el rol")
      }
      console.error(error)
    }
  }

  const inputClass = (campo: string) =>
    `bg-slate-800 p-3 rounded border ${
      errores[campo] ? "border-red-500" : "border-slate-800"
    }`

  return (
    <div className="bg-slate-900 p-6 rounded-xl mb-6">
      <h2 className="text-2xl font-semibold mb-4">
        {editando ? "Editar Rol" : "Crear Rol"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className={`w-full ${inputClass("nombre")}`}
          />
          {errores.nombre && <p className="text-red-400 text-xs mt-1">{errores.nombre}</p>}
        </div>

        <div>
          <input
            placeholder="DescripciÃƒÂ³n"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className={`w-full ${inputClass("descripcion")}`}
          />
          {errores.descripcion && <p className="text-red-400 text-xs mt-1">{errores.descripcion}</p>}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={guardar}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          {editando ? "Actualizar Rol" : "Guardar Rol"}
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