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
  Package,
  Tag,
  Percent,
  Sparkles,
  Gift,
  Truck,
  DoorOpen,
  Hotel,
  Menu,
  X,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuth((s) => s.logout)

  const [mobileAbierto, setMobileAbierto] = useState(false)

  const [recepcionAbierto, setRecepcionAbierto] = useState(
    location.pathname.startsWith("/recepcion")
  )

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

  const [productosAbierto, setProductosAbierto] = useState(
    location.pathname.startsWith("/productos")
  )

  const [promocionesAbierto, setPromocionesAbierto] = useState(
    location.pathname.startsWith("/promociones")
  )

  const [decoracionesAbierto, setDecoracionesAbierto] = useState(
    location.pathname.startsWith("/decoraciones")
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
    setMobileAbierto(false)
    await logout()
    navigate("/login")
  }

  const cerrarMobile = () => setMobileAbierto(false)

  return (
    <>
      {/* Botón hamburguesa - solo mobile */}
      <button
        onClick={() => setMobileAbierto(true)}
        className="lg:hidden fixed top-4 left-4 z-30 bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-lg shadow-lg border border-slate-700"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {/* Overlay mobile */}
      <div
        onClick={cerrarMobile}
        className={`lg:hidden fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          mobileAbierto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-slate-900 border-r border-slate-800 flex flex-col
          fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50
          transition-transform duration-300 ease-in-out
          ${mobileAbierto ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between p-4 pb-0">
          <h1 className="text-2xl font-bold text-white px-2">
            🏨 Hospedaje
          </h1>
          <button
            onClick={cerrarMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1"
            aria-label="Cerrar menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto p-4 pt-4">
          <Link to="/dashboard" className={itemClass("/dashboard")} onClick={cerrarMobile}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          {/* RECEPCIÓN */}
          <div>
            <button onClick={() => setRecepcionAbierto(!recepcionAbierto)} className={dropdownButtonClass(recepcionAbierto)}>
              <span className="flex items-center gap-3">
                <Hotel size={18} />
                Recepción
              </span>
              <ChevronDown size={16} className={`transition-transform ${recepcionAbierto ? "rotate-180" : ""}`} />
            </button>

            {recepcionAbierto && (
              <div className="mt-1 space-y-1">
                <Link to="/recepcion" className={subItemClass("/recepcion")} onClick={cerrarMobile}>
                  <Hotel size={16} />
                  Mapa
                </Link>
              </div>
            )}
          </div>

          {/* USUARIOS */}
          <div>
            <button onClick={() => setUsuariosAbierto(!usuariosAbierto)} className={dropdownButtonClass(usuariosAbierto)}>
              <span className="flex items-center gap-3">
                <Users size={18} />
                Usuarios
              </span>
              <ChevronDown size={16} className={`transition-transform ${usuariosAbierto ? "rotate-180" : ""}`} />
            </button>

            {usuariosAbierto && (
              <div className="mt-1 space-y-1">
                <Link to="/usuarios" className={subItemClass("/usuarios")} onClick={cerrarMobile}>
                  <Users size={16} />
                  Usuarios
                </Link>
                <Link to="/roles" className={subItemClass("/roles")} onClick={cerrarMobile}>
                  <Shield size={16} />
                  Roles
                </Link>
                <Link to="/turnos" className={subItemClass("/turnos")} onClick={cerrarMobile}>
                  <Clock size={16} />
                  Turnos
                </Link>
              </div>
            )}
          </div>

          {/* CONFIGURACIÓN */}
          <div>
            <button onClick={() => setConfigAbierto(!configAbierto)} className={dropdownButtonClass(configAbierto)}>
              <span className="flex items-center gap-3">
                <Settings size={18} />
                Configuración
              </span>
              <ChevronDown size={16} className={`transition-transform ${configAbierto ? "rotate-180" : ""}`} />
            </button>

            {configAbierto && (
              <div className="mt-1 space-y-1">
                <Link to="/configuracion/pisos" className={subItemClass("/configuracion/pisos")} onClick={cerrarMobile}>
                  <Building2 size={16} />
                  Pisos
                </Link>
                <Link to="/configuracion/tipos-habitacion" className={subItemClass("/configuracion/tipos-habitacion")} onClick={cerrarMobile}>
                  <BedDouble size={16} />
                  Tipos de Habitación
                </Link>
                <Link to="/configuracion/tipos-documento" className={subItemClass("/configuracion/tipos-documento")} onClick={cerrarMobile}>
                  <FileText size={16} />
                  Tipos de Documento
                </Link>
                <Link to="/configuracion/metodos-pago" className={subItemClass("/configuracion/metodos-pago")} onClick={cerrarMobile}>
                  <Wallet size={16} />
                  Métodos de Pago
                </Link>
                <Link to="/configuracion/categorias-movimiento" className={subItemClass("/configuracion/categorias-movimiento")} onClick={cerrarMobile}>
                  <TrendingUp size={16} />
                  Categorías Movimiento
                </Link>
                <Link to="/configuracion/clientes-niveles" className={subItemClass("/configuracion/clientes-niveles")} onClick={cerrarMobile}>
                  <Award size={16} />
                  Niveles de Cliente
                </Link>
                <Link to="/configuracion/tarifas" className={subItemClass("/configuracion/tarifas")} onClick={cerrarMobile}>
                  <DollarSign size={16} />
                  Tarifas
                </Link>
                <Link to="/configuracion/habitaciones" className={subItemClass("/configuracion/habitaciones")} onClick={cerrarMobile}>
                  <DoorOpen size={16} />
                  Habitaciones
                </Link>
                <Link to="/configuracion/sistema" className={subItemClass("/configuracion/sistema")} onClick={cerrarMobile}>
                  <Settings size={16} />
                  Config. Sistema
                </Link>
              </div>
            )}
          </div>

          {/* CLIENTES */}
          <div>
            <button onClick={() => setClientesAbierto(!clientesAbierto)} className={dropdownButtonClass(clientesAbierto)}>
              <span className="flex items-center gap-3">
                <UserPlus size={18} />
                Clientes
              </span>
              <ChevronDown size={16} className={`transition-transform ${clientesAbierto ? "rotate-180" : ""}`} />
            </button>

            {clientesAbierto && (
              <div className="mt-1 space-y-1">
                <Link to="/clientes" className={subItemClass("/clientes")} onClick={cerrarMobile}>
                  <UserPlus size={16} />
                  Clientes
                </Link>
                <Link to="/clientes/tipos-observacion" className={subItemClass("/clientes/tipos-observacion")} onClick={cerrarMobile}>
                  <AlertOctagon size={16} />
                  Tipos Observación
                </Link>
                <Link to="/clientes/gravedades-observacion" className={subItemClass("/clientes/gravedades-observacion")} onClick={cerrarMobile}>
                  <ShieldAlert size={16} />
                  Gravedades
                </Link>
              </div>
            )}
          </div>

          {/* PRODUCTOS */}
          <div>
            <button onClick={() => setProductosAbierto(!productosAbierto)} className={dropdownButtonClass(productosAbierto)}>
              <span className="flex items-center gap-3">
                <Package size={18} />
                Productos
              </span>
              <ChevronDown size={16} className={`transition-transform ${productosAbierto ? "rotate-180" : ""}`} />
            </button>

            {productosAbierto && (
              <div className="mt-1 space-y-1">
                <Link to="/productos" className={subItemClass("/productos")} onClick={cerrarMobile}>
                  <Package size={16} />
                  Productos
                </Link>
                <Link to="/productos/categorias" className={subItemClass("/productos/categorias")} onClick={cerrarMobile}>
                  <Tag size={16} />
                  Categorías
                </Link>
                <Link to="/productos/proveedores" className={subItemClass("/productos/proveedores")} onClick={cerrarMobile}>
                  <Truck size={16} />
                  Proveedores
                </Link>
              </div>
            )}
          </div>

          {/* PROMOCIONES */}
          <div>
            <button onClick={() => setPromocionesAbierto(!promocionesAbierto)} className={dropdownButtonClass(promocionesAbierto)}>
              <span className="flex items-center gap-3">
                <Percent size={18} />
                Promociones
              </span>
              <ChevronDown size={16} className={`transition-transform ${promocionesAbierto ? "rotate-180" : ""}`} />
            </button>

            {promocionesAbierto && (
              <div className="mt-1 space-y-1">
                <Link to="/promociones" className={subItemClass("/promociones")} onClick={cerrarMobile}>
                  <Percent size={16} />
                  Promociones
                </Link>
                <Link to="/promociones/categorias" className={subItemClass("/promociones/categorias")} onClick={cerrarMobile}>
                  <Tag size={16} />
                  Categorías
                </Link>
                <Link to="/promociones/asignadas" className={subItemClass("/promociones/asignadas")} onClick={cerrarMobile}>
                  <Gift size={16} />
                  Asignadas
                </Link>
              </div>
            )}
          </div>

          {/* DECORACIONES */}
          <div>
            <button onClick={() => setDecoracionesAbierto(!decoracionesAbierto)} className={dropdownButtonClass(decoracionesAbierto)}>
              <span className="flex items-center gap-3">
                <Sparkles size={18} />
                Decoraciones
              </span>
              <ChevronDown size={16} className={`transition-transform ${decoracionesAbierto ? "rotate-180" : ""}`} />
            </button>

            {decoracionesAbierto && (
              <div className="mt-1 space-y-1">
                <Link to="/decoraciones/paquetes" className={subItemClass("/decoraciones/paquetes")} onClick={cerrarMobile}>
                  <Gift size={16} />
                  Paquetes
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="p-4 pt-0">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition font-medium"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}
