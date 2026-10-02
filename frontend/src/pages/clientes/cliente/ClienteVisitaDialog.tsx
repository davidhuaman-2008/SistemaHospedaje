import { useState } from 'react'
import { toast } from 'sonner'
import { clienteService } from '@/services/clienteService'
import type { Cliente } from '@/types/cliente'

interface Props {
  cliente: Cliente
  onCerrar: () => void
  onGuardado: () => void
}

export function ClienteVisitaDialog({ cliente, onCerrar, onGuardado }: Props) {
  const [monto, setMonto] = useState(0)
  const [observacion, setObservacion] = useState('')
  const [guardando, setGuardando] = useState(false)

  const guardar = async () => {
    setGuardando(true)
    try {
      await clienteService.crearVisita(cliente.id_cliente, {
        fecha_entrada: new Date().toISOString(),
        monto_gastado: monto,
      })
      toast.success(`Visita registrada. Cliente ahora tiene ${cliente.visitas + 1} visitas.`)
      onGuardado()
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Error al registrar visita')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-white mb-4">
          Registrar visita
        </h2>

        <div className="mb-4 text-slate-300 text-sm space-y-1">
          <p><strong>Cliente:</strong> {cliente.nombre} {cliente.apellido ?? ''}</p>
          <p><strong>Visitas actuales:</strong> {cliente.visitas}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm block mb-1">Monto gastado (opcional)</label>
            <input
              type="number"
              step="0.01"
              min={0}
              value={monto}
              onChange={e => setMonto(Number(e.target.value))}
              className="w-full bg-slate-800 text-white p-2 rounded"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm block mb-1">Observación (opcional)</label>
            <input
              type="text"
              value={observacion}
              onChange={e => setObservacion(e.target.value)}
              className="w-full bg-slate-800 text-white p-2 rounded"
              placeholder="Ej: Cliente frecuente, bueno..."
            />
          </div>

          <div className="bg-slate-800 p-3 rounded text-sm text-slate-300">
            Al guardar, el sistema:<br />
            ✓ Incrementa el contador de visitas<br />
            ✓ Actualiza la fecha de última visita<br />
            ✓ Suma el monto al total gastado<br />
            ✓ Recalcula el nivel si corresponde
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={guardar}
            disabled={guardando}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded font-medium"
          >
            {guardando ? 'Registrando...' : 'Registrar Visita'}
          </button>
          <button
            onClick={onCerrar}
            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}