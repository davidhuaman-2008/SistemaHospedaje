¡Perfecto! 🎯 Ahora te doy el **README frontend completo, sin redundancias**, con TODO lo que construimos hasta ahora explicado al detalle.

---

## 📄 README.md frontend — COMPLETO Y DEFINITIVO

**Abrí `frontend/README.md` en VS Code:**
1. **Ctrl+A** (seleccionar todo)
2. **Delete** (borrar)
3. **Pegar TODO lo de abajo**
4. **Ctrl+S** (guardar)

````markdown
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

---

## 📌 Descripción

SPA (Single Page Application) para gestión completa de un hospedaje de rotación rápida. Consume la API REST del backend Laravel (Sanctum Bearer tokens). Interfaz completa en modo oscuro.

**Arquitectura:**
- Componentes por página (Page/Form/Tabla/Modal)
- Cada `Page.tsx` incluye `<AppLayout>` (que contiene `<Sidebar />`)
- Servicios para llamadas API (axios)
- Zustand para estado de autenticación
- Sidebar con dropdowns por módulo
- Rutas protegidas con guard
- **Sistema en tiempo real:** auto-refresh cada 15s en el mapa de Recepción

---

## 🔴 REGLAS DEL PROYECTO (NO NEGOCIABLES)

### R1 — Nada hardcodeado
Todo sale de la BD. Si puede cambiar sin tocar código → va a BD.

**Ejemplo:** El select de "Categoría de Paquete" en `PaqueteDecoracionForm` carga desde `categoriaPaqueteService.listarActivos()`. NO tiene categorías hardcodeadas.

### R2 — Poco código por archivo
100 archivos de 30 líneas > 10 archivos de 300 líneas.
1 archivo = 1 responsabilidad.

### R3 — Funcional > Elegante
Si algo es "elegante pero confuso" → simplificar.

### R4 — Componentes reutilizables
- `<IconPicker />` → selector visual de íconos Lucide con buscador
- `<IconoDinamico />` → renderiza un ícono Lucide por nombre
- `<ConfirmDialog />` → modal de confirmación
- `<ProtectedRoute />` → guard de rutas autenticadas
- `<AlertaClienteObservaciones />` → banner rojo de alertas

### R5 — Servicios: GET vs POST/PUT
- **GET** → devuelve `data` directo
- **POST/PUT/PATCH** → devuelve `data.data` (porque el backend anida `{ mensaje, data }`)
- **DELETE** → solo el mensaje

### R6 — Estado de formularios
Cuando un formulario se abre para EDITAR, debe cargar los datos del item:
- **useState** inicializado con `inicial?.campo`
- Si necesita sincronizar al cambiar props → **useEffect**
- **NUNCA hardcodear valores** en el estado inicial (excepto placeholders)

### R7 — Fechas ISO
El backend devuelve fechas como `2026-10-03T05:00:00.000000Z`. Siempre normalizar:
```ts
function normalizarFecha(valor: string | null): string {
  if (!valor) return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor
  return valor.substring(0, 10)  // "2026-10-03"
}
```

### R8 — Z-index para modales anidados
- Modal principal: `z-50`
- Submodales (anidados): `z-60`
- **NUNCA** renderizar submodal dentro del modal principal. Usar `if (mostrarSubmodal) return <Submodal />` ANTES del return principal.

### R9 — El backend es la fuente de verdad
- Validaciones en backend (frontend es solo UX)
- Cálculos de dinero (totales, saldos) vienen del backend
- El frontend solo muestra y captura

### R10 — Paleta de colores de estados
| Estado | Color | Hex |
|--------|-------|-----|
| Disponible | 🟢 Verde | `#10b981` |
| Ocupada | 🔴 Rojo | `#ef4444` |
| Por vencer | 🟡 Amarillo | `#f59e0b` |
| Vencida | 🔴 Rojo oscuro | `#dc2626` |
| Limpieza | 🔵 Celeste | `#06b6d4` |
| Reservada | 🟣 Morado | `#7c3aed` |
| Inactiva | ⚫ Gris | `#475569` |

**Los colores vienen del BACKEND** (`EstadoHabitacionService`), el frontend solo los aplica con `style={{ background: color }}`.

### R11 — Manejo de errores
- **Nunca** `any` en catch → usar `catch (e: unknown)`
- **Nunca** `alert()` → usar `toast.error()`
- **Nunca** `window.confirm()` → usar `<ConfirmDialog />`
- Usar `mensajeDeError(e)` para extraer el mensaje del backend

### R12 — Iconos dinámicos
- Todos los CRUDs con campo `icono` DEBEN usar `<IconPicker />` para editar
- Todas las tablas con columna `icono` DEBEN usar `<IconoDinamico />` para mostrar
- Los `icono` son strings Lucide (`banknote`, `credit-card`, `smartphone`, etc.)

---

## 📂 Estructura de carpetas

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx               (menú lateral con dropdowns)
│   │   │   └── AppLayout.tsx             (Sidebar + main content)
│   │   ├── ui/                            (componentes shadcn)
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── label.tsx
│   │   ├── ConfirmDialog.tsx              (modal reutilizable)
│   │   ├── ProtectedRoute.tsx             (guard de rutas autenticadas)
│   │   ├── IconPicker.tsx                 (selector visual de íconos)
│   │   └── IconoDinamico.tsx              (render dinámico de íconos)
│   │
│   ├── hooks/
│   │   └── useAuth.ts                     (Zustand + persist)
│   │
│   ├── lib/
│   │   ├── utils.ts                       (helper cn de shadcn)
│   │   └── errores.ts                     (mensajeDeError)
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   │
│   │   ├── usuarios/                      (Módulo 01)
│   │   │   ├── usuario/
│   │   │   ├── turno/
│   │   │   └── rol/
│   │   │
│   │   ├── configuracion/                 (Módulos 02, 03, 08 y 09C)
│   │   │   ├── piso/
│   │   │   ├── tipoHabitacion/
│   │   │   ├── tipoDocumento/
│   │   │   ├── metodoPago/
│   │   │   ├── categoriaMovimiento/
│   │   │   ├── clienteNivel/
│   │   │   ├── tarifa/
│   │   │   ├── habitacion/                (Módulo 08)
│   │   │   │   ├── HabitacionPage.tsx
│   │   │   │   ├── HabitacionForm.tsx
│   │   │   │   └── HabitacionTabla.tsx
│   │   │   └── ConfiguracionSistemaPage.tsx  (Módulo 09C)
│   │   │
│   │   ├── clientes/                      (Módulo 04 + Observaciones)
│   │   │   ├── tipoObservacion/
│   │   │   ├── gravedadObservacion/
│   │   │   └── cliente/
│   │   │       ├── ClientePage.tsx
│   │   │       ├── ClienteForm.tsx
│   │   │       ├── ClienteTabla.tsx
│   │   │       ├── ClienteHistorial.tsx
│   │   │       ├── ClienteVisitaDialog.tsx
│   │   │       ├── AgregarObservacionModal.tsx
│   │   │       ├── AlertaClienteObservaciones.tsx
│   │   │       └── ClienteObservaciones.tsx
│   │   │
│   │   ├── productos/                     (Módulo 05)
│   │   │   ├── categoriaProducto/
│   │   │   ├── proveedor/
│   │   │   └── producto/
│   │   │
│   │   ├── promociones/                   (Módulo 06)
│   │   │   ├── categoriaPromocion/
│   │   │   ├── promocion/
│   │   │   └── promocionCliente/
│   │   │
│   │   ├── decoraciones/                  (Módulo 07)
│   │   │   ├── categoriaPaquete/
│   │   │   └── paqueteDecoracion/
│   │   │
│   │   └── recepcion/                     (Módulos 09A + 09C + Pagos)
│   │       ├── RecepcionPage.tsx          (mapa visual)
│   │       ├── TarjetaHabitacion.tsx      (tarjeta con tiempo)
│   │       ├── ModalHabitacionOcupada.tsx (modal principal)
│   │       ├── RegistrarIngresoPage.tsx   (walk-in + cobro)
│   │       ├── CheckoutPage.tsx           (check-out + consumos + pagos + vuelto)
│   │       ├── CambiarHabitacionModal.tsx (cambio con dinero)
│   │       ├── AnularReservaModal.tsx     (anular)
│   │       ├── AgregarConsumoModal.tsx    (agregar productos)
│   │       ├── ModalExtensionTiempo.tsx   (extensión de horas)
│   │       ├── AgregarPagoModal.tsx       (pago adicional)
│   │       └── EntregarVueltoModal.tsx    (vuelto al cliente)
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
│   │   ├── clienteService.ts
│   │   ├── clienteObservacionService.ts
│   │   ├── categoriaProductoService.ts
│   │   ├── proveedorService.ts
│   │   ├── productoService.ts
│   │   ├── categoriaPromocionService.ts
│   │   ├── promocionService.ts
│   │   ├── promocionClienteService.ts
│   │   ├── categoriaPaqueteService.ts
│   │   ├── paqueteDecoracionService.ts
│   │   ├── habitacionService.ts
│   │   ├── configuracionSistemaService.ts
│   │   └── reservaService.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── configuracion.ts
│   │   ├── tarifa.ts
│   │   ├── tipoObservacion.ts
│   │   ├── gravedadObservacion.ts
│   │   ├── cliente.ts
│   │   ├── producto.ts
│   │   ├── promocion.ts
│   │   ├── categoriaPaquete.ts
│   │   ├── paqueteDecoracion.ts
│   │   ├── habitacion.ts
│   │   └── reserva.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
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
| `/configuracion/habitaciones` | HabitacionPage | Sí |
| `/configuracion/sistema` | ConfiguracionSistemaPage | Sí |
| `/clientes` | ClientePage | Sí |
| `/clientes/tipos-observacion` | TipoObservacionPage | Sí |
| `/clientes/gravedades-observacion` | GravedadObservacionPage | Sí |
| `/productos` | ProductoPage | Sí |
| `/productos/categorias` | CategoriaProductoPage | Sí |
| `/productos/proveedores` | ProveedorPage | Sí |
| `/promociones` | PromocionPage | Sí |
| `/promociones/categorias` | CategoriaPromocionPage | Sí |
| `/promociones/asignadas` | PromocionClientePage | Sí |
| `/decoraciones/paquetes` | PaqueteDecoracionPage | Sí |
| `/recepcion` | RecepcionPage | Sí |
| `/recepcion/registrar/:idHabitacion` | RegistrarIngresoPage | Sí |
| `/recepcion/checkout/:idReserva` | CheckoutPage | Sí |
| `/` | Redirect → `/dashboard` | — |
| `*` | Redirect → `/dashboard` | — |

**Toaster global:** Sonner con `theme="dark"`, `position="top-right"`, `richColors`, `closeButton`.

**Auto-refresh:** El mapa de Recepción refresca cada 15s automáticamente.

---

## 🎨 Sidebar — Estructura de menú

```
🏨 Hospedaje
├── Dashboard (link directo)
├── Recepción (dropdown)
│   └── Mapa                    → /recepcion
├── Usuarios (dropdown)
│   ├── Usuarios                → /usuarios
│   ├── Roles                   → /roles
│   └── Turnos                  → /turnos
├── Configuración (dropdown)
│   ├── Pisos                   → /configuracion/pisos
│   ├── Tipos de Habitación     → /configuracion/tipos-habitacion
│   ├── Tipos de Documento      → /configuracion/tipos-documento
│   ├── Métodos de Pago         → /configuracion/metodos-pago
│   ├── Categorías Movimiento   → /configuracion/categorias-movimiento
│   ├── Niveles de Cliente      → /configuracion/clientes-niveles
│   ├── Tarifas                 → /configuracion/tarifas
│   ├── Habitaciones            → /configuracion/habitaciones
│   └── Config. Sistema         → /configuracion/sistema
├── Clientes (dropdown)
│   ├── Clientes                → /clientes
│   ├── Tipos Observación       → /clientes/tipos-observacion
│   └── Gravedades              → /clientes/gravedades-observacion
├── Productos (dropdown)
│   ├── Productos               → /productos
│   ├── Categorías              → /productos/categorias
│   └── Proveedores             → /productos/proveedores
├── Promociones (dropdown)
│   ├── Promociones             → /promociones
│   ├── Categorías              → /promociones/categorias
│   └── Asignadas               → /promociones/asignadas
└── Decoraciones (dropdown)
    └── Paquetes                → /decoraciones/paquetes
```

**Iconos de Lucide:** ChevronDown, Users, Shield, Clock, LayoutDashboard, Settings, Building2, BedDouble, FileText, Wallet, TrendingUp, Award, DollarSign, UserPlus, AlertOctagon, ShieldAlert, Package, Tag, Percent, Sparkles, Gift, Truck, DoorOpen, Hotel, Menu, X.

**Comportamiento de dropdowns:**
- Cada dropdown tiene su `useState` inicializado según la ruta actual
- Se abre automáticamente si estás en una ruta de ese grupo
- Se cierra/abre con click
- Al clickear un item, se cierra el menú mobile (si aplica)

---

## 🎨 Componentes reutilizables

### `<IconPicker />`

Selector visual de íconos Lucide.

**Uso:**
```tsx
<IconPicker valor={icono} onChange={setIcono} />
```

**Características:**
- Popover con grilla de 6 columnas
- Buscador por nombre (ej: "cake", "heart")
- Preview del ícono actual en el botón
- Lista curada de ~60 íconos útiles
- Click fuera → cierra

**⚠️ REGLA:** Todos los CRUDs que tengan campo `icono` **DEBEN usar `<IconPicker />`**, NO un `<input>` de texto.

### `<IconoDinamico />`

Renderiza un ícono Lucide por su nombre (string).

**Uso:**
```tsx
<IconoDinamico nombre={item.icono} size={20} style={{ color: item.color }} />
```

**Características:**
- Convierte `"arrow-right"` → `<ArrowRight />`
- Fallback a `<Tag />` si el ícono no existe
- Retorna `null` si `nombre` es null

**⚠️ REGLA:** Todas las tablas que tengan columna `icono` **DEBEN usar `<IconoDinamico />`**.

### `<ConfirmDialog />`

Modal de confirmación.

**Uso:**
```tsx
<ConfirmDialog
  titulo="¿Eliminar?"
  descripcion="Esta acción no se puede deshacer"
  onConfirm={eliminar}
/>
```

**⚠️ REGLA:** Nunca usar `window.confirm()`. Siempre `<ConfirmDialog />`.

### `<AlertaClienteObservaciones />`

Banner rojo con alertas de cliente. Se usa en `RegistrarIngresoPage` y `ClienteForm`.

**Props:**
```tsx
interface Props {
  observaciones: ClienteObservacion[]
  onContinuar?: () => void
  onCancelar?: () => void
  mostrarBotones?: boolean
}
```

**Variantes visuales:**
- 🟡 1 obs Baja/Media → banner amarillo
- 🟠 1 obs Alta → banner naranja
- 🔴 2+ obs → "CLIENTE NO GRATO"
- ⛔ Bloqueo permanente/Crítica → "CLIENTE VETADO"

---

## 📄 Módulo 01 — AUTH (✅ CERRADO)

### Componentes
- `LoginPage.tsx` → login
- `DashboardPage.tsx` → datos de sesión
- `usuario/UsuarioPage.tsx` → CRUD usuarios
- `usuario/UsuarioForm.tsx`, `UsuarioTabla.tsx`
- `rol/RolPage.tsx` → CRUD roles
- `turno/TurnoPage.tsx` → CRUD turnos

### Reglas
- Login por `nombre_usuario`
- Token en `localStorage.token`
- Persistencia con Zustand en `auth-storage`

---

## ⚙️ Módulo 02 — CONFIG-BASE (✅ CERRADO)

### 6 CRUDs
- `piso/` — Pisos
- `tipoHabitacion/` — Tipos de Habitación
- `tipoDocumento/` — Tipos de Documento
- `metodoPago/` — Métodos de Pago (con badge CAJA/DUEÑA)
- `categoriaMovimiento/` — Categorías Movimiento
- `clienteNivel/` — Niveles de Cliente (con IconPicker)

### Patrón de cada CRUD
```
src/pages/configuracion/xxx/
├── XxxPage.tsx
├── XxxForm.tsx
└── XxxTabla.tsx
```

### Reglas
- Todos usan `<AppLayout>` (contiene `<Sidebar />`)
- Todos los formularios de Nivel, Categoría, etc. usan `<IconPicker />` si tienen campo ícono
- Las tablas con ícono usan `<IconoDinamico />`

---

## 💰 Módulo 03 — TARIFAS (✅ CERRADO)

### Componentes
- `tarifa/TarifaPage.tsx`
- `tarifa/TarifaForm.tsx`
- `tarifa/TarifaTabla.tsx`

### Reglas
- Carga tipos de habitación con `Promise.all`
- Selector de tipo + horas + montos

---

## 👤 Módulo 04 — CLIENTES (✅ CERRADO)

### Componentes
- `cliente/ClientePage.tsx` — con búsqueda
- `cliente/ClienteForm.tsx` — buscador por DNI + banner de observaciones
- `cliente/ClienteTabla.tsx` — 6 botones por fila + badge de obs
- `cliente/ClienteHistorial.tsx` — modal con pestañas Visitas/Observaciones
- `cliente/ClienteVisitaDialog.tsx` — registrar visita
- `tipoObservacion/TipoObservacionPage.tsx`
- `gravedadObservacion/GravedadObservacionPage.tsx`

### Reglas
- Buscar por DNI → si existe, cambiar a modo Editar automáticamente
- `normalizarFecha()` para `<input type="date">`
- `formatearFecha()` para mostrar `DD/MM/YYYY`
- **Cliente con reserva activa** → banner rojo "1 cliente = 1 reserva activa" + form bloqueado
- **Cliente con observaciones pendientes** → banner de alerta (amarillo/naranja/rojo según gravedad)

---

## 👁️ MÓDULO OBSERVACIONES DE CLIENTE (✅ CERRADO)

### Componentes

| Componente | Función |
|------------|---------|
| `AgregarObservacionModal.tsx` | Modal reutilizable para crear observación |
| `AlertaClienteObservaciones.tsx` | Banner rojo con alertas (4 variantes visuales) |
| `ClienteObservaciones.tsx` | Lista de observaciones con botones resolver/eliminar |

### Cómo funciona

**Al buscar un DNI en `/recepcion/registrar/X`:**

1. `clienteService.buscarPorDni(dni)` devuelve `{ cliente, reserva_activa }`
2. Si `cliente` existe:
   - Setea el cliente
   - **Si `reserva_activa` NO es null** → muestra el banner rojo "CLIENTE CON RESERVA ACTIVA" + bloquea el form
   - **Si tiene observaciones pendientes** → muestra el banner correspondiente

### Banner "CLIENTE CON RESERVA ACTIVA"

```
┌─────────────────────────────────────────────────┐
│ 🚫 CLIENTE CON RESERVA ACTIVA                   │
│                                                  │
│ DAVID EFRAIN HUAMAN ROMERO                      │
│                                                  │
│ Ya está hospedado en:                           │
│ 🏨 Habitación 105                               │
│    Estándar · Piso 1                            │
│ Entrada: 04/10/2026, ...                        │
│ Código: WK-XXXXXX                               │
│                                                  │
│ 💡 Solución: Si necesitás otra habitación,      │
│    registrala a nombre de otra persona.         │
│                                                  │
│ [Entendido — Limpiar y buscar otro DNI]         │
└─────────────────────────────────────────────────┘
```

### Banner "CLIENTE NO GRATO" (2+ observaciones)

```
┌─────────────────────────────────────────────────┐
│ 🚨 CLIENTE NO GRATO — 2 OBSERVACIONES           │
│ ⚠️ Se recomienda NO darle servicio              │
│                                                  │
│ 🔴 Deuda · ALTA — "Se fue sin pagar 2h" — S/20 │
│ 🔴 Deuda · ALTA — "Se fue sin pagar vino" — S/35│
│ ────────────────────────────────────────────    │
│ TOTAL ADEUDADO: S/ 55.00                        │
│                                                  │
│ [Continuar de todas formas]  [Cancelar]         │
└─────────────────────────────────────────────────┘
```

### `AgregarObservacionModal.tsx`

**Props:**
```tsx
interface Props {
  idCliente: number
  nombreCliente?: string
  motivoInicial?: string
  onClose: () => void
  onSuccess?: () => void
}
```

**Comportamiento:**
- Carga tipos y gravedades de `tipoObservacionService.listarActivos()` y `gravedadObservacionService.listarActivos()`
- Muestra campo "Monto de deuda" si el tipo es `deuda` o `dano_habitacion`
- Al guardar → POST `/clientes/{id}/observaciones`

### Botones de acción en `ClienteTabla.tsx`

Cada fila tiene 6 botones:
- 🟡 Editar
- 🟢 + Visita
- 🟣 Historial
- 🔴 ⚠️ Obs (agregar observación)
- 🔵 Desactivar/Activar
- 🔴 Eliminar

**Si el cliente tiene observaciones pendientes:**
- La fila tiene fondo rojo (`bg-red-950/30`)
- El nombre tiene un ⚠️ adelante
- La columna "Obs." muestra un badge rojo con el count

---

## 📦 Módulo 05 — PRODUCTOS Fase 1 (✅ CERRADO)

### Componentes
- `producto/ProductoPage.tsx`
- `producto/ProductoForm.tsx`
- `producto/ProductoTabla.tsx`
- `categoriaProducto/CategoriaProductoPage.tsx` (con IconPicker)
- `proveedor/ProveedorPage.tsx`

### Reglas
- ProductoPage carga SOLO productos al inicio (optimización)
- Categorías/proveedores se cargan AL ABRIR el formulario (lazy loading)
- Stock coloreado: verde normal, rojo si ≤ `stock_minimo`
- Categorías con ícono → `<IconPicker />` + `<IconoDinamico />`

---

## 🎉 Módulo 06 — PROMOCIONES (✅ CERRADO)

### Componentes
- `promocion/PromocionPage.tsx`
- `promocion/PromocionForm.tsx`
- `promocion/PromocionTabla.tsx`
- `categoriaPromocion/CategoriaPromocionPage.tsx` (con IconPicker)
- `promocionCliente/PromocionClientePage.tsx`

### Reglas
- Fechas formateadas con `formatearFecha()` → `DD/MM/YYYY`
- Badges de categoría con fondo suave (opacidad 20%) + borde del color
- Fórmula de promociones visible

---

## 🎨 Módulo 07 — PAQUETES DE DECORACIÓN (✅ CERRADO)

### Componentes
- `paqueteDecoracion/PaqueteDecoracionPage.tsx`
- `paqueteDecoracion/PaqueteDecoracionForm.tsx`
- `paqueteDecoracion/PaqueteDecoracionTabla.tsx`

### Reglas
- **Fórmula validada en tiempo real:** `precio_total = ganancia_local + ganancia_proveedor`
- Barra verde si la fórmula cuadra, roja si no
- Botón "Crear" deshabilitado si la fórmula no cuadra
- Select de **Tipo de Habitación** (NO categoría, rediseñado)
- Tabla muestra Tipo de Habitación, incluye emojis (🛁 jacuzzi, 🍷 vino, etc.)

---

## 🏨 Módulo 08 — HABITACIONES (✅ CERRADO)

### Componentes
- `habitacion/HabitacionPage.tsx` — con filtro por piso
- `habitacion/HabitacionForm.tsx`
- `habitacion/HabitacionTabla.tsx`

### Reglas
- La tabla muestra datos **heredados del tipo**:
  - Capacidad, Camas, Jacuzzi → vienen de `tipos_habitacion`
- La 208 aparece como "Inactiva"
- Filtro por piso en la parte superior

---

## 🎯 Módulo 09A — RECEPCIÓN / WALK-IN (✅ CERRADO)

### Componentes

| Componente | Ruta | Función |
|------------|------|---------|
| `RecepcionPage.tsx` | `/recepcion` | Mapa visual de las 32 habitaciones |
| `TarjetaHabitacion.tsx` | — | Tarjeta con tiempo transcurrido |
| `ModalHabitacionOcupada.tsx` | — | Modal con 3 acciones |
| `RegistrarIngresoPage.tsx` | `/recepcion/registrar/:id` | Walk-in (cliente actual) |
| `CheckoutPage.tsx` | `/recepcion/checkout/:id` | Check-out + consumos + pagos |
| `CambiarHabitacionModal.tsx` | — | Cambio con lógica de dinero |
| `AnularReservaModal.tsx` | — | Anular registro |
| `AgregarConsumoModal.tsx` | — | Agregar productos a la cuenta |

### Vistas del Módulo 09

#### 1. `RecepcionPage.tsx` — Mapa Visual

**Ruta:** `/recepcion`

**Funcionalidad:**
- Muestra las 32 habitaciones agrupadas por piso
- Cada tarjeta muestra color según estado (viene del backend)
- Auto-refresh cada 15 segundos
- Header con contadores: `X disponibles · Y ocupadas · Z en limpieza`
- Click en habitación:
  - **Disponible** → va a `/recepcion/registrar/{id}`
  - **Ocupada/Por vencer/Vencida** → abre `<ModalHabitacionOcupada>`
  - **Reservada** → toast informativo
  - **Limpieza** → toast informativo
  - **Inactiva** → toast de error

#### 2. `TarjetaHabitacion.tsx` — Tarjeta con Tiempo

**Muestra para habitaciones ocupadas:**
```
┌────────────────────────┐
│ 🔴 OCUPADO: 102        │
│ DAVID EFRAIN           │
│ ⏱️ 2h 15m / 8h         │
│ ████░░░░░░░░░░░░░      │  ← barra progreso
└────────────────────────┘
```

**Muestra para habitaciones por vencer:**
```
┌────────────────────────┐
│ 🟡 POR VENCER: 102     │
│ DAVID EFRAIN           │
│ ⏱️ 7h 45m / 8h         │
│ ████████████████░      │
│ ⚠️ Quedan 15m          │
└────────────────────────┘
```

**Muestra para vencidas:**
```
┌────────────────────────┐
│ 🔴 OCUPADO: 102  +45m  │
│ DAVID EFRAIN           │
│ ⏱️ 8h 45m / 8h         │
│ 🔴 Excedido 45m        │
└────────────────────────┘
```

**⚠️ IMPORTANTE:** El tiempo viene del backend (`minutos_transcurridos`, `minutos_totales`, etc.). El frontend SOLO formatea con `formatearTiempo()`.

#### 3. `ModalHabitacionOcupada.tsx`

**3 acciones:**
- 📋 **Ir a Pre-Cuenta** → navega a `/recepcion/checkout/{idReserva}`
- 🔄 **Cambiar Habitación** → abre `<CambiarHabitacionModal>`
- ❌ **Anular Registro** → abre `<AnularReservaModal>`

**⚠️ REGLA R8:** Cuando se abre un submodal, el modal principal **se desmonta** (return temprano). NO renderiza ambos al mismo tiempo.

#### 4. `RegistrarIngresoPage.tsx` — Walk-in + Cobro

**Formulario:**

**Datos del Cliente:**
- DNI + botón buscar
- Si existe → muestra verde con datos + banner de observaciones/reserva activa
- Si NO existe → form de cliente nuevo (nombre, apellido, fecha nacimiento, email)
- Cantidad de personas
- Teléfono

**Datos del Alquiler (COBRO):**
- Tarifa (select dinámico según tipo de habitación)
- **Toggle "Un solo método" / "Varios métodos"**
- **Modo único:** Monto + select de método
- **Modo varios métodos:** Lista de pagos (método + monto cada uno), botón "+ Agregar otro método"
- **Sección "¿Qué hacer con el vuelto?"** (si `clientePaga > total`):
  - 🅰️ Guardar como saldo a favor (default)
  - 🅱️ Entregar ahora al cliente → select de método de devolución
- **Resumen final:**
  - Total habitación
  - Cliente paga
  - 💵 VUELTO (verde) o 🔴 CLIENTE DEBE (rojo)

**Reglas:**
- **Modo único:** el monto es obligatorio, el método también (si el monto > 0)
- **Modo varios métodos:** la suma de pagos debe coincidir con el total (si el total > 0)
- Si elige "Entregar ahora" → se llama a `entregarVuelto()` después de crear la reserva

#### 5. `CheckoutPage.tsx` — Check-out Completo

**Layout:**
- **Izquierda:**
  - Info del cliente (con botón "Agregar Observación al Cliente")
  - Sección "Pagos registrados" (con íconos + botón "Agregar pago")
  - Sección "Consumos" (con botón "+ Agregar")
- **Derecha:**
  - Resumen de pago con desglose completo
  - **Vuelto final a entregar** (o 🔴 Cliente debe)
  - Input monto final
  - Botón "Finalizar Check-out"
  - **Botón "💵 Entregar Vuelto"** (si hay vuelto pendiente)

**Reglas:**
- El vuelto final se calcula como `pagado - total`
- Si es positivo → vuelto al cliente
- Si es negativo → cliente debe pagar
- Al finalizar → crea limpieza automática

#### 6. `CambiarHabitacionModal.tsx`

**Muestra:**
- Comparación actual vs nueva
- Cálculo de diferencia de precio
- **3 modos:**
  - Si sube: cobrar ahora / sumar al saldo final
  - Si baja: devolver ahora / saldo a favor
- Método de pago (si cobrar ahora)
- ⚠️ Si la nueva no tiene tarifa con las horas base → aviso "se ajusta a Xh"

**Reglas:**
- Al cambiar → la habitación VIEJA va a LIMPIEZA
- El tiempo NO se resetea
- Se crea `reserva_ajuste` en el backend

#### 7. `AnularReservaModal.tsx`

- Advertencia: "Esta acción anula el registro completamente"
- Pide motivo obligatorio
- Al confirmar → no cuenta para SUNAT, no afecta caja

#### 8. `AgregarConsumoModal.tsx`

**Buscador de productos:**
- Input con buscador (nombre o código de barras)
- Lista scrolleable de productos
- Click en producto → se selecciona

**Selector de cantidad:**
- + / - para ajustar
- Input de cantidad
- Subtotal en vivo

**Forma de pago:**
- 🅰️ "Agregar a la cuenta (paga al retirarse)" → `pagado = false`
- 🅱️ "Pagar ahora" → `pagado = true` + método de pago

**Reglas:**
- El stock se descuenta automáticamente
- Si el producto no tiene stock → no se puede agregar
- Si paga ahora → se registra pago + no afecta `monto_consumos`

#### 9. `AgregarPagoModal.tsx`

**Props:**
```tsx
interface Props {
  idReserva: number
  montoSugerido?: number
  onClose: () => void
  onSuccess: () => void
}
```

**Uso:**
```tsx
<AgregarPagoModal
  idReserva={Number(idReserva)}
  montoSugerido={vueltoFinal < 0 ? Math.abs(vueltoFinal) : undefined}
  onClose={() => setMostrarAgregarPago(false)}
  onSuccess={() => { setMostrarAgregarPago(false); cargar() }}
/>
```

**Función:** Registrar pago adicional (parcial, saldo) con método + monto.

#### 10. `EntregarVueltoModal.tsx`

**Props:**
```tsx
interface Props {
  idReserva: number
  vueltoPendiente: number
  onClose: () => void
  onSuccess: () => void
}
```

**Función:** Entrega el vuelto al cliente. Se registra como pago NEGATIVO.

**Campos:**
- Monto a entregar (por defecto = vueltoPendiente, editable para entrega parcial)
- Método de devolución (Efectivo por defecto)
- Botón "Entregar Vuelto"

---

## 💵 MÓDULO PAGOS MIXTOS + VUELTO (✅ CERRADO)

### Concepto

El recepcionista puede registrar:
- **Pago único:** 1 método + 1 monto
- **Pago mixto:** N métodos + N montos

**El vuelto** se maneja así:
- Si el cliente pide vuelto → se registra como **pago NEGATIVO**
- `pagado = SUM(pagos_reserva.monto)` (con negativos)
- Se puede entregar en partes

### Flujo visual

**En `RegistrarIngresoPage`:**

```
┌─────────────────────────────────────────────────────┐
│ 💵 Cobro                                             │
│                                                      │
│ [💵 Un solo método]  [💳 Varios métodos]           │
│                                                      │
│ (Modo "Varios métodos"):                             │
│ #1 [Efectivo ▾]           S/ [20.00]      [🗑️]      │
│ #2 [Yape Hospedaje ▾]     S/ [50.00]      [🗑️]      │
│ [+ Agregar otro método]                              │
│                                                      │
│ ──────────────────────────────────────               │
│ Total habitación:  S/ 70.00                          │
│ Cliente paga:      S/ 100.00                         │
│ 💵 VUELTO:         S/ 30.00                          │
│                                                      │
│ ¿Qué hacer con el vuelto?                            │
│ ● Guardar como saldo a favor (recomendado)          │
│ ○ Entregar ahora al cliente                          │
└─────────────────────────────────────────────────────┘
```

**En `CheckoutPage` (Pagos registrados):**

```
┌─────────────────────────────────────────────────────┐
│ 💳 Pagos registrados                                 │
│                                                      │
│ 💵 Efectivo           + S/ 100.00  [ADELANTO]       │
│ 📱 Yape Hospedaje     + S/  50.00                    │
│ 💸 Vuelto al cliente  - S/  30.00                    │
│ ────────────────────────────                         │
│ Total pagado:         S/ 120.00                      │
└─────────────────────────────────────────────────────┘
```

**Íconos dinámicos:** vienen del campo `metodo_pago.icono` (Lucide name) + `metodo_pago.color`.

**Pagos negativos:** se muestran en amarillo con signo `-`.

### Servicios

```ts
export const reservaService = {
  // ...
  agregarPago: async (id: number, datos: { id_metodo_pago: number; monto: number; observaciones?: string }): Promise<Reserva> => {
    const { data } = await api.post(`/reservas/${id}/pagos`, datos)
    return data.data
  },

  anularPago: async (idReserva: number, idPago: number, motivo: string): Promise<Reserva> => {
    const { data } = await api.delete(`/reservas/${idReserva}/pagos/${idPago}`, {
      data: { motivo },
    })
    return data.data
  },

  entregarVuelto: async (id: number, datos: { monto: number; id_metodo_pago: number }): Promise<Reserva> => {
    const { data } = await api.post(`/reservas/${id}/entregar-vuelto`, datos)
    return data.data
  },
}
```

### Tipos TypeScript

```ts
export interface PagoMixto {
  id_metodo_pago: number
  monto: number
}

export interface WalkInRequest {
  id_cliente: number
  id_habitacion: number
  id_tarifa: number
  cantidad_personas?: number
  fecha_entrada?: string
  adelanto?: number
  id_metodo_pago?: number
  pagos?: PagoMixto[]
  telefono?: string
  notas?: string
  observaciones?: string
}

export interface PagoReserva {
  id_pago: number
  id_reserva: number
  id_metodo_pago: number
  monto: number  // puede ser NEGATIVO (vuelto)
  es_adelanto: boolean
  fecha_pago: string
  observaciones: string | null
  anulado: boolean
  metodo_pago?: {
    id_metodo: number
    nombre: string
    icono: string | null
    color: string | null
    es_de_caja: boolean
  }
  usuario?: { id: number; nombre: string }
}
```

---

## 🕐 Módulo 09C — EXTENSIONES DE TIEMPO (✅ CERRADO)

### Visión general

Sistema visual para detectar y cobrar automáticamente las **horas extra** cuando un cliente excede el tiempo contratado. Muestra **historial de extensiones**, **desglose de pagos** y **opciones configurables**.

### Componentes del Módulo 09C

| Componente | Ruta | Función |
|------------|------|---------|
| `ModalExtensionTiempo.tsx` | (modal) | Aplicar extensión con historial |
| `ConfiguracionSistemaPage.tsx` | `/configuracion/sistema` | Editar parámetros globales |

### `ModalExtensionTiempo.tsx`

**Cuándo se abre:**
- Click en botón amarillo **"⏱️ Aplicar Extensión de Tiempo"** en el CheckoutPage
- Solo aparece si `horasExtra > 0`

**Props:**
```tsx
interface Props {
  idReserva: number
  idCliente?: number
  nombreCliente?: string
  onClose: () => void
  onSuccess: () => void
}
```

**Estados visuales:**

**Caso 1 — Sin exceso (dentro de tolerancia):**
```
┌──────────────────────────────────────────┐
│ ✅ Sin exceso                             │
│ El cliente está dentro de la tolerancia  │
│ de 30 minutos.                            │
│ [Cerrar]                                  │
└──────────────────────────────────────────┘
```

**Caso 2 — Primera extensión:**
```
┌──────────────────────────────────────────────────────────┐
│ ⚠️ Extensión de Tiempo                                    │
│ Exceso total: 2h 20m (base 8h)                            │
├──────────────────────────────────────────────────────────┤
│ Transcurrido: 10h 20m  Contratado: 8h  Exceso: 2h 20m    │
│                                                           │
│ Tolerancia: 30 min · Precio hora extra: S/ 10.00         │
│ Máx: 3h · Turno adicional: S/ 135.00                     │
│                                                           │
│ Nueva extensión a aplicar:                                │
│ ○ No cobrar (con observación)              —              │
│ ● 1 hora extra            SUGERIDA      + S/ 10.00        │
│ ○ 2 horas extra                          + S/ 20.00       │
│ ○ 3 horas extra (máximo)                 + S/ 30.00       │
│                                                           │
│ Forma de pago:                                            │
│ ● Cargar a la cuenta (paga al retirarse)                  │
│ ○ Pagar ahora (entra a caja si aplica)                    │
│                                                           │
│ Observaciones: [_______________________]                  │
│                                                           │
│ [Aplicar Extensión]  [Cancelar]                          │
└──────────────────────────────────────────────────────────┘
```

**Caso 3 — Con historial (ya aplicaste 3h):**
```
┌──────────────────────────────────────────────────────────┐
│ ⚠️ Extensión de Tiempo                                    │
│ Exceso total: 3h 34m (base 8h)                            │
├──────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────┐   │
│ │ 🕐 Ya aplicado anteriormente                       │   │
│ │ Horas extra:    3h                                 │   │
│ │ Monto aplicado: S/ 30.00                           │   │
│ │   └─ A cuenta:  S/ 30.00  ← pendiente de cobro    │   │
│ └────────────────────────────────────────────────────┘   │
│                                                           │
│ Nueva extensión a aplicar:                                │
│ ○ No cobrar (con observación)              —              │
│ ● 1 hora extra            SUGERIDA      + S/ 10.00        │
│ ○ 2 horas extra                          + S/ 20.00       │
│ ...                                                       │
└──────────────────────────────────────────────────────────┘
```

**Caso 4 — Excede el máximo:**
```
┌──────────────────────────────────────────────────────────┐
│ ⚠️ Excede el máximo de 3h extra                           │
│ Se recomienda cobrar turno adicional completo            │
├──────────────────────────────────────────────────────────┤
│ ○ 3 horas extra (máximo):      + S/ 30.00                │
│ ○ 4 horas extra (excede):      + S/ 40.00  ⚠️             │
│ ● Turno adicional completo:    + S/ 135.00 SUGERIDA      │
└──────────────────────────────────────────────────────────┘
```

**⚠️ Reglas del modal:**
- Si `dentro_tolerancia = true` → muestra pantalla "Sin exceso" y cierra
- Si `opciones.length === 0` → no hay nada que aplicar
- Si `excede_maximo = true` → la opción sugerida es **Turno adicional**
- La opción **"No cobrar"** requiere observación obligatoria
- **Pagar ahora** requiere seleccionar método de pago
- Si elige **"No cobrar"**, se pide también **tipo + gravedad de observación** (integración con Módulo Observaciones)

### `ConfiguracionSistemaPage.tsx`

**Ruta:** `/configuracion/sistema`

**Función:** Editar los parámetros globales del hospedaje.

**Estructura:**
```
┌──────────────────────────────────────────────────────────┐
│ ⚙️ Configuraciones del Sistema                            │
│ Parámetros globales del hospedaje                         │
├──────────────────────────────────────────────────────────┤
│ RESERVAS                                                  │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ tolerancia_extension_minutos                          │ │
│ │ Minutos de tolerancia antes de cobrar hora extra      │ │
│ │ [30____] [💾 Guardar]                                 │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ buffer_limpieza_minutos                               │ │
│ │ Buffer entre reservas (limpieza)                      │ │
│ │ [30____] [💾 Guardar]                                 │ │
│ ├──────────────────────────────────────────────────────┤ │
│ │ tolerancia_no_show_minutos                            │ │
│ │ Tiempo para marcar No-Show                            │ │
│ │ [60____] [💾 Guardar]                                 │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                           │
│ COMPROBANTES                                              │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ igv_porcentaje                                        │ │
│ │ IGV aplicado a comprobantes                           │ │
│ │ [18____] [💾 Guardar]                                 │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                           │
│ GENERAL                                                   │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ moneda_simbolo                                        │ │
│ │ Símbolo de moneda                                     │ │
│ │ [S/____] [💾 Guardar]                                 │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Datos que consume:**

`GET /api/configuraciones` → lista todas
`GET /api/configuraciones/grupo/{grupo}` → filtradas
`PUT /api/configuraciones/{clave}` → editar valor

**Al guardar:** recarga la lista (para reflejar el cambio).

### Servicio `configuracionSistemaService.ts`

```ts
export const configuracionSistemaService = {
  listar: async (): Promise<Configuracion[]> => {
    const { data } = await api.get('/configuraciones')
    return data
  },

  porGrupo: async (grupo: string): Promise<Configuracion[]> => {
    const { data } = await api.get(`/configuraciones/grupo/${grupo}`)
    return data
  },

  actualizar: async (clave: string, valor: string): Promise<Configuracion> => {
    const { data } = await api.put(`/configuraciones/${clave}`, { valor })
    return data.data
  },
}
```

### Métodos agregados a `reservaService.ts`

```ts
calculoExtension: async (id: number): Promise<CalculoExtension> => {
  const { data } = await api.get(`/reservas/${id}/calculo-extension`)
  return data
},

agregarExtension: async (id: number, datos: AgregarExtensionRequest): Promise<Reserva> => {
  const { data } = await api.post(`/reservas/${id}/extensiones`, datos)
  return data.data
},

listarExtensiones: async (id: number): Promise<ExtensionReserva[]> => {
  const { data } = await api.get(`/reservas/${id}/extensiones`)
  return data
},
```

### Tipos TypeScript

```ts
export interface OpcionExtension {
  horas: number
  monto: number
  es_turno_adicional: boolean
  label: string
  sugerida: boolean
  advertencia?: boolean
}

export interface CalculoExtension {
  horas_base: number
  minutos_transcurridos: number
  minutos_base: number
  minutos_exceso_total: number
  horas_exceso_total: number
  horas_extra_ya_aplicadas: number
  monto_ya_aplicado: number
  monto_ya_pagado: number
  monto_cargado_a_cuenta: number
  turnos_adicionales_aplicados: number
  minutos_exceso_pendiente: number
  minutos_ya_cubiertos: number
  horas_extra_sugeridas_nuevas: number
  monto_sugerido_nuevo: number
  tolerancia_minutos: number
  dentro_tolerancia: boolean
  excede_maximo: boolean
  max_horas_extra: number
  precio_hora_extra: number
  precio_turno_adicional: number
  opciones: OpcionExtension[]
}

export interface ExtensionReserva {
  id_extension: number
  id_reserva: number
  horas_extra: number
  monto: number
  es_turno_adicional: boolean
  minutos_exceso: number
  precio_hora_extra_aplicado: number
  tolerancia_minutos: number
  pagado_inmediato: boolean
  cargado_a_cuenta: boolean
  id_metodo_pago: number | null
  id_usuario: number
  fecha_extension: string
  observaciones: string | null
  metodo_pago?: MetodoPago
  usuario?: { id: number; nombre: string }
}

export interface Configuracion {
  id_configuracion: number
  clave: string
  valor: string
  tipo: "INT" | "DECIMAL" | "STRING" | "BOOLEAN"
  descripcion: string | null
  grupo: string
  created_at?: string
  updated_at?: string
}
```

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
- Interceptor response:
  - Si 401 → limpia `localStorage` y redirige a `/login`
  - Si 404 → NO muestra toast (lo maneja el consumidor)
  - Otros → muestra toast de error automático

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

### `mensajeDeError` mejorado

```ts
export function mensajeDeError(e: unknown): string {
  if (typeof e === 'object' && e !== null) {
    const err = e as {
      response?: {
        data?: {
          message?: string
          mensaje?: string
          error?: string
          errors?: Record<string, string[]>
        }
      }
      message?: string
    }

    // 1. Laravel default: { message: "..." }
    if (err.response?.data?.message) return err.response.data.message

    // 2. Formato custom: { mensaje: "..." }
    if (err.response?.data?.mensaje) return err.response.data.mensaje

    // 3. Errores de validación: { errors: { campo: ["msg"] } }
    if (err.response?.data?.errors) {
      const firstError = Object.values(err.response.data.errors)[0]
      if (Array.isArray(firstError) && firstError[0]) return firstError[0]
    }

    // 4. Fallback: { error: "..." }
    if (err.response?.data?.error) return err.response.data.error

    // 5. Fallback final: mensaje de axios
    if (err.message) return err.message
  }
  return 'Error inesperado'
}
```

**Captura todos los formatos posibles** de respuesta de error de Laravel.

### Servicios especiales

**`clienteService.buscarPorDni(dni)`:**
```ts
buscarPorDni: async (dni: string): Promise<{ cliente: Cliente | null; reservaActiva: any }> => {
  const { data } = await api.get('/clientes/buscar', { params: { dni } })
  if (data && data.existe && data.cliente) {
    return {
      cliente: data.cliente,
      reservaActiva: data.reserva_activa || null,
    }
  }
  return { cliente: null, reservaActiva: null }
}
```

**⚠️ Devuelve un objeto, no el cliente directo.** El frontend debe extraer `.cliente` y `.reservaActiva`.

**`metodoPagoService`:**
- `listarDeCaja()` → solo métodos con `es_de_caja = true`
- `listarDeDuenia()` → solo métodos con `es_de_caja = false`

**`tarifaService`:**
- `listarPorTipo(idTipo)` → tarifas de un tipo específico

**`reservaService`:**
- `crearWalkIn(datos)` → `POST /reservas/walk-in`
- `crearReserva(datos)` → `POST /reservas`
- `checkIn(id)` → `PATCH /reservas/{id}/check-in`
- `checkOut(id, montoFinal)` → `PATCH /reservas/{id}/check-out`
- `cancelar(id, motivo)` → `PATCH /reservas/{id}/cancelar`
- `anular(id, motivo)` → `PATCH /reservas/{id}/anular`
- `cambiarHabitacion(id, datos)` → `PATCH /reservas/{id}/cambiar-habitacion`
- `agregarConsumo(id, datos)` → `POST /reservas/{id}/consumos`
- `eliminarConsumo(idReserva, idConsumo)` → `DELETE /reservas/{id}/consumos/{idConsumo}`
- `agregarPago(id, datos)` → `POST /reservas/{id}/pagos`
- `anularPago(idReserva, idPago, motivo)` → `DELETE /reservas/{id}/pagos/{idPago}`
- `entregarVuelto(id, datos)` → `POST /reservas/{id}/entregar-vuelto`

**`habitacionMapaService`:**
- `listar()` → `GET /habitaciones-mapa` → devuelve las 32 con estado calculado
- `obtener(id)` → `GET /habitaciones-mapa/{id}`

**`estadoReservaService`:**
- `listar()` → `GET /estados-reserva`
- `listarActivos()` → `GET /estados-reserva/activos`

---

## 🎨 Tema visual

**Modo:** Oscuro por defecto (`bg-slate-950` fondo, `bg-slate-900` cards, `bg-slate-800` forms/tablas).

**Colores semánticos de botones:**
- Verde (`bg-green-600`) → éxito, crear, + Visita
- Azul (`bg-blue-600`) → acción neutral, actualizar
- Amarillo (`bg-yellow-600`) → editar, extender tiempo
- Rojo (`bg-red-600`) → eliminar, desactivar, observaciones
- Cyan (`bg-cyan-600`) → buscar por DNI
- Purple (`bg-purple-600`) → historial
- Rojo oscuro (`bg-red-700`) → anular, vetado

**Badges de estado:**
- `bg-green-900 text-green-300` → CAJA / Activo / Ingreso
- `bg-yellow-900 text-yellow-300` → DUEÑA / Por vencer / Vuelto
- `bg-red-900 text-red-300` → Egreso / Inactivo / Vencida / Obs
- `bg-blue-900 text-blue-300` → Pre-cuenta / Adelanto
- Colores dinámicos de `clientes_niveles.color` → Nivel del cliente
- Colores dinámicos del backend → Estado de habitación

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
├── XxxPage.tsx       (incluye AppLayout + orquesta)
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
**Causa:** El `Page.tsx` no incluye `<AppLayout>`.
**Solución:** Cada `Page.tsx` debe retornar:
```tsx
<AppLayout>
  {/* contenido */}
</AppLayout>
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
**Solución:** Usar `catch (e: unknown)` + type guard.

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
  if (!valor) return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor
  return valor.substring(0, 10)
}
```

### Error 10 — `validation.unique` al crear cliente con DNI existente
**Causa:** El form permite crear, pero el DNI ya existe.
**Solución:** Al buscar por DNI, si existe → cambiar a modo Editar.

### Error 11 — Modal que no se cierra / submodal que no abre
**Causa:** El modal principal tiene `onClick={onClose}` en el overlay. Al renderizar un submodal DENTRO del modal principal, los clicks en el submodal burbujean y cierran todo.
**Solución:** Usar **early return**:
```tsx
if (mostrarSubmodal) {
  return <Submodal onClose={() => setMostrarSubmodal(false)} />
}
return <div className="modal-principal">...</div>
```

### Error 12 — Números decimales gigantes en la UI
**Causa:** El backend devuelve minutos con decimales (`10.1775866666`).
**Solución:** Redondear en el frontend antes de mostrar:
```ts
function formatearTiempo(minutos: number): string {
  const total = Math.floor(Math.abs(minutos))
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}
```

### Error 13 — 422 Unprocessable Entity en cambio de habitación
**Causa:** La nueva habitación no tiene tarifa con las mismas horas.
**Solución:** Mostrar el mensaje exacto del backend (ya viene con `mensaje`).

### Error 14 — Ruta no encontrada (404 en backend)
**Causa:** PowerShell regex falló silenciosamente al agregar la ruta.
**Solución:** Verificar con `php artisan route:list --path=api/xxx` en el backend.

### Error 15 — 500 en `/clientes` por `$appends`
**Causa:** El modelo `Cliente` tenía `protected $appends = ['reserva_activa']` pero no existía `getReservaActivaAttribute()`. Laravel fallaba al serializar la colección.
**Solución:** Remover `$appends`, usar `setAttribute('reserva_activa', ...)` + `getAttribute('reserva_activa')` en el Controller.

### Error 16 — Pagos mixtos no se guardan
**Causa:** El Controller no validaba `'pagos' => 'nullable|array'` y Laravel descartaba el array.
**Solución:** Agregar la validación en el Controller + manejo en el Service.

### Error 17 — "No hay vuelto pendiente para esta reserva"
**Causa:** `entregarVuelto()` calculaba `SUM(pagos) = 0` porque los pagos mixtos nunca se guardaron.
**Solución:** Fix del bug #16 + verificar que `crearWalkIn` cree los pagos mixtos.

### Error 18 — Error de parseo JSX en `CheckoutPage`
**Causa:** Un `<span>` que abre, mete un ternario, y cierra con `/>`. Rompe el JSX.
**Solución:** Remover el `<span>` innecesario, dejar el ternario directo:
```tsx
{p.metodo_pago?.icono ? (
  <IconoDinamico nombre={p.metodo_pago.icono} size={16} style={{ color: p.metodo_pago.color }} />
) : (
  <span className="w-2 h-2 rounded-full" style={{ background: p.metodo_pago?.color }} />
)}
```

### Error 19 — PowerShell regex no matchea por encoding
**Causa:** Los regex con caracteres especiales fallan por saltos de línea Windows vs Unix.
**Solución:** Usar `Get-Content | Where-Object { $_ -notmatch 'patrón' }` para filtrar líneas por línea.

### Error 20 — `Undefined variable: $total` en Service
**Causa:** Bloque duplicado que usaba `$total` en métodos donde no existe (`agregarPago`, `anularPago`).
**Solución:** Usar `$reserva->total` (que siempre existe).

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
| Confirmaciones | `ConfirmDialog` (nunca `window.confirm`) |
| Tema | Oscuro (slate-950, slate-900) |
| Layout | Cada `Page.tsx` incluye `<AppLayout>` |
| Modales anidados | Early return, no renderizar en paralelo |
| Fechas | Normalizar ISO → `YYYY-MM-DD` |
| Tiempo | Formatear minutos con `formatearTiempo()` |
| Errores | `mensajeDeError(e)` en catch |

### Estructura de capas
- `pages/` → una página por ruta. Si >100 líneas → dividir en Page/Form/Tabla
- `components/ui/` → shadcn (NO modificar)
- `components/layout/` → Sidebar, AppLayout
- `components/` → componentes reutilizables (IconPicker, IconoDinamico, ConfirmDialog, AlertaClienteObservaciones)
- `services/` → llamadas HTTP (nunca lógica en componentes)
- `hooks/` → estado global (Zustand)
- `types/` → interfaces TypeScript
- `lib/` → utilidades (utils.ts, errores.ts)

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
| 01 | AUTH | ✅ | ✅ | CERRADO |
| 02 | CONFIG-BASE | ✅ | ✅ | CERRADO |
| 03 | TARIFAS | ✅ | ✅ | CERRADO |
| 04 | CLIENTES | ✅ | ✅ | CERRADO |
| 05 | PRODUCTOS Fase 1 | ✅ | ✅ | CERRADO |
| 06 | PROMOCIONES | ✅ | ✅ | CERRADO |
| 07 | PAQUETES DECORACIÓN | ✅ | ✅ | CERRADO |
| 08 | HABITACIONES | ✅ | ✅ | CERRADO |
| 09A | RECEPCIÓN / WALK-IN | ✅ | ✅ | CERRADO |
| 09B | RESERVAS FUTURAS | ✅ | ⏳ | Pendiente frontend |
| 09C | EXTENSIONES DE TIEMPO | ✅ | ✅ | CERRADO |
| OBS | OBSERVACIONES CLIENTE | ✅ | ✅ | CERRADO |
| PAGOS | PAGOS MIXTOS + VUELTO | ✅ | ✅ | CERRADO |
| 10 | DECORACIONES APLICADAS | ⏳ | ⏳ | Pendiente |
| 11 | CAJA | ⏳ | ⏳ | Pendiente |
| 12 | INVENTARIO / KARDEX | ⏳ | ⏳ | Pendiente |
| 13 | CUENTAS POR PAGAR | ⏳ | ⏳ | Pendiente |
| 14 | LIMPIEZA (pantalla) | ✅ | ⏳ | Backend listo |
| 15 | MANTENIMIENTO | ⏳ | ⏳ | Pendiente |
| 16 | COMPROBANTES SUNAT | ⏳ | ⏳ | Pendiente |
| 17 | ALERTAS | ⏳ | ⏳ | Pendiente |
| 18 | REPORTES | ⏳ | ⏳ | Pendiente |
| 19 | AUDITORÍA | ⏳ | ⏳ | Pendiente |
| 20 | ASISTENCIA PERSONAL | ⏳ | ⏳ | Pendiente |
| 21 | INTEGRACIÓN RENIEC | ⏳ | ⏳ | Pendiente |

---

## 🎯 Módulos pendientes — detalle frontend

### Módulo 09B — RESERVAS FUTURAS

**Vistas a crear:**
- `/reservas` (listado de reservas con filtros)
- `/reservas/nueva` (form con fecha futura)
- `/reservas/:id` (detalle con opción check-in)

**Componentes:**
- `ReservasPage.tsx`
- `ReservasTabla.tsx`
- `NuevaReservaPage.tsx`
- `DetalleReservaPage.tsx`

**Backend listo:**
- `POST /reservas` (crear reserva futura)
- `PATCH /reservas/{id}/check-in` (activar)
- `PATCH /reservas/{id}/cancelar`
- `PATCH /reservas/{id}/anular`

**Notas:**
- El form es similar al walk-in, pero con fecha futura
- Selector de fecha/hora de entrada
- Validación de disponibilidad automática

### Módulo 14 — PANTALLA DE LIMPIEZA

**Vista a crear:** `/limpieza`

**Componentes:**
- `LimpiezaPage.tsx`
- `LimpiezaTabla.tsx`

**Backend listo:**
- `GET /limpieza` (todas)
- `GET /limpieza/pendientes` (pendientes + en proceso)
- `PATCH /limpieza/{id}/iniciar`
- `PATCH /limpieza/{id}/finalizar`

**Reglas:**
- Lista de tareas pendientes ordenadas por antigüedad
- Botón "Iniciar" (PENDIENTE → EN_PROCESO)
- Botón "Finalizar" (EN_PROCESO → COMPLETADA)
- Al finalizar → habitación vuelve a Disponible automáticamente
- Personal de limpieza ve esta pantalla desde su celular
- Auto-refresh cada 20s
- **Responsive prioritario** (celular)

**Servicio a crear:** `limpiezaService.ts`

```ts
export const limpiezaService = {
  listar: async () => {
    const { data } = await api.get('/limpieza')
    return data
  },

  listarPendientes: async () => {
    const { data } = await api.get('/limpieza/pendientes')
    return data
  },

  iniciar: async (id: number) => {
    const { data } = await api.patch(`/limpieza/${id}/iniciar`)
    return data.data
  },

  finalizar: async (id: number) => {
    const { data } = await api.patch(`/limpieza/${id}/finalizar`)
    return data.data
  },
}
```

**Agregar al Sidebar:**
```
🧹 Limpieza   ← /limpieza (link directo, con contador de pendientes)
```

### Módulo 11 — CAJA

**Vistas a crear:**
- `/caja` (caja actual abierta)
- `/caja/historial` (cajas cerradas)

**Backend a crear:**
- `cajas`, `movimientos_caja`, `arqueo_denominaciones`, `retiros_caja`, `devoluciones`

**Reglas R17-R23, R39.**

### Módulo 12 — INVENTARIO / KARDEX

**Vistas a crear:**
- `/inventario/kardex` (movimientos)
- `/inventario/fisico` (conteos)

**Backend a crear:**
- `kardex`, `inventario_fisico`, `inventario_detalle`

### Módulo 13 — CUENTAS POR PAGAR

**Vistas a crear:**
- `/cuentas-por-pagar`
- `/cuentas-por-pagar/:id`

**Backend a crear:**
- `cuentas_por_pagar`, `pagos_proveedor`

### Módulo 15 — MANTENIMIENTO

**Vistas a crear:**
- `/mantenimiento` (lista de reportes)
- `/mantenimiento/nuevo` (crear reporte)

**Backend a crear:**
- `mantenimiento`

### Módulo 16 — COMPROBANTES SUNAT

**Vistas a crear:**
- `/comprobantes`
- `/comprobantes/:id`

**Backend a crear:**
- `tipos_comprobante`, `series_comprobante`, `facturas`, `facturas_detalle`, `notas_credito`

### Módulo 17 — ALERTAS

**Vistas a crear:**
- `/alertas` (panel en vivo)

**Backend a crear:**
- `alertas`, `reglas_alerta`, `canales_alerta`

### Módulo 18 — REPORTES

**Vistas a crear:**
- `/reportes` (dashboard)
- `/reportes/ocupacion`
- `/reportes/ingresos`
- `/reportes/clientes-frecuentes`

### Módulo 19 — AUDITORÍA

**Vistas a crear:**
- `/auditoria`

**Backend a crear:**
- `auditoria`, `auditoria_cambios`

### Módulo 20 — ASISTENCIA

**Vistas a crear:**
- `/asistencia`
- `/asistencia/horas-extra`

**Backend a crear:**
- `asistencia`, `horas_extra`

### Módulo 21 — RENIEC

**Sin vistas nuevas.** Se integra en `RegistrarIngresoPage` y `ClienteForm` cuando el backend lo active (solo producción).

---

## 📝 Decisiones técnicas tomadas

| # | Decisión | Razón |
|---|----------|-------|
| D1 | Cada `Page.tsx` incluye `<AppLayout>` | Página autocontenida |
| D2 | Los services devuelven `data.data` en POST/PUT | Backend anida respuesta |
| D3 | Guardar token en `localStorage.token` | Interceptor axios lo lee |
| D4 | Interceptor NO muestra toast para 404 | El consumidor maneja 404 |
| D5 | Dropdowns del Sidebar con `useState` por ruta | UX consistente |
| D6 | Badges con `bg-X-900 text-X-300` | Legibles en modo oscuro |
| D7 | Page/Form/Tabla por cada CRUD | Cada archivo <100 líneas |
| D8 | ConfirmDialog en vez de `window.confirm()` | UX consistente |
| D9 | Normalizar fechas ISO a YYYY-MM-DD en forms | Compatibilidad `<input type="date">` |
| D10 | Modo Editar automático si DNI existe | Evita error `validation.unique` |
| D11 | ProductoPage carga SOLO productos al inicio | Optimización: categorías/proveedores se cargan al abrir el form |
| D12 | Stock coloreado dinámicamente | Verde normal, rojo si ≤ stock_minimo |
| D13 | `IconPicker` para campos de ícono | UX visual, no input de texto |
| D14 | `IconoDinamico` para mostrar íconos | Renderiza cualquier ícono Lucide por nombre |
| D15 | Modales anidados con early return | Evita conflictos de z-index y propagation |
| D16 | Mapa auto-refresh cada 15s | Sistema en tiempo real |
| D17 | Colores de estado vienen del backend | R1: nada hardcodeado |
| D18 | El vuelto final se muestra en CheckoutPage | Se calcula como `pagado - total` |
| D19 | Formatear tiempo con `formatearTiempo()` | Evita decimales gigantes |
| D20 | Cálculo de diferencia en cambio habitación se hace en frontend + confirmación en backend | UX ágil + seguridad backend |
| **D21** | **Servicios devuelven un objeto `{cliente, reservaActiva}`** para `buscarPorDni` | Backend devuelve 2 cosas |
| **D22** | **Banner de "reserva activa" + observaciones** al buscar DNI | UX proactiva |
| **D23** | **Toggle "Un solo método / Varios métodos"** en cobro | Claridad mental |
| **D24** | **Pago negativo** se muestra en amarillo con `-` | Diferenciar vuelto de pago |
| **D25** | **Íconos dinámicos de métodos de pago** | Identificación visual rápida |
| **D26** | **Sección "¿Qué hacer con el vuelto?"** al registrar | Decisión en el momento |
| **D27** | **Botón "Entregar Vuelto"** en Checkout | Permite entregar después |
| **D28** | **Integración "No cobrar" con modal de observación** | Registra motivo cuando no cobra |

---

## 📝 Notas de diseño

- **Todo en español:** nombres de variables, funciones, archivos, comentarios
- **Sin `alert()`:** reemplazado por toasts de sonner
- **Sin `window.confirm()`:** reemplazado por `ConfirmDialog`
- **Sin `any`:** TypeScript estricto
- **Sin archivos >100 líneas:** si pasa, dividir en Page/Form/Tabla
- **Componentes "tontos":** Form y Tabla reciben datos por props
- **Páginas "inteligentes":** Page tiene el estado, hace llamadas API, maneja eventos
- **Nada hardcodeado:** todos los catálogos vienen de la BD
- **Componentes reutilizables:** IconPicker, IconoDinamico, ConfirmDialog, AlertaClienteObservaciones
- **Sistema en tiempo real:** auto-refresh donde sea necesario
- **Errores claros:** `mensajeDeError(e)` captura todos los formatos

---

## 👥 Credenciales de prueba

| Usuario | Password | Rol | Turno |
|---------|----------|-----|-------|
| nancy | admin123 | admin | Libre |

---

## 📄 Licencia

Proyecto privado — Sistema de Hospedaje.

---

**Última actualización:** 04/10/2026
**Módulos completados:** 11 de 21 (09A, 09C, OBS, PAGOS + 01-08)
````

---

## 📸 Pegame:

1. **Screenshot del README frontend guardado**
2. **¿Guardaste bien?** (Ctrl+S)

**Después:**
- 🅰️ Commit de los 2 READMEs
- 🅱️ Seguir con módulo 14 (Limpieza frontend) o 09B (Reservas futuras)
- 🅲 Otra cosa

**¿Dale?** 🚀