import api from './api'
import type {
  CuentaPagar,
  CuentaPagarRequest,
  RegistrarPagoProveedorRequest,
} from '@/types/cuentaPagar'

export const cuentaPagarService = {
  listar: async (): Promise<CuentaPagar[]> => {
    const { data } = await api.get('/cuentas-por-pagar')
    return data
  },

  listarPendientes: async (): Promise<CuentaPagar[]> => {
    const { data } = await api.get('/cuentas-por-pagar/pendientes')
    return data
  },

  listarVencidas: async (): Promise<CuentaPagar[]> => {
    const { data } = await api.get('/cuentas-por-pagar/vencidas')
    return data
  },

  porProveedor: async (idProveedor: number): Promise<CuentaPagar[]> => {
    const { data } = await api.get(`/cuentas-por-pagar/por-proveedor/${idProveedor}`)
    return data
  },

  obtener: async (id: number): Promise<CuentaPagar> => {
    const { data } = await api.get(`/cuentas-por-pagar/${id}`)
    return data
  },

  crear: async (datos: CuentaPagarRequest): Promise<CuentaPagar> => {
    const { data } = await api.post('/cuentas-por-pagar', datos)
    return data.data
  },

  actualizar: async (id: number, datos: Partial<CuentaPagarRequest>): Promise<CuentaPagar> => {
    const { data } = await api.put(`/cuentas-por-pagar/${id}`, datos)
    return data.data
  },

  anular: async (id: number, motivo: string): Promise<CuentaPagar> => {
    const { data } = await api.patch(`/cuentas-por-pagar/${id}/anular`, { motivo })
    return data.data
  },

  registrarPago: async (
    id: number,
    datos: RegistrarPagoProveedorRequest
  ): Promise<CuentaPagar> => {
    const { data } = await api.post(`/cuentas-por-pagar/${id}/pagos`, datos)
    return data.data
  },

  anularPago: async (idCuenta: number, idPago: number, motivo: string): Promise<CuentaPagar> => {
    const { data } = await api.delete(
      `/cuentas-por-pagar/${idCuenta}/pagos/${idPago}`,
      { data: { motivo } }
    )
    return data.data
  },
}