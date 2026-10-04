import { useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/components/layout/AppLayout"
import { configuracionSistemaService } from "@/services/configuracionSistemaService"
import { mensajeDeError } from "@/lib/errores"
import type { Configuracion } from "@/types/reserva"
import { Save } from "lucide-react"

export function ConfiguracionSistemaPage() {
  const [configs, setConfigs] = useState<Configuracion[]>([])
  const [editando, setEditando] = useState<Record<string, string>>({})
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState<string | null>(null)

  const cargar = async () => {
    try {
      setCargando(true)
      const datos = await configuracionSistemaService.listar()
      setConfigs(datos)
      const edicion: Record<string, string> = {}
      datos.forEach(c => { edicion[c.clave] = c.valor })
      setEditando(edicion)
    } catch {
      toast.error("Error al cargar configuraciones")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const guardar = async (clave: string) => {
    setGuardando(clave)
    try {
      await configuracionSistemaService.actualizar(clave, editando[clave])
      toast.success("Configuración actualizada")
      cargar()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setGuardando(null)
    }
  }

  // Agrupar por grupo
  const porGrupo = configs.reduce((acc, c) => {
    if (!acc[c.grupo]) acc[c.grupo] = []
    acc[c.grupo].push(c)
    return acc
  }, {} as Record<string, Configuracion[]>)

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">⚙️ Configuraciones del Sistema</h1>
        <p className="text-slate-400 text-sm mt-1">
          Parámetros globales del hospedaje
        </p>
      </div>

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(porGrupo).map(([grupo, items]) => (
            <div key={grupo} className="bg-slate-800 p-5 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 capitalize">{grupo}</h2>
              <div className="space-y-3">
                {items.map(c => (
                  <div key={c.clave} className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-1">
                      <label className="text-slate-300 text-sm font-mono">{c.clave}</label>
                      {c.descripcion && (
                        <p className="text-slate-500 text-xs mt-0.5">{c.descripcion}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={editando[c.clave] ?? ""}
                        onChange={e => setEditando({ ...editando, [c.clave]: e.target.value })}
                        className="bg-slate-900 text-white p-2 rounded w-40"
                      />
                      <button
                        onClick={() => guardar(c.clave)}
                        disabled={guardando === c.clave || editando[c.clave] === c.valor}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white px-3 py-2 rounded flex items-center gap-1"
                      >
                        <Save size={14} />
                        {guardando === c.clave ? "..." : "Guardar"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}