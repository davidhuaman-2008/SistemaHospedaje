import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { clienteService } from '@/services/clienteService'
import { clienteObservacionService } from '@/services/clienteObservacionService'
import { tipoDocumentoService } from '@/services/tipoDocumentoService'
import type { Cliente, ClienteRequest, ClienteObservacion } from '@/types/cliente'
import type { TipoDocumento } from '@/types/configuracion'
import { AlertaClienteObservaciones } from './AlertaClienteObservaciones'

interface Props {
  inicial: Cliente | null
  onGuardar: (datos: ClienteRequest, idExistente?: number) => void
  onCancelar: () => void
}

function normalizarFecha(valor: string | null | undefined): string {
  if (!valor) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor
  return valor.substring(0, 10)
}

export function ClienteForm({ inicial, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre || '')
  const [apellido, setApellido] = useState(inicial?.apellido || '')
  const [numeroDocumento, setNumeroDocumento] = useState(inicial?.numero_documento || '')
  const [celular, setCelular] = useState(inicial?.celular || '')
  const [email, setEmail] = useState(inicial?.email || '')
  const [fechaNacimiento, setFechaNacimiento] = useState(normalizarFecha(inicial?.fecha_nacimiento))
  const [direccion, setDireccion] = useState(inicial?.direccion || '')
  const [buscando, setBuscando] = useState(false)
  const [idExistente, setIdExistente] = useState<number | null>(null)
  const [visitasExistentes, setVisitasExistentes] = useState<number | null>(null)
  const [observacionesPendientes, setObservacionesPendientes] = useState<ClienteObservacion[]>([])

  // Tipo de documento
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([])
  const [idTipoDocumento, setIdTipoDocumento] = useState<number | null>(inicial?.id_tipo_documento ?? null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const tipos = await tipoDocumentoService.listarActivos()
        setTiposDocumento(tipos)
        if (!idTipoDocumento && tipos.length > 0) {
          const dni = tipos.find(t => t.abreviatura === "DNI")
          if (dni) setIdTipoDocumento(dni.id_documento)
          else setIdTipoDocumento(tipos[0].id_documento)
        }
      } catch {
        // silent
      }
    }
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (inicial?.id_tipo_documento) {
      setIdTipoDocumento(inicial.id_tipo_documento)
    }
  }, [inicial])

  const buscarDni = async () => {
    if (!numeroDocumento) return
    setBuscando(true)
    try {
      const { cliente: encontrado } = await clienteService.buscarPorDni(numeroDocumento)

      if (encontrado) {
        setNombre(encontrado.nombre)
        setApellido(encontrado.apellido || '')
        setCelular(encontrado.celular || '')
        setEmail(encontrado.email || '')
        setFechaNacimiento(normalizarFecha(encontrado.fecha_nacimiento))
        setDireccion(encontrado.direccion || '')
        setIdExistente(encontrado.id_cliente)
        setVisitasExistentes(encontrado.visitas)
        if (encontrado.id_tipo_documento) {
          setIdTipoDocumento(encontrado.id_tipo_documento)
        }

        try {
          const obs = await clienteObservacionService.porCliente(encontrado.id_cliente)
          const pendientes = obs.filter(o => !o.resuelto)
          setObservacionesPendientes(pendientes)

          if (pendientes.length > 0) {
            toast.warning(`${encontrado.nombre} tiene ${pendientes.length} observación(es) pendiente(s)`)
          } else {
            toast.info(`${encontrado.nombre} ya existe con ${encontrado.visitas} visitas.`)
          }
        } catch {
          setObservacionesPendientes([])
          toast.info(`${encontrado.nombre} ya existe con ${encontrado.visitas} visitas.`)
        }
      } else {
        setIdExistente(null)
        setVisitasExistentes(null)
        setObservacionesPendientes([])
        toast.success('Cliente nuevo. Complete los datos.')
      }
    } catch {
      toast.error('Error al buscar')
    } finally {
      setBuscando(false)
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return
    onGuardar({
      nombre,
      apellido: apellido || null,
      id_tipo_documento: idTipoDocumento,
      numero_documento: numeroDocumento || null,
      celular: celular || null,
      email: email || null,
      fecha_nacimiento: fechaNacimiento || null,
      direccion: direccion || null,
      activo: true,
    }, idExistente ?? undefined)
  }

  return (
    <form onSubmit={submit} className="bg-slate-800 p-4 rounded mb-4">
      {observacionesPendientes.length > 0 && (
        <div className="mb-4">
          <AlertaClienteObservaciones observaciones={observacionesPendientes} />
        </div>
      )}

      {idExistente && observacionesPendientes.length === 0 && (
        <div className="mb-4 bg-cyan-900 border border-cyan-700 text-cyan-200 p-3 rounded text-sm">
          ⚠️ Este cliente <strong>ya existe</strong> con <strong>{visitasExistentes}</strong> visitas.
          Estás en modo <strong>edición</strong>.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-slate-300 text-sm">Tipo de documento</label>
          <select
            value={idTipoDocumento ?? ""}
            onChange={e => setIdTipoDocumento(e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-slate-900 text-white p-2 rounded"
          >
            <option value="">— Seleccionar —</option>
            {tiposDocumento.map(t => (
              <option key={t.id_documento} value={t.id_documento}>
                {t.nombre} ({t.abreviatura})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-300 text-sm">N° de documento</label>
          <div className="flex gap-2">
            <input
              value={numeroDocumento}
              onChange={e => setNumeroDocumento(e.target.value)}
              className="flex-1 bg-slate-900 text-white p-2 rounded"
            />
            <button
              type="button"
              onClick={buscarDni}
              disabled={buscando || !numeroDocumento}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white px-3 py-2 rounded text-sm"
            >
              {buscando ? '...' : 'Buscar'}
            </button>
          </div>
        </div>
        <div>
          <label className="text-slate-300 text-sm">Nombre *</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" required />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Apellido</label>
          <input value={apellido} onChange={e => setApellido(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Celular</label>
          <input value={celular} onChange={e => setCelular(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div>
          <label className="text-slate-300 text-sm">Fecha de nacimiento</label>
          <input type="date" value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <label className="text-slate-300 text-sm">Dirección</label>
          <input value={direccion} onChange={e => setDireccion(e.target.value)} className="w-full bg-slate-900 text-white p-2 rounded" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          {idExistente ? 'Actualizar datos' : 'Crear'}
        </button>
        <button type="button" onClick={onCancelar} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">Cancelar</button>
      </div>
    </form>
  )
}