import { useState, useMemo, useRef, useEffect } from "react"
import * as Icons from "lucide-react"
import { Search, X } from "lucide-react"

interface Props {
  valor: string | null
  onChange: (icono: string) => void
}

/**
 * Lista curada de íconos útiles para el sistema.
 * Si querés agregar más, sumalos acá (nombre en kebab-case).
 */
const ICONOS_DISPONIBLES = [
  // Dinero / Pagos
  "banknote", "credit-card", "wallet", "dollar-sign", "coins", "piggy-bank",
  // Dispositivos / Tech
  "smartphone", "building", "arrow-right-left", "landmark", "receipt",
  // Comida / Bebida
  "cup-soda", "wine", "cookie", "popcorn", "pizza", "beer", "coffee",
  // Personas / Clientes
  "user", "user-plus", "users", "heart", "star", "crown", "award", "gem",
  // Alertas / Estados
  "alert-triangle", "alert-octagon", "shield", "shield-alert", "shield-x",
  "file-x", "file-check", "hammer", "wrench", "info", "check-circle", "x-circle",
  // Fechas / Eventos
  "cake", "gift", "party-popper", "calendar", "clock", "sun", "moon", "sparkles",
  // Categorías / Tags
  "tag", "tags", "package", "box", "shopping-bag", "shopping-cart",
  // Naturaleza / Decoración
  "flower", "leaf", "flower-2", "candy",
  // Varios
  "trending-up", "trending-down", "percent", "badge-percent",
  "spray-can", "teddy-bear", "baby", "music", "camera", "image",
]

function kebabToPascal(nombre: string): string {
  return nombre
    .split("-")
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join("")
}

export function IconPicker({ valor, onChange }: Props) {
  const [abierto, setAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  // Cerrar al hacer click afuera
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const filtrados = useMemo(() => {
    if (!busqueda.trim()) return ICONOS_DISPONIBLES
    const q = busqueda.toLowerCase().trim()
    return ICONOS_DISPONIBLES.filter(n => n.includes(q))
  }, [busqueda])

  const IconoActual = valor
    ? (Icons as any)[kebabToPascal(valor)] ?? null
    : null

  return (
    <div ref={ref} className="relative">
      {/* Botón que muestra el icono actual */}
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="w-full bg-slate-900 text-white p-2 rounded flex items-center gap-2 hover:bg-slate-800 border border-slate-700"
      >
        {IconoActual ? (
          <IconoActual size={18} />
        ) : (
          <span className="text-slate-500 text-sm">Sin ícono</span>
        )}
        <span className="text-slate-400 text-xs flex-1 text-left">
          {valor ?? "Seleccionar..."}
        </span>
        <Search size={14} className="text-slate-500" />
      </button>

      {/* Popover con grilla */}
      {abierto && (
        <div className="absolute z-50 mt-1 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-3">
          {/* Buscador */}
          <div className="flex items-center gap-2 mb-3 bg-slate-900 rounded px-2 py-1">
            <Search size={14} className="text-slate-500" />
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar ícono..."
              className="bg-transparent text-white text-sm flex-1 outline-none"
              autoFocus
            />
            {busqueda && (
              <button type="button" onClick={() => setBusqueda("")} className="text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Grilla */}
          <div className="grid grid-cols-6 gap-1 max-h-64 overflow-y-auto">
            {filtrados.length === 0 ? (
              <p className="text-slate-500 text-xs col-span-6 text-center py-2">
                No se encontraron íconos
              </p>
            ) : (
              filtrados.map(nombre => {
                const Ico = (Icons as any)[kebabToPascal(nombre)] ?? null
                if (!Ico) return null
                const activo = valor === nombre
                return (
                  <button
                    key={nombre}
                    type="button"
                    onClick={() => { onChange(nombre); setAbierto(false); setBusqueda("") }}
                    title={nombre}
                    className={`p-2 rounded hover:bg-slate-700 flex items-center justify-center ${
                      activo ? "bg-blue-600" : "bg-slate-900"
                    }`}
                  >
                    <Ico size={18} />
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}