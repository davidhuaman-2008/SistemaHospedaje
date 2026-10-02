# 📘 README completo del Backend

**Copiá TODO este bloque y pegalo en la terminal (`backend/`). Enter.**

```powershell
# ============================================================================
# README COMPLETO DEL BACKEND — Sistema de Hospedaje
# ============================================================================

$ErrorActionPreference = "Stop"

if (-not (Test-Path "artisan")) {
    Write-Host "✗ No estás en backend" -ForegroundColor Red
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
# Backend — Sistema de Hospedaje

**Framework:** Laravel 12
**PHP:** 8.2.12
**Base de datos:** MySQL 8 (MariaDB 10.4)
**Autenticación:** Laravel Sanctum (Bearer tokens)
**Estado global:** Módulo 02 completado (Backend + Frontend)

---

## 📌 Descripción

API REST para gestión completa de un hospedaje de rotación rápida (por horas / corta estadía). Cubre autenticación, usuarios, roles, turnos, configuración base, clientes con fidelización, habitaciones, reservas, caja, inventario, promociones, comprobantes, alertas y reportes.

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
│   │       └── ClienteNivelController.php
│   ├── Models/
│   │   ├── Usuario.php
│   │   ├── Rol.php
│   │   ├── Turno.php
│   │   ├── Piso.php
│   │   ├── TipoHabitacion.php
│   │   ├── TipoDocumento.php
│   │   ├── MetodoPago.php
│   │   ├── CategoriaMovimiento.php
│   │   └── ClienteNivel.php
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
│   │   └── ClienteNivelService.php
│   ├── Reglas/                    (lógica de negocio compleja - futura)
│   │   └── .gitkeep
│   └── Providers/
│       └── AppServiceProvider.php
├── bootstrap/
│   └── app.php
├── config/                         (configuración Laravel)
├── database/
│   ├── migrations/
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   ├── 2026_10_01_130753_create_personal_access_tokens_table.php
│   │   ├── 2026_10_01_130952_create_roles_table.php
│   │   ├── 2026_10_01_130953_create_turnos_table.php
│   │   ├── 2026_10_01_130953_create_usuarios_table.php
│   │   ├── 2026_10_02_200001_create_pisos_table.php
│   │   ├── 2026_10_02_200002_create_tipos_habitacion_table.php
│   │   ├── 2026_10_02_200003_create_tipos_documento_table.php
│   │   ├── 2026_10_02_200004_create_metodos_pago_table.php
│   │   ├── 2026_10_02_200005_create_categorias_movimiento_table.php
│   │   └── 2026_10_02_200006_create_clientes_niveles_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       └── ConfiguracionBaseSeeder.php
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

### Tablas creadas (Módulo 01 + Módulo 02)

| Tabla | Filas | Módulo | Propósito |
|-------|-------|--------|-----------|
| `roles` | 5 | 01 | Roles del sistema |
| `turnos` | 3 | 01 | Turnos (Mañana, Noche, Libre) |
| `usuarios` | 1 | 01 | Usuarios del sistema |
| `personal_access_tokens` | 0 | 01 | Tokens Sanctum |
| `pisos` | 4 | 02 | Pisos del hospedaje |
| `tipos_habitacion` | 8 | 02 | Tipos de habitación |
| `tipos_documento` | 4 | 02 | DNI, RUC, CE, Pasaporte |
| `metodos_pago` | 10 | 02 | Métodos de pago |
| `categorias_movimiento` | 23 | 02 | Categorías ingreso/egreso |
| `clientes_niveles` | 4 | 02 | Niveles de fidelización |

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

## 🔷 Módulo 02 — CONFIG-BASE (🔨 Backend + Frontend listos)

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

#### `tipos_documento` (4 filas)
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id_documento | BIGINT UNSIGNED PK | AUTO_INCREMENT |
| nombre | VARCHAR(50) | UNIQUE, NOT NULL |
| abreviatura | VARCHAR(10) | UNIQUE, NOT NULL |
| longitud | INT | NULL |
| activo | BOOLEAN | DEFAULT true |
| created_at, updated_at | TIMESTAMP | NULL |

**Datos semilla:** DNI (8), RUC (11), Carné de Extranjería (12), Pasaporte (NULL).

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

**Datos semilla:** Bronce (0-4, 0%), Plata (5-9, 5%), Oro (10-19, 10%), VIP (20+, 15%).

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
GET /api/categorias-movimiento?tipo=Ingreso  → filtrar por tipo
GET /api/categorias-movimiento?tipo=Egreso   → filtrar por tipo
```

### Reglas de negocio Módulo 02
- Todos los catálogos son CRUD (nada hardcodeado)
- Se puede crear/editar/desactivar cualquier ítem
- Soft delete vía `activo = false` (no se borra físicamente)
- `metodos_pago.es_de_caja` define si un pago entra a caja o va a la dueña
- Cada cambio queda en auditoría (futuro)

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

## 📋 Validaciones por endpoint

### POST `/login`
| Campo | Regla |
|-------|-------|
| nombre_usuario | required, string |
| password | required, string |

### POST/PUT `/usuarios`
| Campo | Regla |
|-------|-------|
| nombre | required, string, max:100 |
| apellido | required, string, max:100 |
| nombre_usuario | required, string, max:50, unique:usuarios |
| password | required, string, min:6 |
| id_rol | required, exists:roles,id |
| id_turno | nullable, exists:turnos,id |
| activo | boolean |

### POST/PUT `/roles`
| Campo | Regla |
|-------|-------|
| nombre | required (POST) / sometimes (PUT), string, max:50, unique:roles |
| descripcion | nullable, string, max:255 |
| activo | sometimes, boolean |

### POST/PUT `/turnos`
| Campo | Regla |
|-------|-------|
| nombre | required, string, max:50 |
| hora_inicio | required |
| hora_fin | required |
| descripcion | nullable, string, max:255 |
| activo | sometimes, boolean |

### POST/PUT `/pisos`
| Campo | Regla |
|-------|-------|
| nombre | required, string, max:50, unique:pisos |
| descripcion | nullable, string, max:255 |
| orden | nullable, integer |
| activo | boolean |

### POST/PUT `/tipos-habitacion`
| Campo | Regla |
|-------|-------|
| nombre | required, string, max:50, unique |
| slug | required, string, max:50, unique |
| descripcion | nullable, string, max:255 |
| capacidad | nullable, integer, min:1 |
| camas | nullable, integer, min:1 |
| tiene_jacuzzi | boolean |
| activo | boolean |

### POST/PUT `/tipos-documento`
| Campo | Regla |
|-------|-------|
| nombre | required, string, max:50, unique |
| abreviatura | required, string, max:10, unique |
| longitud | nullable, integer, min:1 |
| activo | boolean |

### POST/PUT `/metodos-pago`
| Campo | Regla |
|-------|-------|
| nombre | required, string, max:50, unique |
| descripcion | nullable, string, max:255 |
| es_de_caja | required, boolean |
| icono | nullable, string, max:50 |
| color | nullable, string, max:20 |
| orden | nullable, integer |
| activo | boolean |

### POST/PUT `/categorias-movimiento`
| Campo | Regla |
|-------|-------|
| nombre | required, string, max:50 |
| tipo | required, in:Ingreso,Egreso |
| descripcion | nullable, string, max:255 |
| orden | nullable, integer |
| activo | boolean |

### POST/PUT `/clientes-niveles`
| Campo | Regla |
|-------|-------|
| nombre | required, string, max:50, unique |
| visitas_min | required, integer, min:0 |
| visitas_max | nullable, integer, min:0 |
| descuento | required, numeric, min:0, max:100 |
| color | nullable, string, max:20 |
| icono | nullable, string, max:50 |
| beneficios | nullable, string |
| activo | boolean |

---

## 🧬 Modelos y sus relaciones

### Módulo 01

```
usuarios.id_rol   → roles.id       (belongsTo)
usuarios.id_turno → turnos.id      (belongsTo)
roles.usuarios    → hasMany
turnos.usuarios   → hasMany
```

### Módulo 02 (relaciones futuras)

```
clientes.id_tipo_documento → tipos_documento.id_documento
clientes.id_nivel          → clientes_niveles.id_nivel
habitaciones.id_piso       → pisos.id_piso
habitaciones.id_tipo       → tipos_habitacion.id_tipo
tarifas.id_tipo            → tipos_habitacion.id_tipo
pagos_reserva.id_metodo    → metodos_pago.id_metodo
movimientos_caja.id_metodo → metodos_pago.id_metodo
movimientos_caja.id_categoria → categorias_movimiento.id_categoria
```

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
- **R39** ⚠️ **Yape/Plin/Depósito/Transferencia Dueña NO entran a caja** (van a cuenta personal)

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

# Listar usuarios
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/usuarios" -Headers @{ Authorization = "Bearer $token" }

# Listar pisos
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/pisos" -Headers @{ Authorization = "Bearer $token" }

# Métodos de pago de caja
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/metodos-pago/de-caja" -Headers @{ Authorization = "Bearer $token" }
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
| 18 | INTEGRACIÓN RENIEC | ⏳ | ⏳ | ⏳ Pendiente (solo producción) |

---

## 📝 Detalle del roadmap

### Módulo 03 — TARIFAS
**Tabla:** `tarifas` (15 filas)
- id_tarifa, id_tipo FK, horas, monto, precio_hora_extra, max_horas_extra, precio_turno_adicional
- UNIQUE (id_tipo, horas)
- Se relaciona con `tipos_habitacion`

### Módulo 04 — CLIENTES
**Tablas:** `clientes`, `cliente_visitas`, `cliente_observaciones`
- Cliente se identifica por DNI (UNIQUE)
- Búsqueda local primero → si no existe, RENIEC (futuro)
- Contador de visitas se incrementa en check-in
- Observaciones: deuda, daño, mal comportamiento, bloqueo
- Nivel se recalcula automáticamente

### Módulo 05 — HABITACIONES
**Tabla:** `habitaciones` (32 filas)
- 4 pisos × 8 habitaciones
- La 208 está inactiva (es almacén)
- Se relaciona con `pisos` y `tipos_habitacion`

### Módulo 06 — RESERVAS
**Tablas:** `reservas`, `estados_reserva`, `ocupacion_habitacion`, `registros_estadia`, `extensiones_reserva`, `huespedes_adicionales`, `intentos_contacto`
- Tabla central del sistema
- Bloqueo real en `ocupacion_habitacion` (no en `reservas`)
- Buffer de limpieza configurable

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
- Cada movimiento genera registro en kardex
- Consumo descuenta stock

### Módulo 11 — PROVEEDORES
**Tablas:** `proveedores`, `cuentas_por_pagar`, `pagos_proveedor`
- Cuentas por pagar por decoración
- Pago a proveedor

### Módulo 12 — PROMOCIONES
**Tablas:** `promociones`, `promociones_aplicadas`, `promociones_cliente`, `temporadas`
- 5 promociones activas
- Se aplica la mejor por defecto
- Acumulables se suman

### Módulo 13 — COMPROBANTES
**Tablas:** `facturas`, `facturas_detalle`, `tipos_comprobante`, `series_comprobante`, `notas_credito`
- Boleta (B001) y Factura (F001)
- IGV 18% descompuesto
- Emisión electrónica a SUNAT (futuro)

### Módulo 14 — ALERTAS
**Tablas:** `alertas`, `reglas_alerta`, `canales_alerta`
- Cronjob cada minuto
- Alertas críticas por WebSocket
- Anti-duplicados por clave única

### Módulo 15 — REPORTES
- Ocupación, ingresos, clientes frecuentes
- Exportación PDF y Excel

### Módulo 16 — AUDITORÍA
**Tablas:** `auditoria`, `auditoria_cambios`
- Registra cada acción sensible
- Cambios campo a campo

### Módulo 17 — ASISTENCIA DE PERSONAL
**Tablas:** `asistencia`, `horas_extra`
- Entrada/salida de cada trabajador
- Cálculo de horas extra y tardanzas

### Módulo 18 — INTEGRACIÓN RENIEC
**Función:** `ReniecService::consultar($dni)`
- Se activa SOLO en producción
- Al registrar cliente nuevo, autocompleta datos
- Si falla → permite registro manual

---

## 📌 Reglas de código

| Regla | Obligatorio |
|-------|-------------|
| Idioma | Español (variables, funciones, tablas) |
| Estilos | Tailwind CSS (nunca CSS puro) |
| Componentes UI | shadcn/ui |
| Estado global | Zustand |
| HTTP | axios con `api.ts` |
| Routing | react-router-dom v7 |
| Alias | `@/` siempre |
| Tipos | TypeScript estricto (nunca `any`) |
| Iconos | lucide-react |
| Toasts | sonner (nunca `alert()`) |
| Confirmaciones | ConfirmDialog |
| Tema | Oscuro (slate-950, slate-900) |

### Estructura de capas
- `pages/` → una página por ruta. Si >100 líneas → dividir en Page/Form/Tabla
- `components/ui/` → shadcn (NO modificar)
- `components/layout/` → Sidebar, Header
- `services/` → llamadas HTTP (nunca lógica en componentes)
- `hooks/` → estado global (Zustand)
- `types/` → interfaces TypeScript
- `Reglas/` → lógica de negocio compleja

### Convenciones
- Componentes: `PascalCase.tsx`
- Servicios/utilidades: `camelCase.ts`
- Tipos: `PascalCase`
- Funciones: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`

---

## 📝 Decisiones técnicas tomadas

| # | Decisión | Razón |
|---|----------|-------|
| D1 | Yape/Plin/Depósito Dueña NO entran a caja | El dinero va a la cuenta personal de la dueña |
| D2 | Métodos 7 y 8 del intento anterior no se usan | Eran duplicados |
| D3 | Cobro de reserva en 2 pasos | Al crear reserva se abre modal de cobro |
| D4 | Catálogos dinámicos | Métodos de pago y categorías vienen de BD |
| D5 | Precios con IGV incluido | Regla de negocio peruana |
| D6 | Buffer de limpieza = 30 min | Configurable |
| D7 | Tolerancia No-Show = 60 min | Configurable |
| D8 | Método de pago 1 default | Efectivo es el más común |
| D9 | Al anular pago se revierte caja | PagoService lo maneja |
| D10 | Estado de hab. en vivo | EstadoHabitacionService calcula |

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
Write-Host "Archivo: backend/README.md ($tamano bytes)" -ForegroundColor White
Write-Host ""
Write-Host "Contenido:" -ForegroundColor Cyan
Write-Host "  1. Descripcion general" -ForegroundColor White
Write-Host "  2. Reglas del proyecto (R1, R2, R3)" -ForegroundColor White
Write-Host "  3. Estructura de carpetas completa" -ForegroundColor White
Write-Host "  4. Base de datos (10 tablas actuales)" -ForegroundColor White
Write-Host "  5. Modulo 01 AUTH (tablas + endpoints + reglas)" -ForegroundColor White
Write-Host "  6. Modulo 02 CONFIG-BASE (6 tablas + endpoints)" -ForegroundColor White
Write-Host "  7. Autenticacion Sanctum" -ForegroundColor White
Write-Host "  8. Validaciones por endpoint" -ForegroundColor White
Write-Host "  9. Modelos y relaciones" -ForegroundColor White
Write-Host "  10. Reglas de negocio R1-R50" -ForegroundColor White
Write-Host "  11. Como probar (PowerShell + Postman)" -ForegroundColor White
Write-Host "  12. Instalacion paso a paso" -ForegroundColor White
Write-Host "  13. Comandos utiles" -ForegroundColor White
Write-Host "  14. Roadmap de 18 modulos" -ForegroundColor White
Write-Host "  15. Detalle de cada modulo futuro" -ForegroundColor White
Write-Host "  16. Reglas de codigo" -ForegroundColor White
Write-Host "  17. Decisiones tecnicas" -ForegroundColor White
Write-Host "  18. Credenciales de prueba" -ForegroundColor White
Write-Host ""
Write-Host "Ahora subi a GitHub:" -ForegroundColor Yellow
Write-Host "  cd C:\Users\David\Desktop\hospedaje" -ForegroundColor White
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m 'docs: README backend completo con roadmap de 18 modulos'" -ForegroundColor White
Write-Host "  git push" -ForegroundColor White
Write-Host ""
```

---

## 📋 Qué incluye el README

| Sección | Contenido |
|---------|-----------|
| **Reglas del proyecto** | R1 (nada hardcodeado), R2 (poco código), R3 (funcional > elegante) |
| **Estructura completa** | Árbol de carpetas con TODOS los archivos |
| **Base de datos** | 10 tablas con esquema, tipos, restricciones |
| **Módulo 01 (AUTH)** | Tablas + 18 endpoints + reglas + semilla |
| **Módulo 02 (CONFIG-BASE)** | 6 tablas + 48 endpoints + reglas + 53 registros semilla |
| **Reglas de negocio** | R1-R50 con descripción |
| **Modelos y relaciones** | Diagrama de FK actuales y futuras |
| **Autenticación** | Flujo completo Sanctum |
| **Validaciones** | Todas las reglas por endpoint |
| **Testing** | Ejemplos con PowerShell + Postman |
| **Instalación** | Paso a paso |
| **Comandos útiles** | 8 comandos con descripción |
| **Roadmap** | 18 módulos con estado |
| **Detalle de cada módulo futuro** | Qué tablas, qué hace, dependencias |
| **Decisiones técnicas** | D1-D10 |
| **Reglas de código** | 12 reglas + estructura de capas + convenciones |

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
   git commit -m "docs: README backend completo con roadmap de 18 modulos"
   git push
   ```

---

## 📌 Pegame:

1. **La salida del bloque** (los mensajes de OK)
2. **El tamaño del README** (bytes)
3. **(Opcional) Un screenshot del README abierto en VS Code**

**¿Dale?** 🚀
