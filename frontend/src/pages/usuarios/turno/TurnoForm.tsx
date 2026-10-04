import { useState } from "react"
import { toast } from "sonner"
import { turnoService } from "@/services/turnoService"
import type { Turno } from "@/types"

interface Props {
  turno: Turno | null
  onGuardado: () => Promise<void> | void
  onCancelar: () => void
}

export default function TurnoForm({ turno, onGuardado, onCancelar }: Props) {
  const editando = turno !== null

  const [form, setForm] = useState({
    nombre: turno?.nombre ?? "",
    hora_inicio: turno?.hora_inicio ?? "",
    hora_fin: turno?.hora_fin ?? "",
    descripcion: turno?.descripcion ?? "",
  })

  const [errores, setErrores] = useState<Record<string, string>>({})

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {}

    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio"
    if (!form.hora_inicio) nuevosErrores.hora_inicio = "La hora de inicio es obligatoria"
    if (!form.hora_fin) nuevosErrores.hora_fin = "La hora de fin es obligatoria"

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const guardar = async () => {
    if (!validar()) {
      toast.error("RevisÃƒÂ¡ los campos marcados en rojo")
      return
    }

    try {
      if (editando && turno) {
        await turnoService.actualizar(turno.id, {
          nombre: form.nombre,
          hora_inicio: form.hora_inicio,
          hora_fin: form.hora_fin,
          descripcion: form.descripcion,
        })
        toast.success("Turno actualizado correctamente")
      } else {
        await turnoService.crear({
          nombre: form.nombre,
          hora_inicio: form.hora_inicio,
          hora_fin: form.hora_fin,
          descripcion: form.descripcion,
          activo: true,
        })
        toast.success("Turno creado correctamente")
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
        toast.error("Error al guardar el turno")
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
        {editando ? "Editar Turno" : "Crear Turno"}
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
            type="time"
            value={form.hora_inicio}
            onChange={(e) => setForm({ ...form, hora_inicio: e.target.value })}
            className={`w-full ${inputClass("hora_inicio")}`}
          />
          {errores.hora_inicio && <p className="text-red-400 text-xs mt-1">{errores.hora_inicio}</p>}
        </div>

        <div>
          <input
            type="time"
            value={form.hora_fin}
            onChange={(e) => setForm({ ...form, hora_fin: e.target.value })}
            className={`w-full ${inputClass("hora_fin")}`}
          />
          {errores.hora_fin && <p className="text-red-400 text-xs mt-1">{errores.hora_fin}</p>}
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

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={guardar}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          {editando ? "Actualizar Turno" : "Guardar Turno"}
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