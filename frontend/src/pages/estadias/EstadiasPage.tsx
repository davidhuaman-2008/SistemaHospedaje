import { useEffect, useState } from "react"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { reservaService } from "@/services/reservaService"
import type { Reserva } from "@/types/reserva"
import { EstadiasTabla } from "./EstadiasTabla"

type Filtro = "Todas" | "Activas" | "Finalizadas" | "Anuladas"

export function EstadiasPage() {
  const [items, setItems] = useState<Reserva[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState<Filtro>("Todas")
  const [busqueda, setBusqueda] = useState("")

  const cargar = async () => {
    try {
      setCargando(true)
      const datos = await reservaService.listarSoloWalkIns()
      setItems(datos)
    } catch {
      toast.error("Error al cargar estadías")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
    const intervalo = setInterval(cargar, 30000)
    return () => clearInterval(intervalo)
  }, [])

  const filtradas = items.filter((r) => {
    if (filtro === "Activas" && r.estado?.slug !== "activa") return false
    if (filtro === "Finalizadas" && r.estado?.slug !== "finalizada") return false
    if (filtro === "Anuladas" && r.estado?.slug !== "cancelada" && r.estado?.slug !== "anulada") return false

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase()
      const coincide =
        r.codigo_reserva.toLowerCase().includes(q) ||
        r.cliente?.nombre.toLowerCase().includes(q) ||
        r.cliente?.apellido?.toLowerCase().includes(q) ||
        r.cliente?.numero_documento?.toLowerCase().includes(q) ||
        r.habitacion?.numero?.toLowerCase().includes(q)
      if (!coincide) return false
    }

    return true
  })

  const filtros: { key: Filtro; label: string }[] = [
    { key: "Todas", label: "Todas" },
    { key: "Activas", label: "En curso" },
    { key: "Finalizadas", label: "Finalizadas" },
    { key: "Anuladas", label: "Canceladas/Anuladas" },
  ]

  const activas = items.filter((r) => r.estado?.slug === "activa").length

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">🛏️ Estadías</h1>
          <p className="text-slate-400 text-sm">
            {items.length} estadías (código WK-) · {activas} en curso
          </p>
        </div>
        <button
          onClick={cargar}
          className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {filtros.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`px-3 py-1.5 rounded text-sm transition ${
              filtro === f.key
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por código, cliente, DNI o habitación..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-slate-800 text-white p-2 rounded border border-slate-700"
        />
      </div>

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : (
        <EstadiasTabla items={filtradas} />
      )}
    </AppLayout>
  )
}