import { useState } from "react"
import { toast } from "sonner"
import type { PrioridadMantenimiento, PrioridadMantenimientoRequest } from "@/types/mantenimiento"

interface Props {
  inicial: PrioridadMantenimiento | null
  onGuardar: (datos: PrioridadMantenimientoRequest) => void
  onCancelar: () => void
}

function generarSlug(nombre: string): string {
  return nombre.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function PrioridadMantenimientoForm({ inicial, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre || "")
  const [slug, setSlug] = useState(inicial?.slug || "")
  const [color, setColor] = useState(inicial?.color || "#f59e0b")
  const [orden, setOrden] = useState(inicial?.orden ?? 0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return toast.error("El nombre es obligatorio")
    const slugFinal = slug.trim() || generarSlug(nombre)

    onGuardar({
      nombre: nombre.trim(),
      slug: slugFinal,
      color: color || null,
      orden,
      activo: true,
    })
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-slate-300 text-sm">Nombre *</label>
          <input
            value={nombre}
            onChange={e => {
              setNombre(e.target.value)
              if (!inicial) setSlug(generarSlug(e.target.value))
            }}
            className="w-full bg-slate-900 text-white p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Slug</label>
          <input
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="w-full bg-slate-900 text-white p-2 rounded"
          />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Color</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
            <input value={color} onChange={e => setColor(e.target.value)} className="flex-1 bg-slate-900 text-white p-2 rounded" />
          </div>
        </div>
        <div>
          <label className="text-slate-300 text-sm">Orden</label>
          <input type="number" value={orden} onChange={e => setOrden(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          {inicial ? "Actualizar" : "Crear"}
        </button>
        <button type="button" onClick={onCancelar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  )
}