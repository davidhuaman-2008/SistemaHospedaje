import api from "@/services/api"
import type {
  Usuario,
  CrearUsuarioRequest,
} from "@/types"

export const usuarioService = {
  async listar(): Promise<Usuario[]> {
    const { data } = await api.get<Usuario[]>("/usuarios")
    return data
  },

  async crear(datos: CrearUsuarioRequest) {
    const { data } = await api.post("/usuarios", datos)
    return data
  },

  async actualizar(
    id: number,
    datos: Partial<CrearUsuarioRequest>
  ) {
    const { data } = await api.put(
      `/usuarios/${id}`,
      datos
    )

    return data
  },

  async eliminar(id: number) {
    const { data } = await api.delete(
      `/usuarios/${id}`
    )

    return data
  },
}