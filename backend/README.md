¡Perfecto! 🎯 Entendido. Voy a darte el **README backend completo y definitivo**, sin redundancias, con TODO lo que construimos hasta ahora, explicado al detalle para que otra IA entienda el contexto en una sola lectura.

---

## 📄 README.md backend — COMPLETO Y DEFINITIVO

**Abrí `backend/README.md` en VS Code:**
1. **Ctrl+A** (seleccionar todo)
2. **Delete** (borrar)
3. **Pegar TODO lo de abajo**
4. **Ctrl+S** (guardar)

````markdown
# Backend — Sistema de Hospedaje

**Framework:** Laravel 12
**PHP:** 8.2.12
**Base de datos:** MySQL 8 (MariaDB 10.4)
**Autenticación:** Laravel Sanctum (Bearer tokens)
**Estado global:** Módulos 01-09C + Observaciones + Pagos Mixtos + Vuelto completados

---

## 📌 Descripción

API REST para gestión completa de un hospedaje de rotación rápida (por horas / corta estadía). Cubre autenticación, usuarios, roles, turnos, configuración base, tarifas, clientes con fidelización, habitaciones, recepción (walk-in), extensiones de tiempo, consumos, cambio de habitación, pagos (simples/mixtos), vuelto, observaciones de cliente, limpieza, y próximamente caja, inventario, comprobantes, alertas y reportes.

**Arquitectura:** Controllers delgados + Services (CRUD + lógica de negocio) + Models Eloquent + Reglas (lógica compleja futura).

---

## 🔴 REGLAS DEL PROYECTO (NO NEGOCIABLES)

### R1 — Nada hardcodeado
Todo sale de la BD. Si puede cambiar sin tocar código → va a BD.

### R2 — Poco código por archivo
100 archivos de 30 líneas > 10 archivos de 300 líneas.
1 archivo = 1 responsabilidad.

### R3 — Funcional > Elegante
Si algo es "elegante pero confuso" → simplificar.

### R4 — Estado se calcula en vivo
El estado de habitación NO se guarda. Se calcula en `EstadoHabitacionService`.

### R5 — Sistema en tiempo real
Este NO es un CRUD académico. Es un sistema real usado AHORA por:
- Dueña (celular)
- Recepcionista (tablet)
- Personal de limpieza (celular)
- Cajero (PC)

**Implicaciones:**
- Transacciones DB obligatorias en operaciones multi-tabla
- Validaciones fuertes en backend
- Auditoría de quién hizo qué
- Estados calculados en vivo (no guardados)

---

## 📂 Estructura del proyecto

```
backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── AuthController.php
│   │       ├── UsuarioController.php
│   │       ├── RolController.php
│   │       ├── TurnoController.php
│   │       ├── PisoController.php
│   │       ├── TipoHabitacionController.php
│   │       ├── TipoDocumentoController.php
│   │       ├── MetodoPagoController.php
│   │       ├── CategoriaMovimientoController.php
│   │       ├── ClienteNivelController.php
│   │       ├── TarifaController.php
│   │       ├── TipoObservacionController.php
│   │       ├── GravedadObservacionController.php
│   │       ├── ClienteController.php
│   │       ├── ClienteVisitaController.php
│   │       ├── ClienteObservacionController.php
│   │       ├── CategoriaProductoController.php
│   │       ├── ProveedorController.php
│   │       ├── ProductoController.php
│   │       ├── CategoriaPromocionController.php
│   │       ├── PromocionController.php
│   │       ├── PromocionClienteController.php
│   │       ├── CategoriaPaqueteController.php
│   │       ├── PaqueteDecoracionController.php
│   │       ├── HabitacionController.php
│   │       ├── ReservaController.php
│   │       ├── EstadoHabitacionController.php
│   │       ├── EstadoReservaController.php
│   │       ├── LimpiezaController.php
│   │       └── ConfiguracionController.php
│   │
│   ├── Models/
│   │   ├── Usuario.php
│   │   ├── Rol.php
│   │   ├── Turno.php
│   │   ├── Piso.php
│   │   ├── TipoHabitacion.php
│   │   ├── TipoDocumento.php
│   │   ├── MetodoPago.php
│   │   ├── CategoriaMovimiento.php
│   │   ├── ClienteNivel.php
│   │   ├── Tarifa.php
│   │   ├── TipoObservacion.php
│   │   ├── GravedadObservacion.php
│   │   ├── Cliente.php
│   │   ├── ClienteVisita.php
│   │   ├── ClienteObservacion.php
│   │   ├── CategoriaProducto.php
│   │   ├── Proveedor.php
│   │   ├── Producto.php
│   │   ├── CategoriaPromocion.php
│   │   ├── Promocion.php
│   │   ├── PromocionCliente.php
│   │   ├── CategoriaPaquete.php
│   │   ├── PaqueteDecoracion.php
│   │   ├── Habitacion.php
│   │   ├── Reserva.php
│   │   ├── EstadoReserva.php
│   │   ├── OcupacionHabitacion.php
│   │   ├── RegistroEstadia.php
│   │   ├── PagoReserva.php
│   │   ├── ReservaConsumo.php
│   │   ├── ReservaAjuste.php
│   │   ├── ExtensionReserva.php
│   │   ├── Configuracion.php
│   │   └── Limpieza.php
│   │
│   ├── Services/
│   │   ├── AuthService.php
│   │   ├── UsuarioService.php
│   │   ├── RolService.php
│   │   ├── TurnoService.php
│   │   ├── PisoService.php
│   │   ├── TipoHabitacionService.php
│   │   ├── TipoDocumentoService.php
│   │   ├── MetodoPagoService.php
│   │   ├── CategoriaMovimientoService.php
│   │   ├── ClienteNivelService.php
│   │   ├── TarifaService.php
│   │   ├── TipoObservacionService.php
│   │   ├── GravedadObservacionService.php
│   │   ├── ClienteService.php
│   │   ├── ClienteVisitaService.php
│   │   ├── ClienteObservacionService.php
│   │   ├── CategoriaProductoService.php
│   │   ├── ProveedorService.php
│   │   ├── ProductoService.php
│   │   ├── CategoriaPromocionService.php
│   │   ├── PromocionService.php
│   │   ├── PromocionClienteService.php
│   │   ├── CategoriaPaqueteService.php
│   │   ├── PaqueteDecoracionService.php
│   │   ├── HabitacionService.php
│   │   ├── ReservaService.php
│   │   ├── EstadoHabitacionService.php
│   │   ├── DisponibilidadService.php
│   │   ├── ExtensionService.php
│   │   └── ConfiguracionService.php
│   │
│   └── Providers/
│       └── AppServiceProvider.php
│
├── bootstrap/app.php
├── config/
├── database/
│   ├── migrations/
│   └── seeders/
├── public/index.php
├── resources/views/
├── routes/
│   ├── api.php
│   ├── console.php
│   └── web.php
├── storage/
├── tests/
├── vendor/
├── .env
├── artisan
└── composer.json
```

---

## 🗄️ Base de datos — Estado actual

### Tablas creadas (todos los módulos hasta ahora)

| Tabla | Filas | Módulo | Propósito |
|-------|-------|--------|-----------|
| `roles` | 5 | 01 | Roles del sistema |
| `turnos` | 3 | 01 | Turnos (Mañana, Noche, Libre) |
| `usuarios` | 1+ | 01 | Usuarios del sistema |
| `personal_access_tokens` | 0+ | 01 | Tokens Sanctum |
| `pisos` | 4 | 02 | Pisos del hospedaje |
| `tipos_habitacion` | 8 | 02 | Tipos de habitación |
| `tipos_documento` | 4 | 02 | DNI, RUC, CE, Pasaporte |
| `metodos_pago` | 10 | 02 | Métodos de pago (con `es_de_caja`, `icono`, `color`) |
| `categorias_movimiento` | 23 | 02 | Categorías ingreso/egreso |
| `clientes_niveles` | 4 | 02 | Niveles de fidelización |
| `tarifas` | 15 | 03 | Precios por tipo y horas |
| `tipos_observacion` | 5 | 04 | Tipos de observación cliente |
| `gravedades_observacion` | 4 | 04 | Gravedades |
| `clientes` | - | 04 | Clientes del hospedaje |
| `cliente_visitas` | - | 04 | Historial de visitas |
| `cliente_observaciones` | - | 04 | Alertas por cliente |
| `categorias_producto` | 7 | 05 | Categorías de productos |
| `proveedores` | 6 | 05 | Proveedores |
| `productos` | 18 | 05 | Productos (bebidas, snacks, etc.) |
| `categorias_promocion` | 8 | 06 | Categorías de promociones |
| `promociones` | 6 | 06 | Promociones |
| `promociones_cliente` | 0 | 06 | Promociones asignadas a clientes |
| `categorias_paquete` | 4 | 07 | Categorías de paquetes |
| `paquetes_decoracion` | 6 | 07 | Paquetes de decoración |
| `habitaciones` | 32 | 08 | Habitaciones del hospedaje |
| `estados_reserva` | 7 | 09 | Estados de reserva |
| `reservas` | - | 09 | Reservas (walk-in + futuras) |
| `ocupacion_habitacion` | - | 09 | Bloqueo real de rangos |
| `registros_estadia` | - | 09 | Check-in/check-out |
| `pagos_reserva` | - | 09 | Pagos del cliente (soporta negativos para vuelto) |
| `reserva_consumos` | - | 09 | Consumos de productos |
| `reserva_ajustes` | - | 09 | Ajustes por cambio de habitación |
| `extensiones_reserva` | - | 09C | Historial de extensiones |
| `configuraciones` | 5 | 09C | Configuraciones globales |
| `limpieza` | - | 09A | Cola de limpieza |

### Tablas de Laravel
- `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, `migrations`

---

## 🔐 Módulo 01 — AUTH (✅ CERRADO)

### Tablas

#### `roles` (5 filas)
`id`, `nombre` UNIQUE, `descripcion` NULL, `activo` BOOLEAN DEFAULT true, timestamps.
**Semilla:** admin, encargado, recepcionista, limpieza, cajero.

#### `turnos` (3 filas)
`id`, `nombre`, `hora_inicio` TIME, `hora_fin` TIME, `descripcion` NULL, `activo`.
**Semilla:** Mañana (08:00-20:00), Noche (20:00-08:00), Libre (00:00-23:59).

#### `usuarios`
`id`, `nombre`, `apellido`, `nombre_usuario` UNIQUE, `password` (bcrypt), `id_rol` FK, `id_turno` FK NULL, `activo`, `ultimo_login` NULL, `remember_token`.
**Semilla:** nancy/admin123 (admin, Libre).

### Endpoints Módulo 01

```
POST /api/login       { nombre_usuario, password } → { mensaje, usuario, token }
POST /api/logout      revoca token actual
GET  /api/yo          usuario autenticado

GET    /api/usuarios
POST   /api/usuarios
GET    /api/usuarios/{id}
PUT    /api/usuarios/{id}
DELETE /api/usuarios/{id}
PATCH  /api/usuarios/{id}/desactivar
PATCH  /api/usuarios/{id}/reactivar

GET    /api/roles
POST   /api/roles
GET    /api/roles/{id}
PUT    /api/roles/{id}
DELETE /api/roles/{id}
PATCH  /api/roles/{id}/desactivar
PATCH  /api/roles/{id}/reactivar

GET    /api/turnos
POST   /api/turnos
GET    /api/turnos/{id}
PUT    /api/turnos/{id}
DELETE /api/turnos/{id}
PATCH  /api/turnos/{id}/desactivar
PATCH  /api/turnos/{id}/reactivar
```

### Reglas de negocio Módulo 01
- Login por `nombre_usuario`, NO por email
- Un usuario = UN rol
- Un usuario = UN turno (opcional)
- Roles/turnos con usuarios NO se eliminan (se desactivan)
- `ultimo_login` se actualiza en cada login
- **Importante:** Cuando un Controller recibe `int $id` y NO `Model $modelo`, se evita el route model binding.

---

## ⚙️ Módulo 02 — CONFIG-BASE (✅ CERRADO)

### Tablas

#### `pisos` (4 filas)
`id_piso`, `nombre` UNIQUE, `descripcion`, `orden`, `activo`, timestamps.
**Semilla:** Piso 1, 2, 3, 4.

#### `tipos_habitacion` (8 filas)
`id_tipo`, `nombre` UNIQUE, `slug` UNIQUE, `descripcion`, `capacidad` (2), `camas` (1), `tiene_jacuzzi` BOOLEAN, `activo`, timestamps.
**Semilla:** Simple, Estándar, Premium, Safari, Marina, Romántica, Jacuzzi VIP, Jacuzzi Estelar.

#### `tipos_documento` (4 filas)
`id_documento`, `nombre` UNIQUE, `abreviatura` UNIQUE, `longitud`, `activo`.
**Semilla:** DNI (8), RUC (11), Carné de Extranjería (12), Pasaporte (NULL).

#### `metodos_pago` (10 filas)
`id_metodo`, `nombre` UNIQUE, `descripcion`, **`es_de_caja`** (⚡ REGLA R39), `icono`, `color`, `orden`, `activo`.

**⚠️ Regla R39:** `es_de_caja = true` → entra a caja física. `es_de_caja = false` → va a la cuenta personal de la dueña, NO entra a caja.

**Semilla:**
| id | nombre | es_de_caja | icono | color |
|----|--------|-----------|-------|-------|
| 1 | Efectivo | true | banknote | #16a34a |
| 2 | Tarjeta (POS) | true | credit-card | #2563eb |
| 3 | Yape Hospedaje | true | smartphone | #7c3aed |
| 4 | Yape Dueña | false | smartphone | #f59e0b |
| 5 | Plin Hospedaje | true | smartphone | #06b6d4 |
| 6 | Plin Dueña | false | smartphone | #f59e0b |
| 7 | Depósito Hospedaje | true | building | #0891b2 |
| 8 | Depósito Dueña | false | building | #f59e0b |
| 9 | Transferencia Hospedaje | true | arrow-right-left | #7c3aed |
| 10 | Transferencia Dueña | false | arrow-right-left | #f59e0b |

**El campo `icono` es un nombre Lucide** (banknote, credit-card, smartphone, building, arrow-right-left).

#### `categorias_movimiento` (23 filas)
`id_categoria`, `nombre`, `tipo` ENUM('Ingreso','Egreso'), `descripcion`, `orden`, `activo`.
UNIQUE (nombre, tipo), INDEX (tipo).
**Semilla:** 9 ingresos + 14 egresos.

#### `clientes_niveles` (4 filas)
`id_nivel`, `nombre` UNIQUE, `visitas_min`, `visitas_max` NULL, `descuento` DECIMAL, `color`, `icono`, `beneficios` TEXT, `activo`.

**Semilla:**
| id | nombre | visitas_min | visitas_max | descuento |
|----|--------|-------------|-------------|-----------|
| 1 | Bronce | 0 | 4 | 0% |
| 2 | Plata | 5 | 9 | 5% |
| 3 | Oro | 10 | 19 | 10% |
| 4 | VIP | 20 | NULL | 15% |

### Endpoints Módulo 02

Cada tabla tiene 8 endpoints CRUD + soft delete:

```
GET    /api/{recurso}
GET    /api/{recurso}/activos
GET    /api/{recurso}/{id}
POST   /api/{recurso}
PUT    /api/{recurso}/{id}
PATCH  /api/{recurso}/{id}/desactivar
PATCH  /api/{recurso}/{id}/reactivar
DELETE /api/{recurso}/{id}
```

**Recursos:**
- `/api/pisos`
- `/api/tipos-habitacion`
- `/api/tipos-documento`
- `/api/metodos-pago` (+ `/de-caja` y `/de-duenia`)
- `/api/categorias-movimiento` (+ filtro por tipo)
- `/api/clientes-niveles`

### Reglas de negocio Módulo 02
- Todos los catálogos son CRUD (nada hardcodeado)
- Soft delete vía `activo = false`
- `metodos_pago.es_de_caja` define R39
- El frontend usa `IconoDinamico` para renderizar el `icono` de cada método

---

## 💰 Módulo 03 — TARIFAS (✅ CERRADO)

### Tabla `tarifas` (15 filas)
`id_tarifa`, `id_tipo` FK → tipos_habitacion, `horas`, `monto`, `precio_hora_extra`, `max_horas_extra` (3), `precio_turno_adicional`, `activo`.
UNIQUE (id_tipo, horas).

**Semilla:**
| Tipo | 4h | 6h | 8h | 12h |
|------|----|----|----|----|
| Simple | ✅ S/25 | ❌ | ❌ | ❌ |
| Estándar | ❌ | ✅ S/40 | ❌ | ✅ S/45 |
| Premium | ❌ | ❌ | ✅ S/55 | ✅ S/70 |
| Safari | ❌ | ❌ | ✅ S/70 | ✅ S/90 |
| Marina | ❌ | ❌ | ✅ S/60 | ✅ S/80 |
| Romántica | ❌ | ❌ | ✅ S/60 | ✅ S/80 |
| Jacuzzi VIP | ❌ | ❌ | ✅ S/100 | ✅ S/135 |
| Jacuzzi Estelar | ❌ | ❌ | ✅ S/135 | ✅ S/165 |

### Endpoints Módulo 03

```
GET    /api/tarifas
GET    /api/tarifas/activos
GET    /api/tarifas/por-tipo/{idTipo}    ← usado por Reservas
GET    /api/tarifas/{id}
POST   /api/tarifas
PUT    /api/tarifas/{id}
PATCH  /api/tarifas/{id}/desactivar
PATCH  /api/tarifas/{id}/reactivar
DELETE /api/tarifas/{id}
```

### Reglas de negocio Módulo 03
- Cada tarifa = (tipo habitación, horas) → precio
- Hora extra: S/ 5 (Simple/Estándar/Premium) o S/ 10 (resto)
- Máximo 3h extra → después se cobra turno adicional
- Turno adicional = precio del bloque completo

---

## 👤 Módulo 04 — CLIENTES (✅ CERRADO)

### Tablas

#### `tipos_observacion` (5 filas)
`id_tipo_observacion`, `nombre` UNIQUE, `slug` UNIQUE, `icono`, `color`, `descripcion`, `orden`, `activo`.
**Semilla:** Deuda, Daño a la habitación, Mal comportamiento, Documento falso, Bloqueo permanente.

#### `gravedades_observacion` (4 filas)
`id_gravedad`, `nombre` UNIQUE, `slug` UNIQUE, `color`, `prioridad`, `activo`.
**Semilla:** Baja (1), Media (2), Alta (3), Crítica (4).

#### `clientes`
`id_cliente`, `nombre`, `apellido`, `id_tipo_documento` FK NULL, `numero_documento` UNIQUE NULL, `celular`, `email`, `fecha_nacimiento`, `fecha_aniversario`, `direccion`, `visitas` INT DEFAULT 0, `ultima_visita` DATE NULL, `total_gastado` DECIMAL, `id_nivel` FK NULL, `activo`.

#### `cliente_visitas`
`id_visita`, `id_cliente` FK, `id_reserva` FK NULL, `id_habitacion` FK NULL, `fecha_entrada` DATETIME, `fecha_salida` NULL, `monto_gastado` DECIMAL.

#### `cliente_observaciones`
`id_observacion`, `id_cliente` FK, `id_tipo_observacion` FK, `id_gravedad` FK, `motivo`, `monto_deuda` NULL, `resuelto` BOOLEAN, `fecha_resolucion` NULL, `id_usuario_creacion` FK.

### Endpoints Módulo 04

**Tipos Observación (8):** CRUD + `/desactivar`, `/reactivar`
**Gravedades (8):** CRUD + `/desactivar`, `/reactivar`

**Clientes (11):**
```
GET    /api/clientes
GET    /api/clientes/activos
GET    /api/clientes/buscar?dni=X     ← devuelve { existe, cliente, reserva_activa }
GET    /api/clientes/{id}
POST   /api/clientes
PUT    /api/clientes/{id}
PATCH  /api/clientes/{id}/desactivar
PATCH  /api/clientes/{id}/reactivar
DELETE /api/clientes/{id}
GET    /api/clientes/{id}/visitas
GET    /api/clientes/{id}/observaciones
POST   /api/clientes/{id}/observaciones
```

**Observaciones (4):**
```
GET    /api/cliente-observaciones
GET    /api/cliente-observaciones/{id}
PATCH  /api/cliente-observaciones/{id}/resolver
DELETE /api/cliente-observaciones/{id}
```

### Reglas de negocio Módulo 04

- **R-CLI-1:** Buscar cliente por DNI primero en BD local
- **R-CLI-2:** Si existe, NO se consulta RENIEC (cuando se active)
- **R-CLI-3:** Al registrar visita → incrementar `visitas`, actualizar `ultima_visita`, sumar `total_gastado`
- **R-CLI-4:** Al recalcular visitas → actualizar automáticamente el `nivel`
- **R-CLI-5:** Cliente con observación pendiente → mostrar alerta al buscar por DNI
- **R-CLI-6:** Los tipos de observación y gravedades son dinámicos (CRUD)
- **R-CLI-7:** Cliente con reserva activa → mostrar banner rojo "1 cliente = 1 reserva activa"

### Lógica de visitas — `ClienteVisitaService::registrar()`

```
1. Crea fila en cliente_visitas
2. Incrementa clientes.visitas en 1
3. Actualiza clientes.ultima_visita = now()
4. Suma clientes.total_gastado += monto_gastado
5. Recalcula nivel (Bronce/Plata/Oro/VIP)
```

**Este servicio es llamado desde `ReservaService::crearWalkIn()`.**

### Búsqueda con reserva activa

`GET /api/clientes/buscar?dni=X` devuelve:
```json
{
  "existe": true,
  "cliente": { ... },
  "reserva_activa": {
    "id_reserva": 13,
    "codigo_reserva": "WK-...",
    "habitacion": { "numero": "105", ... },
    "fecha_entrada": "..."
  } | null
}
```

**El `ClienteService::buscarPorDni()` adjunta `reserva_activa` como atributo dinámico** (NO usa `$appends` para evitar el error 500 en `listar()`).

**El `ClienteController::buscar()` extrae ese atributo y lo devuelve como campo separado** para que el frontend pueda accederlo sin problemas.

---

## 📦 Módulo 05 — PRODUCTOS Fase 1 (✅ CERRADO)

### Tablas

#### `categorias_producto` (7 filas)
`id_categoria_producto`, `nombre` UNIQUE, `slug` UNIQUE, `descripcion`, `icono`, `color`, `orden`, `activo`.

#### `proveedores` (6 filas)
`id_proveedor`, `razon_social`, `nombre_comercial`, `ruc`, `telefono`, `email`, `direccion`, `contacto`, `tipo`, `notas`, `activo`.

#### `productos` (18 filas)
`id_producto`, `nombre`, `descripcion`, `id_categoria_producto` FK NULL, `id_proveedor` FK NULL, `codigo_barra`, `precio_compra`, `precio_venta`, `stock_actual`, `stock_minimo` (10), `unidad_medida`, `imagen`, `activo`.

### Endpoints Módulo 05

**Categorías (8):** CRUD + desactivar/reactivar
**Proveedores (8):** CRUD + desactivar/reactivar

**Productos (10):**
```
GET    /api/productos
GET    /api/productos/activos
GET    /api/productos/stock-bajo
GET    /api/productos/por-categoria/{idCategoria}
GET    /api/productos/{id}
POST   /api/productos
PUT    /api/productos/{id}
PATCH  /api/productos/{id}/desactivar
PATCH  /api/productos/{id}/reactivar
DELETE /api/productos/{id}
```

### Reglas de negocio Módulo 05

- **R51:** Producto con `stock_actual <= stock_minimo` → "stock bajo"
- **R52:** Los productos NO se eliminan si tienen movimientos en kardex (futuro)
- **R53:** Los proveedores NO se eliminan si tienen productos asociados
- **R41:** Consumo descuenta stock (implementado en `ReservaService::agregarConsumo()`)

---

## 🎉 Módulo 06 — PROMOCIONES (✅ CERRADO)

### Tablas

#### `categorias_promocion` (8 filas)
`id_categoria_promocion`, `nombre` UNIQUE, `slug` UNIQUE, `descripcion`, `icono`, `color`, `orden`, `activo`.

#### `promociones` (6 filas)
`id_promocion`, `nombre`, `descripcion`, `id_categoria_promocion` FK NULL, `tipo` ENUM('PORCENTAJE','MONTO_FIJO','NOCHE_GRATIS','OTRO'), `valor` DECIMAL, `fecha_inicio`, `fecha_fin`, `dias_semana`, `hora_inicio`, `hora_fin`, `id_tipo_habitacion` FK NULL, `monto_minimo`, `requiere_codigo`, `codigo`, `limite_uso`, `usos_actuales`, `limite_por_cliente`, `acumulable`, `activo`.

#### `promociones_cliente`
`id_promo_cliente`, `id_promocion` FK, `id_cliente` FK, `codigo_personalizado`, `fecha_vencimiento`, `usado`, `fecha_uso`.

### Endpoints Módulo 06

**Categorías (8):** CRUD + desactivar/reactivar

**Promociones (10):**
```
GET    /api/promociones
GET    /api/promociones/activas
GET    /api/promociones/vigentes         ← filtro por fecha
GET    /api/promociones/por-categoria/{id}
GET    /api/promociones/{id}
POST   /api/promociones
PUT    /api/promociones/{id}
PATCH  /api/promociones/{id}/desactivar
PATCH  /api/promociones/{id}/reactivar
DELETE /api/promociones/{id}
```

**Promociones Cliente (7):** CRUD + `/usar`

### Reglas de negocio Módulo 06

- **R36:** Por defecto se aplica la mejor promo
- **R37:** Solo acumulables se suman
- **R38:** Uso se registra en `promociones_cliente`

---

## 🎨 Módulo 07 — PAQUETES DE DECORACIÓN (✅ CERRADO)

### Tablas

#### `categorias_paquete` (4 filas)
`id_categoria_paquete`, `nombre` UNIQUE, `slug` UNIQUE, `descripcion`, `icono`, `color`, `orden`, `activo`.
**Semilla:** Romántico, Fantasía, Aniversario, Premium.

#### `paquetes_decoracion` (6 filas)
`id_paquete`, `nombre`, `slug` UNIQUE, `descripcion`, `precio_total`, `ganancia_local`, `ganancia_proveedor`, `id_proveedor` FK NULL, `id_categoria_paquete` FK NULL, `id_tipo_habitacion` FK NULL, `imagen`, `categoria_servicio` ENUM, `horas_incluidas`, `incluye_jacuzzi`, `incluye_vino`, `incluye_decoracion`, `incluye_sexshop`, `incluye_netflix`, `activo`. Solo `created_at`.

**Fórmula (R11):** `precio_total = ganancia_local + ganancia_proveedor`

**6 paquetes cargados:**
| id | Nombre | Tipo habitación | Precio | Local | Proveedor |
|----|--------|-----------------|--------|-------|-----------|
| 1 | Romántico N°1 - Suite VIP | Jacuzzi VIP | 199 | 30 | 169 |
| 2 | Romántico N°2 - Suite VIP | Jacuzzi VIP | 219 | 35 | 184 |
| 3 | Estelar N°3 - Suite Estelar | Jacuzzi Estelar | 259 | 40 | 219 |
| 4 | Romántico N°4 - Temática | Romántica | 159 | 25 | 134 |
| 5 | Fantasía N°5 - Safari | Safari | 159 | 25 | 134 |
| 6 | Aniversario N°6 - Estelar | Jacuzzi Estelar | 299 | 45 | 254 |

### Endpoints Módulo 07

**Categorías (8):** CRUD

**Paquetes (9):**
```
GET    /api/paquetes-decoracion
GET    /api/paquetes-decoracion/activos
GET    /api/paquetes-decoracion/por-tipo-habitacion/{idTipo}
GET    /api/paquetes-decoracion/{id}
POST   /api/paquetes-decoracion
PUT    /api/paquetes-decoracion/{id}
PATCH  /api/paquetes-decoracion/{id}/desactivar
PATCH  /api/paquetes-decoracion/{id}/reactivar
DELETE /api/paquetes-decoracion/{id}
```

### Reglas de negocio Módulo 07

- **R11:** Reserva con decoración genera CuentaPagar al proveedor (a futuro)
- Fórmula validada en `PaqueteDecoracionService::validarFormula()`

---

## 🏨 Módulo 08 — HABITACIONES (✅ CERRADO)

### Tabla `habitaciones` (32 filas)
`id_habitacion`, `id_piso` FK, `id_tipo` FK, `numero` UNIQUE VARCHAR(10), `orden` INT, `activo` BOOLEAN.

**⚠️ NO guarda `estado`** → se calcula en vivo (R4/R8).

**Semilla (32 habitaciones):**
- **Piso 1 (7):** 101-107
- **Piso 2 (9, la 208 inactiva):** 201-209
- **Piso 3 (8):** 301-308
- **Piso 4 (8):** 401-408

**Habitación 208:** Inactiva (almacén/recepción).

### Endpoints Módulo 08

```
GET    /api/habitaciones
GET    /api/habitaciones/activas
GET    /api/habitaciones/por-piso/{idPiso}
GET    /api/habitaciones/por-tipo/{idTipo}
GET    /api/habitaciones/{id}
POST   /api/habitaciones
PUT    /api/habitaciones/{id}
PATCH  /api/habitaciones/{id}/desactivar
PATCH  /api/habitaciones/{id}/reactivar
DELETE /api/habitaciones/{id}
```

---

## 🎯 Módulo 09A — RECEPCIÓN / WALK-IN (✅ CERRADO)

### Visión general

Este módulo maneja **2 flujos**:
1. **WALK-IN** (cliente físico ahora) → `/api/reservas/walk-in`
2. **RESERVA futura** (cliente llama) → `/api/reservas`

Ambos usan la **misma tabla `reservas`** con `tipo_reserva`.

**Estado actual:** Walk-in 100% funcional. Reserva futura backend listo, frontend pendiente.

### Tablas

#### `estados_reserva` (7 filas)
`id_estado`, `nombre` UNIQUE, `slug` UNIQUE, `color`, `descripcion`, `orden`, `activo`.
**Semilla:** Pendiente, Confirmada, Activa, Finalizada, Cancelada, No-Show, Anulada.

#### `reservas`
```
id_reserva (PK)
codigo_reserva (UNIQUE)              "WK-XXXXXX" o "RES-XXXXXX"
tipo_reserva ENUM('NORMAL', 'CON_DECORACION')
id_estado (FK → estados_reserva)
id_cliente (FK → clientes)
id_habitacion (FK → habitaciones)
id_tarifa (FK → tarifas)
id_usuario_creacion (FK → usuarios)
cantidad_personas INT
fecha_entrada DATETIME
fecha_salida_prevista DATETIME
fecha_salida_real DATETIME NULL
horas_base INT
horas_extra INT
horas_totales INT
monto_habitacion DECIMAL
monto_horas_extra DECIMAL
monto_consumos DECIMAL
monto_ajustes DECIMAL
descuento DECIMAL
descuento_porcentaje DECIMAL
total DECIMAL                    ← monto_habitacion + consumos + horas_extra + ajustes - descuento
pagado DECIMAL                   ← SUM(pagos_reserva.monto WHERE anulado=false) — INCLUYE NEGATIVOS
saldo DECIMAL                    ← max(0, total - pagado)
vuelto_entregado DECIMAL         ← DEPRECADO (se calcula desde pagos_reserva)
telefono VARCHAR(20) NULL
notas TEXT NULL
observaciones TEXT NULL
id_usuario_anulacion (FK NULL)
fecha_anulacion DATETIME NULL
motivo_anulacion VARCHAR(255) NULL
timestamps
```

**⚠️ IMPORTANTE:** `pagado` ahora se calcula como `SUM(pagos_reserva.monto)` donde `monto` puede ser **negativo** (para vueltos entregados). El campo `vuelto_entregado` quedó **deprecado** (ya no se usa).

#### `ocupacion_habitacion`
`id_ocupacion`, `id_habitacion` FK, `id_reserva` FK, `fecha_inicio`, `fecha_fin`, `estado` ENUM('ACTIVA','LIBERADA','CANCELADA').

**Es el bloqueo real** (no `reservas`). Índice clave: `(id_habitacion, fecha_inicio, fecha_fin, estado)`.

#### `registros_estadia`
`id_registro`, `id_reserva` FK UNIQUE, `fecha_entrada`, `fecha_salida` NULL, `horas_reales` NULL, `id_usuario_checkin` FK, `id_usuario_checkout` FK NULL, `monto_final` NULL, `observaciones`.

#### `pagos_reserva`
`id_pago`, `id_reserva` FK, `id_metodo_pago` FK, `monto` (puede ser NEGATIVO), `es_adelanto` BOOLEAN, `fecha_pago`, `id_usuario` FK, `observaciones`, `anulado` BOOLEAN, `id_usuario_anulacion` NULL, `fecha_anulacion` NULL, `motivo_anulacion`.

**⚡ REGLA:** Los vueltos se registran como **pagos negativos** (`monto < 0`) con `observaciones = "Vuelto entregado al cliente"`.

#### `reserva_consumos`
`id_consumo`, `id_reserva` FK, `id_producto` FK, `cantidad`, `precio_unitario`, `subtotal`, `pagado` BOOLEAN, `id_metodo_pago` FK NULL, `id_usuario` FK, `fecha_consumo`, `observaciones`.

#### `reserva_ajustes`
`id_ajuste`, `id_reserva` FK, `tipo` ENUM('CAMBIO_HABITACION','AJUSTE_MANUAL'), `monto_anterior`, `monto_nuevo`, `diferencia`, `id_usuario` FK, `fecha_ajuste`, `notas`.

#### `limpieza`
`id_limpieza`, `id_habitacion` FK, `id_reserva` FK NULL, `id_usuario_asignado` FK NULL, `estado` ENUM('PENDIENTE','EN_PROCESO','COMPLETADA'), `tipo` ENUM('NORMAL','PROFUNDA'), `fecha_solicitud`, `fecha_inicio` NULL, `fecha_fin` NULL, `observaciones`.

### Endpoints Módulo 09

**Estados de Reserva (2):**
```
GET /api/estados-reserva
GET /api/estados-reserva/activos
```

**Mapa de Habitaciones (2):**
```
GET /api/habitaciones-mapa           ← devuelve las 32 con estado calculado
GET /api/habitaciones-mapa/{id}
```

**Reservas (14):**
```
GET    /api/reservas
POST   /api/reservas                              ← reserva futura
POST   /api/reservas/walk-in                      ← cliente actual
GET    /api/reservas/{id}
PATCH  /api/reservas/{id}/check-in
PATCH  /api/reservas/{id}/check-out
PATCH  /api/reservas/{id}/cancelar
PATCH  /api/reservas/{id}/anular
PATCH  /api/reservas/{id}/cambiar-habitacion
POST   /api/reservas/{id}/consumos
DELETE /api/reservas/{id}/consumos/{idConsumo}
POST   /api/reservas/{id}/pagos                   ← pago adicional (parcial/mixto posterior)
DELETE /api/reservas/{id}/pagos/{idPago}          ← anular pago
POST   /api/reservas/{id}/entregar-vuelto         ← registra pago negativo
```

**Limpieza (4):**
```
GET    /api/limpieza
GET    /api/limpieza/pendientes
PATCH  /api/limpieza/{id}/iniciar
PATCH  /api/limpieza/{id}/finalizar
```

### Servicios clave del Módulo 09

#### `ReservaService`

**Métodos principales:**
- `crearWalkIn(array $datos, int $idUsuario)` → crea reserva tipo WALK-IN con estado ACTIVA
- `crearReserva(array $datos, int $idUsuario)` → reserva futura con estado CONFIRMADA
- `checkIn(int $idReserva, int $idUsuario)` → activa una reserva confirmada
- `checkOut(int $idReserva, int $idUsuario, ?float $montoFinal)` → finaliza + crea limpieza
- `cancelar(int $idReserva, int $idUsuario, string $motivo)`
- `anular(int $idReserva, int $idUsuario, string $motivo)` → anula pagos, no SUNAT
- `cambiarHabitacion(...)` → crea `reserva_ajuste` + limpieza en la vieja
- `agregarConsumo(...)` → descuenta stock + suma a cuenta o registra pago
- `eliminarConsumo(int $idConsumo, int $idUsuario)` → devuelve stock + revierte montos
- `agregarPago(int $idReserva, array $datos, int $idUsuario)` → registra pago positivo
- `anularPago(int $idPago, int $idUsuario, string $motivo)` → marca `anulado = true`
- `entregarVuelto(int $idReserva, float $monto, int $idMetodoPago, int $idUsuario)` → registra pago NEGATIVO
- `clienteTieneReservaActiva(int $idCliente): ?Reserva` → valida R-CLI-7

**Todas las operaciones multi-tabla usan `DB::transaction()`.**

#### `EstadoHabitacionService`

Calcula el estado **EN VIVO** de cada habitación. Devuelve:
```php
[
    'estado' => 'Disponible' | 'Ocupada' | 'Por vencer' | 'Vencida' | 'Reservada' | 'Limpieza' | 'Inactiva',
    'color' => '#10b981',
    'cliente' => 'nombre o null',
    'id_reserva' => 123,
    'fecha_entrada' => ISO8601,
    'fecha_salida_prevista' => ISO8601,
    'minutos_transcurridos' => 120,
    'minutos_totales' => 480,
    'minutos_restantes' => 360,
    'minutos_extra' => 0,
    'horas_base' => 8,
]
```

**Lógica (orden de prioridad):**
1. Si `activo = false` → **Inactiva** (#475569)
2. Si hay limpieza pendiente/en proceso → **Limpieza** (#06b6d4)
3. Si hay ocupación ACTIVA actual → depende:
   - `minutos_extra > 0` → **Vencida** (#dc2626)
   - `minutos_restantes <= 30` → **Por vencer** (#f59e0b)
   - Sino → **Ocupada** (#ef4444)
4. Si hay ocupación futura → **Reservada** (#7c3aed)
5. Sino → **Disponible** (#10b981)

**Importante:** El cálculo usa `diffInMinutes` correctamente:
- `minutosRestantes = round($ahora->diffInMinutes($fin, false))` → positivo si falta, negativo si excedió
- `minutosExtra = max(0, -$minutosRestantes)`

#### `DisponibilidadService`

- `estaDisponible(int $idHabitacion, Carbon $inicio, Carbon $fin, ?int $excluirReserva)` → verifica con buffer de 30 min
- `habitacionesLibres(Carbon $inicio, Carbon $fin)` → array de IDs libres

**Buffer de limpieza (R4):** 30 minutos entre reservas.

### Reglas de negocio Módulo 09

#### Reservas (R1-R7)
- **R1** Habitación alquilada no se re-alquila hasta liberación
- **R2** Reserva Pendiente/Confirmada bloquea en su rango
- **R3** Sistema rechaza reservas que se crucen
- **R4** Buffer de limpieza configurable (30 min default)
- **R5** Salida anticipada no devuelve dinero pero libera antes
- **R6** No-Show libera bloqueo y retiene adelanto
- **R7** DNI genera Boleta, RUC genera Factura

#### Habitaciones (R8-R12)
- **R8** Estado se calcula en vivo (NO se guarda)
- **R9** Al check-out pasa a Limpieza automáticamente
- **R10** Se libera cuando limpieza termina
- **R11** En Limpieza no se puede alquilar
- **R12** En Mantenimiento no se puede alquilar

#### Cambio de habitación
- Al cambiar, se crea `reserva_ajuste` con `monto_anterior`, `monto_nuevo`, `diferencia`
- La habitación **vieja** pasa a **LIMPIEZA**
- El tiempo **NO se resetea** (mantiene `fecha_inicio` original)
- Si la nueva no tiene tarifa con `horas_base`, se ajusta a la **más chica disponible**
- Si la diferencia es positiva y el modo es `AHORA` → cobra + `pago_reserva`
- Si la diferencia es negativa y el modo es `AHORA` → ajusta `pagado`

#### Consumos
- Al agregar: descuenta `productos.stock_actual`
- Si `pagado = true` → `pago_reserva` + no suma a `monto_consumos`
- Si `pagado = false` → suma a `monto_consumos` + recalcula `total`
- Al eliminar: devuelve stock + revierte montos

#### Vuelto (R-DINERO-1 a R-DINERO-5)

- **R-DINERO-1:** El vuelto se registra como **pago NEGATIVO** en `pagos_reserva`
- **R-DINERO-2:** El campo `pagado` = `SUM(pagos_reserva.monto WHERE anulado = false)` (puede bajar)
- **R-DINERO-3:** Se puede entregar vuelto **parcial** (múltiples veces)
- **R-DINERO-4:** Al entregar vuelto, se pide método de devolución (efectivo, yape, etc.)
- **R-DINERO-5:** El campo `vuelto_entregado` quedó deprecado (ya no se usa)

**Ejemplo:**
```
Cliente paga S/ 100 por hab. S/ 55
→ pagos_reserva: [+100 Efectivo]
→ pagado = 100

Se entrega vuelto de S/ 45:
→ pagos_reserva: [+100 Efectivo, -45 Efectivo]
→ pagado = 55 ✅
```

#### Pagos mixtos (R-PAGO-1 a R-PAGO-4)

- **R-PAGO-1:** El recepcionista puede registrar N pagos con distintos métodos para una misma reserva
- **R-PAGO-2:** El frontend envía el array `pagos[]` con `[{id_metodo_pago, monto}, ...]`
- **R-PAGO-3:** El Controller valida `pagos.*.id_metodo_pago` y `pagos.*.monto`
- **R-PAGO-4:** El Service itera y crea N `PagoReserva` + recalcula `pagado`

**Ejemplo:**
```
Cliente paga S/ 45 = S/ 5 Pin Dueña + S/ 10 Yape Dueña + S/ 30 Depósito
→ pagos_reserva: [+5, +10, +30]
→ pagado = 45
```

#### Limpieza
- Al check-out → INSERT en `limpieza` (PENDIENTE)
- Al cambiar habitación → INSERT en `limpieza` para la habitación vieja
- Al finalizar limpieza → habitación vuelve a Disponible
- **Importante:** El cálculo del estado prioriza Limpieza sobre Disponible

#### 1 cliente = 1 reserva activa (R-CLI-7)
- Al crear walk-in → validar `clienteTieneReservaActiva()`
- Si el cliente ya tiene reserva activa → error 422
- Mensaje: *"Este cliente ya tiene una reserva activa en la habitación {X}. Si necesita otra habitación, regístrela a nombre de otra persona (familiar)."*

---

## 🕐 Módulo 09C — EXTENSIONES DE TIEMPO (✅ CERRADO)

### Visión general

Sistema que detecta automáticamente cuando un cliente **excede el tiempo contratado** y ofrece opciones para cobrar las horas extra con **múltiples formas de pago**, **historial de extensiones**, y **tolerancia configurable**.

### Tablas

#### `configuraciones` (5 filas)
Tabla de configuraciones globales del sistema (NO hardcodeadas).

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_configuracion | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| clave | VARCHAR(100) | UNIQUE, NOT NULL |
| valor | VARCHAR(255) | NOT NULL |
| tipo | VARCHAR(20) | INT/DECIMAL/STRING/BOOLEAN |
| descripcion | VARCHAR(255) | NULL |
| grupo | VARCHAR(50) | default 'general' |
| timestamps | | |

**Semilla:**
| clave | valor | tipo | grupo |
|-------|-------|------|-------|
| tolerancia_extension_minutos | 30 | INT | reservas |
| buffer_limpieza_minutos | 30 | INT | reservas |
| tolerancia_no_show_minutos | 60 | INT | reservas |
| igv_porcentaje | 18 | DECIMAL | comprobantes |
| moneda_simbolo | S/ | STRING | general |

**Método helper:** `Configuracion::obtener($clave, $default)` → lee el valor casteado.

#### `extensiones_reserva`
Registra cada extensión de tiempo aplicada a una reserva.

`id_extension`, `id_reserva` FK, `horas_extra`, `monto`, `es_turno_adicional` BOOLEAN, `minutos_exceso`, `precio_hora_extra_aplicado`, `tolerancia_minutos`, `pagado_inmediato` BOOLEAN, `cargado_a_cuenta` BOOLEAN, `id_metodo_pago` FK NULL, `id_usuario` FK, `fecha_extension`, `observaciones`.

### Lógica de cálculo (ExtensionService)

```
minutos_transcurridos = ahora - fecha_entrada
minutos_base = horas_base × 60
minutos_exceso_total = minutos_transcurridos - minutos_base

horas_extra_ya_aplicadas = SUM(extensiones.horas_extra)
minutos_ya_cubiertos = horas_extra_ya_aplicadas × 60

minutos_exceso_pendiente = minutos_exceso_total - minutos_ya_cubiertos

dentro_tolerancia = minutos_exceso_pendiente <= tolerancia_minutos

si !dentro_tolerancia:
    minutos_a_cobrar = minutos_exceso_pendiente - tolerancia_minutos
    horas_extra_sugeridas_nuevas = ceil(minutos_a_cobrar / 60)

monto = horas_extra_sugeridas_nuevas × precio_hora_extra
```

### Reglas RG-Extensión

- **RG-E1:** Tolerancia de 30 min configurable antes de cobrar
- **RG-E2:** Horas extra = `ceil((exceso - tolerancia) / 60)`
- **RG-E3:** El recepcionista puede cobrar más/menos/no cobrar (con observación)
- **RG-E4:** Formas de pago: cargar a cuenta o pagar ahora
- **RG-E5:** Si es "de dueña" → NO entra a caja (R39)
- **RG-E6:** Cada extensión se registra en `extensiones_reserva`
- **RG-E7:** Los precios vienen de `tarifas`
- **RG-E8:** La tolerancia viene de `configuraciones`
- **RG-E9:** Múltiples extensiones por reserva permitidas
- **RG-E10:** El cálculo resta las extensiones ya aplicadas (evita doble cobro)
- **RG-E11:** Si excede máximo → ofrece turno adicional completo

### Endpoints Módulo 09C

**Configuraciones (3):**
```
GET    /api/configuraciones
GET    /api/configuraciones/grupo/{grupo}
PUT    /api/configuraciones/{clave}
```

**Extensiones (3):**
```
GET    /api/reservas/{id}/calculo-extension          → previsualizar
GET    /api/reservas/{id}/extensiones                → historial
POST   /api/reservas/{id}/extensiones                → aplicar
```

### Servicios Módulo 09C

- `ExtensionService::calcular(Reserva $reserva): array`
- `ReservaService::agregarExtension(...)`
- `ReservaService::listarExtensiones(int $idReserva)`

---

## 👁️ MÓDULO OBSERVACIONES DE CLIENTE (✅ CERRADO)

### Visión general

Sistema de alertas sobre clientes problemáticos. Cuando el recepcionista busca un DNI en recepción, si el cliente tiene observaciones pendientes → muestra una alerta roja **inmediata** (antes de llenar el resto del formulario).

### Reglas de negocio

- **OBS-1:** Cliente con 1+ observación pendiente → banner rojo
- **OBS-2:** Cliente con 2+ observaciones → "CLIENTE NO GRATO" (rojo más fuerte)
- **OBS-3:** Tipo = "Bloqueo permanente" o gravedad = "Crítica" → "CLIENTE VETADO" (rojo oscuro)
- **OBS-4:** Se pueden resolver las observaciones (PATCH `/resolver`)
- **OBS-5:** El backend expone `observaciones_pendientes` en `buscarPorDni`

### Campos de alerta visual

El frontend muestra:
- 🟡 1 obs Baja/Media → banner amarillo
- 🟠 1 obs Alta → banner naranja
- 🔴 2+ obs → "CLIENTE NO GRATO"
- ⛔ Bloqueo permanente/Crítica → "CLIENTE VETADO"

---

## 🧹 MÓDULO 14 — LIMPIEZA (backend listo, frontend pendiente)

### Tabla `limpieza`

Cola de tareas de limpieza por habitación.

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_limpieza | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| id_habitacion | BIGINT FK | → habitaciones, cascade |
| id_reserva | BIGINT FK NULL | → reservas, set null |
| id_usuario_asignado | BIGINT FK NULL | → usuarios, set null |
| estado | ENUM('PENDIENTE','EN_PROCESO','COMPLETADA') | default PENDIENTE |
| tipo | ENUM('NORMAL','PROFUNDA') | default NORMAL |
| fecha_solicitud | DATETIME | cuándo se pidió |
| fecha_inicio | DATETIME NULL | cuándo empezó |
| fecha_fin | DATETIME NULL | cuándo terminó |
| observaciones | TEXT | NULL |
| timestamps | | |

### Cuándo se crea (automático)

1. **Al check-out** → PENDIENTE
2. **Al cambiar de habitación** → PENDIENTE para la vieja
3. **Al finalizar mantenimiento** → (futuro)

### Endpoints

```
GET    /api/limpieza
GET    /api/limpieza/pendientes
PATCH  /api/limpieza/{id}/iniciar             → PENDIENTE → EN_PROCESO
PATCH  /api/limpieza/{id}/finalizar           → EN_PROCESO → COMPLETADA
```

### Integración con EstadoHabitacionService

- Si hay limpieza PENDIENTE o EN_PROCESO → estado = **Limpieza** (#06b6d4)
- Al finalizar → habitación vuelve a Disponible

---

## 🎯 Reglas de negocio globales (R1-R71 + RG-* + R-DINERO-* + R-PAGO-* + OBS-*)

### Reservas (Módulo 09)
- **R1** Habitación alquilada no se re-alquila hasta liberación
- **R2** Reserva Pendiente/Confirmada bloquea en su rango
- **R3** Sistema rechaza reservas que se crucen
- **R4** Buffer de limpieza configurable (30 min)
- **R5** Salida anticipada no devuelve dinero pero libera antes
- **R6** No-Show libera bloqueo y retiene adelanto
- **R7** DNI genera Boleta, RUC genera Factura

### Habitaciones
- **R8** Estado se calcula en vivo (NO se guarda)
- **R9** Al check-out pasa a Limpieza automáticamente
- **R10** Se libera cuando limpieza termina
- **R11** En Limpieza no se puede alquilar
- **R12** En Mantenimiento no se puede alquilar

### Extensiones
- **R13** Máximo de horas extra según tipo (3 por defecto)
- **R14** Al exceder máximo → turno adicional
- **R15** Turno adicional cuesta el bloque completo
- **R16** Cada extensión se registra en `extensiones_reserva`
- **R54** Tolerancia configurable (default 30 min)
- **R55** Horas extra = `ceil((exceso - tolerancia) / 60)`
- **R56** Precio hora extra viene de `tarifas`
- **R57** Máximo horas extra viene de `tarifas`
- **R58** Excede máximo → ofrecer turno adicional
- **R59** Cada extensión se registra (auditoría)
- **R60** Múltiples extensiones permitidas
- **R61** Cálculo resta extensiones ya aplicadas
- **R62** Formas de pago: cargar a cuenta o pagar ahora
- **R63** Se puede "no cobrar" con observación
- **R64** Precios y tolerancia NO se hardcodean

### Caja (Módulo 11)
- **R17** Solo 1 caja abierta a la vez
- **R18** Todo movimiento pertenece a caja abierta
- **R19** Vuelto NO es egreso
- **R20** Movimientos no se borran, se anulan
- **R21** Si hay diferencia → observación obligatoria
- **R22** Arqueo por método de pago
- **R23** Egresos requieren responsable

### IGV y Comprobantes (Módulo 16)
- **R24** Precios incluyen IGV
- **R25** IGV = 18% (configurable)
- **R26** Base = Total / 1.18
- **R27** Redondeo al final
- **R28** Boleta puede mostrar solo total
- **R29** Factura discrimina Base + IGV
- **R30** Cada comprobante consume correlativo
- **R31** Series B001, F001, NC01, ND01

### Clientes
- **R32** Al reservar: DNI + nombre + celular
- **R33** Los demás datos se enriquecen después
- **R34** Nivel según visitas
- **R35** Descuento por nivel se aplica automáticamente
- **R-CLI-7:** 1 cliente = 1 reserva activa

### Promociones
- **R36** Por defecto se aplica la mejor promo
- **R37** Solo acumulables se suman
- **R38** Uso se registra en `promociones_cliente`

### ⚡ R39 — Métodos "de dueña" NO entran a caja
Los métodos con `es_de_caja = false` NO se registran en `movimientos_caja`.

### Inventario
- **R40** Cada movimiento → kardex
- **R41** Consumo descuenta stock ✅
- **R42** Stock bajo → alerta
- **R43** Inventario físico → ajustes

### Alertas
- **R44-R47** Cronjob + WebSocket + anti-duplicados

### Auditoría
- **R48-R50** Todo cambio sensible se audita con IP + user-agent

### Productos
- **R51-R53** Stock bajo, no eliminar productos/proveedores con dependencias

### ⚡ R-DINERO-1 a R-DINERO-5 — Vuelto
- **R-DINERO-1:** Vuelto = pago negativo en `pagos_reserva`
- **R-DINERO-2:** `pagado = SUM(pagos.monto WHERE anulado = false)`
- **R-DINERO-3:** Se puede entregar parcial
- **R-DINERO-4:** Se pide método de devolución
- **R-DINERO-5:** `vuelto_entregado` deprecado

### ⚡ R-PAGO-1 a R-PAGO-4 — Pagos mixtos
- **R-PAGO-1:** N pagos con distintos métodos para misma reserva
- **R-PAGO-2:** Frontend envía array `pagos[]`
- **R-PAGO-3:** Controller valida `pagos.*.id_metodo_pago` y `pagos.*.monto`
- **R-PAGO-4:** Service itera + recalcula `pagado`

### ⚡ OBS-1 a OBS-5 — Observaciones cliente
- **OBS-1:** 1+ obs → banner rojo
- **OBS-2:** 2+ obs → "CLIENTE NO GRATO"
- **OBS-3:** Tipo bloqueo/crítica → "CLIENTE VETADO"
- **OBS-4:** PATCH `/resolver`
- **OBS-5:** Backend expone `observaciones_pendientes`

### Configuraciones (R65-R67)
- **R65:** Parámetros globales viven en tabla `configuraciones`
- **R66:** Cambiar una config aplica al instante
- **R67:** Parámetros iniciales: tolerancia, buffer, no-show, IGV, moneda

### Limpieza (R68-R71)
- **R68:** Al check-out → INSERT en `limpieza`
- **R69:** Al cambiar habitación → limpieza para la vieja
- **R70:** Vuelve a Disponible solo cuando se completa
- **R71:** Limpieza tiene prioridad sobre Disponible

### Reglas propias del Hospedaje (RG-*)
- **RG1** Al alquilar, SIEMPRE debe pagar la habitación completa
- **RG2** El vuelto puede quedar como saldo a favor
- **RG3** El vuelto se descuenta automáticamente con consumos/horas extra
- **RG4** Al cambiar hab, la vieja va a LIMPIEZA
- **RG5** Al cambiar hab, el tiempo NO se resetea
- **RG6** Si no hay tarifa exacta, se ajusta a la más chica

---

## 🔐 Autenticación (Sanctum)

- `bootstrap/app.php` registra `routes/api.php`
- Rutas protegidas con `Route::middleware('auth:sanctum')`
- Token: `$usuario->createToken('auth_token')->plainTextToken`
- **Sin expiración por defecto**

**Flujo:**
1. `POST /api/login` con `{ nombre_usuario, password }`
2. Servidor valida, actualiza `ultimo_login`, genera token
3. Token se devuelve en JSON
4. Cliente lo manda: `Authorization: Bearer {token}`
5. Token inválido → 401

---

## 🎨 Reglas de código

| Regla | Obligatorio |
|-------|-------------|
| Idioma | Español (variables, funciones, tablas) |
| Controllers | Delgados, solo llaman al Service |
| Services | Toda la lógica CRUD + negocio |
| Models | Relaciones explícitas |
| Migraciones | `Schema::create` con FK explícitas |
| Seeders | Datos reales, no lorem ipsum |
| Alias | `App\...` siempre |
| Tipos | PHP 8.2 estricto |
| Transacciones | `DB::transaction()` para operaciones multi-tabla |
| Soft delete | Vía `activo = false` |
| Timestamps | Siempre (excepto paquetes_decoracion) |

### Convenciones

- Controllers: `XxxController.php`
- Models: `Xxx.php`
- Services: `XxxService.php`
- Migraciones: `YYYY_MM_DD_HHMMSS_create_xxx_table.php`
- Tablas: `snake_case` plural
- Campos: `snake_case`
- Rutas API: `kebab-case` plural

### Patrón de respuesta JSON

- **GET** → devuelve el recurso directo: `[...]` o `{...}`
- **POST/PUT/PATCH** → devuelve `{ mensaje, data }`
- **DELETE** → devuelve `{ mensaje }`

**⚠️ Excepción:** `GET /api/clientes/buscar?dni=X` devuelve `{ existe, cliente, reserva_activa }` (formato especial).

**Por qué:** El frontend lee `data` en GET y `data.data` en POST/PUT/PATCH.

**⚠️ Importante sobre `$appends`:** NO usar `$appends` con atributos que se setean dinámicamente (como `reserva_activa`). Rompe la serialización de colecciones. En su lugar, extraer el atributo en el Controller y devolverlo como campo separado.

---

## 🧪 Cómo probar

### PowerShell
```powershell
$body = @{ nombre_usuario = "nancy"; password = "admin123" } | ConvertTo-Json
$resp = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/login" -Method POST -Body $body -ContentType "application/json"
$token = $resp.token

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/habitaciones-mapa" -Headers @{ Authorization = "Bearer $token" }
```

### Tinker

**IMPORTANTE:** Tinker **no acepta bloques multilínea**. Hay que pegar **una línea a la vez**.

```powershell
cd C:\Users\David\Desktop\hospedaje\backend
php artisan tinker
```

Una línea a la vez:
```php
app(\App\Services\ClienteService::class)->listar()->count();
```

```php
$r = \App\Models\Reserva::find(2);
```

```php
$r->pagos
```

```php
exit
```

**Para scripts largos:** crear un archivo `.php`, guardarlo, y ejecutarlo con:
```powershell
Get-Content "script.php" | php artisan tinker
Remove-Item "script.php"
```

---

## 🚀 Instalación

### Requisitos
- PHP 8.2+
- Composer
- MySQL 8 / MariaDB 10.4+

### Pasos

```powershell
composer install
cp .env.example .env
php artisan key:generate
# Configurar .env con MySQL
# DB_DATABASE=hospedaje
# DB_USERNAME=root
# DB_PASSWORD=

# Crear la BD 'hospedaje' en MySQL

php artisan migrate
php artisan db:seed --class=ConfiguracionBaseSeeder
php artisan db:seed --class=TarifaSeeder
php artisan db:seed --class=TiposObservacionSeeder
php artisan db:seed --class=GravedadesObservacionSeeder
php artisan db:seed --class=CategoriaProductoSeeder
php artisan db:seed --class=ProveedorSeeder
php artisan db:seed --class=ProductoSeeder
php artisan db:seed --class=CategoriaPromocionSeeder
php artisan db:seed --class=PromocionSeeder
php artisan db:seed --class=CategoriaPaqueteSeeder
php artisan db:seed --class=PaqueteDecoracionSeeder
php artisan db:seed --class=HabitacionSeeder
php artisan db:seed --class=EstadoReservaSeeder
php artisan db:seed --class=ConfiguracionSistemaSeeder

php artisan serve
```

**Acceder:** `http://localhost:8000`

---

## 🔧 Comandos útiles

```powershell
# Ver rutas API
php artisan route:list --path=api

# Resetear BD completa
php artisan migrate:fresh --seed

# Tinker
php artisan tinker

# Limpiar cachés
php artisan optimize:clear

# Ver logs
Get-Content storage\logs\laravel.log -Tail 50

# Truncar tablas respetando FK
php artisan tinker
>>> DB::statement('SET FOREIGN_KEY_CHECKS=0;');
>>> DB::table('reservas')->truncate();
>>> DB::statement('SET FOREIGN_KEY_CHECKS=1;');
>>> exit
```

---

## 🗺️ Roadmap de módulos

| # | Módulo | Backend | Frontend | Estado |
|---|--------|---------|----------|--------|
| 01 | AUTH | ✅ | ✅ | CERRADO |
| 02 | CONFIG-BASE (6 tablas) | ✅ | ✅ | CERRADO |
| 03 | TARIFAS | ✅ | ✅ | CERRADO |
| 04 | CLIENTES | ✅ | ✅ | CERRADO |
| 05 | PRODUCTOS Fase 1 | ✅ | ✅ | CERRADO |
| 06 | PROMOCIONES | ✅ | ✅ | CERRADO |
| 07 | PAQUETES DE DECORACIÓN | ✅ | ✅ | CERRADO (catálogo) |
| 08 | HABITACIONES | ✅ | ✅ | CERRADO |
| 09A | RECEPCIÓN / WALK-IN | ✅ | ✅ | CERRADO |
| **09B** | **RESERVAS FUTURAS** | ✅ | ⏳ | Backend listo |
| **09C** | **EXTENSIONES DE TIEMPO** | ✅ | ✅ | CERRADO |
| **OBS** | **OBSERVACIONES CLIENTE** | ✅ | ✅ | CERRADO |
| **PAGOS** | **PAGOS MIXTOS + VUELTO** | ✅ | ✅ | CERRADO |
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

## 📝 Módulos futuros — detalle

### Módulo 09B — RESERVAS FUTURAS (frontend pendiente)

**Backend listo:** `POST /api/reservas`, `PATCH /api/reservas/{id}/check-in`.

**Frontend pendiente:**
- `/reservas` (listado con filtros)
- `/reservas/nueva` (form con fecha futura)
- `/reservas/:id` (detalle con opción check-in)

### Módulo 10 — DECORACIONES APLICADAS

**Tabla `decoraciones`:** `id_decoracion`, `id_reserva` FK, `id_cliente` FK, `id_habitacion` FK, `id_paquete` FK, `id_proveedor` FK, `fecha_inicio`, `fecha_fin`, `monto`, `ganancia_local`, `ganancia_proveedor`, `adelanto`, `saldo`, `frase`, `musica`, `estado` ENUM, `observaciones`, `created_at`.

**R11:** Al crear reserva con decoración → crear CuentaPagar al proveedor.

### Módulo 11 — CAJA

**Tablas:** `cajas`, `movimientos_caja`, `arqueo_denominaciones`, `retiros_caja`, `devoluciones`.

**Reglas R17-R23, R39.**

### Módulo 12 — INVENTARIO / KARDEX

**Tablas:** `kardex`, `inventario_fisico`, `inventario_detalle`.

### Módulo 13 — CUENTAS POR PAGAR

**Tablas:** `cuentas_por_pagar`, `pagos_proveedor`.

### Módulo 14 — LIMPIEZA (pantalla)

**Backend listo.** Falta frontend: `/limpieza`, botones Iniciar/Finalizar.

### Módulo 15 — MANTENIMIENTO

**Tabla `mantenimiento`:** reportes de problemas, bloquea habitación.

### Módulo 16 — COMPROBANTES SUNAT

**Tablas:** `tipos_comprobante`, `series_comprobante`, `facturas`, `facturas_detalle`, `notas_credito`.

### Módulo 17 — ALERTAS

**Tablas:** `alertas`, `reglas_alerta`, `canales_alerta`.

### Módulo 18 — REPORTES

Sin tablas nuevas. Consultas sobre tablas existentes.

### Módulo 19 — AUDITORÍA

**Tablas:** `auditoria`, `auditoria_cambios`.

### Módulo 20 — ASISTENCIA PERSONAL

**Tablas:** `asistencia`, `horas_extra`.

### Módulo 21 — RENIEC

Sin tablas. Solo `ReniecService::consultar($dni)` en producción.

---

## 📝 Decisiones técnicas tomadas

| # | Decisión | Razón |
|---|----------|-------|
| D1 | Yape/Plin/Depósito Dueña NO entran a caja | Dinero va a cuenta personal de la dueña |
| D2 | Cobro de reserva en 2 pasos | Modal de cobro al crear reserva |
| D3 | Catálogos dinámicos | Métodos de pago y categorías vienen de BD |
| D4 | Precios con IGV incluido | Regla de negocio peruana |
| D5 | Buffer de limpieza = 30 min | Configurable |
| D6 | Tolerancia No-Show = 60 min | Configurable |
| D7 | Al anular pago se revierte caja | PagoService lo maneja |
| D8 | Estado de habitación en vivo | `EstadoHabitacionService` |
| D9 | RENIEC solo en producción | Ahorro de costos |
| D10 | Visitas se incrementan en walk-in/check-in | `ClienteVisitaService` |
| D11 | Vuelto se entrega al final, no al inicio | Cliente puede consumir/usar horas extra |
| D12 | Cambio de habitación mantiene `fecha_inicio` | No se resetea el tiempo |
| D13 | Al cambiar hab, la vieja va a LIMPIEZA | El personal debe verificar |
| D14 | Si no hay tarifa exacta → usar la más chica | Adaptación automática |
| D15 | `reserva_ajustes` registra todos los cambios | Auditoría |
| D16 | `reserva_consumos` descuenta stock | R41 |
| D17 | Múltiples pagos por reserva | Permite adelanto + saldo + consumos |
| **D18** | **Vuelto como pago NEGATIVO** | Cero migraciones + trazabilidad completa |
| **D19** | **`pagado` = SUM(pagos) con negativos** | Refleja realidad neta |
| **D20** | **NO usar `$appends` para atributos dinámicos** | Rompe serialización de colecciones |
| **D21** | **Permitir pago parcial** | Realidad del negocio (cliente sin sencillo) |
| **D22** | **1 cliente = 1 reserva activa** | Evita duplicidad en reportes |
| **D23** | **Pago mixto con array `pagos[]`** | Trazabilidad por método |

---

## 🚨 Bugs resueltos (histórico)

1. **Bug Rol update/delete** → `apiResource` generaba `{role}`, no `{rol}`. Fix: `->parameters(['roles' => 'rol'])`.
2. **Bug vuelto no se guardaba** → frontend mandaba `Math.min(adelanto, total)`. Fix: quitar el `min()`.
3. **Bug visitas no incrementaban** → faltaba llamar `ClienteVisitaService::registrar()`. Fix: agregado.
4. **Bug limpieza no se creaba al check-out** → no existía la tabla. Fix: creada + insert.
5. **Bug cambio habitación reseteaba tiempo** → se creaba nueva ocupación con `now()`. Fix: usar `$ocupacion->fecha_inicio` original.
6. **Bug 422 al cambiar habitación** → no había tarifa de las mismas horas. Fix: buscar la más chica disponible.
7. **Bug "No hay tarifa"** → Jacuzzi VIP tiene 8h/12h, no 6h. Fix: adaptar automáticamente.
8. **Bug extensiones 500 "Class not found"** → faltaba `use` de `ExtensionReserva` y `Configuracion`. Fix: agregados.
9. **Bug historial de extensiones** → no restaba las ya aplicadas. Fix: `minutos_exceso_pendiente = total - ya_cubiertos`.
10. **Bug wording "ya cobrado"** → ambiguo. Fix: "ya aplicado" con desglose pagado/cargado.
11. **Bug cálculo de horas extra** → no respetaba la tolerancia. Fix: `ceil((exceso - tolerancia) / 60)`.
12. **Bug 500 en `/clientes` por `$appends = ['reserva_activa']`** → Laravel buscaba `getReservaActivaAttribute()` que no existía. **Fix: remover `$appends`, usar `setAttribute()` + `getAttribute()` en Controller.**
13. **Bug 500 en `/clientes/buscar` por `$appends`** → mismo caso. Fix: idem.
14. **Bug pagos mixtos NO se guardaban** → `crearWalkIn()` solo creaba pago si `isset($datos['id_metodo_pago'])`, pero en modo mixto viene `pagos[]` (sin `id_metodo_pago`). **Fix: agregar validación de `$tienePagosMixtos` + `foreach ($pagosMixtos)` en Service + agregar `'pagos' => 'nullable|array'` y `'pagos.*.*'` en Controller.**
15. **Bug "No hay vuelto pendiente"** → `entregarVuelto()` calculaba SUM(pagos) pero los pagos mixtos nunca se guardaron. Fix: idem al #14.
16. **Bug `$total` indefinido en `agregarPago` y `anularPago`** → bloque duplicado usaba `$total` que no existía en ese scope. Fix: usar `$reserva->total`.
17. **Bug `validation.unique` al reintentar walk-in** → si falla el walk-in después de crear el cliente, al reintentar falla el `unique` del DNI. Fix: frontend debe manejar el caso (pendiente).

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
**Módulos completados:** 09A, 09C, OBS, PAGOS + 01-08 (11 de 21)
````

---

## 📸 Pegame:

1. **Screenshot del README.md** guardado
2. **¿Guardaste bien?** (Ctrl+S)

**Después seguimos con lo que elijas:**
- 🅰️ Módulo 14 — LIMPIEZA (frontend, es rápido)
- 🅱️ Módulo 09B — RESERVAS FUTURAS
- 🅲 Otra cosa

**¿Dale?** 🚀
## 🔧 MÓDULO 15 — MANTENIMIENTO (✅ CERRADO)

### Visión general

Sistema para registrar y gestionar **reparaciones** de habitaciones (pintura, plomería, jacuzzi roto, etc.). La habitación queda **BLOQUEADA** hasta que se resuelva. Al resolver → se crea **LIMPIEZA automática**.

**No confundir:**
- **Inactiva** → permanentemente desactivada (ej: 208 = almacén)
- **Mantenimiento** → temporalmente bloqueada por reparación

### Tablas

#### `tipos_mantenimiento` (CRUD, 8 filas)
`id_tipo_mantenimiento`, `nombre` UNIQUE, `slug` UNIQUE, `descripcion`, `icono` (Lucide name), `color`, `orden`, `activo`.

**Semilla:**
| id | nombre | slug | icono | color |
|----|--------|------|-------|-------|
| 1 | Eléctrico | electrico | zap | #f59e0b |
| 2 | Plomería | plomeria | droplets | #06b6d4 |
| 3 | Jacuzzi | jacuzzi | bath | #7c3aed |
| 4 | Muebles | muebles | sofa | #a855f7 |
| 5 | Pintura | pintura | paintbrush | #ec4899 |
| 6 | Aire Acondicionado | aire-acondicionado | wind | #0ea5e9 |
| 7 | Cerraduras | cerraduras | key | #64748b |
| 8 | Otro | otro | wrench | #6b7280 |

#### `prioridades_mantenimiento` (CRUD, 4 filas)
`id_prioridad`, `nombre` UNIQUE, `slug` UNIQUE, `color`, `orden`, `activo`.

**Semilla:**
| id | nombre | slug | color | orden |
|----|--------|------|-------|-------|
| 1 | Baja | baja | #10b981 | 1 |
| 2 | Media | media | #f59e0b | 2 |
| 3 | Alta | alta | #ef4444 | 3 |
| 4 | Urgente | urgente | #dc2626 | 4 |

#### `mantenimiento` (registros)
`id_mantenimiento`, `id_habitacion` FK, `id_tipo_mantenimiento` FK, `id_prioridad` FK, `id_usuario_reporta` FK, `id_usuario_asignado` FK NULL, `descripcion` TEXT, `estado` ENUM('REPORTADO','EN_PROCESO','RESUELTO','CANCELADO'), `fecha_reporte` DATETIME, `fecha_inicio` NULL, `fecha_resolucion` NULL, `observaciones` TEXT, `motivo_cancelacion` TEXT.

**Índices:** `id_habitacion`, `estado`, `(id_habitacion, estado)`.

### Flujo de estados

```
REPORTADO  →  EN_PROCESO  →  RESUELTO
   ↓             ↓             ↓
Recién         Alguien       Al resolver
creado         lo tomó       → Crea LIMPIEZA automática

        ↘  CANCELADO (no era necesario)
```

### Comportamiento clave

- **Al CREAR un reporte:** la habitación queda bloqueada → `EstadoHabitacionService` devuelve `Mantenimiento` (#f97316 naranja). Tiene **prioridad sobre Limpieza** en el cálculo.
- **Al RESOLVER:** se crea una fila automática en `limpieza` (porque después de reparar hay que limpiar).
- **NO se puede crear 2 reportes activos** en la misma habitación.
- **Solo se pueden reportar** habitaciones en estado `Disponible` (no ocupadas, no limpieza, no mantenimiento).
- **Roles permitidos:** admin, encargado, recepcionista.
- **Roles solo-lectura:** limpieza, cajero.

### Endpoints Módulo 15

**Tipos (8 endpoints):**
```
GET    /api/tipos-mantenimiento
GET    /api/tipos-mantenimiento/activos
GET    /api/tipos-mantenimiento/{id}
POST   /api/tipos-mantenimiento
PUT    /api/tipos-mantenimiento/{id}
PATCH  /api/tipos-mantenimiento/{id}/desactivar
PATCH  /api/tipos-mantenimiento/{id}/reactivar
DELETE /api/tipos-mantenimiento/{id}
```

**Prioridades (8 endpoints):**
```
GET    /api/prioridades-mantenimiento
GET    /api/prioridades-mantenimiento/activos
GET    /api/prioridades-mantenimiento/{id}
POST   /api/prioridades-mantenimiento
PUT    /api/prioridades-mantenimiento/{id}
PATCH  /api/prioridades-mantenimiento/{id}/desactivar
PATCH  /api/prioridades-mantenimiento/{id}/reactivar
DELETE /api/prioridades-mantenimiento/{id}
```

**Mantenimiento (registros):**
```
GET    /api/mantenimiento
GET    /api/mantenimiento/pendientes        → { pendientes: [...], total_pendientes: N }
GET    /api/mantenimiento/habitacion/{id}
GET    /api/mantenimiento/{id}
POST   /api/mantenimiento
PATCH  /api/mantenimiento/{id}/iniciar
PATCH  /api/mantenimiento/{id}/resolver
PATCH  /api/mantenimiento/{id}/cancelar
DELETE /api/mantenimiento/{id}
```

### Integración con `EstadoHabitacionService`

**Orden de prioridad del cálculo de estado:**

1. Si `habitacion.activo = false` → **Inactiva** (#475569)
2. Si hay mantenimiento REPORTADO/EN_PROCESO → **Mantenimiento** (#f97316) ⬅️ **NUEVO**
3. Si hay limpieza PENDIENTE/EN_PROCESO → **Limpieza** (#06b6d4)
4. Si hay ocupación activa ahora → **Ocupada** / **Por vencer** / **Vencida**
5. Si hay ocupación futura → **Reservada** (#7c3aed)
6. Si no → **Disponible** (#10b981)

**El `habitaciones-mapa` devuelve campos extra cuando está en mantenimiento:**
```json
{
  "estado": "Mantenimiento",
  "color": "#f97316",
  "id_mantenimiento": 5,
  "mantenimiento_tipo": "Jacuzzi",
  "mantenimiento_descripcion": "No calienta el agua",
  "mantenimiento_prioridad": "Alta",
  "mantenimiento_prioridad_color": "#ef4444",
  "mantenimiento_estado": "EN_PROCESO",
  "mantenimiento_fecha_reporte": "2026-10-04T...",
  "mantenimiento_asignado": "Juan Pérez"
}
```

### Servicios clave

- `TipoMantenimientoService` — CRUD estándar
- `PrioridadMantenimientoService` — CRUD estándar
- `MantenimientoService` — lógica completa:
  - `listar()`, `listarPendientes()`, `listarPorHabitacion()`
  - `crear($datos, $idUsuario)` → valida que no haya otro activo
  - `iniciar($id, $idUsuario)` → auto-asigna al usuario que inicia
  - `resolver($id, $idUsuario, $obs)` → **crea limpieza automática**
  - `cancelar($id, $idUsuario, $motivo)`
  - `tieneMantenimientoActivo($idHabitacion)` → usado por `EstadoHabitacionService`
  - Validación de roles: `['admin', 'encargado', 'recepcionista']`

---

## 🛒 MÓDULO CONSUMOS MÚLTIPLES (✅ CERRADO)

### Visión general

Permite agregar **N productos en una sola operación** con soporte para:
- Todo a cuenta (paga al retirarse)
- Pago único (1 método)
- Pago parcial / mixto (varios métodos o pago incompleto)

Reemplaza al modal simple anterior (`AgregarConsumoModal`).

### Nuevo endpoint

```
POST /api/reservas/{id}/consumos-multiple
```

**Body:**
```json
{
  "consumos": [
    { "id_producto": 11, "cantidad": 1 },
    { "id_producto": 13, "cantidad": 2 }
  ],
  "pagos": [
    { "id_metodo_pago": 1, "monto": 20 },
    { "id_metodo_pago": 3, "monto": 30 }
  ],
  "cargar_a_cuenta": true,
  "observaciones": "Cliente pidió pago mixto"
}
```

**Response:**
```json
{
  "mensaje": "Consumos agregados correctamente",
  "data": { /* Reserva completa con consumos y pagos */ }
}
```

### Lógica del Service

```php
public function agregarConsumosMultiple(
    int $idReserva,
    array $consumos,      // [['id_producto' => X, 'cantidad' => Y], ...]
    array $pagos,         // [['id_metodo_pago' => X, 'monto' => Y], ...]
    bool $cargarACuenta,  // true → el saldo no pagado va a monto_consumos
    int $idUsuario,
    ?string $observaciones
): Reserva
```

**Pasos:**
1. **Validar stock de TODOS los productos** antes de crear nada (transacción atómica)
2. Crear N `ReservaConsumo` con `pagado = false`
3. Descontar stock de cada uno
4. Crear N `PagoReserva` (si hay pagos)
5. **`cargar_a_cuenta = true`:** el saldo (`total - pagado`) se suma a `monto_consumos`
6. **`cargar_a_cuenta = false`:** si el pago no cubre el total → error 422
7. Recalcular `total`, `pagado`, `saldo` de la reserva

### Reglas de negocio

- **R-CONS-1:** Transacción atómica — si falla un producto, no se crea NINGUNO
- **R-CONS-2:** Validar stock de TODOS antes de crear (no parcialmente)
- **R-CONS-3:** Si `cargar_a_cuenta = true`, el saldo pendiente se suma a `monto_consumos`
- **R-CONS-4:** Si `cargar_a_cuenta = false` y hay saldo → error 422
- **R-CONS-5:** Cada pago se registra individualmente en `pagos_reserva`
- **R-CONS-6:** Reutiliza la lógica de pagos mixtos del walk-in

### Ejemplo real

**Cliente pide:**
- 1 Chilcano (S/ 45)
- 2 Galletas (S/ 5 total)
- Total: S/ 50

**Caso 1 — Todo a cuenta:**
```json
{
  "consumos": [
    { "id_producto": 11, "cantidad": 1 },
    { "id_producto": 13, "cantidad": 2 }
  ],
  "cargar_a_cuenta": true
}
```
→ `reserva_consumos`: 2 filas con `pagado = false`
→ `reserva.monto_consumos += 50`
→ `reserva.total += 50`

**Caso 2 — Pago único (S/ 30 efectivo):**
```json
{
  "consumos": [...],
  "pagos": [{ "id_metodo_pago": 1, "monto": 30 }],
  "cargar_a_cuenta": true
}
```
→ `reserva_consumos`: 2 filas
→ `pagos_reserva`: 1 fila (S/ 30 Efectivo)
→ `reserva.monto_consumos += 20` (saldo no cubierto)
→ `reserva.pagado += 30`

**Caso 3 — Pago mixto (S/ 20 Yape + S/ 30 Efectivo = S/ 50):**
```json
{
  "consumos": [...],
  "pagos": [
    { "id_metodo_pago": 3, "monto": 20 },
    { "id_metodo_pago": 1, "monto": 30 }
  ],
  "cargar_a_cuenta": true
}
```
→ `reserva_consumos`: 2 filas
→ `pagos_reserva`: 2 filas
→ `reserva.monto_consumos += 0` (todo cubierto)
→ `reserva.pagado += 50`

---

## 🎯 Reglas de negocio globales (R1-R71 + RG-* + R-DINERO-* + R-PAGO-* + OBS-* + R-CONS-*)

### Reservas (Módulo 09)
- **R1** Habitación alquilada no se re-alquila hasta liberación
- **R2** Reserva Pendiente/Confirmada bloquea en su rango
- **R3** Sistema rechaza reservas que se crucen
- **R4** Buffer de limpieza configurable (30 min default)
- **R5** Salida anticipada no devuelve dinero pero libera antes
- **R6** No-Show libera bloqueo y retiene adelanto
- **R7** DNI genera Boleta, RUC genera Factura

### Habitaciones
- **R8** Estado se calcula en vivo (NO se guarda)
- **R9** Al check-out pasa a Limpieza automáticamente
- **R10** Se libera cuando limpieza termina
- **R11** En Limpieza no se puede alquilar
- **R12** En Mantenimiento no se puede alquilar

### Extensiones
- **R13** Máximo de horas extra según tipo (3 por defecto)
- **R14** Al exceder máximo → turno adicional
- **R15** Turno adicional cuesta el bloque completo
- **R16** Cada extensión se registra en `extensiones_reserva`
- **R54** Tolerancia configurable (default 30 min)
- **R55** Horas extra = `ceil((exceso - tolerancia) / 60)`
- **R56** Precio hora extra viene de `tarifas`
- **R57** Máximo horas extra viene de `tarifas`
- **R58** Excede máximo → ofrecer turno adicional
- **R59** Cada extensión se registra (auditoría)
- **R60** Múltiples extensiones permitidas
- **R61** Cálculo resta extensiones ya aplicadas
- **R62** Formas de pago: cargar a cuenta o pagar ahora
- **R63** Se puede "no cobrar" con observación
- **R64** Precios y tolerancia NO se hardcodean

### Caja (Módulo 11)
- **R17** Solo 1 caja abierta a la vez
- **R18** Todo movimiento pertenece a caja abierta
- **R19** Vuelto NO es egreso
- **R20** Movimientos no se borran, se anulan
- **R21** Si hay diferencia → observación obligatoria
- **R22** Arqueo por método de pago
- **R23** Egresos requieren responsable

### IGV y Comprobantes (Módulo 16)
- **R24** Precios incluyen IGV
- **R25** IGV = 18% (configurable)
- **R26** Base = Total / 1.18
- **R27** Redondeo al final
- **R28** Boleta puede mostrar solo total
- **R29** Factura discrimina Base + IGV
- **R30** Cada comprobante consume correlativo
- **R31** Series B001, F001, NC01, ND01

### Clientes
- **R32** Al reservar: DNI + nombre + celular
- **R33** Los demás datos se enriquecen después
- **R34** Nivel según visitas
- **R35** Descuento por nivel se aplica automáticamente
- **R-CLI-7:** 1 cliente = 1 reserva activa

### Promociones
- **R36** Por defecto se aplica la mejor promo
- **R37** Solo acumulables se suman
- **R38** Uso se registra en `promociones_cliente`

### ⚡ R39 — Métodos "de dueña" NO entran a caja
Los métodos con `es_de_caja = false` NO se registran en `movimientos_caja`.

### Inventario
- **R40** Cada movimiento → kardex
- **R41** Consumo descuenta stock ✅
- **R42** Stock bajo → alerta
- **R43** Inventario físico → ajustes

### Alertas
- **R44-R47** Cronjob + WebSocket + anti-duplicados

### Auditoría
- **R48-R50** Todo cambio sensible se audita con IP + user-agent

### Productos
- **R51-R53** Stock bajo, no eliminar productos/proveedores con dependencias

### ⚡ R-DINERO-1 a R-DINERO-5 — Vuelto
- **R-DINERO-1:** Vuelto = pago negativo en `pagos_reserva`
- **R-DINERO-2:** `pagado = SUM(pagos.monto WHERE anulado = false)`
- **R-DINERO-3:** Se puede entregar parcial
- **R-DINERO-4:** Se pide método de devolución
- **R-DINERO-5:** `vuelto_entregado` deprecado

### ⚡ R-PAGO-1 a R-PAGO-4 — Pagos mixtos
- **R-PAGO-1:** N pagos con distintos métodos para misma reserva
- **R-PAGO-2:** Frontend envía array `pagos[]`
- **R-PAGO-3:** Controller valida `pagos.*.id_metodo_pago` y `pagos.*.monto`
- **R-PAGO-4:** Service itera + recalcula `pagado`

### ⚡ OBS-1 a OBS-5 — Observaciones cliente
- **OBS-1:** 1+ obs → banner rojo
- **OBS-2:** 2+ obs → "CLIENTE NO GRATO"
- **OBS-3:** Tipo bloqueo/crítica → "CLIENTE VETADO"
- **OBS-4:** PATCH `/resolver`
- **OBS-5:** Backend expone `observaciones_pendientes`

### Configuraciones (R65-R67)
- **R65:** Parámetros globales viven en tabla `configuraciones`
- **R66:** Cambiar una config aplica al instante
- **R67:** Parámetros iniciales: tolerancia, buffer, no-show, IGV, moneda

### Limpieza (R68-R71)
- **R68:** Al check-out → INSERT en `limpieza`
- **R69:** Al cambiar habitación → limpieza para la vieja
- **R70:** Vuelve a Disponible solo cuando se completa
- **R71:** Limpieza tiene prioridad sobre Disponible

### ⚡ MANT-1 a MANT-8 — Mantenimiento
- **MANT-1:** Solo se reporta en habitaciones `Disponible`
- **MANT-2:** No se puede crear 2 reportes activos en la misma habitación
- **MANT-3:** Al crear → habitación queda bloqueada (estado `Mantenimiento`)
- **MANT-4:** Al iniciar → auto-asigna al usuario que inicia
- **MANT-5:** Al resolver → crea `limpieza` automáticamente
- **MANT-6:** Al cancelar → se registra el motivo
- **MANT-7:** Tipos y prioridades son CRUD (NO hardcodeados)
- **MANT-8:** Roles permitidos: admin, encargado, recepcionista

### ⚡ R-CONS-1 a R-CONS-6 — Consumos múltiples
- **R-CONS-1:** Transacción atómica (todo o nada)
- **R-CONS-2:** Validar stock de TODOS antes de crear
- **R-CONS-3:** `cargar_a_cuenta = true` → saldo se suma a `monto_consumos`
- **R-CONS-4:** `cargar_a_cuenta = false` + saldo → error 422
- **R-CONS-5:** Cada pago se registra en `pagos_reserva`
- **R-CONS-6:** Reutiliza lógica de pagos mixtos

### Reglas propias del Hospedaje (RG-*)
- **RG1** Al alquilar, SIEMPRE debe pagar la habitación completa
- **RG2** El vuelto puede quedar como saldo a favor
- **RG3** El vuelto se descuenta automáticamente con consumos/horas extra
- **RG4** Al cambiar hab, la vieja va a LIMPIEZA
- **RG5** Al cambiar hab, el tiempo NO se resetea
- **RG6** Si no hay tarifa exacta, se ajusta a la más chica

---

## 🆕 REGLAS AGREGADAS EN MÓDULOS 14 Y 15

### Limpieza Rápida (masiva)
- **R72:** El recepcionista puede finalizar TODAS las limpiezas pendientes de una vez
- **R73:** Se registra el usuario que hizo la limpieza rápida
- **R74:** Solo para roles admin, encargado, limpieza
- **R75:** Las habitaciones pasan a `Disponible` inmediatamente

### Filtros de habitaciones en el mapa
- **R76:** Los filtros son en vivo (no se guardan en BD)
- **R77:** Filtros disponibles: Todos, Disponibles, Ocupadas, Por Vencer, Vencidas, Limpieza, Mantenimiento, Reservadas, Inactivas
- **R78:** "Ocupadas" agrupa Ocupada + Por Vencer + Vencida
- **R79:** "Vencidas" muestra solo las que excedieron el tiempo
- **R80:** Cada filtro muestra el contador en el chip

---

## 📝 Estructura de tablas (estado actual)

**Total acumulado:** ~38 tablas.

**Nuevas desde la última actualización:**
- `tipos_mantenimiento` (8 filas)
- `prioridades_mantenimiento` (4 filas)
- `mantenimiento` (0 filas iniciales)

**Sin migraciones adicionales para Consumos Múltiples** — se reutilizan `reserva_consumos` y `pagos_reserva`.

---

## 🎯 Estado actualizado del roadmap

| # | Módulo | Backend | Frontend | Estado |
|---|--------|---------|----------|--------|
| 01-08 | AUTH, CONFIG, TARIFAS, CLIENTES, PRODUCTOS, PROMOCIONES, DECORACIÓN, HABITACIONES | ✅ | ✅ | CERRADOS |
| 09A | RECEPCIÓN / WALK-IN | ✅ | ✅ | CERRADO |
| 09B | RESERVAS FUTURAS | ✅ | ⏳ | Backend listo |
| 09C | EXTENSIONES DE TIEMPO | ✅ | ✅ | CERRADO |
| **OBS** | **OBSERVACIONES CLIENTE** | ✅ | ✅ | **CERRADO** |
| **PAGOS** | **PAGOS MIXTOS + VUELTO** | ✅ | ✅ | **CERRADO** |
| **CONS** | **CONSUMOS MÚLTIPLES** | ✅ | ✅ | **CERRADO** |
| 10 | DECORACIONES APLICADAS | ⏳ | ⏳ | Pendiente |
| 11 | CAJA | ⏳ | ⏳ | Pendiente |
| 12 | INVENTARIO / KARDEX | ⏳ | ⏳ | Pendiente |
| 13 | CUENTAS POR PAGAR | ⏳ | ⏳ | Pendiente |
| 14 | LIMPIEZA | ✅ | ✅ | CERRADO |
| **15** | **MANTENIMIENTO** | ✅ | ✅ | **CERRADO** |
| 16 | COMPROBANTES SUNAT | ⏳ | ⏳ | Pendiente |
| 17 | ALERTAS | ⏳ | ⏳ | Pendiente |
| 18 | REPORTES | ⏳ | ⏳ | Pendiente |
| 19 | AUDITORÍA | ⏳ | ⏳ | Pendiente |
| 20 | ASISTENCIA PERSONAL | ⏳ | ⏳ | Pendiente |
| 21 | INTEGRACIÓN RENIEC | ⏳ | ⏳ | Pendiente |

**Módulos completados:** ~16 de 21

---

## 🚨 Bugs resueltos (histórico actualizado)

18. **Bug doble backslash en `EstadoHabitacionService.php`** → `use App\\Models\\Mantenimiento` (con `\\`). Fix: reemplazo masivo de `\\+` por `\`.

19. **Bug import `categoriaProductoService`** → estaba en `productoService.ts` pero el archivo existe separado. Fix: import desde `@/services/categoriaProductoService`.

20. **Bug `$appends = ['reserva_activa']`** → Laravel buscaba `getReservaActivaAttribute()` inexistente. Fix: remover `$appends`, usar `setAttribute()` + `getAttribute()` en Controller.

21. **Bug pagos mixtos no se guardaban** → `crearWalkIn()` solo creaba pago si `isset($datos['id_metodo_pago'])`. Fix: agregar validación de `$tienePagosMixtos` + `foreach`.

22. **Bug "No hay vuelto pendiente"** → `SUM(pagos) = 0` porque los pagos mixtos no se guardaron. Fix: usar `$reserva->pagado` en vez de `SUM(pagos)` para calcular vuelto.

23. **Bug `$total` indefinido en `agregarPago`/`anularPago`** → bloque duplicado usaba `$total`. Fix: usar `$reserva->total`.

24. **Bug 1 cliente en 2 habitaciones** → No había validación. Fix: `clienteTieneReservaActiva()` + validación en `crearWalkIn`/`crearReserva`.

25. **Bug PowerShell regex no matchea** → encoding UTF-8 vs BOM. Fix: usar `Get-Content | Where-Object { $_ -notmatch 'patrón' }`.

26. **Bug Vite parse error JSX** → `<span>` que abría y cerraba con `</span>` en vez de `</p>`. Fix: revisar cada apertura/cierre.

---

**Última actualización:** 05/10/2026
**Módulos completados:** ~16 de 21 (09A, 09B back, 09C, OBS, PAGOS, CONS, 14, 15)
¡Perfecto! 🎯 Te armo el bloque con **TODO lo que hicimos en esta sesión** para agregar al README del backend. Voy a ser **exhaustivo** para que quede documentado.

---

## 🚀 BLOQUE — Actualizar README backend

**Pegá esto en la terminal del backend:**

```powershell
# ============================================================================
# BACKEND — Actualizar README con TODO el avance de la sesión
# ============================================================================

cd C:\Users\David\Desktop\hospedaje\backend

$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
    param([string]$Path, [string]$Content)
    $full = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $Path))
    [System.IO.File]::WriteAllText($full, $Content, [System.Text.UTF8Encoding]::new($false))
}

Write-Host "`nAgregando seccion al README..." -ForegroundColor Yellow

$path = "README.md"
$contenido = Get-Content $path -Raw -Encoding UTF8

# Quitar el cierre viejo si ya estaba
$contenido = $contenido -replace '(?s)\r?\n---\r?\n\r?\n\*\*Última actualización:.*$', ''

$seccionNueva = @'


---

## 🆕 MÓDULO 09B — RESERVAS FUTURAS (BACKEND CERRADO)

### Visión general

Sistema que permite crear reservas para fechas/horas futuras. La reserva **bloquea** el rango de tiempo en `ocupacion_habitacion` desde que se crea. Se muestra morada en el mapa 4 horas antes (configurable). El check-in se hace **manualmente** desde el mapa.

**Reglas de oro:**
- Una reserva confirmada **bloquea el rango** desde su creación
- La habitación **NO se puede alquilar** a walk-in mientras haya reserva
- El check-in **NO es automático**: el recepcionista lo hace cuando el cliente llega
- Si el cliente llega tarde, **el tiempo cuenta desde la reserva original** (política del negocio)

### Tablas reutilizadas
- `reservas` (con `codigo_reserva` = `RES-XXXXXX`)
- `ocupacion_habitacion` (bloqueo real)
- `configuraciones` (parámetros: `horas_antes_bloqueo_reserva = 4`)

### Cambios clave

#### 1. `ConfiguracionSistemaSeeder`
Se agregó la config:
- `horas_antes_bloqueo_reserva = 4` (INT, grupo `reservas`)

#### 2. `DisponibilidadService`
**Nuevos métodos:**
- `habitacionesLibresConInfo(Carbon $inicio, Carbon $fin)` → devuelve habitaciones libres con relaciones (piso, tipo)
- `habitacionesConConflicto(Carbon $inicio, Carbon $fin)` → devuelve habitaciones con conflicto + motivo
- `obtenerConflicto(int $idHabitacion, Carbon $inicio, Carbon $fin, ?int $excluirReserva)` → devuelve el motivo del conflicto
- `bloquearHabitacion(int $idHabitacion)` → `lockForUpdate()` para race conditions

**Lógica de `estaDisponible()` actualizada (4 filtros):**
1. **Habitación activa** → si `activo = false` → NO disponible
2. **Sin mantenimiento** → si hay `Mantenimiento` en `REPORTADO` o `EN_PROCESO` → NO disponible
3. **Sin limpieza pendiente** → si hay `Limpieza` `PENDIENTE`/`EN_PROCESO` Y la reserva empieza en menos de X minutos (buffer) → NO disponible
4. **Sin ocupación que se cruce** → verifica el rango `[inicio - buffer, fin + buffer]`

**Motivos de bloqueo en orden de prioridad:**
1. `Habitacion inactiva`
2. `En mantenimiento ({tipo})`
3. `En limpieza (Pendiente)` o `En limpieza (En_proceso)`
4. `Ocupada por cliente actual` (walk-in con check-in)
5. `Reservada por otro cliente`
6. `Reserva pendiente de confirmar`

#### 3. `EstadoHabitacionService`
**Lógica de prioridades actualizada:**

```
1. Inactiva
2. Mantenimiento (REPORTADO / EN_PROCESO)
3. Limpieza (PENDIENTE / EN_PROCESO)
4. ✅ NUEVO: Reserva CONFIRMADA/PENDIENTE sin check-in
   ├── Con otra ocupación activa → Reservada-Urgente 🔴
   ├── Dentro de ventana de 4h → Reservada 🟣
   └── Fuera de ventana → Disponible 🟢 (con info de reserva_futura)
5. Ocupación activa CON check-in hecho → Ocupada / Por vencer / Vencida
6. Ocupación vencida CON check-in → Vencida
7. Disponible
```

**Campos nuevos en el JSON del mapa:**
- `minutos_para_entrada` (int)
- `alerta_reserva_ocupada` (bool)
- `cliente_actual` (string|null)
- `id_reserva_actual` (int|null)
- `reserva_futura` (objeto con id_reserva, codigo, cliente, fecha_entrada, minutos_para_entrada, horas_antes_bloqueo)

**CRÍTICO:** La reserva **SIN check-in** se muestra como `Reservada` (morado) **aunque ya haya pasado la hora de la reserva**. Esto es para que el recepcionista decida qué hacer (check-in o anular).

#### 4. `ReservaService`
**Nuevos métodos:**
- `listarProximasConAlerta()` → reservas dentro de la ventana de bloqueo (4h) + info de conflicto si la hab. está ocupada
- `listarHoy()` → reservas con fecha de entrada HOY
- `listarProximasCheckIn()` → reservas dentro de la tolerancia No-Show
- `procesarNoShow()` → marca como No-Show las reservas que pasaron la tolerancia
- `listarDisponiblesEnRango(Carbon $inicio, Carbon $fin, int $horas)` → SOLO habitaciones cuyo tipo tiene tarifa de esas horas exactas
- `listarConConflictoEnRango(Carbon $inicio, Carbon $fin)` → habitaciones con conflicto
- `listarSoloReservas()` → filtro `codigo LIKE 'RES-%'`
- `listarSoloWalkIns()` → filtro `codigo LIKE 'WK-%'`
- `listarHistorialCompleto()` → todas
- `obtenerInfoCheckIn(int $idReserva)` → info completa para la pantalla de check-in
- `checkInValidado(int $idReserva, int $idUsuario)` → check-in con validaciones

**`checkInValidado()` — Lógica completa:**
1. Valida que el estado sea `confirmada` o `pendiente`
2. Valida que NO tenga `registro_estadia` ya
3. Valida que la habitación NO esté ocupada por OTRA reserva activa
4. **NO cambia `fecha_entrada`** (mantiene la original de la reserva)
5. **NO cambia `fecha_salida_prevista`** (mantiene la original)
6. Cambia estado a `activa`
7. Crea `registro_estadia` con la **fecha original** (no la de llegada)
8. Registra la visita del cliente (ClienteVisitaService::registrar)

**`crearReserva()` — Mejoras:**
- Validación de cliente sin reserva activa
- Validación de pagos mixtos
- `lockForUpdate()` en la habitación

#### 5. `ReservaController`
**Nuevos endpoints:**

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/reservas/disponibles?fecha=X&horas=Y` | Habitaciones libres + con conflicto en un rango |
| GET | `/api/reservas/proximas` | Reservas dentro de la ventana de bloqueo |
| GET | `/api/reservas/hoy` | Reservas que llegan hoy |
| GET | `/api/reservas/proximas-check-in` | Reservas listas para check-in |
| GET | `/api/reservas/solo-reservas` | Solo códigos `RES-` |
| GET | `/api/reservas/solo-walk-ins` | Solo códigos `WK-` |
| GET | `/api/reservas/historial` | Historial completo |
| GET | `/api/reservas/{id}/info-check-in` | Info completa para check-in |
| POST | `/api/reservas/{id}/check-in-validado` | Check-in con validaciones |

#### 6. Command `ProcesarNoShowReservas`
**Nuevo archivo:** `app/Console/Commands/ProcesarNoShowReservas.php`
- Comando: `php artisan reservas:procesar-no-show`
- Registrado en `routes/console.php` como `Schedule::command('reservas:procesar-no-show')->everyMinute()`
- Marca como No-Show las reservas confirmadas que pasaron la tolerancia sin check-in

#### 7. Migración
**Nuevo:** `YYYY_MM_DD_HHmmss_add_unique_index_to_ocupacion_habitacion_table.php`
- Índice UNIQUE en `(id_habitacion, fecha_inicio, fecha_fin, estado)`
- Previene solapamientos exactos a nivel BD

### Reglas de negocio (Módulo 09B)

#### Al crear reserva
- **09B-1:** Validar disponibilidad (4 filtros)
- **09B-2:** Aplicar buffer de 30 min (configurable)
- **09B-3:** Bloqueo pesimista con `lockForUpdate()`
- **09B-4:** Estado inicial: `Confirmada` (o `Pendiente` si no pagó)
- **09B-5:** Cliente existente o nuevo (crear en 2 pasos)
- **09B-6:** 1 cliente = 1 reserva activa
- **09B-7:** Código único `RES-XXXXXX`

#### Estado visual en el mapa
- **09B-8:** La reserva es **morada** desde `fecha_entrada - 4h`
- **09B-9:** Si ya pasó la hora y NO hay check-in → **sigue morada**
- **09B-10:** Si la hab. está ocupada por otra reserva → **Reservada-Urgente** (rojo)
- **09B-11:** Fuera de la ventana → Disponible (con info `reserva_futura`)

#### Al hacer check-in
- **09B-12:** Manual (el recepcionista lo hace)
- **09B-13:** Solo si estado = `confirmada` / `pendiente`
- **09B-14:** Solo si NO está ocupada por OTRA reserva
- **09B-15:** **Mantiene la `fecha_entrada` ORIGINAL** (política del negocio)
- **09B-16:** **Mantiene la `fecha_salida_prevista` ORIGINAL**
- **09B-17:** Crea `registro_estadia` con fecha original
- **09B-18:** Registra la visita al cliente
- **09B-19:** Estado → `activa`, hab. → ROJA

#### Al anular
- **09B-20:** Si el cliente no llegó → se **anula** (no se cancela)
- **09B-21:** Cambia `ocupacion_habitacion.estado` a `CANCELADA`
- **09B-22:** Anula los pagos (no devuelve)

#### Al cancelar
- **09B-23:** Si el cliente canceló → `cancelada`
- **09B-24:** Libera ocupación
- **09B-25:** Guarda motivo

### Bugs resueltos en esta sesión (Módulo 09B)

| # | Bug | Fix |
|---|-----|-----|
| 1 | Reserva sin check-in se mostraba como **Ocupada** cuando pasaba la hora | `EstadoHabitacionService` ahora prioriza "reserva sin check-in" sobre "ocupación activa" |
| 2 | El check-in cambiaba `fecha_entrada` a la hora de llegada | `checkInValidado()` mantiene la fecha original |
| 3 | Habitaciones en **limpieza** aparecían como disponibles para reservar | `DisponibilidadService` filtra limpieza (si reserva <30 min) |
| 4 | Habitaciones **inactivas** aparecían como disponibles | `DisponibilidadService` filtra inactivas |
| 5 | Habitaciones en **mantenimiento** aparecían como disponibles | `DisponibilidadService` filtra mantenimiento activo |
| 6 | Filtro de duración no funcionaba (traía todas las habitaciones) | `listarDisponiblesEnRango()` ahora recibe `$horas` y filtra por tarifa exacta |
| 7 | Cliente nuevo no se podía crear en reserva futura | `NuevaReservaPage` permite crear cliente inline |
| 8 | `ClienteForm.tsx` con error TS por `buscarPorDni` | Fix: destructurar `{ cliente }` del response |
| 9 | `ClienteVisitaService` sin métodos CRUD | Agregados: `listarPorCliente`, `obtener`, `crear`, `actualizar`, `eliminar` |
| 10 | `CheckInReservaPage` con `ocupacion: null` crasheaba | Optional chaining `h.ocupacion?.cliente` |
| 11 | Checkout sin check-in daba 422 | `CheckoutPage` ahora detecta `sinCheckIn` y bloquea el botón |

### Archivos modificados en esta sesión

**Backend:**
- `database/seeders/ConfiguracionSistemaSeeder.php` (+1 config)
- `app/Services/DisponibilidadService.php` (reescrito: 4 filtros + métodos nuevos)
- `app/Services/EstadoHabitacionService.php` (reescrito: prioridad reserva > ocupación)
- `app/Services/ReservaService.php` (+15 métodos nuevos)
- `app/Services/ClienteVisitaService.php` (+5 métodos CRUD)
- `app/Http/Controllers/ReservaController.php` (+8 endpoints)
- `routes/api.php` (+8 rutas)
- `routes/console.php` (+schedule No-Show)
- `app/Console/Commands/ProcesarNoShowReservas.php` (NUEVO)
- `database/migrations/YYYY_MM_DD_HHmmss_add_unique_index_to_ocupacion_habitacion_table.php` (NUEVO)

### Estado actual del roadmap

| # | Módulo | Backend | Frontend | Estado |
|---|--------|:---:|:---:|:---:|
| 09A | Recepción / Walk-in | ✅ | ✅ | CERRADO |
| **09B** | **Reservas Futuras** | ✅ | ✅ | **CERRADO** |
| 09C | Extensiones de Tiempo | ✅ | ✅ | CERRADO |
| OBS | Observaciones Cliente | ✅ | ✅ | CERRADO |
| PAGOS | Pagos Mixtos + Vuelto | ✅ | ✅ | CERRADO |
| CONS | Consumos Múltiples | ✅ | ✅ | CERRADO |
| 14 | Limpieza | ✅ | ✅ | CERRADO |
| 15 | Mantenimiento | ✅ | ✅ | CERRADO |

### Endpoints totales del Módulo 09

```
GET    /api/reservas
POST   /api/reservas
POST   /api/reservas/walk-in
GET    /api/reservas/disponibles
GET    /api/reservas/proximas
GET    /api/reservas/hoy
GET    /api/reservas/proximas-check-in
GET    /api/reservas/solo-reservas
GET    /api/reservas/solo-walk-ins
GET    /api/reservas/historial
GET    /api/reservas/{id}
GET    /api/reservas/{id}/info-check-in
PATCH  /api/reservas/{id}/check-in
POST   /api/reservas/{id}/check-in-validado
PATCH  /api/reservas/{id}/check-out
PATCH  /api/reservas/{id}/check-out-con-vuelto
PATCH  /api/reservas/{id}/check-out-con-deuda
PATCH  /api/reservas/{id}/cancelar
PATCH  /api/reservas/{id}/anular
PATCH  /api/reservas/{id}/cambiar-habitacion
POST   /api/reservas/{id}/consumos
POST   /api/reservas/{id}/consumos-multiple
DELETE /api/reservas/{id}/consumos/{idConsumo}
POST   /api/reservas/{id}/pagos
DELETE /api/reservas/{id}/pagos/{idPago}
POST   /api/reservas/{id}/entregar-vuelto
GET    /api/reservas/{id}/calculo-extension
GET    /api/reservas/{id}/extensiones
POST   /api/reservas/{id}/extensiones
```

---

## 🎯 PENDIENTE PARA PRÓXIMAS SESIONES

### Fase 2 — Reservas Futuras
- ⏳ **Banner "Reservas en riesgo"** en `RecepcionPage` (si hay reservas próximas con hab. ocupada)
- ⏳ **Notificación push** al recepcionista cuando hay conflicto
- ⏳ **Cronjob** con `lockForUpdate()` para No-Show
- ⏳ **Modal de cambio de habitación** desde check-in

### Módulos pendientes
- ⏳ Módulo 10 — Decoraciones Aplicadas
- ⏳ Módulo 11 — Caja
- ⏳ Módulo 12 — Inventario / Kardex
- ⏳ Módulo 13 — Cuentas por Pagar (falta cerrar)
- ⏳ Módulo 16-21

---

**Última actualización:** 06/10/2026
**Módulos completados:** 17 de 21 (09A, 09B, 09C, OBS, PAGOS, CONS, 14, 15 + 01-08)
'@

$contenido = $contenido.TrimEnd() + $seccionNueva

Write-Utf8NoBom $path $contenido
Write-Host "  OK README.md actualizado" -ForegroundColor Green
Write-Host ""
Write-Host "Contenido agregado:" -ForegroundColor Yellow
Write-Host "  - Modulo 09B completo (backend)" -ForegroundColor White
Write-Host "  - Reglas de negocio 09B-1 a 09B-25" -ForegroundColor White
Write-Host "  - Bugs resueltos en la sesion (11 bugs)" -ForegroundColor White
Write-Host "  - Archivos modificados" -ForegroundColor White
Write-Host "  - Endpoints nuevos" -ForegroundColor White
Write-Host "  - Estado del roadmap actualizado" -ForegroundColor White
Write-Host ""
```

---

## 📸 Después de pegar:

**Pegame:**
1. **Output** (debería decir "README.md actualizado")
2. Abrí el README y confirmá que la sección se agregó al final

---

## 🎯 Ahora respondeme las 2 preguntas pendientes:

1. **¿Movemos la 501 al Piso 5?** (con Tinker)
2. **¿Arreglamos `HabitacionForm.tsx`** para que preseleccione el piso filtrado?

Para la 2, pegame:
```powershell
cd C:\Users\David\Desktop\hospedaje\frontend
Get-Content src\pages\configuracion\habitacion\HabitacionForm.tsx
```

**¿Dale?** 🚀
🚀 BLOQUE 1 — Actualizar README backend
Pegá esto en la terminal del backend:

powershell
# ============================================================================
# BACKEND — Actualizar README con TODO el avance del 07/10/2026
# ============================================================================

cd C:\Users\David\Desktop\hospedaje\backend

$ErrorActionPreference = "Stop"

function Write-Utf8NoBom {
    param([string]$Path, [string]$Content)
    $full = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $Path))
    [System.IO.File]::WriteAllText($full, $Content, [System.Text.UTF8Encoding]::new($false))
}

Write-Host "`nActualizando README backend..." -ForegroundColor Yellow

$path = "README.md"
$contenido = Get-Content $path -Raw -Encoding UTF8

# Quitar el cierre viejo si ya estaba
$contenido = $contenido -replace '(?s)\r?\n---\r?\n\r?\n\*\*Última actualización:.*$', ''

$seccionNueva = @'


---

## 🆕 MÓDULO 10 — DECORACIONES APLICADAS (CERRADO)

### Visión general

Sistema completo para gestionar decoraciones aplicadas a reservas. Incluye:
- Catálogo de paquetes de decoración (Módulo 07)
- Estados dinámicos (programada, en-proceso, finalizada, cancelada)
- Cálculo de horas extra según duración de la reserva
- CuentaPagar automática al proveedor
- Prefijo `DEC-` para distinguir reservas con decoración
- Color rosa en el mapa para reservas con decoración

### Modelo de negocio

**El paquete de decoración INCLUYE el alquiler de la habitación.**
Ejemplo Paquete 1 (Suite VIP, 8h):
├── Cliente paga: S/ 199
├── Ganancia LOCAL (hospedaje): S/ 100 (cubre alquiler + ganancia)
└── Ganancia PROVEEDOR: S/ 99 (CuentaPagar)

text

**Con horas extra:**
Ejemplo Paquete 1 (Suite VIP, 12h):
├── Paquete base 8h: S/ 199
├── Horas extra: 12 - 8 = 4h × S/ 10 = S/ 40
├── Total cliente: S/ 199 + 40 = S/ 239
├── Ganancia LOCAL: 100 + 40 = S/ 140
└── Ganancia PROVEEDOR: S/ 99 (sin cambio)

text

### Tablas

#### `decoraciones` (nueva)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id_decoracion | PK | |
| id_reserva | FK → reservas | |
| id_paquete | FK → paquetes_decoracion | |
| id_proveedor | FK NULL → proveedores | |
| estado | ENUM('programada','en-proceso','finalizada','cancelada') | |
| fecha_programada | DATETIME | Cuando el cliente la quiere |
| fecha_inicio_preparacion | DATETIME NULL | 24h antes |
| fecha_inicio | DATETIME NULL | Cuando el proveedor empieza |
| fecha_fin | DATETIME NULL | Cuando termina |
| precio_total | DECIMAL(10,2) | |
| ganancia_local | DECIMAL(10,2) | |
| ganancia_proveedor | DECIMAL(10,2) | |
| adelanto | DECIMAL(10,2) | |
| saldo | DECIMAL(10,2) | |
| frase_personalizada | TEXT NULL | |
| musica | VARCHAR(100) NULL | |
| notas | TEXT NULL | |
| id_cuenta_pagar | FK NULL → cuentas_por_pagar | |
| id_usuario_creacion | FK → usuarios | |
| id_usuario_anulacion | FK NULL | |
| fecha_anulacion | DATETIME NULL | |
| motivo_anulacion | VARCHAR(255) NULL | |
| timestamps | | |

#### `paquetes_decoracion` (modificada)
**Nuevo campo:**
- `precio_hora_adicional` DECIMAL(10,2) → cuánto se cobra por cada hora extra

### Semilla de paquetes (CORREGIDA)

| # | Nombre | Tipo Hab. | 8h Total | Local | Proveedor | Hora Adic. |
|---|--------|-----------|----------|-------|-----------|-----------|
| 1 | Romántico N°1 | Jacuzzi VIP | S/ 199 | S/ 100 | S/ 99 | S/ 10 |
| 2 | Romántico N°2 | Jacuzzi VIP | S/ 199 | S/ 100 | S/ 99 | S/ 10 |
| 3 | Estelar N°3 | Jacuzzi Estelar | S/ 259 | S/ 130 | S/ 129 | S/ 15 |
| 4 | Romántico N°4 | Romántica | S/ 159 | S/ 60 | S/ 99 | S/ 5 |
| 5 | Fantasía N°5 | Safari | S/ 159 | S/ 70 | S/ 89 | S/ 5 |

**Paquete 6 (Aniversario) fue ELIMINADO.**

### Fórmula de cálculo (en `DecoracionService::crear`)

```php
$horasExtra = max(0, $reserva->horas_base - $paquete->horas_incluidas);
$montoExtra = $horasExtra * $paquete->precio_hora_adicional;

$precioTotal    = $paquete->precio_total + $montoExtra;
$gananciaLocal  = $paquete->ganancia_local + $montoExtra;  // extra va al hospedaje
$gananciaProveedor = $paquete->ganancia_proveedor;  // el proveedor cobra lo mismo
Prefijos de reserva
Prefijo	Tipo
WK-	Walk-in (cliente físico)
RES-	Reserva normal
DEC-	Reserva con decoración
generarCodigoReserva() decide el prefijo según $datos['con_decoracion'].

Endpoints
Estados de decoración: (eliminados, ahora hardcoded en el enum)

~~/estados-decoracion~~ (eliminado)

Decoraciones aplicadas:

text
GET    /api/decoraciones
GET    /api/decoraciones/activas
GET    /api/decoraciones/proximas
GET    /api/decoraciones/por-reserva/{idReserva}
GET    /api/decoraciones/por-proveedor/{idProveedor}
GET    /api/decoraciones/{id}
POST   /api/decoraciones
PUT    /api/decoraciones/{id}
PATCH  /api/decoraciones/{id}/estado
POST   /api/decoraciones/{id}/adelanto
PATCH  /api/decoraciones/{id}/anular
DELETE /api/decoraciones/{id}
Reservas decoradas:

text
GET /api/reservas/solo-decoraciones     → filtro DEC-
Reglas de negocio (Módulo 10)
Al crear decoración
R-DEC-1: El paquete ya incluye la habitación (NO se cobra tarifa aparte)

R-DEC-2: Si la reserva tiene más horas que el paquete → se cobra hora adicional

R-DEC-3: El monto extra va a ganancia LOCAL (hospedaje)

R-DEC-4: La ganancia del proveedor NO cambia

R-DEC-5: Se crea CuentaPagar automática al proveedor

R-DEC-6: 1 reserva = 1 decoración activa

R-DEC-7: Código DEC-XXXXXX

Al hacer check-in
R-DEC-8: Si la reserva es DEC-, debe existir decoración activa

R-DEC-9: La decoración debe estar programada o en-proceso

Anticipación mínima
R-DEC-10: El proveedor necesita 24h mínimo (configurable)

R-DEC-11: La reserva debe crearse con 24h de anticipación

R-DEC-12: Se valida en DisponibilidadService

Estados de decoración
Programada → esperando que el proveedor confirme

En proceso → proveedor decorando

Finalizada → decoración lista

Cancelada → anulada por el recepcionista

Al anular reserva con decoración
R-DEC-13: La decoración pasa a cancelada

R-DEC-14: Se anula la CuentaPagar si no tiene pagos

Bugs resueltos (07/10/2026)
#	Bug	Fix
1	La reserva con decoración sumaba tarifa + paquete	DecoracionService ahora calcula paquete + hora extra
2	No se distinguía reserva con decoración	Prefijo DEC-
3	La habitación con decoración se veía morada (no rosa)	EstadoHabitacionService detecta tiene_decoracion
4	El mapa mostraba reservas confirmadas como OCUPADAS	EstadoHabitacionService ahora filtra por estado.slug (no por registro_estadia)
5	La 106 no permitía check-in aunque estaba libre	obtenerInfoCheckIn usa esWalkIn=true
6	Walk-in bloqueado por anticipación mínima	esWalkIn=true en crearWalkIn
7	No se liberaban reservas vencidas	Nuevo command reservas:liberar-vencidas
8	Faltaba anticipación mínima configurable	Campo anticipacion_minima_reserva_minutos
9	Faltaba validación de 24h en decoración	Campo horas_antes_decoracion = 24
Commands (cronjobs)
Comando	Frecuencia	Descripción
reservas:procesar-no-show	Cada minuto	Marca como No-Show (tolerancia 60 min)
reservas:liberar-vencidas	Cada minuto	Libera reservas vencidas sin check-in (cancela decoración también)
Archivos creados/modificados (07/10/2026)
Nuevos:

app/Console/Commands/LiberarReservasVencidas.php

database/migrations/2026_10_07_122531_add_precio_hora_adicional_to_paquetes_decoracion.php

Modificados:

app/Models/PaqueteDecoracion.php (+precio_hora_adicional)

app/Models/Decoracion.php (simplificado, estados hardcoded)

app/Services/DecoracionService.php (fórmula correcta)

app/Services/DisponibilidadService.php (+esWalkIn +anticipacion minima)

app/Services/EstadoHabitacionService.php (filtro por estado.slug + ROSA)

app/Services/ReservaService.php (generarCodigoReserva + esWalkIn en checkIn)

app/Http/Controllers/ReservaController.php (+con_decoracion)

routes/api.php (+solo-decoraciones)

routes/console.php (+liberar-vencidas)

database/seeders/ConfiguracionSistemaSeeder.php (+anticipacion +24h decoracion)

Configuraciones nuevas
Clave	Valor	Descripción
horas_antes_decoracion	24	Anticipación mínima para decoración
anticipacion_minima_reserva_minutos	30	Anticipación mínima para reserva normal
Estados del mapa (actualizado)
Color	Estado	Cuándo
🟢 Verde	Disponible	Libre
🔴 Rojo	Ocupada	Walk-in o reserva con check-in
🟡 Amarillo	Por vencer	Ocupada + 30 min restantes
🔴 Rojo oscuro	Vencida	Ocupada + tiempo excedido
🔵 Celeste	Limpieza	Limpieza pendiente
🟠 Naranja	Mantenimiento	Reporte activo
🟣 Morado	Reservada	Reserva normal sin check-in
🎨 Rosa	Con-Decoracion	Reserva con decoración sin check-in
⚫ Gris	Inactiva	Desactivada
Roadmap actualizado
#	Módulo	Backend	Frontend
01-09A	Auth, Config, Tarifas, Clientes, Productos, Promos, Decoración catálogo, Habitaciones, Recepción	✅	✅
09B	Reservas Futuras	✅	✅
09C	Extensiones	✅	✅
OBS	Observaciones	✅	✅
PAGOS	Pagos Mixtos	✅	✅
CONS	Consumos Múltiples	✅	✅
13	Cuentas por Pagar	✅	✅
10	Decoraciones Aplicadas	✅	⏳ Frontend en progreso
14	Limpieza	✅	✅
15	Mantenimiento	✅	✅
Última actualización: 07/10/2026
Módulos completados: ~17 de 21
'@

c
o
n
t
e
n
i
d
o
=
contenido=contenido.TrimEnd() + $seccionNueva

Write-Utf8NoBom 
p
a
t
h
pathcontenido

Write-Host " OK README backend actualizado" -ForegroundColor Green
Write-Host ""
Write-Host "Contenido agregado:" -ForegroundColor Yellow
Write-Host " - Modulo 10 completo" -ForegroundColor White
Write-Host " - Modelo de negocio" -ForegroundColor White
Write-Host " - Formula de calculo" -ForegroundColor White
Write-Host " - Prefijos (WK-, RES-, DEC-)" -ForegroundColor White
Write-Host " - Estados del mapa" -ForegroundColor White
Write-Host " - 9 bugs resueltos" -ForegroundColor White
Write-Host " - 2 commands (cronjobs)" -ForegroundColor White
Write-Host ""
