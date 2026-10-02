import Sidebar from "@/components/layout/Sidebar"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardPage() {
  const usuario = useAuth((s) => s.usuario)

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold">
          Bienvenido, {usuario?.nombre}
        </h1>

        <p className="mt-2 text-slate-400">
          {usuario?.rol?.nombre} · Turno: {usuario?.turno?.nombre ?? "Sin turno"}
        </p>

        <div className="mt-8 bg-slate-900 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Datos de sesión
          </h2>

          <p><strong>Usuario:</strong> {usuario?.nombre_usuario}</p>
          <p><strong>Nombre:</strong> {usuario?.nombre} {usuario?.apellido}</p>
          <p><strong>Rol:</strong> {usuario?.rol?.nombre}</p>
          <p><strong>Turno:</strong> {usuario?.turno?.nombre ?? "—"}</p>
          <p><strong>Estado:</strong> {usuario?.activo ? "✅ Activo" : "❌ Inactivo"}</p>
        </div>
      </main>
    </div>
  )
}