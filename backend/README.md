# 📘 README.md completo del Backend — Solo para pegar en el archivo

**Copiá TODO lo que está dentro del bloque de abajo y pegalo en tu `backend/README.md`** (reemplazando el contenido actual).

```markdown
# Backend — Sistema de Hospedaje

**Framework:** Laravel 12
**PHP:** 8.2.12
**Base de datos:** MySQL 8 (MariaDB 10.4)
**Autenticación:** Laravel Sanctum (Bearer tokens)
**Estado global:** Módulos 01-04 completados

---

## 📌 Descripción

API REST para gestión completa de un hospedaje de rotación rápida (por horas / corta estadía). Cubre autenticación, usuarios, roles, turnos, configuración base, tarifas, clientes con fidelización, habitaciones, reservas, caja, inventario, promociones, comprobantes, alertas y reportes.

**Arquitectura:** Controllers delgados + Services (CRUD) + Reglas (lógica de negocio compleja) + Models Eloquent.

---

## 🔴 REGLAS DEL PROYECTO (NO NEGOCIABLES)

### R1 — Nada hardcodeado
Todo sale de la BD. Si puede cambiar sin tocar código → va a BD.

### R2 — Poco código por archivo
100 archivos de 30 líneas > 10 archivos de 300 líneas.
1 archivo = 1 responsabilidad.

### R3 — Funcional > Elegante
Si algo es "elegante pero confuso" → simplificar.

---

## 📂 Estructura del proyecto

```
backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── Controller.php
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
│   │       └── ClienteObservacionController.php
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
│   │   └── ClienteObservacion.php
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
│   │   └── ClienteObservacionService.php
│   ├── Reglas/                    (lógica de negocio compleja - futura)
│   │   └── .gitkeep
│   └── Providers/
│       └── AppServiceProvider.php
├── bootstrap/
│   └── app.php
├── config/                         (configuración Laravel)
├── database/
│   ├── migrations/
│   └── seeders/
├── public/
│   └── index.php
├── resources/
│   └── views/
│       └── welcome.blade.php
├── routes/
│   ├── api.php
│   ├── console.php
│   └── web.php
├── storage/
├── tests/
├── vendor/
├── .env
├── artisan
├── composer.json
└── composer.lock
```

---

## 🗄️ Base de datos — Estado actual

### Tablas creadas (Módulos 01-04)

| Tabla | Filas | Módulo | Propósito |
|-------|-------|--------|-----------|
| `roles` | 5 | 01 | Roles del sistema |
| `turnos` | 3 | 01 | Turnos (Mañana, Noche, Libre) |
| `usuarios` | 1 | 01 | Usuarios del sistema |
| `personal_access_tokens` | 0 | 01 | Tokens Sanctum |
| `pisos` | 4 | 02 | Pisos del hospedaje |
| `tipos_habitacion` | 8 | 02 | Tipos de habitación |
| `tipos_documento` | 5 | 02 | DNI, RUC, CE, Pasaporte, LIC |
| `metodos_pago` | 10 | 02 | Métodos de pago |
| `categorias_movimiento` | 23 | 02 | Categorías ingreso/egreso |
| `clientes_niveles` | 4 | 02 | Niveles de fidelización |
| `tarifas` | 15 | 03 | Precios por tipo y horas |
| `tipos_observacion` | 5 | 04 | Tipos de observación cliente |
| `gravedades_observacion` | 4 | 04 | Gravedades (baja/media/alta/crítica) |
| `clientes` | 0 | 04 | Clientes del hospedaje |
| `cliente_visitas` | 0 | 04 | Historial de visitas |
| `cliente_observaciones` | 0 | 04 | Alertas por cliente |

### Tablas de Laravel
- `cache` — caché de la aplicación
- `cache_locks` — locks de caché
- `jobs` — cola de trabajos
- `job_batches` — lotes de jobs
- `failed_jobs` — jobs fallidos
- `migrations` — control de migraciones

---

## 🔷 Módulo 01 — AUTH (✅ CERRADO)

### Tablas

#### `roles`
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| nombre | VARCHAR(50) | UNIQUE, NOT NULL |
| descripcion | VARCHAR(255) | NULL |
| activo | BOOLEAN | DEFAULT true |
| created_at, updated_at | TIMESTAMP | NULL |

**Datos semilla:** admin, encargado, recepcionista, limpieza, cajero.

#### `turnos`
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| nombre | VARCHAR(50) | NOT NULL |
| hora_inicio | TIME | NOT NULL |
| hora_fin | TIME | NOT NULL |
| descripcion | VARCHAR(255) | NULL |
| activo | BOOLEAN | DEFAULT true |
| created_at, updated_at | TIMESTAMP | NULL |

**Datos semilla:** Mañana (08:00-20:00), Noche (20:00-08:00), Libre (00:00-23:59).

#### `usuarios`
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| nombre | VARCHAR(100) | NOT NULL |
| apellido | VARCHAR(100) | NOT NULL |
| nombre_usuario | VARCHAR(50) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (bcrypt) |
| id_rol | BIGINT FK | → roles.id, onDelete restrict |
| id_turno | BIGINT FK NULL | → turnos.id, onDelete set null |
| activo | BOOLEAN | DEFAULT true |
| ultimo_login | TIMESTAMP | NULL |
| remember_token | VARCHAR(100) | NULL |
| created_at, updated_at | TIMESTAMP | NULL |

**Datos semilla:** nancy/admin123 (admin).

### Endpoints Módulo 01

**Público:**
```
POST /api/login       { nombre_usuario, password } → { mensaje, usuario, token }
```

**Protegidos (Bearer token):**
```
POST   /api/logout                    → revoca token actual
GET    /api/yo                        → usuario autenticado

GET    /api/usuarios                  → listar
POST   /api/usuarios                  → crear
GET    /api/usuarios/{id}             → detalle
PUT    /api/usuarios/{id}             → actualizar
DELETE /api/usuarios/{id}             → eliminar

GET    /api/roles                     → listar
POST   /api/roles                     → crear
GET    /api/roles/{id}                → detalle
PUT    /api/roles/{id}                → actualizar
DELETE /api/roles/{id}                → eliminar

GET    /api/turnos                    → listar
POST   /api/turnos                    → crear
GET    /api/turnos/{id}               → detalle
PUT    /api/turnos/{id}               → actualizar
DELETE /api/turnos/{id}               → eliminar
```

### Reglas de negocio Módulo 01
- Login por `nombre_usuario`, NO por email
- Sin verificación de email
- Un usuario tiene UN rol
- Un usuario tiene UN turno (opcional)
- Roles/turnos con usuarios NO se eliminan (se desactivan)
- Token Sanctum sin expiración por defecto
- `ultimo_login` se actualiza en cada login

---

## 🔷 Módulo 02 — CONFIG-BASE (✅ CERRADO)

### Tablas

#### `pisos` (4 filas)
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_piso | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| nombre | VARCHAR(50) | UNIQUE, NOT NULL |
| descripcion | VARCHAR(255) | NULL |
| orden | INT | DEFAULT 0 |
| activo | BOOLEAN | DEFAULT true |
| created_at, updated_at | TIMESTAMP | NULL |

**Datos semilla:** Piso 1, Piso 2, Piso 3, Piso 4.

#### `tipos_habitacion` (8 filas)
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_tipo | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| nombre | VARCHAR(50) | UNIQUE, NOT NULL |
| slug | VARCHAR(50) | UNIQUE, NOT NULL |
| descripcion | VARCHAR(255) | NULL |
| capacidad | INT | DEFAULT 2 |
| camas | INT | DEFAULT 1 |
| tiene_jacuzzi | BOOLEAN | DEFAULT false |
| activo | BOOLEAN | DEFAULT true |
| created_at, updated_at | TIMESTAMP | NULL |

**Datos semilla:** Simple, Estándar, Premium, Safari, Marina, Romántica, Jacuzzi VIP, Jacuzzi Estelar.

#### `tipos_documento` (5 filas)
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_documento | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| nombre | VARCHAR(50) | UNIQUE, NOT NULL |
| abreviatura | VARCHAR(10) | UNIQUE, NOT NULL |
| longitud | INT | NULL |
| activo | BOOLEAN | DEFAULT true |
| created_at, updated_at | TIMESTAMP | NULL |

**Datos semilla:** DNI (8), RUC (11), Carné de Extranjería (12), Pasaporte (NULL), Licencia de Conducir (8).

#### `metodos_pago` (10 filas)
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_metodo | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| nombre | VARCHAR(50) | UNIQUE, NOT NULL |
| descripcion | VARCHAR(255) | NULL |
| es_de_caja | BOOLEAN | DEFAULT true ⚠️ REGLA R39 |
| icono | VARCHAR(50) | NULL |
| color | VARCHAR(20) | NULL |
| orden | INT | DEFAULT 0 |
| activo | BOOLEAN | DEFAULT true |
| created_at, updated_at | TIMESTAMP | NULL |

**Datos semilla:**
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

**⚠️ Regla R39 (crítica):** `es_de_caja = true` → entra a la caja física del turno. `es_de_caja = false` → va a la cuenta personal de la dueña, NO entra a caja.

#### `categorias_movimiento` (23 filas)
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_categoria | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| nombre | VARCHAR(50) | NOT NULL |
| tipo | ENUM('Ingreso','Egreso') | NOT NULL |
| descripcion | VARCHAR(255) | NULL |
| orden | INT | DEFAULT 0 |
| activo | BOOLEAN | DEFAULT true |
| created_at, updated_at | TIMESTAMP | NULL |

**Índices:** UNIQUE (nombre, tipo), INDEX (tipo).

**Datos semilla:** 9 ingresos + 14 egresos.

#### `clientes_niveles` (4 filas)
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_nivel | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| nombre | VARCHAR(50) | UNIQUE, NOT NULL |
| visitas_min | INT | DEFAULT 0 |
| visitas_max | INT | NULL |
| descuento | DECIMAL(5,2) | DEFAULT 0 |
| color | VARCHAR(20) | NULL |
| icono | VARCHAR(50) | NULL |
| beneficios | TEXT | NULL |
| activo | BOOLEAN | DEFAULT true |
| created_at, updated_at | TIMESTAMP | NULL |

**Datos semilla:**
| id | nombre | visitas_min | visitas_max | descuento |
|----|--------|-------------|-------------|-----------|
| 1 | Bronce | 0 | 4 | 0% |
| 2 | Plata | 5 | 9 | 5% |
| 3 | Oro | 10 | 19 | 10% |
| 4 | VIP | 20 | NULL | 15% |

### Endpoints Módulo 02

**Cada tabla tiene 8 endpoints (CRUD + soft delete):**
```
GET    /api/{recurso}                    → listar
GET    /api/{recurso}/activos            → solo activos
GET    /api/{recurso}/{id}               → detalle
POST   /api/{recurso}                    → crear
PUT    /api/{recurso}/{id}               → editar
PATCH  /api/{recurso}/{id}/desactivar    → activo = false
PATCH  /api/{recurso}/{id}/reactivar     → activo = true
DELETE /api/{recurso}/{id}               → eliminar
```

**Recursos:**
- `/api/pisos`
- `/api/tipos-habitacion`
- `/api/tipos-documento`
- `/api/metodos-pago`
- `/api/categorias-movimiento`
- `/api/clientes-niveles`

**Endpoints especiales:**
```
GET /api/metodos-pago/de-caja      → solo es_de_caja = true
GET /api/metodos-pago/de-duenia    → solo es_de_caja = false
GET /api/categorias-movimiento?tipo=Ingreso
GET /api/categorias-movimiento?tipo=Egreso
```

### Reglas de negocio Módulo 02
- Todos los catálogos son CRUD (nada hardcodeado)
- Soft delete vía `activo = false`
- `metodos_pago.es_de_caja` define si un pago entra a caja o va a la dueña

---

## 🔷 Módulo 03 — TARIFAS (✅ CERRADO)

### Tabla

#### `tarifas` (15 filas)
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_tarifa | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| id_tipo | BIGINT FK | → tipos_habitacion.id_tipo, onDelete restrict |
| horas | INT | NOT NULL |
| monto | DECIMAL(10,2) | Precio con IGV |
| precio_hora_extra | DECIMAL(10,2) | S/ 5 o S/ 10 |
| max_horas_extra | INT | DEFAULT 3 |
| precio_turno_adicional | DECIMAL(10,2) | Bloque completo |
| activo | BOOLEAN | DEFAULT true |
| created_at, updated_at | TIMESTAMP | NULL |

**UNIQUE:** (id_tipo, horas).

**Datos semilla:**
| id | Tipo | Horas | Monto | Hora extra | Turno adic. |
|----|------|-------|-------|-----------|-------------|
| 1 | Simple | 4 | 25 | 5 | 25 |
| 2 | Estándar | 6 | 40 | 5 | 40 |
| 3 | Estándar | 12 | 45 | 5 | 45 |
| 4 | Premium | 8 | 55 | 5 | 55 |
| 5 | Premium | 12 | 70 | 5 | 70 |
| 6 | Safari | 8 | 70 | 10 | 70 |
| 7 | Safari | 12 | 90 | 10 | 90 |
| 8 | Marina | 8 | 60 | 10 | 60 |
| 9 | Marina | 12 | 80 | 10 | 80 |
| 10 | Romántica | 8 | 60 | 10 | 60 |
| 11 | Romántica | 12 | 80 | 10 | 80 |
| 12 | Jacuzzi VIP | 8 | 100 | 10 | 100 |
| 13 | Jacuzzi VIP | 12 | 135 | 10 | 135 |
| 14 | Jacuzzi Estelar | 8 | 135 | 10 | 135 |
| 15 | Jacuzzi Estelar | 12 | 165 | 10 | 165 |

**⚠️ NO todas las combinaciones existen.** Matriz:
| Tipo | 4h | 6h | 8h | 12h |
|------|----|----|----|----|
| Simple | ✅ | ❌ | ❌ | ❌ |
| Estándar | ❌ | ✅ | ❌ | ✅ |
| Premium | ❌ | ❌ | ✅ | ✅ |
| Safari | ❌ | ❌ | ✅ | ✅ |
| Marina | ❌ | ❌ | ✅ | ✅ |
| Romántica | ❌ | ❌ | ✅ | ✅ |
| Jacuzzi VIP | ❌ | ❌ | ✅ | ✅ |
| Jacuzzi Estelar | ❌ | ❌ | ✅ | ✅ |

### Endpoints Módulo 03

```
GET    /api/tarifas                        → listar
GET    /api/tarifas/activos                → solo activos
GET    /api/tarifas/por-tipo/{idTipo}      → tarifas de un tipo
GET    /api/tarifas/{id}                   → detalle
POST   /api/tarifas                        → crear
PUT    /api/tarifas/{id}                   → editar
PATCH  /api/tarifas/{id}/desactivar        → activo = false
PATCH  /api/tarifas/{id}/reactivar         → activo = true
DELETE /api/tarifas/{id}                   → eliminar
```

### Reglas de negocio Módulo 03
- Cada tarifa = (tipo habitación, horas) → precio
- Precio hora extra: S/ 5 (Simple/Estándar/Premium) o S/ 10 (resto)
- Máximo 3 horas extra → después se cobra turno adicional
- Turno adicional = precio del bloque completo
- La lógica de extensión se implementa en Módulo 06 (Reservas)

---

## 🔷 Módulo 04 — CLIENTES (✅ CERRADO)

### Tablas

#### `tipos_observacion` (5 filas)
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_tipo_observacion | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| nombre | VARCHAR(50) | UNIQUE, NOT NULL |
| slug | VARCHAR(50) | UNIQUE, NOT NULL |
| icono | VARCHAR(50) | NULL |
| color | VARCHAR(20) | NULL |
| descripcion | VARCHAR(255) | NULL |
| orden | INT | DEFAULT 0 |
| activo | BOOLEAN | DEFAULT true |
| created_at, updated_at | TIMESTAMP | NULL |

**Datos semilla:** Deuda, Daño a la habitación, Mal comportamiento, Documento falso, Bloqueo permanente.

#### `gravedades_observacion` (4 filas)
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_gravedad | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| nombre | VARCHAR(30) | UNIQUE, NOT NULL |
| slug | VARCHAR(30) | UNIQUE, NOT NULL |
| color | VARCHAR(20) | NULL |
| prioridad | INT | DEFAULT 0 |
| activo | BOOLEAN | DEFAULT true |
| created_at, updated_at | TIMESTAMP | NULL |

**Datos semilla:** Baja (1), Media (2), Alta (3), Crítica (4).

#### `clientes`
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_cliente | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| nombre | VARCHAR(100) | NOT NULL |
| apellido | VARCHAR(100) | NULL |
| id_tipo_documento | BIGINT FK NULL | → tipos_documento, onDelete set null |
| numero_documento | VARCHAR(30) | UNIQUE, NULL |
| celular | VARCHAR(20) | NULL |
| email | VARCHAR(150) | NULL |
| fecha_nacimiento | DATE | NULL |
| fecha_aniversario | DATE | NULL |
| direccion | VARCHAR(255) | NULL |
| visitas | INT | DEFAULT 0 |
| ultima_visita | DATE | NULL |
| total_gastado | DECIMAL(10,2) | DEFAULT 0 |
| id_nivel | BIGINT FK NULL | → clientes_niveles, onDelete set null |
| activo | BOOLEAN | DEFAULT true |
| created_at, updated_at | TIMESTAMP | NULL |

**Índices:** `numero_documento`, `id_nivel`.

#### `cliente_visitas`
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_visita | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| id_cliente | BIGINT FK | → clientes, onDelete cascade |
| id_reserva | BIGINT NULL | (futuro, Módulo 06) |
| id_habitacion | BIGINT NULL | (futuro, Módulo 05) |
| fecha_entrada | DATETIME | NOT NULL |
| fecha_salida | DATETIME | NULL |
| monto_gastado | DECIMAL(10,2) | DEFAULT 0 |
| created_at, updated_at | TIMESTAMP | NULL |

#### `cliente_observaciones`
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_observacion | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| id_cliente | BIGINT FK | → clientes, onDelete cascade |
| id_tipo_observacion | BIGINT FK | → tipos_observacion, onDelete restrict |
| id_gravedad | BIGINT FK | → gravedades_observacion, onDelete restrict |
| motivo | VARCHAR(255) | NOT NULL |
| monto_deuda | DECIMAL(10,2) | NULL |
| resuelto | BOOLEAN | DEFAULT false |
| fecha_resolucion | DATETIME | NULL |
| id_usuario_creacion | BIGINT FK | → usuarios, onDelete restrict |
| created_at, updated_at | TIMESTAMP | NULL |

**Índices:** `id_cliente`, `resuelto`.

### Endpoints Módulo 04

**Tipos de Observación (8):**
```
GET    /api/tipos-observacion
GET    /api/tipos-observacion/activos
GET    /api/tipos-observacion/{id}
POST   /api/tipos-observacion
PUT    /api/tipos-observacion/{id}
PATCH  /api/tipos-observacion/{id}/desactivar
PATCH  /api/tipos-observacion/{id}/reactivar
DELETE /api/tipos-observacion/{id}
```

**Gravedades (8):**
```
GET    /api/gravedades-observacion
GET    /api/gravedades-observacion/activos
GET    /api/gravedades-observacion/{id}
POST   /api/gravedades-observacion
PUT    /api/gravedades-observacion/{id}
PATCH  /api/gravedades-observacion/{id}/desactivar
PATCH  /api/gravedades-observacion/{id}/reactivar
DELETE /api/gravedades-observacion/{id}
```

**Clientes (10):**
```
GET    /api/clientes
GET    /api/clientes/activos
GET    /api/clientes/buscar?dni=X
GET    /api/clientes/{id}
POST   /api/clientes
PUT    /api/clientes/{id}
PATCH  /api/clientes/{id}/desactivar
PATCH  /api/clientes/{id}/reactivar
DELETE /api/clientes/{id}
GET    /api/clientes/{id}/visitas
```

**Visitas (5):**
```
GET    /api/clientes/{idCliente}/visitas
GET    /api/cliente-visitas/{id}
POST   /api/clientes/{idCliente}/visitas
PUT    /api/cliente-visitas/{id}
DELETE /api/cliente-visitas/{id}
```

**Observaciones (6):**
```
GET    /api/cliente-observaciones
GET    /api/clientes/{idCliente}/observaciones
GET    /api/cliente-observaciones/{id}
POST   /api/clientes/{idCliente}/observaciones
PATCH  /api/cliente-observaciones/{id}/resolver
DELETE /api/cliente-observaciones/{id}
```

### Reglas de negocio Módulo 04

- **R-CLI-1:** Buscar cliente por DNI primero en BD local
- **R-CLI-2:** Si existe, NO se consulta RENIEC (cuando se active)
- **R-CLI-3:** Al registrar visita → incrementar `visitas`, actualizar `ultima_visita`, sumar `total_gastado`
- **R-CLI-4:** Al recalcular visitas → actualizar automáticamente el `nivel` (Bronce/Plata/Oro/VIP)
- **R-CLI-5:** Cliente con observación pendiente → mostrar alerta al buscar por DNI
- **R-CLI-6:** Los tipos de observación y gravedades son dinámicos (CRUD)

### Lógica de visitas (automática)

**`ClienteVisitaService::crear()`:**
1. Crea fila en `cliente_visitas`
2. Incrementa `clientes.visitas` en 1
3. Actualiza `clientes.ultima_visita = now()`
4. Suma `clientes.total_gastado += monto_gastado`
5. Recalcula nivel (`recalcularNivel()`)
   - Bronce: 0-4 visitas
   - Plata: 5-9 visitas
   - Oro: 10-19 visitas
   - VIP: 20+ visitas

**Este servicio va a ser llamado desde el Módulo 06 (Reservas → Check-in).**

---

## 🔌 Autenticación (Sanctum)

**Configuración:**
- `bootstrap/app.php` registra `routes/api.php`
- Rutas protegidas con `Route::middleware('auth:sanctum')`
- Token: `$usuario->createToken('auth_token')->plainTextToken`

**Flujo:**
1. Cliente envía `POST /api/login` con credenciales
2. Servidor valida, actualiza `ultimo_login`, genera token
3. Token se devuelve en JSON
4. Cliente guarda token y lo manda: `Authorization: Bearer {token}`
5. Token inválido → 401 Unauthorized

---

## 🎯 Reglas de negocio globales (R1-R50)

### Reservas
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

### Caja
- **R17** Solo una caja abierta a la vez
- **R18** Todo movimiento pertenece a caja abierta
- **R19** Vuelto NO es egreso
- **R20** Movimientos no se borran, se anulan
- **R21** Si hay diferencia → observación obligatoria
- **R22** Arqueo por método de pago
- **R23** Egresos requieren responsable

### IGV y Comprobantes
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
- **R38** Uso se registra en `promociones_aplicadas`
- **R39** ⚠️ **Yape/Plin/Depósito/Transferencia Dueña NO entran a caja**

### Inventario
- **R40** Cada movimiento → kardex
- **R41** Consumo descuenta stock
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

---

## 🧪 Cómo probar

### Con PowerShell
```powershell
# Login
$body = @{ nombre_usuario = "nancy"; password = "admin123" } | ConvertTo-Json
$resp = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/login" -Method POST -Body $body -ContentType "application/json"
$token = $resp.token

# Listar pisos
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/pisos" -Headers @{ Authorization = "Bearer $token" }
```

### Con Postman / Thunder Client
1. **POST** `http://localhost:8000/api/login`
2. **Body** → raw → **JSON**:
```json
{ "nombre_usuario": "nancy", "password": "admin123" }
```
3. Copiar `token` de la respuesta
4. Endpoints protegidos: **Headers** → `Authorization: Bearer {token}`

---

## 🚀 Instalación y ejecución

### Requisitos
- PHP 8.2+
- Composer
- MySQL 8 / MariaDB 10.4+

### Pasos

```powershell
# 1. Instalar dependencias
composer install

# 2. Copiar .env
cp .env.example .env

# 3. Generar clave
php artisan key:generate

# 4. Configurar .env con datos de MySQL
#    DB_DATABASE=hospedaje
#    DB_USERNAME=root
#    DB_PASSWORD=

# 5. Crear la BD en MySQL (phpMyAdmin o CLI)
#    Nombre: hospedaje

# 6. Migrar + seed
php artisan migrate
php artisan db:seed
php artisan db:seed --class=ConfiguracionBaseSeeder
php artisan db:seed --class=TarifaSeeder
php artisan db:seed --class=TiposObservacionSeeder
php artisan db:seed --class=GravedadesObservacionSeeder

# 7. Levantar servidor
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

# Tinker (consola interactiva)
php artisan tinker

# Limpiar cachés
php artisan optimize:clear
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Ver logs
Get-Content storage\logs\laravel.log -Tail 50
```

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
| 18 | INTEGRACIÓN RENIEC | ⏳ | ⏳ | ⏳ Pendiente (producción) |

---

## 📝 Detalle de módulos futuros

### Módulo 05 — HABITACIONES
**Tabla:** `habitaciones` (32 filas: piso 1 = 7 habs, piso 2 = 8 habs activas + 1 inactiva, piso 3 = 8 habs, piso 4 = 8 habs)
- Se relaciona con `pisos` y `tipos_habitacion`
- El estado NO se guarda (se calcula en vivo)
- La 208 está inactiva (almacén)

### Módulo 06 — RESERVAS
**Tablas:** `reservas`, `estados_reserva`, `ocupacion_habitacion`, `registros_estadia`, `extensiones_reserva`, `huespedes_adicionales`, `intentos_contacto`
- Tabla central del sistema
- Bloqueo real en `ocupacion_habitacion` (no en `reservas`)
- Buffer de limpieza configurable
- Al hacer check-in: llamar a `ClienteVisitaService::crear()` (ya está listo)
- Extensión: máximo 3h → después turno adicional (con decisión manual del recepcionista)

### Módulo 07 — CAJA
**Tablas:** `caja`, `movimientos_caja`, `arqueo_denominaciones`, `retiros_caja`, `pagos_reserva`, `devoluciones`
- Apertura/cierre de caja
- Solo una caja abierta a la vez
- Yape/Plin/Depósito/Transferencia Dueña NO entran a caja

### Módulo 08 — LIMPIEZA
**Tabla:** `limpieza`
- Cola de limpieza
- Se crea automáticamente al hacer check-out
- Al completar → habitación pasa a Libre

### Módulo 09 — MANTENIMIENTO
**Tabla:** `mantenimiento`
- Reportar avería → habitación a Mantenimiento
- Al finalizar → pasa a Limpieza

### Módulo 10 — INVENTARIO / KARDEX
**Tablas:** `productos`, `categorias_producto`, `kardex`, `inventario_fisico`, `inventario_detalle`

### Módulo 11 — PROVEEDORES
**Tablas:** `proveedores`, `cuentas_por_pagar`, `pagos_proveedor`

### Módulo 12 — PROMOCIONES
**Tablas:** `promociones`, `promociones_aplicadas`, `promociones_cliente`, `temporadas`

### Módulo 13 — COMPROBANTES
**Tablas:** `facturas`, `facturas_detalle`, `tipos_comprobante`, `series_comprobante`, `notas_credito`
- Boleta (B001) y Factura (F001)
- IGV 18% descompuesto

### Módulo 14 — ALERTAS
**Tablas:** `alertas`, `reglas_alerta`, `canales_alerta`
- Cronjob cada minuto
- Alertas críticas por WebSocket

### Módulo 15 — REPORTES
- Ocupación, ingresos, clientes frecuentes
- Exportación PDF y Excel

### Módulo 16 — AUDITORÍA
**Tablas:** `auditoria`, `auditoria_cambios`

### Módulo 17 — ASISTENCIA DE PERSONAL
**Tablas:** `asistencia`, `horas_extra`

### Módulo 18 — INTEGRACIÓN RENIEC
**Función:** `ReniecService::consultar($dni)` (solo producción)

---

## 📌 Reglas de código

| Regla | Obligatorio |
|-------|-------------|
| Idioma | Español (variables, funciones, tablas) |
| Controllers | Delgados, solo llaman al Service |
| Services | Lógica CRUD |
| Reglas | Lógica de negocio compleja |
| Models | Relaciones explícitas |
| Migraciones | `Schema::create` con FK explícitas |
| Seeders | Datos reales, no lorem ipsum |
| Alias | `App\...` siempre |
| Tipos | PHP 8.2 estricto |

### Convenciones
- Controllers: `XxxController.php`
- Models: `Xxx.php`
- Services: `XxxService.php`
- Reglas: `XxxService.php` (en carpeta `Reglas/`)
- Migraciones: `YYYY_MM_DD_HHMMSS_create_xxx_table.php`
- Tablas: `snake_case` plural
- Campos: `snake_case`

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
| D8 | Estado de hab. en vivo | EstadoHabitacionService calcula |
| D9 | RENIEC solo en producción | Ahorro de costos en desarrollo |
| D10 | Visitas se incrementan en check-in | ClienteVisitaService lo maneja |

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

1. **Abrí `backend/README.md`** en VS Code
2. **Seleccioná TODO** el contenido actual (`Ctrl+A`)
3. **Borralo** (`Delete` o `Backspace`)
4. **Pegá TODO el bloque de arriba** (desde `# Backend — Sistema de Hospedaje` hasta el final)
5. **Guardá** (`Ctrl+S`)

---

## 🎯 Después de pegar

**Cuando quieras subirlo a GitHub:**

```bash
cd /c/Users/David/Desktop/hospedaje
git add backend/README.md
git commit -m "docs: actualizo README backend con módulos 01-04"
git push
```

**¿Dale?** 🚀
BACKEND (backend/README.md)
🔹 Qué agregar (7 puntos)
1. Actualizar el título "Estado global"

Buscar:

text
**Estado global:** Módulos 01-04 completados
Reemplazar por:

text
**Estado global:** Módulos 01-05 completados
2. Actualizar la sección "🗄️ Base de datos — Estado actual"

Buscar la tabla y agregar 3 filas nuevas:

markdown
| `categorias_producto` | 7 | 05 | Categorías de productos |
| `proveedores` | 5 | 05 | Proveedores ficticios |
| `productos` | 19 | 05 | Productos (bebidas, snacks, etc.) |
3. Agregar sección completa "🔷 Módulo 05 — PRODUCTOS (Fase 1)"

Insertar después de la sección del Módulo 04 (antes de "🔌 Autenticación"):

markdown
## 🔷 Módulo 05 — PRODUCTOS Fase 1 (✅ CERRADO)

### Tablas

#### `categorias_producto` (7 filas)
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_categoria_producto | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| nombre | VARCHAR(50) | UNIQUE, NOT NULL |
| slug | VARCHAR(50) | UNIQUE, NOT NULL |
| descripcion | VARCHAR(255) | NULL |
| icono | VARCHAR(50) | NULL |
| color | VARCHAR(20) | NULL |
| orden | INT | DEFAULT 0 |
| activo | BOOLEAN | DEFAULT true |

**Datos semilla:** Bebidas, Licores, Golosinas, Snacks, Cuidado Personal, Aseo, Peluches.

#### `proveedores` (5 filas)
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_proveedor | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| razon_social | VARCHAR(100) | NOT NULL |
| nombre_comercial | VARCHAR(100) | NULL |
| ruc | VARCHAR(20) | NULL |
| telefono | VARCHAR(20) | NULL |
| email | VARCHAR(150) | NULL |
| direccion | VARCHAR(255) | NULL |
| contacto | VARCHAR(100) | NULL |
| tipo | VARCHAR(30) | NULL |
| notas | TEXT | NULL |
| activo | BOOLEAN | DEFAULT true |

#### `productos` (19 filas)
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_producto | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| nombre | VARCHAR(100) | NOT NULL |
| descripcion | VARCHAR(255) | NULL |
| id_categoria_producto | BIGINT FK NULL | → categorias_producto |
| id_proveedor | BIGINT FK NULL | → proveedores |
| codigo_barra | VARCHAR(50) | NULL |
| precio_compra | DECIMAL(10,2) | DEFAULT 0 |
| precio_venta | DECIMAL(10,2) | NOT NULL |
| stock_actual | INT | DEFAULT 0 |
| stock_minimo | INT | DEFAULT 10 |
| unidad_medida | VARCHAR(20) | NULL |
| imagen | VARCHAR(255) | NULL |
| activo | BOOLEAN | DEFAULT true |

### Endpoints Módulo 05

**Categorías de Producto (8):**
GET /api/categorias-producto
GET /api/categorias-producto/activos
GET /api/categorias-producto/{id}
POST /api/categorias-producto
PUT /api/categorias-producto/{id}
PATCH /api/categorias-producto/{id}/desactivar
PATCH /api/categorias-producto/{id}/reactivar
DELETE /api/categorias-producto/{id}

**Proveedores (8):**
GET /api/proveedores
GET /api/proveedores/activos
GET /api/proveedores/{id}
POST /api/proveedores
PUT /api/proveedores/{id}
PATCH /api/proveedores/{id}/desactivar
PATCH /api/proveedores/{id}/reactivar
DELETE /api/proveedores/{id}

**Productos (10):**
GET /api/productos
GET /api/productos/activos
GET /api/productos/stock-bajo
GET /api/productos/por-categoria/{idCategoria}
GET /api/productos/{id}
POST /api/productos
PUT /api/productos/{id}
PATCH /api/productos/{id}/desactivar
PATCH /api/productos/{id}/reactivar
DELETE /api/productos/{id}

### Reglas de negocio Módulo 05

- Stock mínimo default = 10
- Productos con `stock_actual <= stock_minimo` se listan en `/stock-bajo`
- Proveedores y categorías son catálogos dinámicos
- Productos opcionalmente asociados a categoría/proveedor
4. Actualizar la sección "🔮 Roadmap de módulos"

Buscar la tabla y agregar la fila del Módulo 05:

markdown
| 05 | PRODUCTOS (Fase 1) | ✅ | ✅ | ✅ CERRADO |
Y ajustar la fila del 06 (antes decía HABITACIONES):

markdown
| 06 | PROMOCIONES | ⏳ | ⏳ | ⏳ Pendiente |
| 07 | HABITACIONES | ⏳ | ⏳ | ⏳ Pendiente |
| 08 | RESERVAS | ⏳ | ⏳ | ⏳ Pendiente |
5. Agregar en la sección "📌 Reglas de negocio globales" (por si falta)

Al final, después de las 50 reglas actuales, agregar:

markdown
### Productos (nuevas)
- **R51** Producto con `stock_actual <= stock_minimo` se marca como "stock bajo"
- **R52** Los productos NO se eliminan si tienen movimientos en kardex (futuro)
- **R53** Los proveedores NO se eliminan si tienen productos asociados
6. Actualizar la sección "👥 Credenciales de prueba"

No hay cambios (sigue siendo nancy/admin123).

7. Actualizar la última línea

Buscar:

text
**Última actualización:** 02/10/2026
**Módulos completados:** 4 de 18
Reemplazar por:

text
**Última actualización:** 03/10/2026
**Módulos completados:** 5 de 18
