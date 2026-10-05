export interface Rol {
  id: number
  nombre: string
  descripcion: string | null
  activo: boolean
}

export interface Turno {
  id: number
  nombre: string
  hora_inicio: string
  hora_fin: string
  descripcion: string | null
  activo: boolean
}

export interface Usuario {
  id: number
  nombre: string
  apellido: string
  nombre_usuario: string
  id_rol: number
  id_turno: number | null
  activo: boolean
  ultimo_login: string | null
  rol: Rol
  turno: Turno | null
}

export interface LoginRequest {
  nombre_usuario: string
  password: string
}

export interface LoginResponse {
  mensaje: string
  usuario: Usuario
  token: string
}
export interface CrearUsuarioRequest {
  nombre: string
  apellido: string
  nombre_usuario: string
  password: string
  id_rol: number
  id_turno: number | null
  activo: boolean
}