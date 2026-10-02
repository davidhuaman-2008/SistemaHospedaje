import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"

import LoginPage from "@/pages/LoginPage"
import DashboardPage from "@/pages/DashboardPage"
import UsuarioPage from "@/pages/usuarios/usuario/UsuarioPage"
import TurnoPage from "@/pages/usuarios/turno/TurnoPage"
import RolPage from "@/pages/usuarios/rol/RolPage"

// ============================================================================
// CONFIGURACIÃ“N BASE
// ============================================================================
import { PisoPage } from "@/pages/configuracion/piso/PisoPage"
import { TipoHabitacionPage } from "@/pages/configuracion/tipoHabitacion/TipoHabitacionPage"
import { TipoDocumentoPage } from "@/pages/configuracion/tipoDocumento/TipoDocumentoPage"
import { MetodoPagoPage } from "@/pages/configuracion/metodoPago/MetodoPagoPage"
import { CategoriaMovimientoPage } from "@/pages/configuracion/categoriaMovimiento/CategoriaMovimientoPage"
import { ClienteNivelPage } from "@/pages/configuracion/clienteNivel/ClienteNivelPage"

import ProtectedRoute from "@/components/ProtectedRoute"

import { TarifaPage } from "@/pages/configuracion/tarifa/TarifaPage"
import { ClientePage } from "@/pages/clientes/cliente/ClientePage"
import { GravedadObservacionPage } from "@/pages/clientes/gravedadObservacion/GravedadObservacionPage"
import { TipoObservacionPage } from "@/pages/clientes/tipoObservacion/TipoObservacionPage"
function App() {
  return (
    <BrowserRouter>
      <Toaster
        theme="dark"
        position="top-right"
        richColors
        closeButton
      />

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* ============================================================== */}
        {/* USUARIOS (MÃ³dulo 01)                                           */}
        {/* ============================================================== */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <UsuarioPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/turnos"
          element={
            <ProtectedRoute>
              <TurnoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <RolPage />
            </ProtectedRoute>
          }
        />

        {/* ============================================================== */}
        {/* CONFIGURACIÃ“N BASE (MÃ³dulo 02)                                 */}
        {/* ============================================================== */}

        <Route
          path="/configuracion/pisos"
          element={
            <ProtectedRoute>
              <PisoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/configuracion/tipos-habitacion"
          element={
            <ProtectedRoute>
              <TipoHabitacionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/configuracion/tipos-documento"
          element={
            <ProtectedRoute>
              <TipoDocumentoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/configuracion/metodos-pago"
          element={
            <ProtectedRoute>
              <MetodoPagoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/configuracion/categorias-movimiento"
          element={
            <ProtectedRoute>
              <CategoriaMovimientoPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/configuracion/clientes-niveles"
          element={
            <ProtectedRoute>
              <ClienteNivelPage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/configuracion/tarifas"
  element={
    <ProtectedRoute>
      <TarifaPage />
    </ProtectedRoute>
  }
/>
        {/* ============================================================== */}
        {/* ============================================================== */}
        {/* CLIENTES (Módulo 04)                                           */}
        {/* ============================================================== */}

        <Route path="/clientes" element={<ProtectedRoute><ClientePage /></ProtectedRoute>} />
        <Route path="/clientes/tipos-observacion" element={<ProtectedRoute><TipoObservacionPage /></ProtectedRoute>} />
        <Route path="/clientes/gravedades-observacion" element={<ProtectedRoute><GravedadObservacionPage /></ProtectedRoute>} />


        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
