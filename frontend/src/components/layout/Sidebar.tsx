import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ChevronDown, Users, Shield, Clock, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuth((s) => s.logout)

  const [usuariosAbierto, setUsuariosAbierto] = useState(
    location.pathname.startsWith("/usuarios") ||
    location.pathname.startsWith("/roles") ||
    location.pathname.startsWith("/turnos")
  )

  const itemClass = (path: string) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm ${
      location.pathname === path
        ? "bg-slate-700 text-white font-medium"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`

  const subItemClass = (path: string) =>
    `flex items-center gap-3 px-4 py-2 pl-11 rounded-lg transition text-sm ${
      location.pathname === path
        ? "bg-slate-700 text-white font-medium"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-4 flex flex-col">
      <h1 className="text-2xl font-bold text-white mb-8 px-2">
        🏨 Hospedaje
      </h1>

      <nav className="space-y-1 flex-1">
        <Link to="/dashboard" className={itemClass("/dashboard")}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <div>
          <button
            onClick={() => setUsuariosAbierto(!usuariosAbierto)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition text-sm ${
              usuariosAbierto ? "text-white" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span className="flex items-center gap-3">
              <Users size={18} />
              Usuarios
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${usuariosAbierto ? "rotate-180" : ""}`}
            />
          </button>

          {usuariosAbierto && (
            <div className="mt-1 space-y-1">
              <Link to="/usuarios" className={subItemClass("/usuarios")}>
                <Users size={16} />
                Usuarios
              </Link>
              <Link to="/roles" className={subItemClass("/roles")}>
                <Shield size={16} />
                Roles
              </Link>
              <Link to="/turnos" className={subItemClass("/turnos")}>
                <Clock size={16} />
                Turnos
              </Link>
            </div>
          )}
        </div>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition font-medium"
      >
        Cerrar sesión
      </button>
    </aside>
  )
}