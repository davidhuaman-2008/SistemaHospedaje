# Módulo 02 — CONFIGURACIÓN BASE

**Estado:** Backend listo, falta frontend
**Última actualización:** 02/10/2026

---

## 1. Qué hace

CRUDs de 6 tablas catálogo que alimentan al resto del sistema.

---

## 2. Tablas

| # | Tabla | Filas | Propósito |
|---|-------|-------|-----------|
| 1 | `pisos` | 4 | Pisos del hospedaje |
| 2 | `tipos_habitacion` | 8 | Tipos (Simple, Jacuzzi VIP...) |
| 3 | `tipos_documento` | 4 | DNI, RUC, CE, Pasaporte |
| 4 | `metodos_pago` | 10 | Efectivo, Tarjeta, Yape, etc. |
| 5 | `categorias_movimiento` | 23 | Ingresos y egresos |
| 6 | `clientes_niveles` | 4 | Bronce, Plata, Oro, VIP |

**Regla crítica:** `metodos_pago.es_de_caja` define si un pago entra a caja (true) o va a la dueña (false).

---

## 3. Endpoints

Cada tabla tiene 8 endpoints:

GET /api/{recurso}                      listar
GET /api/{recurso}/activos              solo activos
GET /api/{recurso}/{id}                 detalle
POST /api/{recurso}                     crear
PUT /api/{recurso}/{id}                 editar
PATCH /api/{recurso}/{id}/desactivar    activo = false
PATCH /api/{recurso}/{id}/reactivar     activo = true
DELETE /api/{recurso}/{id}              eliminar

**Endpoints especiales:**

GET /api/metodos-pago/de-caja      solo es_de_caja = true
GET /api/metodos-pago/de-duenia    solo es_de_caja = false
GET /api/categorias-movimiento?tipo=Ingreso  filtrar por tipo

---

## 4. Estructura de archivos

### Backend
app/Models/                       (6)
app/Services/                     (6)
app/Http/Controllers/             (6)
database/migrations/              (6)
database/seeders/ConfiguracionBaseSeeder.php

### Frontend (pendiente)
src/types/                        (6)
src/services/                     (6)
src/pages/configuracion/          (6 carpetas x 3 archivos = 18)

---

## 5. Próximos pasos

- Frontend del módulo (6 pantallas CRUD)
- Probar endpoints con Postman
- Probar pantallas en el navegador
- Marcar como CERRADO

---

## 6. Datos semilla

Todos los datos reales están en `ConfiguracionBaseSeeder.php`:

- **4 pisos** (Piso 1-4)
- **8 tipos** (Simple a Jacuzzi Estelar)
- **4 documentos** (DNI, RUC, CE, Pasaporte)
- **10 métodos** (Efectivo, Tarjeta, Yapex2, Plinx2, Depositox2, Transferenciax2)
- **23 categorías** (9 ingresos, 14 egresos)
- **4 niveles** (Bronce 0%, Plata 5%, Oro 10%, VIP 15%)