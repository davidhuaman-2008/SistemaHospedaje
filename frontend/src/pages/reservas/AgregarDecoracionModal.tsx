import { useEffect, useState } from "react"
import { toast } from "sonner"
import { X, Sparkles, DollarSign } from "lucide-react"
import { decoracionService } from "@/services/decoracionService"
import { paqueteDecoracionService } from "@/services/paqueteDecoracionService"
import { mensajeDeError } from "@/lib/errores"
import type { PaqueteDecoracion } from "@/types/paqueteDecoracion"

interface Props {
  idReserva: number
  idTipoHabitacion: number
  onClose: () => void
  onSuccess: () => void
}

export function AgregarDecoracionModal({ idReserva, idTipoHabitacion, onClose, onSuccess }: Props) {
  const [paquetes, setPaquetes] = useState<PaqueteDecoracion[]>([])
  const [cargando, setCargando] = useState(true)
  const [idPaquete, setIdPaquete] = useState<number | null>(null)
  const [frasePersonalizada, setFrasePersonalizada] = useState("")
  const [musica, setMusica] = useState("")
  const [adelanto, setAdelanto] = useState(0)
  const [notas, setNotas] = useState("")
  const [procesando, setProcesando] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        const todos = await paqueteDecoracionService.listarActivos()
        const filtrados = todos.filter(
          p => !p.id_tipo_habitacion || p.id_tipo_habitacion === idTipoHabitacion
        )
        setPaquetes(filtrados)
      } catch {
        toast.error("Error al cargar paquetes")
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [idTipoHabitacion])

  const paqueteSeleccionado = paquetes.find(p => p.id_paquete === idPaquete)
  const saldoProveedor = paqueteSeleccionado
    ? Math.max(0, Number(paqueteSeleccionado.ganancia_proveedor) - adelanto)
    : 0

  const guardar = async () => {
    if (!idPaquete) return toast.error("Selecciona un paquete")
    try {
      setProcesando(true)
      await decoracionService.crear({
        id_reserva: idReserva,
        id_paquete: idPaquete,
        adelanto: adelanto > 0 ? adelanto : 0,
        frase_personalizada: frasePersonalizada || null,
        musica: musica || null,
        notas: notas || null,
      })
      toast.success("Decoracion agregada. Cuenta por pagar creada.")
      onSuccess()
    } catch (e: unknown) {
      toast.error(mensajeDeError(e))
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-slate-900 p-4 rounded-t-lg flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-purple-400" />
            <h3 className="text-lg font-bold text-white">Agregar Decoracion</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {cargando ? (
            <p className="text-slate-400">Cargando paquetes...</p>
          ) : paquetes.length === 0 ? (
            <div className="bg-yellow-950/40 border border-yellow-700 p-3 rounded text-yellow-200 text-sm">
              No hay paquetes de decoracion disponibles para este tipo de habitacion.
            </div>
          ) : (
            <>
              <div>
                <label className="text-slate-300 text-sm block mb-2">Seleccionar paquete *</label>
                <div className="space-y-2">
                  {paquetes.map(p => (
                    <button
                      key={p.id_paquete}
                      type="button"
                      onClick={() => setIdPaquete(p.id_paquete)}
                      className={`w-full p-3 rounded border-2 text-left transition ${
                        idPaquete === p.id_paquete
                          ? "bg-purple-900/50 border-purple-500"
                          : "bg-slate-900 border-slate-700 hover:border-purple-500"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white font-semibold">{p.nombre}</p>
                          <p className="text-slate-400 text-xs mt-1">
                            {p.horas_incluidas}h · {p.proveedor?.razon_social || "Sin proveedor"}
                          </p>
                        </div>
                        <div className="text-right ml-3">
                          <p className="text-purple-400 font-bold">S/ {Number(p.precio_total).toFixed(2)}</p>
                          <p className="text-xs text-slate-500">
                            Hospedaje: S/ {Number(p.ganancia_local).toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-500">
                            Proveedor: S/ {Number(p.ganancia_proveedor).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {paqueteSeleccionado && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 text-sm block mb-1">Frase personalizada</label>
                      <input
                        value={frasePersonalizada}
                        onChange={e => setFrasePersonalizada(e.target.value)}
                        placeholder="Ej: Feliz Aniversario mi amor"
                        className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 text-sm block mb-1">Musica</label>
                      <input
                        value={musica}
                        onChange={e => setMusica(e.target.value)}
                        placeholder="Ej: Playlist romantica"
                        className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm block mb-1 flex items-center gap-1">
                      <DollarSign size={14} /> Adelanto al proveedor (opcional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      max={Number(paqueteSeleccionado.ganancia_proveedor)}
                      value={adelanto || ""}
                      onChange={e => setAdelanto(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
                    />
                  </div>

                  <div className="bg-slate-900 p-3 rounded space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Precio total (cliente):</span>
                      <span className="text-purple-400 font-bold">S/ {Number(paqueteSeleccionado.precio_total).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs ml-4">
                      <span className="text-slate-500">→ Ganancia hospedaje:</span>
                      <span className="text-cyan-400">S/ {Number(paqueteSeleccionado.ganancia_local).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs ml-4">
                      <span className="text-slate-500">→ Ganancia proveedor:</span>
                      <span className="text-yellow-400">S/ {Number(paqueteSeleccionado.ganancia_proveedor).toFixed(2)}</span>
                    </div>
                    {adelanto > 0 && (
                      <>
                        <div className="flex justify-between border-t border-slate-700 pt-2">
                          <span className="text-slate-400">Adelanto registrado:</span>
                          <span className="text-green-400 font-bold">S/ {adelanto.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Saldo al proveedor:</span>
                          <span className="text-yellow-400 font-bold">S/ {saldoProveedor.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm block mb-1">Notas</label>
                    <textarea
                      value={notas}
                      onChange={e => setNotas(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
                      placeholder="Instrucciones especiales para el proveedor"
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={guardar}
              disabled={!idPaquete || procesando}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white py-2 rounded font-medium"
            >
              {procesando ? "Agregando..." : "Agregar Decoracion"}
            </button>
            <button onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white px-4 rounded">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}