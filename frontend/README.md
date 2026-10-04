# 📘 README.md completo del Frontend — Solo para pegar en el archivo

**Copiá TODO lo que está dentro del bloque de abajo y pegalo en tu `frontend/README.md`** (reemplazando el contenido actual).

```markdown
# Frontend — Sistema de Hospedaje

**Framework:** React 19 + TypeScript 6
**Build:** Vite 8
**Estilos:** Tailwind CSS v4
**UI Components:** shadcn/ui (Base UI + preset Nova)
**Router:** React Router v7
**Estado global:** Zustand 5 (con persist)
**HTTP:** Axios 1.20
**Notificaciones:** Sonner 2
**Iconos:** Lucide React 1.49
**Estado global:** Módulos 01-04 completados

---

## 📌 Descripción

SPA (Single Page Application) para gestión completa de un hospedaje de rotación rápida. Consume la API REST del backend Laravel (Sanctum Bearer tokens). Interfaz completa en modo oscuro.

**Arquitectura:**
- Componentes por página (Page/Form/Tabla)
- Cada `Page.tsx` incluye `<Sidebar />` (Layout a nivel de página)
- Servicios para llamadas API (axios)
- Zustand para estado de autenticación
- Sidebar con dropdowns por módulo
- Rutas protegidas con guard

---

## 🔴 REGLAS DEL PROYECTO (NO NEGOCIABLES)

### R1 — Nada hardcodeado
Todo sale de la BD. Si puede cambiar sin tocar código → va a BD.
Los datos de estado, tipos, categorías, métodos de pago, etc. vienen del backend.

### R2 — Poco código por archivo
100 archivos de 30 líneas > 10 archivos de 300 líneas.
1 archivo = 1 responsabilidad.

### R3 — Funcional > Elegante
Si algo es "elegante pero confuso" → simplificar.

---

## 📂 Estructura de carpetas

```
frontend/
├── public/
│   └── (vacío)
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Sidebar.tsx               (menú lateral con 3 dropdowns)
│   │   ├── ui/                            (componentes shadcn)
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   ├── ConfirmDialog.tsx              (modal reutilizable)
│   │   └── ProtectedRoute.tsx             (guard de rutas autenticadas)
│   │
│   ├── hooks/
│   │   └── useAuth.ts                     (Zustand + persist)
│   │
│   ├── lib/
│   │   └── utils.ts                       (helper cn de shadcn)
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   │
│   │   ├── usuarios/                      (Módulo 01)
│   │   │   ├── usuario/
│   │   │   │   ├── UsuarioPage.tsx
│   │   │   │   ├── UsuarioForm.tsx
│   │   │   │   └── UsuarioTabla.tsx
│   │   │   ├── turno/
│   │   │   │   ├── TurnoPage.tsx
│   │   │   │   ├── TurnoForm.tsx
│   │   │   │   └── TurnoTabla.tsx
│   │   │   └── rol/
│   │   │       ├── RolPage.tsx
│   │   │       ├── RolForm.tsx
│   │   │       └── RolTabla.tsx
│   │   │
│   │   ├── configuracion/                 (Módulos 02 y 03)
│   │   │   ├── piso/
│   │   │   │   ├── PisoPage.tsx
│   │   │   │   ├── PisoForm.tsx
│   │   │   │   └── PisoTabla.tsx
│   │   │   ├── tipoHabitacion/
│   │   │   │   ├── TipoHabitacionPage.tsx
│   │   │   │   ├── TipoHabitacionForm.tsx
│   │   │   │   └── TipoHabitacionTabla.tsx
│   │   │   ├── tipoDocumento/
│   │   │   │   ├── TipoDocumentoPage.tsx
│   │   │   │   ├── TipoDocumentoForm.tsx
│   │   │   │   └── TipoDocumentoTabla.tsx
│   │   │   ├── metodoPago/
│   │   │   │   ├── MetodoPagoPage.tsx
│   │   │   │   ├── MetodoPagoForm.tsx
│   │   │   │   └── MetodoPagoTabla.tsx
│   │   │   ├── categoriaMovimiento/
│   │   │   │   ├── CategoriaMovimientoPage.tsx
│   │   │   │   ├── CategoriaMovimientoForm.tsx
│   │   │   │   └── CategoriaMovimientoTabla.tsx
│   │   │   ├── clienteNivel/
│   │   │   │   ├── ClienteNivelPage.tsx
│   │   │   │   ├── ClienteNivelForm.tsx
│   │   │   │   └── ClienteNivelTabla.tsx
│   │   │   └── tarifa/
│   │   │       ├── TarifaPage.tsx
│   │   │       ├── TarifaForm.tsx
│   │   │       └── TarifaTabla.tsx
│   │   │
│   │   └── clientes/                      (Módulo 04)
│   │       ├── tipoObservacion/
│   │       │   ├── TipoObservacionPage.tsx
│   │       │   ├── TipoObservacionForm.tsx
│   │       │   └── TipoObservacionTabla.tsx
│   │       ├── gravedadObservacion/
│   │       │   ├── GravedadObservacionPage.tsx
│   │       │   ├── GravedadObservacionForm.tsx
│   │       │   └── GravedadObservacionTabla.tsx
│   │       └── cliente/
│   │           ├── ClientePage.tsx
│   │           ├── ClienteForm.tsx
│   │           ├── ClienteTabla.tsx
│   │           ├── ClienteHistorial.tsx
│   │           └── ClienteVisitaDialog.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── usuarioService.ts
│   │   ├── rolService.ts
│   │   ├── turnoService.ts
│   │   ├── pisoService.ts
│   │   ├── tipoHabitacionService.ts
│   │   ├── tipoDocumentoService.ts
│   │   ├── metodoPagoService.ts
│   │   ├── categoriaMovimientoService.ts
│   │   ├── clienteNivelService.ts
│   │   ├── tarifaService.ts
│   │   ├── tipoObservacionService.ts
│   │   ├── gravedadObservacionService.ts
│   │   └── clienteService.ts
│   │
│   ├── types/
│   │   ├── index.ts                       (tipos Módulo 01)
│   │   ├── configuracion.ts               (tipos Módulo 02)
│   │   ├── tarifa.ts                      (tipos Módulo 03)
│   │   ├── tipoObservacion.ts             (tipos Módulo 04)
│   │   ├── gravedadObservacion.ts         (tipos Módulo 04)
│   │   └── cliente.ts                     (tipos Módulo 04)
│   │
│   ├── App.tsx                            (router principal + Toaster)
│   ├── main.tsx                           (entry point)
│   └── index.css                          (Tailwind + variables shadcn)
│
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## 🛠️ Stack técnico completo

### Dependencies (producción)

| Paquete | Versión | Uso |
|---------|---------|-----|
| react | ^19.2.8 | UI |
| react-dom | ^19.2.8 | Render |
| react-router-dom | ^7.18.4 | Router |
| axios | ^1.20.0 | HTTP client |
| zustand | ^5.0.15 | Estado global |
| sonner | ^2.0.8 | Toasts |
| lucide-react | ^1.49.0 | Iconos |
| @base-ui/react | ^1.8.0 | Base de componentes shadcn |
| shadcn | ^4.21.1 | CLI de componentes |
| class-variance-authority | ^0.7.1 | Variantes de clases |
| cn | ^0.4.0 | Helper de clases |
| tailwindcss | ^4.3.3 | Estilos |
| @tailwindcss/vite | ^4.3.3 | Plugin Tailwind para Vite |
| tw-animate-css | ^1.4.0 | Animaciones Tailwind |
| @fontsource-variable/geist | ^5.3.0 | Fuente Geist |

### DevDependencies

| Paquete | Versión |
|---------|---------|
| vite | ^8.3.0 |
| @vitejs/plugin-react | ^6.1.1 |
| typescript | ~6.0.2 |
| @types/node | ^24.19.0 |
| @types/react | ^19.2.18 |
| @types/react-dom | ^19.2.7 |
| eslint | ^10.10.0 |
| @eslint/js | ^10.0.1 |
| eslint-plugin-react-hooks | ^7.1.1 |
| eslint-plugin-react-refresh | ^0.5.6 |
| globals | ^17.12.0 |
| typescript-eslint | ^8.69.0 |

---

## ⚙️ Configuración clave

### `vite.config.ts`

```ts
import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
})
```

**Importante:** El proxy `/api` redirige al backend Laravel.

### `tsconfig.json` y `tsconfig.app.json`

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 🧭 Rutas completas

### `src/App.tsx`

| Ruta | Componente | Protegida |
|------|-----------|-----------|
| `/login` | LoginPage | No |
| `/dashboard` | DashboardPage | Sí |
| `/usuarios` | UsuarioPage | Sí |
| `/roles` | RolPage | Sí |
| `/turnos` | TurnoPage | Sí |
| `/configuracion/pisos` | PisoPage | Sí |
| `/configuracion/tipos-habitacion` | TipoHabitacionPage | Sí |
| `/configuracion/tipos-documento` | TipoDocumentoPage | Sí |
| `/configuracion/metodos-pago` | MetodoPagoPage | Sí |
| `/configuracion/categorias-movimiento` | CategoriaMovimientoPage | Sí |
| `/configuracion/clientes-niveles` | ClienteNivelPage | Sí |
| `/configuracion/tarifas` | TarifaPage | Sí |
| `/clientes` | ClientePage | Sí |
| `/clientes/tipos-observacion` | TipoObservacionPage | Sí |
| `/clientes/gravedades-observacion` | GravedadObservacionPage | Sí |
| `/` | Redirect → `/dashboard` | — |
| `*` | Redirect → `/dashboard` | — |

**Toaster global:** Sonner con `theme="dark"`, `position="top-right"`, `richColors`, `closeButton`.

---

## 🎨 Sidebar — Estructura de menú

```
🏨 Hospedaje
├── Dashboard (link directo)
├── Usuarios (dropdown)
│   ├── Usuarios
│   ├── Roles
│   └── Turnos
├── Configuración (dropdown)
│   ├── Pisos
│   ├── Tipos de Habitación
│   ├── Tipos de Documento
│   ├── Métodos de Pago
│   ├── Categorías Movimiento
│   ├── Niveles de Cliente
│   └── Tarifas
└── Clientes (dropdown)
    ├── Clientes
    ├── Tipos Observación
    └── Gravedades
```

**Iconos de Lucide:** ChevronDown, Users, Shield, Clock, LayoutDashboard, Settings, Building2, BedDouble, FileText, Wallet, TrendingUp, Award, DollarSign, UserPlus, AlertOctagon, ShieldAlert.

**Comportamiento de dropdowns:**
- Cada dropdown tiene su `useState` inicializado según la ruta actual
- Se abre automáticamente si estás en una ruta de ese grupo
- Se cierra/abre con click

---

## 📄 Módulo 01 — AUTH

### `LoginPage.tsx`
- Input usuario, input password
- Botón "Ingresar" (deshabilitado mientras carga)
- Toast de éxito: "Bienvenido, {nombre}"
- Toast de error: mensaje del backend

**Credenciales de prueba:** `nancy` / `admin123`

### `DashboardPage.tsx`
- Saludo: "Bienvenido, {nombre}"
- Rol + turno del usuario
- Card con datos de sesión
- **Incluye `<Sidebar />`**

### `UsuarioPage.tsx`, `TurnoPage.tsx`, `RolPage.tsx`
- CRUD completo con Page/Form/Tabla
- Toasts verde/rojo
- **Cada uno incluye `<Sidebar />`**

---

## 📄 Módulo 02 — CONFIG-BASE (6 CRUDs)

**Cada uno con el mismo patrón:**

```
src/pages/configuracion/xxx/
├── XxxPage.tsx         (orquesta + Sidebar + carga datos)
├── XxxForm.tsx         (formulario con validación)
└── XxxTabla.tsx        (tabla con acciones)
```

**CRUDs:**
1. `piso/` — Pisos
2. `tipoHabitacion/` — Tipos de Habitación
3. `tipoDocumento/` — Tipos de Documento
4. `metodoPago/` — Métodos de Pago (con badges CAJA/DUEÑA)
5. `categoriaMovimiento/` — Categorías Movimiento
6. `clienteNivel/` — Niveles de Cliente

**Patrón de cada Page:**

```tsx
export function XxxPage() {
  const [items, setItems] = useState<Xxx[]>([])
  const [editando, setEditando] = useState<Xxx | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  const cargar = async () => { ... }
  useEffect(() => { cargar() }, [])

  const guardar = async (datos) => { ... }
  const cambiarEstado = async (item) => { ... }
  const eliminar = async (item) => { ... }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Xxx</h1>
          <button className="bg-green-600 ...">+ Nuevo</button>
        </div>
        {mostrarForm && <XxxForm ... />}
        {cargando ? <p>Cargando...</p> : <XxxTabla ... />}
      </main>
    </div>
  )
}
```

**⚠️ IMPORTANTE:** Cada `Page.tsx` **incluye `<Sidebar />`** adentro. El Layout se hace a nivel de página, no a nivel de App.tsx.

---

## 📄 Módulo 03 — TARIFAS

### `TarifaPage.tsx`
- Carga tarifas + tipos de habitación (`Promise.all`)
- Formulario con selector de tipo + horas + montos
- Tabla con: ID, Tipo, Horas, Monto, Hora Extra, Máx Extra, Turno Adic., Estado, Acciones
- **Incluye `<Sidebar />`**

### `TarifaForm.tsx`
- Select de tipo de habitación
- Input horas
- Input monto
- Input precio hora extra
- Input max horas extra
- Input precio turno adicional

### `TarifaTabla.tsx`
- Muestra todos los campos formateados con "S/ X.XX"

---

## 📄 Módulo 04 — CLIENTES

### `cliente/ClientePage.tsx`
- Lista de clientes con búsqueda por nombre/DNI/celular
- Botón "+ Nuevo Cliente"
- Maneja 3 estados:
  - `editando` (editar existente)
  - `idExistente` (buscó DNI que ya existe → cambia a modo Editar)
  - Ninguno (crear nuevo)
- Modales: `ClienteHistorial` + `ClienteVisitaDialog`

### `cliente/ClienteForm.tsx`
- **Buscador por DNI** (botón cyan "Buscar")
  - Si existe → autocompleta + cambia a modo Editar + muestra aviso cyan "Este cliente ya existe con X visitas"
  - Si no existe → mensaje "Cliente nuevo. Complete los datos."
- Campos: DNI, Nombre, Apellido, Celular, Email, Fecha Nacimiento, Dirección
- Botón cambia entre "Crear" / "Actualizar datos"

**Función `normalizarFecha()`**: convierte ISO (`2026-10-02T00:00:00.000000Z`) a `YYYY-MM-DD` para el `<input type="date">`.

### `cliente/ClienteTabla.tsx`
- Columnas: ID, Nombre, Documento, Celular, F. Nac., Visitas, Nivel, Estado, Acciones
- 5 botones por fila:
  - **Editar** (amarillo)
  - **+ Visita** (verde) → abre `ClienteVisitaDialog`
  - **Historial** (purple) → abre `ClienteHistorial`
  - **Desactivar/Activar** (azul)
  - **Eliminar** (rojo)
- `formatearFecha()`: convierte `YYYY-MM-DD` a `DD/MM/YYYY`

### `cliente/ClienteHistorial.tsx`
- Modal con lista de visitas del cliente
- Muestra: Visitas totales, Total gastado, tabla con ID/Entrada/Salida/Monto

### `cliente/ClienteVisitaDialog.tsx`
- Modal para registrar visita manual (simula check-in)
- Input monto gastado (opcional)
- Input observación (opcional)
- Info box explicando qué hace al guardar (incrementa visitas, actualiza fecha, suma total, recalcula nivel)

### `tipoObservacion/TipoObservacionPage.tsx`
- CRUD de tipos de observación
- Campos: nombre, slug, icono, color, descripción, orden

### `gravedadObservacion/GravedadObservacionPage.tsx`
- CRUD de gravedades
- Campos: nombre, slug, color, prioridad

---

## 🧠 Estado global

### `src/hooks/useAuth.ts` (Zustand + persist)

```ts
interface AuthState {
  usuario: Usuario | null
  token: string | null
  login: (usuario: Usuario, token: string) => void
  logout: () => Promise<void>
  setUsuario: (usuario: Usuario) => void
}
```

**Persistencia:** clave `auth-storage` en localStorage. El token también se guarda en `localStorage.token` para el interceptor de axios.

---

## 🔌 Servicios — Patrón común

### `src/services/api.ts`

Instancia de axios con:
- `baseURL: "/api"` (proxy a Laravel)
- Interceptor request: agrega `Authorization: Bearer {token}` desde `localStorage.token`
- Interceptor response: si 401 → limpia `localStorage` y redirige a `/login`; si 404 → NO muestra toast (lo maneja el consumidor)

### Patrón de cada Service

```ts
export const xxxService = {
  listar: async (): Promise<Xxx[]> => {
    const { data } = await api.get('/xxx')
    return data
  },
  listarActivos: async (): Promise<Xxx[]> => {
    const { data } = await api.get('/xxx/activos')
    return data
  },
  obtener: async (id: number): Promise<Xxx> => {
    const { data } = await api.get(`/xxx/${id}`)
    return data
  },
  crear: async (datos: XxxRequest): Promise<Xxx> => {
    const { data } = await api.post('/xxx', datos)
    return data.data       // ← POST devuelve { mensaje, data }
  },
  actualizar: async (id: number, datos: Partial<XxxRequest>): Promise<Xxx> => {
    const { data } = await api.put(`/xxx/${id}`, datos)
    return data.data       // ← PUT devuelve { mensaje, data }
  },
  desactivar: async (id: number): Promise<Xxx> => {
    const { data } = await api.patch(`/xxx/${id}/desactivar`)
    return data.data
  },
  reactivar: async (id: number): Promise<Xxx> => {
    const { data } = await api.patch(`/xxx/${id}/reactivar`)
    return data.data
  },
  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/xxx/${id}`)
  },
}
```

**⚠️ IMPORTANTE:**
- **GET** → devuelve `data` directo
- **POST/PUT/PATCH** → devuelve `data.data` (porque el backend anida `{ mensaje, data }`)

### Servicios especiales

**`clienteService`** incluye:
- `buscarPorDni(dni)` → `GET /clientes/buscar?dni=X`
- `listarVisitas(idCliente)` → `GET /clientes/{id}/visitas`
- `crearVisita(idCliente, datos)` → `POST /clientes/{id}/visitas`
- `listarObservaciones(idCliente)` → `GET /clientes/{id}/observaciones`
- `crearObservacion(idCliente, datos)` → `POST /clientes/{id}/observaciones`
- `resolverObservacion(id)` → `PATCH /cliente-observaciones/{id}/resolver`

**`metodoPagoService`** incluye:
- `listarDeCaja()` → solo métodos con `es_de_caja = true`
- `listarDeDuenia()` → solo métodos con `es_de_caja = false`

**`tarifaService`** incluye:
- `listarPorTipo(idTipo)` → tarifas de un tipo específico

---

## 🎨 Tema visual

**Modo:** Oscuro por defecto (`bg-slate-950` fondo, `bg-slate-900` cards, `bg-slate-800` forms/tablas).

**Colores semánticos de botones:**
- Verde (`bg-green-600`) → éxito, crear, + Visita
- Azul (`bg-blue-600`) → acción neutral, actualizar
- Amarillo (`bg-yellow-600`) → editar
- Rojo (`bg-red-600`) → eliminar, desactivar
- Cyan (`bg-cyan-600`) → buscar por DNI
- Purple (`bg-purple-600`) → historial

**Badges de estado:**
- `bg-green-900 text-green-300` → CAJA / Activo / Ingreso
- `bg-yellow-900 text-yellow-300` → DUEÑA
- `bg-red-900 text-red-300` → Egreso / Inactivo
- Colores dinámicos de `clientes_niveles.color` → Nivel del cliente

**Toasts (Sonner):**
- Verde con `richColors` → éxito
- Rojo con `richColors` → error
- Cyan con `richColors` → info
- Posición: arriba a la derecha
- Tema: oscuro

---

## 🚀 Instalación y ejecución

### Requisitos
- Node.js 20+
- npm

### Pasos

```powershell
# 1. Instalar dependencias
npm install

# 2. Levantar servidor de desarrollo
npm run dev
```

**Acceder:** `http://localhost:5173`

**⚠️ El backend Laravel debe estar corriendo en `http://127.0.0.1:8000`.**

---

## 🎯 Flujo para agregar un módulo nuevo

### 1. Crear types en `src/types/xxx.ts`

```ts
export interface Xxx { ... }
export interface XxxRequest { ... }
```

### 2. Crear service en `src/services/xxxService.ts`

```ts
export const xxxService = { listar, listarActivos, obtener, crear, actualizar, desactivar, reactivar, eliminar }
```

### 3. Crear carpeta y 3 componentes

```
src/pages/xxx/xxx/
├── XxxPage.tsx       (incluye Sidebar + orquesta)
├── XxxForm.tsx       (formulario)
└── XxxTabla.tsx      (tabla)
```

### 4. Agregar ruta en `App.tsx`

```tsx
<Route path="/xxx" element={<ProtectedRoute><XxxPage /></ProtectedRoute>} />
```

### 5. Agregar link en `Sidebar.tsx`

Agregar al dropdown correspondiente (Configuración, Clientes, o nuevo grupo).

---

## 🐛 Errores comunes y cómo evitarlos

### Error 1 — Encodings raros (`Ã³`, `Ã¡`)
**Causa:** Archivos guardados con BOM UTF-8.
**Solución:** Usar `Write-Utf8NoBom` (función PowerShell del script).

### Error 2 — Página no aparece dentro del Dashboard
**Causa:** El `Page.tsx` no incluye `<Sidebar />`.
**Solución:** Cada `Page.tsx` debe retornar:
```tsx
<div className="min-h-screen bg-slate-950 text-white flex">
  <Sidebar />
  <main className="flex-1 p-8">
    {/* contenido */}
  </main>
</div>
```

### Error 3 — Servicios devuelven `undefined` en `.data.data`
**Causa:** El backend devuelve `{ mensaje, data }` en POST/PUT, pero `{ ... }` directo en GET.
**Solución:**
- GET: `return data`
- POST/PUT/PATCH: `return data.data`

### Error 4 — Token no se envía en las requests
**Causa:** El interceptor de axios lee el token de `localStorage.token`, pero el `useAuth` de Zustand lo guarda en `auth-storage`.
**Solución:** Guardar el token TAMBIÉN en `localStorage.token` al hacer login.

### Error 5 — 404 de endpoints muestra toast rojo
**Causa:** El interceptor de axios muestra toast para CUALQUIER error.
**Solución:** El interceptor NO debe mostrar toast para 404.

### Error 6 — `Cannot access 'X' before initialization`
**Causa:** Uso de variable antes de declararla.
**Solución:** En React, el orden de hooks importa:
1. useState
2. useForm
3. watch
4. Queries
5. useMemo
6. useEffect

### Error 7 — Tipos `any` en catch
**Causa:** TypeScript estricto no permite `any` implícito.
**Solución:** Usar `catch (e: any)` o `catch (e: unknown)` + type guard.

### Error 8 — Sidebar no despliega dropdown
**Causa:** El estado `useState` no se inicializa según la ruta actual.
**Solución:**
```tsx
const [abierto, setAbierto] = useState(
  location.pathname.startsWith("/configuracion")
)
```

### Error 9 — Fecha ISO con `T` no se muestra en `<input type="date">`
**Causa:** El backend devuelve `2026-10-02T00:00:00.000000Z` (con T y Z).
**Solución:** Normalizar con `valor.substring(0, 10)` para obtener `YYYY-MM-DD`.
```ts
function normalizarFecha(valor: string | null): string {
  if (!valor) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor
  return valor.substring(0, 10)
}
```

### Error 10 — `validation.unique` al crear cliente con DNI existente
**Causa:** El form permite crear, pero el DNI ya existe.
**Solución:** Al buscar por DNI, si existe → cambiar a modo Editar:
- Guardar `idExistente` en estado
- `onGuardar(datos, idExistente)` → hace PUT en vez de POST

---

## 🔧 Comandos útiles

```powershell
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint

# Agregar componente shadcn
npx shadcn@latest add [componente]
```

---

## 📌 Reglas de código

| Regla | Obligatorio |
|-------|-------------|
| Estilos | Tailwind CSS (nunca CSS puro) |
| Componentes UI | shadcn/ui |
| Estado global | Zustand |
| HTTP | axios con `api.ts` |
| Routing | react-router-dom v7 |
| Alias | `@/` siempre |
| Tipos | TypeScript estricto (nunca `any`) |
| Iconos | lucide-react |
| Toasts | sonner (nunca `alert()`) |
| Confirmaciones | `ConfirmDialog` |
| Tema | Oscuro (slate-950, slate-900) |
| Layout | Cada `Page.tsx` incluye `<Sidebar />` |

### Estructura de capas
- `pages/` → una página por ruta. Si >100 líneas → dividir en Page/Form/Tabla
- `components/ui/` → shadcn (NO modificar)
- `components/layout/` → Sidebar
- `services/` → llamadas HTTP (nunca lógica en componentes)
- `hooks/` → estado global (Zustand)
- `types/` → interfaces TypeScript

### Convenciones
- Componentes: `PascalCase.tsx`
- Servicios/utilidades: `camelCase.ts`
- Tipos: `PascalCase`
- Funciones: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`

---

## 🔮 Roadmap de módulos

| # | Módulo | Backend | Frontend | Estado |
|---|--------|---------|----------|--------|
| 01 | AUTH (usuarios, roles, turnos) | ✅ | ✅ | ✅ CERRADO |
| 02 | CONFIG-BASE (6 tablas) | ✅ | ✅ | ✅ CERRADO |
| 03 | TARIFAS | ✅ | ✅ | ✅ CERRADO |
| 04 | CLIENTES (5 tablas) | ✅ | ✅ | ✅ CERRADO |
| 05 | HABITACIONES | ⏳ | ⏳ | ⏳ Pendiente |
| 06 | RESERVAS | ⏳ | ⏳ | ⏳ Pendiente |
| 07 | CAJA | ⏳ | ⏳ | ⏳ Pendiente |
| 08 | LIMPIEZA | ⏳ | ⏳ | ⏳ Pendiente |
| 09 | MANTENIMIENTO | ⏳ | ⏳ | ⏳ Pendiente |
| 10 | INVENTARIO / KARDEX | ⏳ | ⏳ | ⏳ Pendiente |
| 11 | PROVEEDORES | ⏳ | ⏳ | ⏳ Pendiente |
| 12 | PROMOCIONES | ⏳ | ⏳ | ⏳ Pendiente |
| 13 | COMPROBANTES (IGV/SUNAT) | ⏳ | ⏳ | ⏳ Pendiente |
| 14 | ALERTAS | ⏳ | ⏳ | ⏳ Pendiente |
| 15 | REPORTES | ⏳ | ⏳ | ⏳ Pendiente |
| 16 | AUDITORÍA | ⏳ | ⏳ | ⏳ Pendiente |
| 17 | ASISTENCIA DE PERSONAL | ⏳ | ⏳ | ⏳ Pendiente |
| 18 | INTEGRACIÓN RENIEC | ⏳ | ⏳ | ⏳ Pendiente |

---

## 🎯 Rutas planeadas para próximos módulos

```
/habitaciones                    → CRUD habitaciones + mapa visual
/reservas                        → listado + creación
/reservas/:id                    → detalle (check-in/out, pagos, consumos)
/caja                            → caja actual + movimientos
/caja/historial                  → historial de cajas cerradas
/limpieza                        → cola de limpieza
/mantenimiento                   → reportes y reparaciones
/inventario                      → productos + kardex
/proveedores                     → CRUD proveedores + cuentas por pagar
/promociones                     → CRUD promociones
/comprobantes                    → facturas y boletas
/alertas                         → panel de alertas en vivo
/reportes                        → dashboards y exportaciones
/auditoria                       → log de acciones
/asistencia                      → asistencia de personal
```

---

## 📝 Decisiones técnicas tomadas

| # | Decisión | Razón |
|---|----------|-------|
| D1 | Cada `Page.tsx` incluye `<Sidebar />` | Página autocontenida |
| D2 | Los services devuelven `data.data` en POST/PUT | Backend anida respuesta |
| D3 | Guardar token en `localStorage.token` | Interceptor axios lo lee |
| D4 | Interceptor NO muestra toast para 404 | El consumidor maneja 404 |
| D5 | Dropdowns del Sidebar con `useState` por ruta | UX consistente |
| D6 | Badges con `bg-X-900 text-X-300` | Legibles en modo oscuro |
| D7 | Page/Form/Tabla por cada CRUD | Cada archivo <100 líneas |
| D8 | ConfirmDialog en vez de `window.confirm()` | UX consistente |
| D9 | Normalizar fechas ISO a YYYY-MM-DD en forms | Compatibilidad `<input type="date">` |
| D10 | Modo Editar automático si DNI existe | Evita error `validation.unique` |

---

## 📝 Notas de diseño

- **Todo en español:** nombres de variables, funciones, archivos, comentarios
- **Sin `alert()`:** reemplazado por toasts de sonner
- **Sin `window.confirm()`:** reemplazado por `ConfirmDialog`
- **Sin `any`:** TypeScript estricto
- **Sin archivos >100 líneas:** si pasa, dividir en Page/Form/Tabla
- **Componentes "tontos":** Form y Tabla reciben datos por props
- **Páginas "inteligentes":** Page tiene el estado, hace llamadas API, maneja eventos

---

## 👥 Credenciales de prueba

| Usuario | Password | Rol | Turno |
|---------|----------|-----|-------|
| nancy | admin123 | admin | Libre |

---

## 📄 Licencia

Proyecto privado — Sistema de Hospedaje.

---

**Última actualización:** 02/10/2026
**Módulos completados:** 4 de 18
```

---

## 📌 Cómo usarlo

1. **Abrí `frontend/README.md`** en VS Code
2. **Seleccioná TODO** el contenido actual (`Ctrl+A`)
3. **Borralo** (`Delete` o `Backspace`)
4. **Pegá TODO el bloque de arriba** (desde `# Frontend — Sistema de Hospedaje` hasta el final)
5. **Guardá** (`Ctrl+S`)

---

## 🎯 Después de pegar

**Cuando quieras subirlo a GitHub:**

```bash
cd /c/Users/David/Desktop/hospedaje
git add frontend/README.md
git commit -m "docs: actualizo README frontend con módulos 01-04"
git push
```

**¿Dale?** 🚀
FRONTEND (frontend/README.md)
🔹 Qué agregar (6 puntos)
1. Actualizar el título "Estado global"

Buscar:

text
**Estado global:** Módulos 01-04 completados
Reemplazar por:

text
**Estado global:** Módulos 01-05 completados
2. Actualizar la estructura de carpetas

Agregar dentro de src/pages/:

text
│   │   └── productos/                     (Módulo 05)
│   │       ├── categoriaProducto/
│   │       │   ├── CategoriaProductoPage.tsx
│   │       │   ├── CategoriaProductoForm.tsx
│   │       │   └── CategoriaProductoTabla.tsx
│   │       ├── proveedor/
│   │       │   ├── ProveedorPage.tsx
│   │       │   ├── ProveedorForm.tsx
│   │       │   └── ProveedorTabla.tsx
│   │       └── producto/
│   │           ├── ProductoPage.tsx
│   │           ├── ProductoForm.tsx
│   │           └── ProductoTabla.tsx
Y en services/:

text
│   │   ├── categoriaProductoService.ts
│   │   ├── proveedorService.ts
│   │   └── productoService.ts
Y en types/:

text
│   │   └── producto.ts
3. Actualizar la sección "🧭 Rutas"

Agregar 3 rutas al final de la tabla:

markdown
| `/productos` | ProductoPage | Sí |
| `/productos/categorias` | CategoriaProductoPage | Sí |
| `/productos/proveedores` | ProveedorPage | Sí |
4. Agregar sección "📄 Módulo 05 — PRODUCTOS (Fase 1)"

Insertar después de la sección del Módulo 04 (antes de "🧠 Estado global"):

markdown
## 📄 Módulo 05 — PRODUCTOS (Fase 1)

### `producto/ProductoPage.tsx`
- Lista de productos con búsqueda por nombre/código de barras
- Botón "+ Nuevo Producto"
- Carga inicial: solo productos (1 petición)
- Categorías y proveedores se cargan AL ABRIR el formulario (lazy loading)
- Tabla con stock coloreado (verde normal, rojo si ≤ mínimo)
- **Incluye `<Sidebar />`** (vía AppLayout)

### `producto/ProductoForm.tsx`
- Campos: nombre, categoría (select), proveedor (select), código de barras, precio compra, precio venta, stock actual, stock mínimo, unidad de medida, descripción
- Selects de categoría y proveedor cargados dinámicamente
- Validación local

### `producto/ProductoTabla.tsx`
- Columnas: ID, Nombre, Categoría (badge con color), P. Compra, P. Venta, Stock (coloreado), Mín., Unidad, Estado, Acciones
- Stock en rojo si ≤ stock_minimo

### `categoriaProducto/CategoriaProductoPage.tsx`
- CRUD de categorías de producto
- Campos: nombre, slug, descripción, ícono, color, orden

### `proveedor/ProveedorPage.tsx`
- CRUD de proveedores
- Campos: razón social, nombre comercial, RUC, teléfono, email, dirección, contacto, tipo, notas
5. Agregar en la sección "📝 Decisiones técnicas tomadas"

Agregar al final:

markdown
| D11 | ProductoPage carga SOLO productos al inicio | Optimización: categorías/proveedores se cargan al abrir el form |
| D12 | Stock coloreado dinámicamente | Verde normal, rojo si ≤ stock_minimo |
6. Actualizar la última línea

Buscar:

text
**Última actualización:** 02/10/2026
**Módulos completados:** 4 de 18
Reemplazar por:

text
**Última actualización:** 03/10/2026
**Módulos completados:** 5 de 18
🎯 Resumen de cambios
Archivo	Cambios
backend/README.md	+1 sección (Módulo 05) + ajustes en tablas, roadmap y contador
frontend/README.md	+1 sección (Módulo 05) + ajustes en estructura, rutas y contador
Total: ~100 líneas nuevas en cada README.

📌 ¿Cómo hacerlo?
Opción A — Aplicarlo vos manualmente
Buscá los textos que te marqué y reemplazalos / agregá las secciones.

Opción B — Te armo un bloque PowerShell
Que reemplace ambas secciones (título + estructura + sección Módulo 05 + roadmap + contador final).

¿Cuál querés?

