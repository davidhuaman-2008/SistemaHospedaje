/**
 * Extrae el mensaje de error de una respuesta HTTP de Laravel.
 * Captura todos los formatos posibles:
 * - { message: "..." }              → Laravel default
 * - { mensaje: "..." }              → Formato custom
 * - { errors: { campo: ["msg"] } }  → Validación
 * - { error: "..." }                → Algunos controllers
 */
export function mensajeDeError(e: unknown): string {
  if (typeof e === 'object' && e !== null) {
    const err = e as {
      response?: {
        data?: {
          message?: string
          mensaje?: string
          error?: string
          errors?: Record<string, string[]>
        }
      }
      message?: string
    }

    // 1. Laravel default: { message: "..." }
    if (err.response?.data?.message) return err.response.data.message

    // 2. Formato custom: { mensaje: "..." }
    if (err.response?.data?.mensaje) return err.response.data.mensaje

    // 3. Errores de validación: { errors: { campo: ["msg"] } }
    if (err.response?.data?.errors) {
      const firstError = Object.values(err.response.data.errors)[0]
      if (Array.isArray(firstError) && firstError[0]) return firstError[0]
    }

    // 4. Fallback: { error: "..." }
    if (err.response?.data?.error) return err.response.data.error

    // 5. Fallback final: mensaje de axios
    if (err.message) return err.message
  }
  return 'Error inesperado'
}