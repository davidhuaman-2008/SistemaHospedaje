import api from './api'
import type {
  Reserva, ReservaRequest, WalkInRequest,
  EstadoReserva, HabitacionMapa,
  AgregarConsumoRequest, CambiarHabitacionRequest
} from '@/types/reserva'

export const reservaService = {
  listar: async (): Promise<Reserva[]> => {
    const { data } = await api.get('/reservas')
    return data
  },

  obtener: async (id: number): Promise<Reserva> => {
    const { data } = await api.get(`/reservas/${id}`)
    return data
  },

  crearWalkIn: async (datos: WalkInRequest): Promise<Reserva> => {
    const { data } = await api.post('/reservas/walk-in', datos)
    return data.data
  },

  crearReserva: async (datos: ReservaRequest): Promise<Reserva> => {
    const { data } = await api.post('/reservas', datos)
    return data.data
  },

  checkIn: async (id: number): Promise<Reserva> => {
    const { data } = await api.patch(`/reservas/${id}/check-in`)
    return data.data
  },

  checkOut: async (id: number, montoFinal?: number): Promise<Reserva> => {
    const { data } = await api.patch(`/reservas/${id}/check-out`, {
      monto_final: montoFinal,
    })
    return data.data
  },

  cancelar: async (id: number, motivo: string): Promise<Reserva> => {
    const { data } = await api.patch(`/reservas/${id}/cancelar`, { motivo })
    return data.data
  },

  anular: async (id: number, motivo: string): Promise<Reserva> => {
    const { data } = await api.patch(`/reservas/${id}/anular`, { motivo })
    return data.data
  },

  cambiarHabitacion: async (id: number, datos: CambiarHabitacionRequest): Promise<Reserva> => {
    const { data } = await api.patch(`/reservas/${id}/cambiar-habitacion`, datos)
    return data.data
  },

  agregarConsumo: async (id: number, datos: AgregarConsumoRequest): Promise<Reserva> => {
    const { data } = await api.post(`/reservas/${id}/consumos`, datos)
    return data.reserva
  },

  eliminarConsumo: async (idReserva: number, idConsumo: number): Promise<void> => {
    await api.delete(`/reservas/${idReserva}/consumos/${idConsumo}`)
  },
}

export const estadoReservaService = {
  listar: async (): Promise<EstadoReserva[]> => {
    const { data } = await api.get('/estados-reserva')
    return data
  },
  listarActivos: async (): Promise<EstadoReserva[]> => {
    const { data } = await api.get('/estados-reserva/activos')
    return data
  },
}

export const habitacionMapaService = {
  listar: async (): Promise<HabitacionMapa[]> => {
    const { data } = await api.get('/habitaciones-mapa')
    return data
  },
  obtener: async (id: number) => {
    const { data } = await api.get(`/habitaciones-mapa/${id}`)
    return data
  },
}