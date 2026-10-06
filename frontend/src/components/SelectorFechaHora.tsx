import { useMemo, useState } from "react"
import { Calendar, Clock, ChevronLeft, ChevronRight, Pencil, LayoutGrid } from "lucide-react"

interface Props {
  fechaEntrada: string
  horas: number
  onChangeFecha: (fecha: string) => void
  onChangeHoras: (horas: number) => void
}

type Modo = "visual" | "manual"

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
const MESES_LARGO = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
const DIAS_SEMANA = ["D", "L", "M", "M", "J", "V", "S"]
const DIAS_SEMANA_LARGO = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
const HORAS_RAPIDAS = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"]

function pad(n: number): string {
  return String(n).padStart(2, "0")
}

function formatearISO(d: Date, hora: string): string {
  const [h, m] = hora.split(":").map(Number)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(h)}:${pad(m)}`
}

function parsearISO(iso: string): { fecha: Date | null; hora: string } {
  if (!iso || iso.length < 16) return { fecha: null, hora: "14:00" }
  const [fechaParte, horaParte] = iso.split("T")
  const [y, m, d] = fechaParte.split("-").map(Number)
  return { fecha: new Date(y, m - 1, d), hora: horaParte.substring(0, 5) }
}

function esMismoDia(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function esPasado(d: Date, hoy: Date): boolean {
  const dSinHora = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  return dSinHora < hoySinHora
}

export function SelectorFechaHora({ fechaEntrada, horas, onChangeFecha, onChangeHoras }: Props) {
  const { fecha: fechaActual, hora: horaActual } = parsearISO(fechaEntrada)
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const [modo, setModo] = useState<Modo>("visual")
  const [mesVisible, setMesVisible] = useState<Date>(() => {
    if (fechaActual) return new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1)
    return new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  })

  const chipsFecha = [
    { label: "Hoy", offset: 0 },
    { label: "Mañana", offset: 1 },
    { label: "Pasado", offset: 2 },
    { label: "+3d", offset: 3 },
    { label: "+7d", offset: 7 },
  ]

  const año = mesVisible.getFullYear()
  const mes = mesVisible.getMonth()

  const primerDia = new Date(año, mes, 1)
  const primerDiaSemana = primerDia.getDay()
  const diasEnMes = new Date(año, mes + 1, 0).getDate()

  const diasCalendario: (Date | null)[] = []
  for (let i = 0; i < primerDiaSemana; i++) diasCalendario.push(null)
  for (let d = 1; d <= diasEnMes; d++) {
    diasCalendario.push(new Date(año, mes, d))
  }

  const seleccionarFecha = (d: Date) => {
    if (esPasado(d, hoy)) return
    onChangeFecha(formatearISO(d, horaActual))
  }

  const seleccionarHora = (h: string) => {
    const base = fechaActual ?? new Date()
    onChangeFecha(formatearISO(base, h))
  }

  const irMesAnterior = () => {
    const nuevo = new Date(año, mes - 1, 1)
    const limite = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    if (nuevo < limite) return
    setMesVisible(nuevo)
  }

  const irMesSiguiente = () => {
    setMesVisible(new Date(año, mes + 1, 1))
  }

  const preview = useMemo(() => {
    if (!fechaActual) return null
    const [h, m] = horaActual.split(":").map(Number)
    const entrada = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate(), h, m)
    const salida = new Date(entrada.getTime() + horas * 60 * 60 * 1000)
    return {
      entradaLabel: `${DIAS_SEMANA_LARGO[fechaActual.getDay()]} ${fechaActual.getDate()} ${MESES_LARGO[fechaActual.getMonth()].substring(0, 3)}, ${horaActual}`,
      salidaLabel: `${DIAS_SEMANA_LARGO[salida.getDay()].substring(0, 3)} ${salida.getDate()} ${MESES[salida.getMonth()]}, ${pad(salida.getHours())}:${pad(salida.getMinutes())}`,
    }
  }, [fechaActual, horaActual, horas])

  return (
    <div className="space-y-3">

      {/* TOGGLE MODO */}
      <div className="flex gap-1 bg-slate-900 p-0.5 rounded-lg">
        <button
          type="button"
          onClick={() => setModo("visual")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition ${
            modo === "visual" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <LayoutGrid size={12} /> Visual
        </button>
        <button
          type="button"
          onClick={() => setModo("manual")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition ${
            modo === "manual" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Pencil size={12} /> Manual
        </button>
      </div>

      {/* MODO VISUAL */}
      {modo === "visual" && (
        <div className="space-y-3">

          {/* Chips fecha */}
          <div className="flex flex-wrap gap-1">
            {chipsFecha.map(c => {
              const d = new Date(hoy)
              d.setDate(d.getDate() + c.offset)
              const activo = fechaActual && esMismoDia(fechaActual, d)
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => onChangeFecha(formatearISO(d, horaActual))}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition border ${
                    activo
                      ? "bg-cyan-600 text-white border-cyan-400"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-500"
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>

          {/* Calendario COMPACTO */}
          <div className="bg-slate-900 rounded border border-slate-700 p-2">
            <div className="flex items-center justify-between mb-1.5">
              <button type="button" onClick={irMesAnterior} className="text-slate-400 hover:text-white p-0.5">
                <ChevronLeft size={14} />
              </button>
              <p className="text-white font-semibold text-xs">
                {MESES[mes]} {año}
              </p>
              <button type="button" onClick={irMesSiguiente} className="text-slate-400 hover:text-white p-0.5">
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {DIAS_SEMANA.map((d, i) => (
                <div key={i} className="text-center text-slate-500 text-[9px] font-medium">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {diasCalendario.map((d, idx) => {
                if (!d) return <div key={`empty-${idx}`} />
                const pasado = esPasado(d, hoy)
                const esHoy = esMismoDia(d, hoy)
                const seleccionado = fechaActual && esMismoDia(d, fechaActual)
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    disabled={pasado}
                    onClick={() => seleccionarFecha(d)}
                    className={`h-6 rounded text-[10px] font-medium transition ${
                      seleccionado
                        ? "bg-cyan-600 text-white"
                        : pasado
                        ? "text-slate-700 cursor-not-allowed"
                        : esHoy
                        ? "bg-slate-700 text-white hover:bg-slate-600"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Hora rápida + input libre */}
          <div>
            <label className="text-slate-300 text-[10px] block mb-1 flex items-center gap-1">
              <Clock size={10} /> Hora
            </label>
            <div className="flex flex-wrap gap-1 items-center">
              {HORAS_RAPIDAS.map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => seleccionarHora(h)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition border ${
                    horaActual === h
                      ? "bg-purple-600 text-white border-purple-400"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:border-purple-500"
                  }`}
                >
                  {h}
                </button>
              ))}
              <div className="flex items-center gap-1 ml-1">
                <span className="text-slate-500 text-[10px]">Otra:</span>
                <input
                  type="time"
                  value={horaActual}
                  onChange={e => seleccionarHora(e.target.value)}
                  className={`bg-slate-900 text-white px-2 py-1 rounded text-[10px] border transition ${
                    !HORAS_RAPIDAS.includes(horaActual)
                      ? "border-purple-500 text-purple-300"
                      : "border-slate-700"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODO MANUAL */}
      {modo === "manual" && (
        <div className="space-y-2">
          <div>
            <label className="text-slate-300 text-xs block mb-1 flex items-center gap-1">
              <Calendar size={12} /> Fecha + hora
            </label>
            <input
              type="datetime-local"
              value={fechaEntrada}
              onChange={e => onChangeFecha(e.target.value)}
              className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
            />
          </div>
        </div>
      )}

      {/* PREVIEW (sin duración, se agrega después) */}
      {preview && (
        <div className="bg-gradient-to-r from-cyan-950 to-purple-950 border border-cyan-800 rounded p-2.5">
          <p className="text-cyan-300 text-[9px] font-semibold mb-0.5">📅 ENTRADA</p>
          <p className="text-white text-xs font-medium">{preview.entradaLabel}</p>
          <p className="text-slate-400 text-[10px] mt-1">
            ⏱️ La duración se elige al seleccionar la tarifa
          </p>
        </div>
      )}
    </div>
  )
}