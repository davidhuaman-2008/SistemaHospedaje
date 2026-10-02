# 📘 README completo del Frontend

**Copiá TODO este bloque y pegalo en la terminal (`frontend/`). Enter.**

```powershell
# ============================================================================
# README COMPLETO DEL FRONTEND — Sistema de Hospedaje
# ============================================================================

$ErrorActionPreference = "Stop"

if (-not (Test-Path "package.json")) {
    Write-Host "✗ No estás en frontend" -ForegroundColor Red
    exit 1
}

function Write-Utf8NoBom {
    param([string]$Path, [string]$Content)
    $full = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $Path))
    $dir = Split-Path $full -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    [System.IO.File]::WriteAllText($full, $Content, [System.Text.UTF8Encoding]::new($false))
}

$readme = @'
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
**Estado global:** Módulo 02 completado (Backend + Frontend)

---

## 📌 Descripción

SPA (Single Page Application) para gestión completa de un hospedaje de rotación rápida. Consume la API REST del backend Laravel (Sanctum Bearer tokens). Interfaz completa en modo oscuro.

**Arquitectura:**
- Componentes por página (Page/Form/Tabla)
- Servicios para llamadas API (axios)
- Zustand para estado de autenticación
- Sidebar con dropdowns
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
│   │   │   └── Sidebar.tsx               (menú lateral con dropdowns)
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
│   │   ├── LoginPage.tsx                  (formulario de login)
│   │   ├── DashboardPage.tsx              (página principal post-login)
│   │   │
│   │   ├── usuarios/
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
│   │   └── configuracion/                 (Módulo 02)
│   │       ├── piso/
│   │       │   ├── PisoPage.tsx
│   │       │   ├── PisoForm.tsx
│   │       │   └── PisoTabla.tsx
│   │       ├── tipoHabitacion/
│   │       │   ├── TipoHabitacionPage.tsx
│   │       │   ├── TipoHabitacionForm.tsx
│   │       │   └── TipoHabitacionTabla.tsx
│   │       ├── tipoDocumento/
│   │       │   ├── TipoDocumentoPage.tsx
│   │       │   ├── TipoDocumentoForm.tsx
│   │       │   └── TipoDocumentoTabla.tsx
│   │       ├── metodoPago/
│   │       │   ├── MetodoPagoPage.tsx
│   │       │   ├── MetodoPagoForm.tsx
│   │       │   └── MetodoPagoTabla.tsx
│   │       ├── categoriaMovimiento/
│   │       │   ├── CategoriaMovimientoPage.tsx
│   │       │   ├── CategoriaMovimientoForm.tsx
│   │       │   └── CategoriaMovimientoTabla.tsx
│   │       └── clienteNivel/
│   │           ├── ClienteNivelPage.tsx
│   │           ├── ClienteNivelForm.tsx
│   │           └── ClienteNivelTabla.tsx
│   │
│   ├── services/
│   │   ├── api.ts                         (axios + interceptores)
│   │   ├── authService.ts                 (login, logout, yo)
│   │   ├── usuarioService.ts              (CRUD usuarios)
│   │   ├── rolService.ts                  (CRUD roles)
│   │   ├── turnoService.ts                (CRUD turnos)
│   │   ├── pisoService.ts                 (CRUD pisos)
│   │   ├── tipoHabitacionService.ts       (CRUD tipos hab.)
│   │   ├── tipoDocumentoService.ts        (CRUD tipos doc.)
│   │   ├── metodoPagoService.ts           (CRUD métodos pago)
│   │   ├── categoriaMovimientoService.ts  (CRUD categorías)
│   │   └── clienteNivelService.ts         (CRUD niveles)
│   │
│   ├── types/
│   │   ├── index.ts                       (tipos Módulo 01)
│   │   └── configuracion.ts               (tipos Módulo 02)
│   │
│   ├── App.tsx                            (router principal + Toaster)
│   ├── main.tsx                           (entry point)
│   └── index.css                          (Tailwind + variables shadcn)
│
├── .gitignore
├── components.json                        (config shadcn)
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

**Importante:** El proxy `/api` redirige al backend Laravel. Evita problemas de CORS.

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

### `src/index.css`

```css
@import "tailwindcss";
/* Variables de shadcn/ui (auto-generadas en init) */
```

### `components.json` (shadcn)

Preset: **Nova** con **Base UI (Recommended)**, iconos **Lucide**, fuente **Geist**.

---

## 🔷 Tipos TypeScript

### `src/types/index.ts` (Módulo 01)

```ts
export interface Rol {
  id: number
  nombre: string
  descripcion: string | null
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
```

### `src/types/configuracion.ts` (Módulo 02)

Incluye:
- `Piso` / `PisoRequest`
- `TipoHabitacion` / `TipoHabitacionRequest`
- `TipoDocumento` / `TipoDocumentoRequest`
- `MetodoPago` / `MetodoPagoRequest`
- `CategoriaMovimiento` / `CategoriaMovimientoRequest`
- `ClienteNivel` / `ClienteNivelRequest`
- `TipoMovimiento` = `'Ingreso' | 'Egreso'`

---

## 🔌 Servicios

### `src/services/api.ts`

Instancia de axios con:
- `baseURL: "/api"` (proxy a Laravel)
- Headers default: `Content-Type: application/json`, `Accept: application/json`
- **Interceptor de request:** agrega `Authorization: Bearer {token}` desde `localStorage`
- **Interceptor de response:** si recibe 401 → limpia `localStorage` y redirige a `/login`
- **Interceptor de response:** NO muestra toast para 404 (lo maneja el consumidor)

### `src/services/authService.ts`

```ts
export const authService = {
  async login(datos: LoginRequest): Promise<LoginResponse>
  async logout(): Promise<void>
  async yo(): Promise<Usuario>
}
```

### `src/services/usuarioService.ts`
### `src/services/rolService.ts`
### `src/services/turnoService.ts`

```ts
export const usuarioService = {
  async listar(): Promise<Usuario[]>
  async crear(datos: CrearUsuarioRequest)
  async actualizar(id: number, datos: Partial<CrearUsuarioRequest>)
  async eliminar(id: number)
}
```

### `src/services/pisoService.ts` (Módulo 02)

Todos los services de Configuración tienen el mismo patrón:

```ts
export const pisoService = {
  listar: async (): Promise<Piso[]> => { ... },
  listarActivos: async (): Promise<Piso[]> => { ... },
  obtener: async (id: number): Promise<Piso> => { ... },
  crear: async (datos: PisoRequest): Promise<Piso> => { ... },
  actualizar: async (id: number, datos: Partial<PisoRequest>): Promise<Piso> => { ... },
  desactivar: async (id: number): Promise<Piso> => { ... },
  reactivar: async (id: number): Promise<Piso> => { ... },
  eliminar: async (id: number): Promise<void> => { ... },
}
```

**Igual para:**
- `tipoHabitacionService`
- `tipoDocumentoService`
- `metodoPagoService` (con `listarDeCaja` y `listarDeDuenia`)
- `categoriaMovimientoService` (con `listar(tipo?: TipoMovimiento)`)
- `clienteNivelService`

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

## 🧭 Rutas

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
| `/` | Redirect → `/dashboard` | — |
| `*` | Redirect → `/dashboard` | — |

**Toaster global:** Sonner con `theme="dark"`, `position="top-right"`, `richColors`, `closeButton`.

---

## 🎨 Componentes reutilizables

### `src/components/ProtectedRoute.tsx`

Envuelve rutas autenticadas. Si no hay token en `useAuth`, redirige a `/login`.

### `src/components/ConfirmDialog.tsx`

Modal de confirmación basado en `AlertDialog` de shadcn. Props:
```ts
interface Props {
  abierto: boolean
  titulo: string
  descripcion: string
  onConfirmar: () => void
  onCancelar: () => void
  textoConfirmar?: string
  textoCancelar?: string
}
```

### `src/components/layout/Sidebar.tsx`

Menú lateral con:
- Logo "🏨 Hospedaje"
- Dashboard (link directo)
- **Usuarios** (dropdown): Usuarios, Roles, Turnos
- **Configuración** (dropdown): Pisos, Tipos Habitación, Tipos Documento, Métodos Pago, Categorías Movimiento, Niveles Cliente
- Botón "Cerrar sesión" (rojo)

Estado de cada dropdown: se abre automáticamente si estás en una ruta de ese grupo.

**Iconos de Lucide:** ChevronDown, Users, Shield, Clock, LayoutDashboard, Settings, Building2, BedDouble, FileText, Wallet, TrendingUp, Award.

---

## 📄 Páginas

### `src/pages/LoginPage.tsx`

Formulario con:
- Input usuario
- Input contraseña (type password)
- Botón "Ingresar" (deshabilitado mientras carga)
- Toast de éxito: "Bienvenido, {nombre}"
- Toast de error: mensaje del backend si falla

**Credenciales de prueba:** `nancy` / `admin123`

### `src/pages/DashboardPage.tsx`

Muestra:
- Saludo personalizado: "Bienvenido, {nombre}"
- Rol + turno del usuario
- Card con datos de sesión: usuario, nombre, rol, turno, estado
- **Incluye `<Sidebar />` adentro**

### Módulo 01 — Usuarios

#### `UsuarioPage.tsx`
- Orquesta CRUD de usuarios
- Carga `Promise.all([usuarioService.listar(), rolService.listar(), turnoService.listar()])`
- Renderiza: `UsuarioForm` + `UsuarioTabla` + `ConfirmDialog`
- **Incluye `<Sidebar />`**

#### `UsuarioForm.tsx`
- Nombre, Apellido, Usuario, Password (solo al crear), Select rol, Select turno
- Validación local + errores del backend (422)
- Toasts verde (éxito) / rojo (error)

#### `UsuarioTabla.tsx`
- Columnas: ID, Nombre, Usuario, Rol, Turno, Estado, Acciones
- Botones: Editar (amarillo), Desactivar/Activar (azul), Eliminar (rojo)

#### `TurnoPage.tsx`, `TurnoForm.tsx`, `TurnoTabla.tsx`
Análogo a Usuario pero para turnos. Sin dropdowns de rol.

#### `RolPage.tsx`, `RolForm.tsx`, `RolTabla.tsx`
Análogo a Usuario pero para roles. Sin dropdowns.

### Módulo 02 — Configuración Base

**6 CRUDs, todos con el MISMO patrón:**

Cada carpeta (`piso/`, `tipoHabitacion/`, etc.) tiene 3 archivos:

1. **`XxxPage.tsx`** — Orquesta: cargar, crear, editar, desactivar, reactivar, eliminar
2. **`XxxForm.tsx`** — Formulario con validación local
3. **`XxxTabla.tsx`** — Tabla con acciones

**Patrón de cada Page:**

```tsx
export function PisoPage() {
  const [items, setItems] = useState<Piso[]>([])
  const [editando, setEditando] = useState<Piso | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [cargando, setCargando] = useState(true)

  // cargar, abrirCrear, abrirEditar, cerrar, guardar, cambiarEstado, eliminar

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Pisos</h1>
          <button onClick={abrirCrear} className="bg-green-600 ...">+ Nuevo</button>
        </div>
        {mostrarForm && <PisoForm ... />}
        {cargando ? <p>Cargando...</p> : <PisoTabla ... />}
      </main>
    </div>
  )
}
```

**⚠️ IMPORTANTE:** Cada Page.tsx **incluye `<Sidebar />` adentro** (el Layout se hace a nivel de página, no a nivel de App.tsx).

**Esta es una decisión de diseño del proyecto:** cada página es dueña de su layout. Esto evita problemas de anidación y hace que cada página sea autocontenida.

---

## 🎨 Componentes de shadcn/ui instalados

| Componente | Ruta |
|-----------|------|
| Button | `src/components/ui/button.tsx` |
| Input | `src/components/ui/input.tsx` |
| Label | `src/components/ui/label.tsx` |
| Card | `src/components/ui/card.tsx` |
| AlertDialog | `src/components/ui/alert-dialog.tsx` |

**Para agregar más componentes:**
```bash
npx shadcn@latest add [nombre-componente]
```

**Componentes recomendados para próximos módulos:**
- `table` → tablas más complejas con sorting
- `dialog` → modales
- `select` → reemplazar `<select>` HTML
- `dropdown-menu` → menús contextuales
- `badge` → etiquetas de estado
- `avatar` → fotos de usuario
- `form` → formularios con react-hook-form
- `toast` (deprecado, ya usamos sonner)
- `sidebar` → sidebar avanzado con shadcn
- `tabs` → pestañas
- `tooltip` → ayuda contextual
- `pagination` → paginación de tablas

---

## 🎨 Tema visual

**Modo:** Oscuro por defecto (`bg-slate-950` fondo, `bg-slate-900` cards).

**Colores semánticos:**
- Verde (`bg-green-600`) → éxito, crear
- Azul (`bg-blue-600`) → acción neutral, activar
- Amarillo (`bg-yellow-600`) → editar
- Rojo (`bg-red-600`) → eliminar, desactivar

**Badges de estado:**
- `bg-green-900 text-green-300` → CAJA / Activo / Ingreso
- `bg-yellow-900 text-yellow-300` → DUEÑA
- `bg-red-900 text-red-300` → Egreso / Inactivo

**Toasts (Sonner):**
- Verde con `richColors` → éxito
- Rojo con `richColors` → error
- Posición: arriba a la derecha
- Cierre: botón X visible
- Tema: oscuro

**Estados hover:** `hover:bg-X-700` en todos los botones.

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

## 🎯 Flujo de trabajo para agregar un módulo nuevo

**Ejemplo: módulo Habitaciones**

### 1. Crear tipos en `src/types/habitacion.ts`

```ts
export interface Habitacion { ... }
export interface HabitacionRequest { ... }
```

### 2. Crear servicio en `src/services/habitacionService.ts`

```ts
export const habitacionService = {
  listar, listarActivos, obtener, crear, actualizar, desactivar, reactivar, eliminar
}
```

### 3. Crear carpeta y 3 componentes

```
src/pages/habitaciones/habitacion/
├── HabitacionPage.tsx       (incluye Sidebar + orquesta)
├── HabitacionForm.tsx       (formulario)
└── HabitacionTabla.tsx      (tabla)
```

### 4. Agregar ruta en `App.tsx`

```tsx
<Route path="/habitaciones" element={<ProtectedRoute><HabitacionPage /></ProtectedRoute>} />
```

### 5. Agregar link en `Sidebar.tsx`

**Patrón repetido 2 veces (Usuarios y Configuración). Solo cambia el nombre del recurso.**

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
- POST/PUT: `return data.data`
- GET: `return data`

### Error 4 — Token no se envía en las requests
**Causa:** El interceptor de axios lee el token de `localStorage.token`, pero el `useAuth` de Zustand lo guarda en `auth-storage`.
**Solución:** Guardar el token TAMBIÉN en `localStorage.token` al hacer login:
```ts
localStorage.setItem('token', token)
```

### Error 5 — 404 de endpoints muestra toast rojo
**Causa:** El interceptor de axios muestra toast para CUALQUIER error.
**Solución:** El interceptor NO debe mostrar toast para 404 (lo maneja el consumidor).

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
| Componentes UI | shadcn/ui (nunca MUI, Ant Design, Bootstrap) |
| Estado global | Zustand (nunca Redux) |
| HTTP | axios con `api.ts` (nunca fetch directo) |
| Routing | react-router-dom v7 |
| Alias | `@/` siempre (nunca `../../`) |
| Tipos | TypeScript estricto (nunca `any`) |
| Iconos | lucide-react |
| Toasts | sonner (nunca `alert()`) |
| Confirmaciones | `ConfirmDialog` (nunca `window.confirm()`) |
| Tema | Oscuro (slate-950, slate-900) |
| Layout | Cada `Page.tsx` incluye `<Sidebar />` |

### Estructura de capas
- `pages/` → una página por ruta. Si >100 líneas → dividir en `Page/Form/Tabla`.
- `components/ui/` → componentes de shadcn (NO modificar).
- `components/layout/` → Sidebar, Header.
- `services/` → llamadas HTTP (nunca lógica en componentes).
- `hooks/` → estado global (Zustand).
- `types/` → interfaces TypeScript.

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
| 03 | TARIFAS | ⏳ | ⏳ | ⏳ Pendiente |
| 04 | CLIENTES (+ RENIEC) | ⏳ | ⏳ | ⏳ Pendiente |
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

## 🎯 Rutas planeadas para los próximos módulos

```
/tarifas                            → CRUD tarifas
/clientes                           → CRUD clientes + búsqueda por DNI
/clientes/:id                       → detalle con historial y observaciones
/habitaciones                       → CRUD habitaciones + mapa visual
/reservas                           → listado + creación
/reservas/:id                       → detalle (check-in/out, pagos, consumos)
/caja                               → caja actual + movimientos
/caja/historial                     → historial de cajas cerradas
/limpieza                           → cola de limpieza
/mantenimiento                      → reportes y reparaciones
/inventario                         → productos + kardex
/proveedores                        → CRUD proveedores + cuentas por pagar
/promociones                        → CRUD promociones
/comprobantes                       → facturas y boletas
/alertas                            → panel de alertas en vivo
/reportes                           → dashboards y exportaciones
/auditoria                          → log de acciones
/asistencia                         → asistencia de personal
```

---

## 📝 Decisiones técnicas tomadas

| # | Decisión | Razón |
|---|----------|-------|
| D1 | Cada `Page.tsx` incluye `<Sidebar />` | Página autocontenida, evita anidación |
| D2 | Los services devuelven `data.data` en POST/PUT | Backend anida respuesta |
| D3 | Guardar token en `localStorage.token` | Interceptor axios lo lee |
| D4 | Interceptor NO muestra toast para 404 | El consumidor maneja 404 |
| D5 | Dropdowns del Sidebar con `useState` inicializado por ruta | UX consistente |
| D6 | Badges con `bg-X-900 text-X-300` | Legibles en modo oscuro |
| D7 | Page/Form/Tabla por cada CRUD | Cada archivo <100 líneas |
| D8 | ConfirmDialog en vez de `window.confirm()` | UX consistente |

---

## 📝 Notas de diseño

- **Todo en español:** nombres de variables, funciones, archivos, comentarios.
- **Sin `alert()`:** reemplazado por toasts de sonner.
- **Sin `window.confirm()`:** reemplazado por `ConfirmDialog`.
- **Sin `any`:** TypeScript estricto.
- **Sin archivos >100 líneas:** si pasa, dividir en Page/Form/Tabla.
- **Componentes "tontos":** Form y Tabla reciben datos por props.
- **Páginas "inteligentes":** Page tiene el estado, hace llamadas API, maneja eventos.

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
**Módulos completados:** 2 de 18
'@

Write-Utf8NoBom -Path "README.md" -Content $readme

$tamano = (Get-Item "README.md").Length
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  OK README.md CREADO" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Archivo: frontend/README.md ($tamano bytes)" -ForegroundColor White
Write-Host ""
Write-Host "Contenido:" -ForegroundColor Cyan
Write-Host "  1. Descripcion general" -ForegroundColor White
Write-Host "  2. Reglas del proyecto (R1, R2, R3)" -ForegroundColor White
Write-Host "  3. Estructura de carpetas completa" -ForegroundColor White
Write-Host "  4. Stack tecnico con versiones exactas" -ForegroundColor White
Write-Host "  5. Configuracion (vite, tsconfig, tailwind)" -ForegroundColor White
Write-Host "  6. Tipos TypeScript (Modulo 01 + 02)" -ForegroundColor White
Write-Host "  7. Servicios (11)" -ForegroundColor White
Write-Host "  8. Estado global (Zustand)" -ForegroundColor White
Write-Host "  9. Rutas completas" -ForegroundColor White
Write-Host "  10. Componentes reutilizables" -ForegroundColor White
Write-Host "  11. Paginas (Modulo 01 + 02)" -ForegroundColor White
Write-Host "  12. Componentes shadcn instalados + recomendados" -ForegroundColor White
Write-Host "  13. Tema visual" -ForegroundColor White
Write-Host "  14. Instalacion" -ForegroundColor White
Write-Host "  15. Flujo para agregar un modulo nuevo" -ForegroundColor White
Write-Host "  16. ERRORES COMUNES Y COMO EVITARLOS (8 errores documentados)" -ForegroundColor Yellow
Write-Host "  17. Comandos utiles" -ForegroundColor White
Write-Host "  18. Reglas de codigo" -ForegroundColor White
Write-Host "  19. Roadmap de 18 modulos" -ForegroundColor White
Write-Host "  20. Rutas planeadas para proximos modulos" -ForegroundColor White
Write-Host "  21. Decisiones tecnicas" -ForegroundColor White
Write-Host "  22. Notas de diseño" -ForegroundColor White
Write-Host ""
Write-Host "Ahora subi a GitHub:" -ForegroundColor Yellow
Write-Host "  cd C:\Users\David\Desktop\hospedaje" -ForegroundColor White
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m 'docs: README frontend completo con errores comunes y roadmap'" -ForegroundColor White
Write-Host "  git push" -ForegroundColor White
Write-Host ""
```

---

## 📋 Qué incluye este README (a diferencia del backend)

### 🎯 Sección especial: **Errores comunes y cómo evitarlos**

**8 errores documentados** que cometí durante el desarrollo:

1. **Encodings raros** (`Ã³`) → usar Write-Utf8NoBom
2. **Página fuera del Dashboard** → cada Page.tsx incluye `<Sidebar />`
3. **`data.data` undefined** → POST/PUT devuelven `data.data`, GET devuelve `data`
4. **Token no se envía** → guardar también en `localStorage.token`
5. **404 muestra toast rojo** → el interceptor no debe toastear 404
6. **`Cannot access X before initialization`** → orden de hooks
7. **Tipos `any` en catch** → usar `catch (e: any)` o `unknown`
8. **Dropdown no se despliega** → `useState` inicializado por ruta

**Esto es CLAVE** para que la próxima IA (o dev) no repita los mismos errores.

### 🎯 Sección extra: **Decisiones técnicas tomadas (D1-D8)**

Documenta **por qué** se hicieron las cosas así:
- D1: Cada Page.tsx incluye Sidebar
- D2: Services devuelven `data.data` en POST/PUT
- etc.

### 🎯 Sección extra: **Rutas planeadas para los próximos módulos**

Lista de las ~18 rutas futuras para que sepas qué viene.

---

## 🎯 Después de pegar

1. **Verificá el archivo:**
   ```powershell
   Get-Item README.md
   ```

2. **Subilo a GitHub:**
   ```powershell
   cd C:\Users\David\Desktop\hospedaje
   git add .
   git commit -m "docs: README frontend completo con errores comunes y roadmap"
   git push
   ```

---

## 📌 Pegame:

1. **La salida del bloque** (mensajes OK + tamaño)
2. **(Opcional) Un screenshot del README abierto en VS Code**

**Con esto, tenés los 2 READMEs completos (backend + frontend) y podés pasárselos a cualquier IA para que entienda el proyecto al 100%.** 🚀

¿Dale?