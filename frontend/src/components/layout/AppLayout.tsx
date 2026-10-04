import Sidebar from "./Sidebar"

interface Props {
  children: React.ReactNode
}

/**
 * Layout principal de la aplicación.
 * Se encarga de:
 * - Posicionar el Sidebar (drawer en mobile, fijo en desktop)
 * - Reservar el espacio del botón hamburguesa en mobile
 * - Aplicar padding adaptativo al contenido
 */
export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 min-w-0 p-4 pt-20 lg:p-8 lg:pt-8">
        {children}
      </main>
    </div>
  )
}