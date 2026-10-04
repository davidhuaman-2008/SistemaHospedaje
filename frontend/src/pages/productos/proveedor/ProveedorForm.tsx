import { useState } from "react"
import type { Proveedor, ProveedorRequest } from "@/types/producto"

interface Props {
  inicial: Proveedor | null
  onGuardar: (datos: ProveedorRequest) => void
  onCancelar: () => void
}

export function ProveedorForm({ inicial, onGuardar, onCancelar }: Props) {
  const [razonSocial, setRazonSocial] = useState(inicial?.razon_social || "")
  const [nombreComercial, setNombreComercial] = useState(inicial?.nombre_comercial || "")
  const [ruc, setRuc] = useState(inicial?.ruc || "")
  const [telefono, setTelefono] = useState(inicial?.telefono || "")
  const [email, setEmail] = useState(inicial?.email || "")
  const [direccion, setDireccion] = useState(inicial?.direccion || "")
  const [contacto, setContacto] = useState(inicial?.contacto || "")
  const [tipo, setTipo] = useState(inicial?.tipo || "Productos")
  const [notas, setNotas] = useState(inicial?.notas || "")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!razonSocial.trim()) return
    onGuardar({
      razon_social: razonSocial,
      nombre_comercial: nombreComercial || null,
      ruc: ruc || null,
      telefono: telefono || null,
      email: email || null,
      direccion: direccion || null,
      contacto: contacto || null,
      tipo: tipo || null,
      notas: notas || null,
      activo: true,
    })
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-slate-300 text-sm">Razón Social *</label>
          <input value={razonSocial} onChange={e => setRazonSocial(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Nombre Comercial</label>
          <input value={nombreComercial} onChange={e => setNombreComercial(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">RUC</label>
          <input value={ruc} onChange={e => setRuc(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Teléfono</label>
          <input value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Contacto</label>
          <input value={contacto} onChange={e => setContacto(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Tipo</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded">
            <option value="Productos">Productos</option>
            <option value="Servicios">Servicios</option>
            <option value="Decoración">Decoración</option>
          </select>
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <label className="text-slate-300 text-sm">Dirección</label>
          <input value={direccion} onChange={e => setDireccion(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <label className="text-slate-300 text-sm">Notas</label>
          <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={2} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">{inicial ? "Actualizar" : "Crear"}</button>
        <button type="button" onClick={onCancelar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  )
}