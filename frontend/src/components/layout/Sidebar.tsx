import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  ChevronDown,
  Users,
  Shield,
  Clock,
  LayoutDashboard,
  Settings,
  Building2,
  BedDouble,
  FileText,
  Wallet,
  TrendingUp,
  Award,
  DollarSign,
  UserPlus,
  AlertOctagon,
  ShieldAlert,
} from "lucide-react"
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

  const [configAbierto, setConfigAbierto] = useState(
    location.pathname.startsWith("/configuracion")
  )

  const [clientesAbierto, setClientesAbierto] = useState(
    location.pathname.startsWith("/clientes")
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

  const dropdownButtonClass = (abierto: boolean) =>
    `w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition text-sm ${
      abierto ? "text-white" : "text-slate-300 hover:bg-slate-800"
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

      <nav className="space-y-1 flex-1 overflow-y-auto">
        <Link to="/dashboard" className={itemClass("/dashboard")}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        {/* USUARIOS */}
        <div>
          <button
            onClick={() => setUsuariosAbierto(!usuariosAbierto)}
            className={dropdownButtonClass(usuariosAbierto)}
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

        {/* CONFIGURACIÓN */}
        <div>
          <button
            onClick={() => setConfigAbierto(!configAbierto)}
            className={dropdownButtonClass(configAbierto)}
          >
            <span className="flex items-center gap-3">
              <Settings size={18} />
              Configuración
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${configAbierto ? "rotate-180" : ""}`}
            />
          </button>

          {configAbierto && (
            <div className="mt-1 space-y-1">
              <Link
                to="/configuracion/pisos"
                className={subItemClass("/configuracion/pisos")}
              >
                <Building2 size={16} />
                Pisos
              </Link>
              <Link
                to="/configuracion/tipos-habitacion"
                className={subItemClass("/configuracion/tipos-habitacion")}
              >
                <BedDouble size={16} />
                Tipos de Habitación
              </Link>
              <Link
                to="/configuracion/tipos-documento"
                className={subItemClass("/configuracion/tipos-documento")}
              >
                <FileText size={16} />
                Tipos de Documento
              </Link>
              <Link
                to="/configuracion/metodos-pago"
                className={subItemClass("/configuracion/metodos-pago")}
              >
                <Wallet size={16} />
                Métodos de Pago
              </Link>
              <Link
                to="/configuracion/categorias-movimiento"
                className={subItemClass("/configuracion/categorias-movimiento")}
              >
                <TrendingUp size={16} />
                Categorías Movimiento
              </Link>
              <Link
                to="/configuracion/clientes-niveles"
                className={subItemClass("/configuracion/clientes-niveles")}
              >
                <Award size={16} />
                Niveles de Cliente
              </Link>
              <Link
                to="/configuracion/tarifas"
                className={subItemClass("/configuracion/tarifas")}
              >
                <DollarSign size={16} />
                Tarifas
              </Link>
            </div>
          )}
        </div>

        {/* CLIENTES */}
        <div>
          <button
            onClick={() => setClientesAbierto(!clientesAbierto)}
            className={dropdownButtonClass(clientesAbierto)}
          >
            <span className="flex items-center gap-3">
              <UserPlus size={18} />
              Clientes
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${clientesAbierto ? "rotate-180" : ""}`}
            />
          </button>

          {clientesAbierto && (
            <div className="mt-1 space-y-1">
              <Link to="/clientes" className={subItemClass("/clientes")}>
                <UserPlus size={16} />
                Clientes
              </Link>
              <Link
                to="/clientes/tipos-observacion"
                className={subItemClass("/clientes/tipos-observacion")}
              >
                <AlertOctagon size={16} />
                Tipos Observación
              </Link>
              <Link
                to="/clientes/gravedades-observacion"
                className={subItemClass("/clientes/gravedades-observacion")}
              >
                <ShieldAlert size={16} />
                Gravedades
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