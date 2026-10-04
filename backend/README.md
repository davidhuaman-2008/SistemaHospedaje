¡Perfecto! 🎯 Vamos con el README backend completo y actualizado. Va a ser un documento extenso pero **completo** para que cualquier IA futura entienda todo el contexto.

---

## 📄 README.md backend — COMPLETO PARA COPIAR Y PEGAR

**Abrí `backend/README.md` en VS Code:**
1. **Ctrl+A** (seleccionar todo)
2. **Delete** (borrar)
3. **Pegar todo lo de abajo**
4. **Ctrl+S** (guardar)

````markdown
# Backend — Sistema de Hospedaje

**Framework:** Laravel 12
**PHP:** 8.2.12
**Base de datos:** MySQL 8 (MariaDB 10.4)
**Autenticación:** Laravel Sanctum (Bearer tokens)
**Estado global:** Módulos 01-09 completados

---

## 📌 Descripción

API REST para gestión completa de un hospedaje de rotación rápida (por horas / corta estadía). Cubre autenticación, usuarios, roles, turnos, configuración base, tarifas, clientes con fidelización, habitaciones, recepción (walk-in), consumos, cambio de habitación, limpieza, y próximamente caja, inventario, comprobantes, alertas y reportes.

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
│   │       └── LimpiezaController.php
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
│   │   └── DisponibilidadService.php
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

### Tablas creadas (Módulos 01-09)

| Tabla | Filas | Módulo | Propósito |
|-------|-------|--------|-----------|
| `roles` | 5 | 01 | Roles del sistema |
| `turnos` | 3 | 01 | Turnos (Mañana, Noche, Libre) |
| `usuarios` | 1+ | 01 | Usuarios del sistema |
| `personal_access_tokens` | 0+ | 01 | Tokens Sanctum |
| `pisos` | 4 | 02 | Pisos del hospedaje |
| `tipos_habitacion` | 8 | 02 | Tipos de habitación |
| `tipos_documento` | 5 | 02 | DNI, RUC, CE, Pasaporte, LIC |
| `metodos_pago` | 10 | 02 | Métodos de pago |
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
| `pagos_reserva` | - | 09 | Pagos del cliente |
| `reserva_consumos` | - | 09 | Consumos de productos |
| `reserva_ajustes` | - | 09 | Ajustes por cambio de habitación |
| `limpieza` | - | 09 | Cola de limpieza |

### Tablas de Laravel
- `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, `migrations`

---

## 🔐 Módulo 01 — AUTH (✅ CERRADO)

### Tablas

#### `roles` (5 filas)
- `id` PK
- `nombre` UNIQUE
- `descripcion` NULL
- `activo` BOOLEAN DEFAULT true
- `created_at`, `updated_at`

**Semilla:** admin, encargado, recepcionista, limpieza, cajero.

#### `turnos` (3 filas)
- `id` PK
- `nombre`
- `hora_inicio` TIME
- `hora_fin` TIME
- `descripcion` NULL
- `activo` BOOLEAN

**Semilla:** Mañana (08:00-20:00), Noche (20:00-08:00), Libre (00:00-23:59).

#### `usuarios`
- `id` PK
- `nombre`, `apellido`
- `nombre_usuario` UNIQUE (login)
- `password` (bcrypt)
- `id_rol` FK → roles
- `id_turno` FK NULL → turnos
- `activo` BOOLEAN
- `ultimo_login` TIMESTAMP NULL
- `remember_token`

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
`id_piso`, `nombre` UNIQUE, `descripcion`, `orden`, `activo`, `timestamps`.
**Semilla:** Piso 1, 2, 3, 4.

#### `tipos_habitacion` (8 filas)
`id_tipo`, `nombre` UNIQUE, `slug` UNIQUE, `descripcion`, `capacidad` (2), `camas` (1), `tiene_jacuzzi` BOOLEAN, `activo`, `timestamps`.
**Semilla:** Simple, Estándar, Premium, Safari, Marina, Romántica, Jacuzzi VIP, Jacuzzi Estelar.

#### `tipos_documento` (5 filas)
`id_documento`, `nombre` UNIQUE, `abreviatura` UNIQUE, `longitud`, `activo`.
**Semilla:** DNI (8), RUC (11), Carné de Extranjería (12), Pasaporte (NULL), Licencia de Conducir (8).

#### `metodos_pago` (10 filas)
`id_metodo`, `nombre` UNIQUE, `descripcion`, **`es_de_caja`** (⚡ REGLA R39), `icono`, `color`, `orden`, `activo`.

**⚠️ Regla R39:** `es_de_caja = true` → entra a caja física. `es_de_caja = false` → va a la cuenta personal de la dueña, NO entra a caja.

**Semilla:**
| id | nombre | es_de_caja |
|----|--------|-----------|
| 1 | Efectivo | true |
| 2 | Tarjeta (POS) | true |
| 3 | Yape Hospedaje | true |
| 4 | Yape Dueña | false |
| 5 | Plin Hospedaje | true |
| 6 | Plin Dueña | false |
| 7 | Depósito Hospedaje | true |
| 8 | Depósito Dueña | false |
| 9 | Transferencia Hospedaje | true |
| 10 | Transferencia Dueña | false |

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
**Clientes (10):**
```
GET    /api/clientes
GET    /api/clientes/activos
GET    /api/clientes/buscar?dni=X     ← devuelve { existe, cliente }
GET    /api/clientes/{id}
POST   /api/clientes
PUT    /api/clientes/{id}
PATCH  /api/clientes/{id}/desactivar
PATCH  /api/clientes/{id}/reactivar
DELETE /api/clientes/{id}
GET    /api/clientes/{id}/visitas
```

**Visitas (5):** CRUD + filtros por cliente
**Observaciones (6):** CRUD + `/resolver`

### Reglas de negocio Módulo 04

- **R-CLI-1:** Buscar cliente por DNI primero en BD local
- **R-CLI-2:** Si existe, NO se consulta RENIEC (cuando se active)
- **R-CLI-3:** Al registrar visita → incrementar `visitas`, actualizar `ultima_visita`, sumar `total_gastado`
- **R-CLI-4:** Al recalcular visitas → actualizar automáticamente el `nivel`
- **R-CLI-5:** Cliente con observación pendiente → mostrar alerta al buscar por DNI
- **R-CLI-6:** Los tipos de observación y gravedades son dinámicos (CRUD)

### Lógica de visitas — `ClienteVisitaService::registrar()`

```
1. Crea fila en cliente_visitas
2. Incrementa clientes.visitas en 1
3. Actualiza clientes.ultima_visita = now()
4. Suma clientes.total_gastado += monto_gastado
5. Recalcula nivel (Bronce/Plata/Oro/VIP)
```

**Este servicio es llamado desde `ReservaService::crearWalkIn()`.**

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
`id_paquete`, `nombre`, `slug` UNIQUE, `descripcion`, `precio_total`, `ganancia_local`, `ganancia_proveedor`, `id_proveedor` FK NULL, `id_categoria_paquete` FK NULL, `id_tipo_habitacion` FK NULL, `imagen`, `categoria_servicio` ENUM, `horas_incluidas`, `incluye_jacuzzi`, `incluye_vino`, `incluye_decoracion`, `incluye_sexshop`, `incluye_netflix`, `activo`. Solo `created_at` (sin `updated_at`).

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

**⚠️ NOTA:** La tabla `decoraciones` (aplicadas a reservas) se creará en el Módulo 10 cuando se haga el flujo de "reserva con decoración". Hoy solo existe el catálogo.

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
`id_habitacion`, `id_piso` FK → pisos, `id_tipo` FK → tipos_habitacion, `numero` UNIQUE VARCHAR(10), `orden` INT, `activo` BOOLEAN.
Índices: `id_piso`, `id_tipo`, `activo`.

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

## 🎯 Módulo 09 — RECEPCIÓN / RESERVAS (✅ CERRADO parcial)

### Visión general

Este módulo maneja **2 flujos**:
1. **WALK-IN** (cliente físico ahora) → `/api/reservas/walk-in`
2. **RESERVA futura** (cliente llama para agendar) → `/api/reservas`

Ambos usan la **misma tabla `reservas`** con `tipo_reserva`.

**Estado actual:** Walk-in 100% funcional. Reserva futura a medias (backend listo, frontend pendiente).

### Tablas

#### `estados_reserva` (7 filas)
`id_estado`, `nombre` UNIQUE, `slug` UNIQUE, `color`, `descripcion`, `orden`, `activo`.
**Semilla:** Pendiente, Confirmada, Activa, Finalizada, Cancelada, No-Show, **Anulada**.

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
monto_consumos DECIMAL          ← NUEVO
monto_ajustes DECIMAL           ← NUEVO
descuento DECIMAL
descuento_porcentaje DECIMAL
total DECIMAL                    ← monto_habitacion + consumos + horas_extra + ajustes - descuento
pagado DECIMAL                   ← suma de todos los pagos (reemplaza adelanto)
saldo DECIMAL                    ← max(0, total - pagado)
vuelto_entregado DECIMAL         ← vuelto YA entregado (0 = guardado como saldo a favor)
telefono VARCHAR(20) NULL
notas TEXT NULL
observaciones TEXT NULL
id_usuario_anulacion (FK NULL)
fecha_anulacion DATETIME NULL
motivo_anulacion VARCHAR(255) NULL
timestamps
```

**REGLA DE ORO:** Al crear walk-in, `pagado` DEBE ser >= `total` (para cubrir la habitación). Salvo cambio de habitación a más barata.

#### `ocupacion_habitacion`
`id_ocupacion`, `id_habitacion` FK, `id_reserva` FK, `fecha_inicio`, `fecha_fin`, `estado` ENUM('ACTIVA','LIBERADA','CANCELADA').

**Es el bloqueo real** (no `reservas`). Índice clave: `(id_habitacion, fecha_inicio, fecha_fin, estado)`.

#### `registros_estadia`
`id_registro`, `id_reserva` FK UNIQUE (1:1), `fecha_entrada`, `fecha_salida` NULL, `horas_reales` NULL, `id_usuario_checkin` FK, `id_usuario_checkout` FK NULL, `monto_final` NULL, `observaciones`.

#### `pagos_reserva`
`id_pago`, `id_reserva` FK, `id_metodo_pago` FK, `monto`, `es_adelanto` BOOLEAN, `fecha_pago`, `id_usuario` FK, `observaciones`, `anulado` BOOLEAN, `id_usuario_anulacion` NULL, `fecha_anulacion` NULL, `motivo_anulacion`.

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

**Reservas (11):**
```
GET    /api/reservas
POST   /api/reservas                              ← reserva futura
POST   /api/reservas/walk-in                      ← cliente actual
GET    /api/reservas/{id}
PATCH  /api/reservas/{id}/check-in                ← convierte reserva en activa
PATCH  /api/reservas/{id}/check-out               ← finaliza estadía + crea limpieza
PATCH  /api/reservas/{id}/cancelar                ← cancela (con motivo)
PATCH  /api/reservas/{id}/anular                  ← anula (no SUNAT, no caja)
PATCH  /api/reservas/{id}/cambiar-habitacion      ← cambio con lógica de dinero
POST   /api/reservas/{id}/consumos                ← agregar consumo
DELETE /api/reservas/{id}/consumos/{idConsumo}    ← eliminar consumo
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
- `cambiarHabitacion(int $idReserva, int $idNuevaHabitacion, int $idUsuario, string $modoDiferencia, ?int $idMetodoPago)` → crea `reserva_ajuste` + limpieza en la vieja
- `agregarConsumo(...)` → descuenta stock + suma a cuenta o registra pago
- `eliminarConsumo(int $idConsumo, int $idUsuario)` → devuelve stock + revierte montos

**Todas las operaciones multi-tabla usan `DB::transaction()`.**

#### `EstadoHabitacionService`

Calcula el estado **EN VIVO** de cada habitación. Devuelve:
```php
[
    'estado' => 'Disponible' | 'Ocupada' | 'Por vencer' | 'Vencida' | 'Reservada' | 'Limpieza' | 'Inactiva',
    'color' => '#10b981',   // hex
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
- **R4** Buffer de limpieza configurable (30 min)
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
- La habitación **vieja** pasa a **LIMPIEZA** (el personal debe verificar)
- El tiempo **NO se resetea** (mantiene `fecha_inicio` original)
- Si la nueva no tiene tarifa con `horas_base`, se ajusta a la **más chica disponible**
- Si la diferencia es positiva y el modo es `AHORA` → cobra + `pago_reserva`
- Si la diferencia es negativa y el modo es `AHORA` → devuelve (ajusta `pagado`)

#### Consumos
- Al agregar: descuenta `productos.stock_actual`
- Si `pagado = true` → `pago_reserva` + no suma a `monto_consumos`
- Si `pagado = false` → suma a `monto_consumos` + recalcula `total`
- Al eliminar: devuelve stock + revierte montos

#### Vuelto (Regla de oro)
- **Al crear walk-in, `pagado` DEBE ser >= `total`** (para cubrir la habitación)
- Si el cliente paga más → `pagado > total` → vuelto calculado = `pagado - total`
- El vuelto **NO se entrega al inicio** (queda como **saldo a favor**)
- Se descuenta con consumos y horas extra automáticamente
- Al hacer **check-out**, se entrega el **vuelto real**: `pagado - total`

**Ejemplo:**
```
Cliente alquila Premium 8h (S/ 55)
Paga S/ 100
→ total = S/ 55, pagado = S/ 100, vuelto calculado = S/ 45 (guardado)

Cliente consume 2 cervezas (S/ 16 a cuenta)
→ total = S/ 71, monto_consumos = S/ 16

Cliente se pasa 1h (S/ 5)
→ total = S/ 76, monto_horas_extra = S/ 5

Al check-out:
→ Vuelto final = S/ 100 - S/ 76 = S/ 24 (se entrega)
```

#### Limpieza
- Al check-out → INSERT en `limpieza` (PENDIENTE)
- Al cambiar habitación → INSERT en `limpieza` para la habitación vieja
- Al finalizar limpieza → habitación vuelve a Disponible
- **Importante:** El cálculo del estado prioriza Limpieza sobre Disponible

---

## 🎯 Reglas de negocio globales (R1-R53)

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

### Extensiones (futuro Módulo 09B)
- **R13** Máximo de horas extra según tipo (3 por defecto)
- **R14** Al exceder máximo → turno adicional
- **R15** Turno adicional cuesta el bloque completo
- **R16** Cada extensión se registra en `extensiones_reserva`

### Caja (futuro Módulo 11)
- **R17** Solo una caja abierta a la vez
- **R18** Todo movimiento pertenece a caja abierta
- **R19** Vuelto NO es egreso
- **R20** Movimientos no se borran, se anulan
- **R21** Si hay diferencia → observación obligatoria
- **R22** Arqueo por método de pago
- **R23** Egresos requieren responsable

### IGV y Comprobantes (futuro Módulo 16)
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

### Promociones
- **R36** Por defecto se aplica la mejor promo
- **R37** Solo acumulables se suman
- **R38** Uso se registra en `promociones_cliente`

### ⚡ Regla Crítica R39
**R39 — Yape/Plin/Depósito/Transferencia Dueña NO entran a caja**
Los métodos de pago con `es_de_caja = false` van a la cuenta personal de la dueña. NO se registran en `movimientos_caja`.

### Inventario
- **R40** Cada movimiento → kardex
- **R41** Consumo descuenta stock ✅ (implementado)
- **R42** Stock bajo → alerta
- **R43** Inventario físico → ajustes

### Alertas
- **R44** Cronjob cada minuto
- **R45** Alertas críticas por WebSocket
- **R46** Alertas se resuelven al desaparecer condición
- **R47** Clave única anti-duplicados

### Auditoría
- **R48** Todo cambio sensible se audita
- **R49** IP + user-agent + fecha
- **R50** Cambios campo a campo en `auditoria_cambios`

### Productos
- **R51** Producto con `stock_actual <= stock_minimo` → "stock bajo"
- **R52** Los productos NO se eliminan si tienen movimientos en kardex
- **R53** Los proveedores NO se eliminan si tienen productos asociados

### Reglas propias del Hospedaje (negocio real)
- **RG1** Regla de oro: al alquilar, SIEMPRE debe pagar la habitación completa
- **RG2** El vuelto inicial puede quedar como saldo a favor (no se entrega hasta el final)
- **RG3** El vuelto se descuenta automáticamente con consumos y horas extra
- **RG4** Al cambiar de habitación, la vieja va a LIMPIEZA (el personal verifica)
- **RG5** Al cambiar de habitación, el tiempo NO se resetea
- **RG6** Si la nueva no tiene la tarifa exacta, se ajusta a la más chica disponible

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
| Timestamps | Siempre (excepto paquetes_decoracion que solo created_at) |

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

**Por qué:** El frontend lee `data` en GET y `data.data` en POST/PUT/PATCH.

---

## 🧪 Cómo probar

### PowerShell
```powershell
$body = @{ nombre_usuario = "nancy"; password = "admin123" } | ConvertTo-Json
$resp = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/login" -Method POST -Body $body -ContentType "application/json"
$token = $resp.token

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/habitaciones-mapa" -Headers @{ Authorization = "Bearer $token" }
```

### Postman
1. `POST http://localhost:8000/api/login` con `{ "nombre_usuario": "nancy", "password": "admin123" }`
2. Copiar `token` de la respuesta
3. Endpoints protegidos: `Authorization: Bearer {token}`

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
| 04 | CLIENTES (5 tablas) | ✅ | ✅ | CERRADO |
| 05 | PRODUCTOS (Fase 1) | ✅ | ✅ | CERRADO |
| 06 | PROMOCIONES | ✅ | ✅ | CERRADO |
| 07 | PAQUETES DE DECORACIÓN | ✅ | ✅ | CERRADO (catálogo) |
| 08 | HABITACIONES | ✅ | ✅ | CERRADO |
| 09A | RECEPCIÓN / WALK-IN | ✅ | ✅ | CERRADO |
| 09B | RESERVAS FUTURAS | ⏳ | ⏳ | Pendiente |
| 09C | EXTENSIONES / HUÉSPEDES | ⏳ | ⏳ | Pendiente |
| 10 | DECORACIONES APLICADAS | ⏳ | ⏳ | Pendiente (necesita 09B) |
| 11 | CAJA | ⏳ | ⏳ | Pendiente (necesita 09) |
| 12 | INVENTARIO / KARDEX | ⏳ | ⏳ | Pendiente |
| 13 | CUENTAS POR PAGAR | ⏳ | ⏳ | Pendiente |
| 14 | LIMPIEZA (pantalla) | ⏳ | ⏳ | Pendiente (backend listo) |
| 15 | MANTENIMIENTO | ⏳ | ⏳ | Pendiente |
| 16 | COMPROBANTES SUNAT | ⏳ | ⏳ | Pendiente |
| 17 | ALERTAS | ⏳ | ⏳ | Pendiente |
| 18 | REPORTES | ⏳ | ⏳ | Pendiente |
| 19 | AUDITORÍA | ⏳ | ⏳ | Pendiente |
| 20 | ASISTENCIA PERSONAL | ⏳ | ⏳ | Pendiente |
| 21 | INTEGRACIÓN RENIEC | ⏳ | ⏳ | Pendiente (producción) |

---

## 📝 Módulos futuros — detalle

### Módulo 09B — RESERVAS FUTURAS

**Backend:** YA ESTÁ HECHO (`ReservaService::crearReserva()`).

**Frontend pendiente:**
- `/reservas` (listado)
- `/reservas/nueva` (form con fecha futura)
- `/reservas/{id}` (detalle con opción check-in)

**Reglas:**
- Reserva pendiente/confirmada bloquea el rango en `ocupacion_habitacion`
- Al llegar el cliente → check-in convierte a `estado = Activa`
- Si no llega en 60 min → No-Show

### Módulo 09C — EXTENSIONES Y HUÉSPEDES

**Tablas faltantes:**
- `extensiones_reserva` (id_reserva, horas_extra, monto, id_usuario, fecha)
- `huespedes_adicionales` (id_reserva, dni, nombre, edad)
- `intentos_contacto` (id_reserva, tipo, resultado, id_usuario, fecha)

**Reglas:**
- R13-R16: máximo 3h extra → después turno adicional
- Se registra cada extensión

### Módulo 10 — DECORACIONES APLICADAS

**Tabla `decoraciones`:**
```
id_decoracion (PK)
id_reserva (FK)
id_cliente (FK)
id_habitacion (FK)
id_paquete (FK → paquetes_decoracion)
id_proveedor (FK → proveedores)
fecha_inicio, fecha_fin
monto, ganancia_local, ganancia_proveedor
adelanto, saldo
frase, musica
estado ENUM('Programada','En proceso','Finalizada','Cancelada')
observaciones
created_at (sin updated_at)
```

**R11:** Al crear reserva con decoración → crear CuentaPagar al proveedor por `ganancia_proveedor`.

### Módulo 11 — CAJA

**Tablas:**
- `cajas` (id, id_usuario_apertura, fecha_apertura, monto_inicial, monto_final, id_usuario_cierre, fecha_cierre, observaciones, estado)
- `movimientos_caja` (id, id_caja, tipo ENUM('Ingreso','Egreso'), monto, id_categoria FK, descripcion, id_metodo_pago FK, id_usuario, fecha, anulado, ...)
- `arqueo_denominaciones` (id, id_caja, tipo, denominacion, cantidad)
- `retiros_caja`
- `devoluciones`

**Reglas R17-R23:**
- Solo 1 caja abierta a la vez
- R39: métodos `es_de_caja = false` NO entran a movimientos_caja
- Arqueo por método de pago
- Vuelto NO es egreso

### Módulo 12 — INVENTARIO / KARDEX

**Tablas:**
- `kardex` (id, id_producto, tipo ENUM('ENTRADA','SALIDA','AJUSTE'), cantidad, motivo, id_referencia, id_usuario, fecha)
- `inventario_fisico`, `inventario_detalle`

**Reglas R40-R43.**

### Módulo 13 — CUENTAS POR PAGAR

**Tablas:**
- `cuentas_por_pagar` (id, id_proveedor, id_reserva, monto, monto_pagado, saldo, fecha_emision, fecha_vencimiento, estado, motivo_anulacion)
- `pagos_proveedor`

**R11:** Se crea al contratar decoración.

### Módulo 14 — LIMPIEZA (pantalla)

**Backend LISTO. Falta frontend:**
- `/limpieza` → cola de tareas pendientes
- Botones: Iniciar / Finalizar
- Al finalizar → habitación vuelve a Disponible

### Módulo 15 — MANTENIMIENTO

**Tabla `mantenimiento`:**
```
id_mantenimiento
id_habitacion (FK)
id_usuario_reporta (FK)
id_usuario_asignado (FK)
tipo (eléctrico, plomería, muebles, etc.)
descripcion
prioridad
estado (reportado, en_proceso, resuelto)
fecha_reporte, fecha_resolucion
observaciones
```

Al reportar → habitación a Mantenimiento (bloqueada).

### Módulo 16 — COMPROBANTES SUNAT

**Tablas:**
- `tipos_comprobante` (Boleta, Factura, NC, ND)
- `series_comprobante` (B001, F001, NC01, ND01)
- `facturas`, `facturas_detalle`, `notas_credito`

**Reglas R24-R31:** IGV 18%, series, correlativos.

### Módulo 17 — ALERTAS

**Tablas:**
- `alertas`, `reglas_alerta`, `canales_alerta`

**Reglas R44-R47:** Cronjob cada minuto, WebSocket para críticas.

### Módulo 18 — REPORTES

Sin tablas nuevas. Consultas sobre tablas existentes.

### Módulo 19 — AUDITORÍA

**Tablas:**
- `auditoria`, `auditoria_cambios`

**Reglas R48-R50.**

### Módulo 20 — ASISTENCIA DE PERSONAL

**Tablas:**
- `asistencia` (marcas entrada/salida)
- `horas_extra`

### Módulo 21 — INTEGRACIÓN RENIEC

Sin tablas. Solo `ReniecService::consultar($dni)`. Solo producción.

---

## 📝 Decisiones técnicas tomadas

| # | Decisión | Razón |
|---|----------|-------|
| D1 | Yape/Plin/Depósito Dueña NO entran a caja | El dinero va a la cuenta personal de la dueña |
| D2 | Cobro de reserva en 2 pasos | Al crear reserva se abre modal de cobro |
| D3 | Catálogos dinámicos | Métodos de pago y categorías vienen de BD |
| D4 | Precios con IGV incluido | Regla de negocio peruana |
| D5 | Buffer de limpieza = 30 min | Configurable |
| D6 | Tolerancia No-Show = 60 min | Configurable |
| D7 | Al anular pago se revierte caja | PagoService lo maneja |
| D8 | Estado de habitación en vivo | `EstadoHabitacionService` calcula |
| D9 | RENIEC solo en producción | Ahorro de costos |
| D10 | Visitas se incrementan en walk-in/check-in | `ClienteVisitaService` lo maneja |
| D11 | Vuelto se entrega al final, no al inicio | El cliente puede consumir/usar horas extra |
| D12 | Cambio de habitación mantiene `fecha_inicio` | No se resetea el tiempo |
| D13 | Al cambiar hab, la vieja va a LIMPIEZA | El personal debe verificar |
| D14 | Si no hay tarifa exacta → usar la más chica | Adaptación automática |
| D15 | `reserva_ajustes` registra todos los cambios | Auditoría de cambios de precio |
| D16 | `reserva_consumos` descuenta stock | R41 |
| D17 | Múltiples pagos por reserva | Permite adelanto + saldo + consumos |

---

## 🚨 Bugs resueltos (histórico)

1. **Bug Rol update/delete** → `Route::apiResource` generaba `{role}`, no `{rol}`. Fix: `->parameters(['roles' => 'rol'])`.
2. **Bug vuelto no se guardaba** → frontend mandaba `Math.min(adelanto, total)`. Fix: quitar el `min()`.
3. **Bug visitas no incrementaban** → faltaba llamar `ClienteVisitaService::registrar()` en walk-in. Fix: agregado.
4. **Bug limpieza no se creaba al check-out** → no existía la tabla. Fix: creada + insert.
5. **Bug cambio habitación reseteaba tiempo** → se creaba nueva ocupación con `now()`. Fix: usar `$ocupacion->fecha_inicio` original.
6. **Bug 422 al cambiar habitación** → no había tarifa de las mismas horas. Fix: buscar la más chica disponible.
7. **Bug "No hay tarifa"** → Jacuzzi VIP tiene 8h/12h, no 6h. Fix: adaptar automáticamente.

---

## 👥 Credenciales de prueba

| Usuario | Password | Rol | Turno |
|---------|----------|-----|-------|
| nancy | admin123 | admin | Libre |

---

## 📄 Licencia

Proyecto privado — Sistema de Hospedaje.

---

**Última actualización:** 03/10/2026
**Módulos completados:** 9 de 21
````

---

## 📸 Pegame

1. **Screenshot del README.md** con la estructura nueva
2. **Salida del commit** (si es que hacés commit primero)

**Después te armo el README del frontend completo.** 🚀

**¿Dale?**
