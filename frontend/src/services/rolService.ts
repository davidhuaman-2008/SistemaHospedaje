import api from "@/services/api"
import type { Rol } from "@/types"

export interface RolRequest {
  nombre: string
  descripcion: string
  activo?: boolean
}

export const rolService = {
  async listar(): Promise<Rol[]> {
    const { data } = await api.get<Rol[]>("/roles")
    return data
  },

  async crear(datos: RolRequest) {
    const { data } = await api.post("/roles", datos)
    return data.data || data
  },

  async actualizar(id: number, datos: Partial<RolRequest>) {
    const { data } = await api.put(`/roles/${id}`, datos)
    return data.data || data
  },

  async desactivar(id: number): Promise<Rol> {
    const { data } = await api.patch(`/roles/${id}/desactivar`)
    return data.data || data
  },

  async reactivar(id: number): Promise<Rol> {
    const { data } = await api.patch(`/roles/${id}/reactivar`)
    return data.data || data
  },

  async eliminar(id: number) {
    const { data } = await api.delete(`/roles/${id}`)
    return data
  },
}