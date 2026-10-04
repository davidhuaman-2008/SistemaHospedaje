/**
 * Extrae el mensaje de error de una respuesta HTTP de Laravel.
 * Evita usar `any` en los catch.
 */
export function mensajeDeError(e: unknown): string {
  if (typeof e === 'object' && e !== null) {
    const err = e as {
      response?: { data?: { message?: string } }
      message?: string
    }
    return err.response?.data?.message || err.message || 'Error inesperado'
  }
  return 'Error inesperado'
}