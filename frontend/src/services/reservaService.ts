import api from './api'
import type {
  Reserva, ReservaRequest, WalkInRequest,
  EstadoReserva, HabitacionMapa,
  AgregarConsumoRequest, CambiarHabitacionRequest,
  CalculoExtension, AgregarExtensionRequest, ExtensionReserva
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

  agregarConsumosMultiple: async (
    id: number,
    datos: {
      consumos: Array<{ id_producto: number; cantidad: number }>
      pagos?: Array<{ id_metodo_pago: number; monto: number }>
      cargar_a_cuenta: boolean
      observaciones?: string | null
    }
  ): Promise<Reserva> => {
    const { data } = await api.post(`/reservas/${id}/consumos-multiple`, datos)
    return data.data
  },

  eliminarConsumo: async (idReserva: number, idConsumo: number): Promise<void> => {
    await api.delete(`/reservas/${idReserva}/consumos/${idConsumo}`)
  },

  calculoExtension: async (id: number): Promise<CalculoExtension> => {
    const { data } = await api.get(`/reservas/${id}/calculo-extension`)
    return data
  },

  agregarExtension: async (id: number, datos: AgregarExtensionRequest): Promise<Reserva> => {
    const { data } = await api.post(`/reservas/${id}/extensiones`, datos)
    return data.data
  },

  listarExtensiones: async (id: number): Promise<ExtensionReserva[]> => {
    const { data } = await api.get(`/reservas/${id}/extensiones`)
    return data
  },

  agregarPago: async (id: number, datos: { id_metodo_pago: number; monto: number; observaciones?: string }): Promise<Reserva> => {
    const { data } = await api.post(`/reservas/${id}/pagos`, datos)
    return data.data
  },

  anularPago: async (idReserva: number, idPago: number, motivo: string): Promise<Reserva> => {
    const { data } = await api.delete(`/reservas/${idReserva}/pagos/${idPago}`, {
      data: { motivo },
    })
    return data.data
  },

  entregarVuelto: async (
    id: number,
    datos: { monto: number; id_metodo_pago: number }
  ): Promise<Reserva> => {
    const { data } = await api.post(`/reservas/${id}/entregar-vuelto`, datos)
    return data.data
  },

  checkOutConVuelto: async (
    id: number,
    datos: {
      monto_final?: number
      decision_tipo: "ENTREGADO" | "NO_RECLAMADO" | "OTRO"
      id_metodo_pago?: number | null
      observaciones?: string | null
    }
  ): Promise<Reserva> => {
    const { data } = await api.patch(`/reservas/${id}/check-out-con-vuelto`, datos)
    return data.data
  },

  checkOutConDeuda: async (
    id: number,
    datos: {
      monto_final?: number
      decision_tipo: "PAGO" | "NO_PAGO"
      monto_pago?: number
      id_metodo_pago?: number | null
      id_gravedad?: number | null
      motivo?: string | null
    }
  ): Promise<Reserva> => {
    const { data } = await api.patch(`/reservas/${id}/check-out-con-deuda`, datos)
    return data.data
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