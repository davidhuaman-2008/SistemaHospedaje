
---

## 📄 **2. `MODULOS/02-CONFIG-BASE.md`** (completo)

**Abrí `MODULOS/02-CONFIG-BASE.md`, seleccioná todo (`Ctrl+A`), borrá y pegá esto:**

```markdown
# Módulo 02 — CONFIGURACIÓN BASE

**Estado:** ✅ CERRADO
**Última actualización:** 03/10/2026

---

## 1. Qué hace

CRUDs de 6 tablas catálogo que alimentan al resto del sistema.

---

## 2. Tablas

| # | Tabla | Filas | Propósito |
|---|-------|-------|-----------|
| 1 | `pisos` | 4 | Pisos del hospedaje |
| 2 | `tipos_habitacion` | 8 | Tipos (Simple, Jacuzzi VIP...) |
| 3 | `tipos_documento` | 5 | DNI, RUC, CE, Pasaporte, Licencia |
| 4 | `metodos_pago` | 10 | Efectivo, Tarjeta, Yape×2, etc. |
| 5 | `categorias_movimiento` | 23 | Ingresos y egresos |
| 6 | `clientes_niveles` | 4 | Bronce, Plata, Oro, VIP |

**Regla crítica:** `metodos_pago.es_de_caja` define si un pago entra a caja (true) o va a la dueña (false).

---

## 3. Endpoints

Cada tabla tiene 8 endpoints:
GET /api/{recurso} listar
GET /api/{recurso}/activos solo activos
GET /api/{recurso}/{id} detalle
POST /api/{recurso} crear
PUT /api/{recurso}/{id} editar
PATCH /api/{recurso}/{id}/desactivar activo = false
PATCH /api/{recurso}/{id}/reactivar activo = true
DELETE /api/{recurso}/{id} eliminar

text

**Endpoints especiales:**
GET /api/metodos-pago/de-caja solo es_de_caja = true
GET /api/metodos-pago/de-duenia solo es_de_caja = false
GET /api/categorias-movimiento?tipo=Ingreso filtrar por tipo

text

---

## 4. Estructura de archivos

### Backend
app/Models/ (6)
app/Services/ (6)
app/Http/Controllers/ (6)
database/migrations/ (6)
database/seeders/ConfiguracionBaseSeeder.php

text

### Frontend
src/types/configuracion.ts (1 archivo, 6 interfaces)
src/services/ (6)
src/pages/configuracion/ (6 carpetas × 3 archivos = 18)

text

---

## 5. Archivos frontend creados
src/pages/configuracion/
├── piso/
│ ├── PisoPage.tsx
│ ├── PisoForm.tsx
│ └── PisoTabla.tsx
├── tipoHabitacion/
│ ├── TipoHabitacionPage.tsx
│ ├── TipoHabitacionForm.tsx
│ └── TipoHabitacionTabla.tsx
├── tipoDocumento/
│ ├── TipoDocumentoPage.tsx
│ ├── TipoDocumentoForm.tsx
│ └── TipoDocumentoTabla.tsx
├── metodoPago/
│ ├── MetodoPagoPage.tsx
│ ├── MetodoPagoForm.tsx
│ └── MetodoPagoTabla.tsx
├── categoriaMovimiento/
│ ├── CategoriaMovimientoPage.tsx
│ ├── CategoriaMovimientoForm.tsx
│ └── CategoriaMovimientoTabla.tsx
└── clienteNivel/
├── ClienteNivelPage.tsx
├── ClienteNivelForm.tsx
└── ClienteNivelTabla.tsx

text

**Rutas en `App.tsx`:**
- `/configuracion/pisos`
- `/configuracion/tipos-habitacion`
- `/configuracion/tipos-documento`
- `/configuracion/metodos-pago`
- `/configuracion/categorias-movimiento`
- `/configuracion/clientes-niveles`

**Sidebar:** grupo "Configuración" con 6 items + Tarifas.

---

## 6. Datos semilla

Todos los datos reales están en `ConfiguracionBaseSeeder.php`:

- **4 pisos** (Piso 1-4)
- **8 tipos** (Simple a Jacuzzi Estelar)
- **5 documentos** (DNI, RUC, CE, Pasaporte, Licencia de Conducir)
- **10 métodos** (Efectivo, Tarjeta, Yape×2, Plin×2, Depósito×2, Transferencia×2)
- **23 categorías** (9 ingresos, 14 egresos)
- **4 niveles** (Bronce 0%, Plata 5%, Oro 10%, VIP 15%)

---

## 7. Notas

- **`metodos_pago.es_de_caja`** es la regla más importante del módulo. Define R39.
- **Los catálogos son 100% CRUD.** Se pueden crear/editar/desactivar desde el panel.
- **Soft delete:** Todos usan `activo = false` en vez de borrar físicamente.
- **Niveles:** Se recalculan automáticamente al hacer check-in (Módulo Clientes).
- **Estados:** El estado de las habitaciones NO está acá. Se calcula en vivo en Reservas.
📌 Cómo aplicarlo
Paso 1 — Abrí cada archivo
MODULOS/00-INDEX.md

MODULOS/02-CONFIG-BASE.md

Paso 2 — Reemplazá el contenido
Ctrl+A (seleccionar todo)

Delete (borrar)

Pegar el contenido nuevo

Ctrl+S (guardar)

🎯 Después de actualizar
Guardá todo en GitHub:

bash
cd /c/Users/David/Desktop/hospedaje
git add .
git commit -m "docs: actualizo INDEX y modulo 02 con progreso hasta modulo 05"
git push
📌 Ahora sí, decime:
¿Arrancamos con el Módulo 06 (PROMOCIONES) o preferís otro?

Mi recomendación: PROMOCIONES (catálogo chico, 1 sesión).

¿Dale? 🚀