import api from "@/services/api"
import type { Rol } from "@/types"

export interface RolRequest {
  nombre: string
  descripcion: string
}

export const rolService = {
  async listar(): Promise<Rol[]> {
    const { data } = await api.get<Rol[]>("/roles")
    return data
  },

  async crear(datos: RolRequest) {
    const { data } = await api.post("/roles", datos)
    return data
  },

  async actualizar(
    id: number,
    datos: Partial<RolRequest>
  ) {
    const { data } = await api.put(
      `/roles/${id}`,
      datos
    )

    return data
  },

  async eliminar(id: number) {
    const { data } = await api.delete(
      `/roles/${id}`
    )

    return data
  },
}
