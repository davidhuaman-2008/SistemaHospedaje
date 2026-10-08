import { useState } from "react"
import { Gift, AlertTriangle, Plus, X } from "lucide-react"
import type { DescuentoManualesConfig } from "@/types/descuento"

export interface DescuentosManualesState {
  aniversario: boolean
  cumpleanos: boolean
  motivo: string
}

interface Props {
  config: DescuentoManualesConfig | null
  value: DescuentosManualesState
  onChange: (nuevo: DescuentosManualesState) => void
}

/**
 * Switch para aplicar descuentos manuales.
 *
 * SOLO se muestran descuentos que NO tengan aplicacion automatica.
 * Ej: Cumpleanos ya se aplica automatico si la fecha coincide → NO se muestra aca.
 *     Aniversario requiere verificacion manual → SI se muestra aca.
 *
 * UX: Colapsado por defecto. Se expande cuando el recepcionista lo pide.
 *
 * R1: Las opciones vienen del backend.
 */
export function DescuentosManualesSwitch({ config, value, onChange }: Props) {
  const [expandido, setExpandido] = useState(false)

  // Si no hay config o esta deshabilitado, no renderiza nada
  if (!config || !config.habilitado || config.opciones.length === 0) {
    return null
  }

  // Filtrar SOLO las opciones que no tengan descuento automatico
  // Cumpleanos se aplica automatico → no se muestra como manual
  const opcionesManuales = config.opciones.filter(op => op.tipo !== 'cumpleanos')

  // Si no quedan opciones manuales, no renderizar el panel
  if (opcionesManuales.length === 0) {
    return null
  }

  const hayAlgunoActivo = value.aniversario
  const motivoRequerido = config.motivo_requerido

  const toggleOpcion = (tipo: "aniversario") => {
    onChange({
      ...value,
      [tipo]: !value[tipo],
    })
  }

  const cerrar = () => {
    if (hayAlgunoActivo) {
      onChange({ aniversario: false, cumpleanos: false, motivo: "" })
    }
    setExpandido(false)
  }

  // ============================================================================
  // ESTADO CERRADO (colapsado por defecto)
  // ============================================================================
  if (!expandido) {
    return (
      <div className="border border-slate-700 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setExpandido(true)}
          className="w-full flex items-center justify-between p-3 bg-slate-900 hover:bg-slate-800 transition text-left"
        >
          <div className="flex items-center gap-2">
            <Gift size={16} className="text-slate-500" />
            <span className="text-slate-400 text-sm">
              ¿El cliente pide descuento especial?
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hayAlgunoActivo && (
              <span className="bg-pink-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                APLICADO
              </span>
            )}
            <Plus size={16} className="text-slate-500" />
          </div>
        </button>

        {hayAlgunoActivo && (
          <div className="px-3 py-2 bg-pink-950/40 border-t border-pink-800 text-[10px] text-pink-200">
            {value.aniversario && <span className="mr-2">💍 Aniversario</span>}
            {value.motivo && <span>· {value.motivo}</span>}
          </div>
        )}
      </div>
    )
  }

  // ============================================================================
  // ESTADO EXPANDIDO
  // ============================================================================
  return (
    <div className="bg-gradient-to-r from-pink-950/60 to-purple-950/60 border-2 border-pink-700 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift size={18} className="text-pink-300" />
          <p className="text-pink-200 font-bold text-sm">Descuento manual</p>
        </div>
        <button
          type="button"
          onClick={cerrar}
          className="text-pink-300 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <p className="text-pink-100/80 text-xs">
        Solo si el cliente <strong>presenta constancia</strong> (partida de matrimonio) con fecha de HOY.
      </p>

      {opcionesManuales.map((op) => {
        const activo = value[op.tipo as "aniversario" | "cumpleanos"]
        return (
          <button
            key={op.tipo}
            type="button"
            onClick={() => toggleOpcion(op.tipo as "aniversario")}
            className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 text-left transition ${
              activo
                ? "bg-pink-600/40 border-pink-400"
                : "bg-slate-900 border-slate-700 hover:border-pink-500"
            }`}
          >
            <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
              activo ? "bg-pink-500 border-pink-300" : "border-slate-500"
            }`}>
              {activo && <span className="text-white text-xs font-bold">✓</span>}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className={`font-semibold text-sm ${activo ? "text-white" : "text-slate-200"}`}>
                  {op.emoji} {op.label}
                </p>
                <span className={`font-bold text-sm ${activo ? "text-white" : "text-pink-400"}`}>
                  {op.porcentaje}%
                </span>
              </div>
              <p className={`text-xs mt-1 ${activo ? "text-pink-100" : "text-slate-500"}`}>
                {op.descripcion}
              </p>
            </div>
          </button>
        )
      })}

      {hayAlgunoActivo && motivoRequerido && (
        <div>
          <label className="text-pink-200 text-xs block mb-1 flex items-center gap-1">
            <AlertTriangle size={12} />
            Motivo / constancia verificada *
          </label>
          <input
            type="text"
            value={value.motivo}
            onChange={e => onChange({ ...value, motivo: e.target.value })}
            placeholder="Ej: constancia de matrimonio 07/10"
            className="w-full bg-slate-900 text-white p-2 rounded border border-pink-700 text-sm"
            required
          />
          <p className="text-pink-200/70 text-[10px] mt-1">
            Se guarda en la reserva para auditoría (R1).
          </p>
        </div>
      )}

      {hayAlgunoActivo && !motivoRequerido && (
        <div>
          <label className="text-pink-200 text-xs block mb-1">Motivo (opcional)</label>
          <input
            type="text"
            value={value.motivo}
            onChange={e => onChange({ ...value, motivo: e.target.value })}
            placeholder="Observación"
            className="w-full bg-slate-900 text-white p-2 rounded border border-pink-700 text-sm"
          />
        </div>
      )}

      <div className="bg-black/30 p-2 rounded text-[10px] text-pink-200">
        💡 Máximo permitido: <strong>{config.max_porcentaje}%</strong>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={cerrar}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}