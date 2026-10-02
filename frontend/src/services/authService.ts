import api from "./api"
import type { LoginRequest, LoginResponse, Usuario } from "@/types"

export const authService = {
  async login(datos: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/login", datos)
    return data
  },

  async logout(): Promise<void> {
    await api.post("/logout")
  },

  async yo(): Promise<Usuario> {
    const { data } = await api.get<Usuario>("/yo")
    return data
  },
}