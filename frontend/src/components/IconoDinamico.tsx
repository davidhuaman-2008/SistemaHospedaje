import * as Icons from "lucide-react"
import { Tag } from "lucide-react"

interface Props {
  nombre: string | null | undefined
  size?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Renderiza un ícono de Lucide dinámicamente a partir de su nombre.
 * Ej: "award" -> <Award />, "crown" -> <Crown />, "cake" -> <Cake />
 *
 * Si el nombre no existe en Lucide, devuelve <Tag /> como fallback.
 */
export function IconoDinamico({ nombre, size = 18, className, style }: Props) {
  if (!nombre) return null

  // "arrow-right" o "arrow_right" -> "ArrowRight"
  const pascal = nombre
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join("")

  const Icono = (Icons as Record<string, unknown>)[pascal] as React.ComponentType<{
    size?: number
    className?: string
    style?: React.CSSProperties
  }> ?? Tag

  return <Icono size={size} className={className} style={style} />
}