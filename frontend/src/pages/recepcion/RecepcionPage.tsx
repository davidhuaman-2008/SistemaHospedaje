import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { RefreshCw } from "lucide-react"
import AppLayout from "@/components/layout/AppLayout"
import { habitacionMapaService } from "@/services/reservaService"
import type { HabitacionMapa } from "@/types/reserva"
import { TarjetaHabitacion } from "./TarjetaHabitacion"
import { ModalHabitacionOcupada } from "./ModalHabitacionOcupada"

export function RecepcionPage() {
  const [habitaciones, setHabitaciones] = useState<HabitacionMapa[]>([])
  const [cargando, setCargando] = useState(true)
  const [modalHabitacion, setModalHabitacion] = useState<HabitacionMapa | null>(null)
  const navigate = useNavigate()

  const cargar = async () => {
    try {
      setCargando(true)
      const datos = await habitacionMapaService.listar()
      setHabitaciones(datos)
    } catch {
      toast.error("Error al cargar el mapa")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
    const intervalo = setInterval(cargar, 15000)
    return () => clearInterval(intervalo)
  }, [])

  const handleClickHabitacion = (h: HabitacionMapa) => {
    if (h.estado === "Inactiva") {
      toast.error("Esta habitación está inactiva")
      return
    }
    if (h.estado === "Disponible") {
      navigate(`/recepcion/registrar/${h.id_habitacion}`)
      return
    }
    if (h.estado === "Ocupada" || h.estado === "Por vencer" || h.estado === "Vencida") {
      setModalHabitacion(h)
      return
    }
    if (h.estado === "Reservada") {
      toast.info("Esta habitación está reservada para una fecha futura")
      return
    }
    if (h.estado === "Limpieza") {
      toast.info("Esta habitación está en limpieza")
      return
    }
  }

  const porPiso = habitaciones.reduce((acc, h) => {
    if (!acc[h.id_piso]) {
      acc[h.id_piso] = { nombre: h.piso_nombre, items: [] }
    }
    acc[h.id_piso].items.push(h)
    return acc
  }, {} as Record<number, { nombre: string; items: HabitacionMapa[] }>)

  const contadores = {
    disponibles: habitaciones.filter(h => h.estado === "Disponible").length,
    ocupadas: habitaciones.filter(h => h.estado === "Ocupada").length,
    porVencer: habitaciones.filter(h => h.estado === "Por vencer").length,
    vencidas: habitaciones.filter(h => h.estado === "Vencida").length,
    limpieza: habitaciones.filter(h => h.estado === "Limpieza").length,
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Vista General — Recepción</h1>
          <p className="text-slate-400 text-sm mt-1">
            {contadores.disponibles} disponibles · {contadores.ocupadas + contadores.porVencer + contadores.vencidas} ocupadas
            {contadores.porVencer > 0 && <span className="text-yellow-400"> ({contadores.porVencer} por vencer)</span>}
            {contadores.vencidas > 0 && <span className="text-red-400"> ({contadores.vencidas} vencidas)</span>}
            {" · "}{contadores.limpieza} en limpieza
          </p>
        </div>
        <button
          onClick={cargar}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm"
        >
          <RefreshCw size={16} className={cargando ? "animate-spin" : ""} />
          Actualizar
        </button>
      </div>

      {cargando && habitaciones.length === 0 ? (
        <p className="text-slate-400">Cargando mapa...</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(porPiso).map(([idPiso, { nombre, items }]) => (
            <div key={idPiso}>
              <h2 className="text-lg font-semibold text-slate-300 mb-3">
                🏠 {nombre}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                {items.map(h => (
                  <TarjetaHabitacion
                    key={h.id_habitacion}
                    habitacion={h}
                    onClick={() => handleClickHabitacion(h)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalHabitacion && (
        <ModalHabitacionOcupada
          habitacion={modalHabitacion}
          onClose={() => setModalHabitacion(null)}
          onRefresh={() => { setModalHabitacion(null); cargar() }}
        />
      )}
    </AppLayout>
  )
}