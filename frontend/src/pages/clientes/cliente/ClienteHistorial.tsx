import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { clienteService } from '@/services/clienteService'
import type { Cliente, ClienteVisita } from '@/types/cliente'

interface Props {
  cliente: Cliente
  onCerrar: () => void
}

function formatearFechaHora(valor: string | null): string {
  if (!valor) return '—'
  const d = new Date(valor)
  return d.toLocaleString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function ClienteHistorial({ cliente, onCerrar }: Props) {
  const [visitas, setVisitas] = useState<ClienteVisita[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        setVisitas(await clienteService.listarVisitas(cliente.id_cliente))
      } catch {
        toast.error('Error al cargar historial')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [cliente.id_cliente])

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            Historial de {cliente.nombre} {cliente.apellido ?? ''}
          </h2>
          <button onClick={onCerrar} className="text-slate-400 hover:text-white text-2xl">
            ✕
          </button>
        </div>

        <div className="mb-4 text-slate-300 text-sm">
          <p><strong>Visitas totales:</strong> {cliente.visitas}</p>
          <p><strong>Total gastado:</strong> S/ {Number(cliente.total_gastado).toFixed(2)}</p>
        </div>

        {cargando ? (
          <p className="text-slate-400">Cargando...</p>
        ) : visitas.length === 0 ? (
          <p className="text-slate-400">Sin visitas registradas todavía.</p>
        ) : (
          <table className="w-full bg-slate-800 rounded">
            <thead className="bg-slate-700 text-slate-300">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Entrada</th>
                <th className="p-2 text-left">Salida</th>
                <th className="p-2 text-left">Monto</th>
              </tr>
            </thead>
            <tbody>
              {visitas.map(v => (
                <tr key={v.id_visita} className="border-t border-slate-700 text-slate-200">
                  <td className="p-2">{v.id_visita}</td>
                  <td className="p-2">{formatearFechaHora(v.fecha_entrada)}</td>
                  <td className="p-2">{formatearFechaHora(v.fecha_salida)}</td>
                  <td className="p-2">S/ {Number(v.monto_gastado).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-4 flex justify-end">
          <button onClick={onCerrar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}