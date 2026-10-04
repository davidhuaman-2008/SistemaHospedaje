import { useState } from "react"
import type { CategoriaPromocion, CategoriaPromocionRequest } from "@/types/promocion"

import { IconPicker } from "@/components/IconPicker"
interface Props {
  inicial: CategoriaPromocion | null
  onGuardar: (datos: CategoriaPromocionRequest) => void
  onCancelar: () => void
}

export function CategoriaPromocionForm({ inicial, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre || "")
  const [slug, setSlug] = useState(inicial?.slug || "")
  const [descripcion, setDescripcion] = useState(inicial?.descripcion || "")
  const [icono, setIcono] = useState(inicial?.icono || "")
  const [color, setColor] = useState(inicial?.color || "#ec4899")
  const [orden, setOrden] = useState(inicial?.orden || 0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !slug.trim()) return
    onGuardar({ nombre, slug, descripcion: descripcion || null, icono: icono || null, color, orden, activo: true })
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-slate-300 text-sm">Nombre *</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Slug *</label>
          <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Ícono (lucide)</label>
          <IconPicker valor={icono} onChange={setIcono} />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 bg-slate-900 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Orden</label>
          <input type="number" value={orden} onChange={e => setOrden(Number(e.target.value))} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <label className="text-slate-300 text-sm">Descripción</label>
          <input value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{inicial ? "Actualizar" : "Crear"}</button>
        <button type="button" onClick={onCancelar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  )
}