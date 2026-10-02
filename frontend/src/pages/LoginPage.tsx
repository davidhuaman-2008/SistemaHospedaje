import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authService } from "@/services/authService"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuth((s) => s.login)

  const [nombreUsuario, setNombreUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    try {
      const respuesta = await authService.login({
        nombre_usuario: nombreUsuario,
        password: password,
      })

      login(respuesta.usuario, respuesta.token)
      toast.success(`Bienvenido, ${respuesta.usuario.nombre}`)
      navigate("/dashboard")
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { errors?: Record<string, string[]> } }
      }
      const mensajes = axiosError.response?.data?.errors

      if (mensajes) {
        toast.error(Object.values(mensajes).flat().join(" "))
      } else {
        toast.error("Error al iniciar sesión")
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">
            🏨 Hospedaje
          </CardTitle>
          <CardDescription className="text-slate-400">
            Ingresá tus credenciales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_usuario" className="text-slate-300">
                Usuario
              </Label>
              <Input
                id="nombre_usuario"
                type="text"
                placeholder="nancy"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
                autoFocus
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <Button type="submit" className="w-full" disabled={cargando}>
              {cargando ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}