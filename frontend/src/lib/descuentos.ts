import type { Cliente } from '@/types/cliente'
import type { DescuentoConfig, ResultadoDescuento } from '@/types/descuento'

interface OpcionesManuales {
  aniversario?: boolean
  cumpleanos?: boolean
}


/**
 * Compara si dos fechas coinciden en dia + mes, respetando zonas horarias.
 *
 * Regla:
 * - fechaNacimiento / fechaAniversario: estan en UTC (vienen de la BD como string)
 * - fechaEntrada: esta en hora local del navegador (Peru = UTC-5)
 *
 * Solucion: convertir fechaEntrada a su equivalente en hora de Peru
 * para que el dia+mes sean los correctos.
 */
function coincideDiaMes(fechaBD: string | null, fechaEntrada: Date): boolean {
  if (!fechaBD) return false

  const cumple = new Date(fechaBD)
  if (isNaN(cumple.getTime())) return false

  // Extraer dia+mes de la fecha de BD (esta en UTC)
  const diaCumple = cumple.getUTCDate()
  const mesCumple = cumple.getUTCMonth() + 1

  // Extraer dia+mes de la fechaEntrada EN HORA LOCAL (no UTC)
  // Porque new Date() siempre devuelve la hora del navegador
  const diaEntrada = fechaEntrada.getDate()
  const mesEntrada = fechaEntrada.getMonth() + 1

  return diaCumple === diaEntrada && mesCumple === mesEntrada
}

/**
 * Calcula el descuento automatico del cliente sobre el monto de habitacion.
 *
 * IMPORTANTE:
 * - Los porcentajes vienen del backend (DescuentoConfig) — R1
 * - El descuento por nivel viene de cliente.nivel.descuento
 * - NO acumulativo por defecto: se aplica SOLO EL MAYOR
 * - Los descuentos manuales (aniversario/cumpleanos) se pueden forzar con `manuales`
 */
export function calcularDescuento(
  cliente: Cliente | null,
  fechaEntrada: Date,
  montoHabitacion: number,
  config: DescuentoConfig | null,
  manuales: OpcionesManuales = {}
): ResultadoDescuento {
  if (!config) {
    return { porcentaje: 0, motivo: null, monto: 0, tipo: null }
  }

  const opciones: Array<{ porcentaje: number; motivo: string; tipo: string }> = []

  // 1. Descuento por NIVEL
  if (cliente?.nivel && Number(cliente.nivel.descuento) > 0) {
    opciones.push({
      porcentaje: Number(cliente.nivel.descuento),
      motivo: `Nivel ${cliente.nivel.nombre}`,
      tipo: 'nivel',
    })
  }

  // 2. Descuento por CUMPLEANOS
  const manualCumple = !!manuales.cumpleanos
  const automaticoCumple =
    !!cliente &&
    config.descuento_cumpleanos_activo &&
    coincideDiaMes(cliente.fecha_nacimiento, fechaEntrada)

  if (automaticoCumple || manualCumple) {
    opciones.push({
      porcentaje: config.descuento_cumpleanos_porcentaje,
      motivo: `🎂 Cumpleaños${manualCumple && !automaticoCumple ? ' (manual)' : ''}`,
      tipo: 'cumpleanos',
    })
  }

  // 3. Descuento por ANIVERSARIO
  const manualAniv = !!manuales.aniversario
  const automaticoAniv =
    !!cliente &&
    config.descuento_aniversario_activo &&
    !!cliente.casado &&
    coincideDiaMes(cliente.fecha_aniversario, fechaEntrada)

  if (automaticoAniv || manualAniv) {
    opciones.push({
      porcentaje: config.descuento_aniversario_porcentaje,
      motivo: `💍 Aniversario${manualAniv && !automaticoAniv ? ' (manual)' : ''}`,
      tipo: 'aniversario',
    })
  }

  // Sin descuentos
  if (opciones.length === 0) {
    return { porcentaje: 0, motivo: null, monto: 0, tipo: null }
  }

  // Combinar segun configuracion del backend
  let porcentajeTotal = 0
  let motivoFinal = ''
  let tipoFinal: string | null = null

  if (config.descuento_aplica_a === 'suma') {
    porcentajeTotal = Math.min(
      100,
      opciones.reduce((acc, o) => acc + o.porcentaje, 0)
    )
    motivoFinal = opciones.map(o => o.motivo).join(' + ')
    const manual = opciones.find(o => o.tipo === 'aniversario' || o.tipo === 'cumpleanos')
    tipoFinal = manual?.tipo ?? opciones[0].tipo
  } else {
    // "mayor" (default): solo el mayor
    opciones.sort((a, b) => b.porcentaje - a.porcentaje)
    const mejor = opciones[0]
    porcentajeTotal = mejor.porcentaje
    motivoFinal = mejor.motivo
    tipoFinal = mejor.tipo
  }

  return {
    porcentaje: porcentajeTotal,
    motivo: motivoFinal,
    monto: Math.round(montoHabitacion * (porcentajeTotal / 100) * 100) / 100,
    tipo: tipoFinal,
  }
}