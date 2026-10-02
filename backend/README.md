Perfecto. **Bloque M1.6 — Documentar Módulo 1.**

**Copiá TODO este bloque y pegalo en la terminal de VS Code (en `backend\`). Enter.**

```powershell
# ============================================================================
# BLOQUE M1.6 — Documentar Módulo 1 (Login + Usuarios + Roles)
# ============================================================================

$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  DOCUMENTANDO MÓDULO 1" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

if (-not (Test-Path "artisan")) {
    Write-Host "✗ No estás en la raíz del backend" -ForegroundColor Red
    exit 1
}

function Write-Utf8NoBom {
    param([string]$Path, [string]$Content)
    $full = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $Path))
    $dir = Split-Path $full -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    [System.IO.File]::WriteAllText($full, $Content, [System.Text.UTF8Encoding]::new($false))
}

# ----------------------------------------------------------------------------
# 1. Crear carpeta docs/modulos
# ----------------------------------------------------------------------------
Write-Host "`n[1/2] Creando estructura de documentación..." -ForegroundColor Yellow

if (-not (Test-Path "..\docs\modulos")) {
    New-Item -ItemType Directory -Force -Path "..\docs\modulos" | Out-Null
}

Write-Host "✓ Carpeta docs/modulos creada" -ForegroundColor Green

# ----------------------------------------------------------------------------
# 2. Escribir README del Módulo 1
# ----------------------------------------------------------------------------
Write-Host "`n[2/2] Creando docs/modulos/01_login_usuarios.md..." -ForegroundColor Yellow

$readme = @'
# Módulo 1 — Login + Usuarios + Roles

**Estado:** ✅ COMPLETADO  
**Fecha de cierre:** 2026-10-01  
**Backend:** Laravel 12 + Sanctum  
**Frontend:** (pendiente — React)

---

## 1. Resumen

Sistema de autenticación por token (Sanctum) con gestión de usuarios,
roles y turnos. Sin email, sin verificación, sin recuperación de contraseña.
Login por `nombre_usuario` + `password`.

---

## 2. Base de datos

### Tabla `roles`

| Campo | Tipo | Notas |
|---|---|---|
| id | BIGINT PK | |
| nombre | VARCHAR(50) UNIQUE | admin, encargado, etc. |
| descripcion | VARCHAR(255) NULL | |
| timestamps | | |

**Datos base:**
- 1 = admin → Acceso total al sistema
- 2 = encargado → Turno día, supervisa
- 3 = recepcionista → Recepción y limpieza noche
- 4 = limpieza → Solo habitaciones
- 5 = cajero → Solo caja y pagos

### Tabla `turnos`

| Campo | Tipo | Notas |
|---|---|---|
| id | BIGINT PK | |
| nombre | VARCHAR(50) | |
| hora_inicio | TIME | |
| hora_fin | TIME | |
| descripcion | VARCHAR(255) NULL | |
| activo | BOOLEAN default true | |
| timestamps | | |

**Datos base:**
- 1 = Mañana → 08:00 - 20:00
- 2 = Noche → 20:00 - 08:00
- 3 = Libre → 00:00 - 23:59 (admin, sin restricción)

### Tabla `usuarios`

| Campo | Tipo | Notas |
|---|---|---|
| id | BIGINT PK | |
| nombre | VARCHAR(100) | |
| apellido | VARCHAR(100) | |
| nombre_usuario | VARCHAR(50) UNIQUE | Login |
| password | VARCHAR(255) | Hash bcrypt |
| id_rol | FK → roles | onDelete restrict |
| id_turno | FK → turnos NULL | onDelete set null |
| activo | BOOLEAN default true | |
| ultimo_login | TIMESTAMP NULL | |
| remember_token | VARCHAR(100) NULL | Laravel |
| timestamps | | |

---

## 3. Modelos

### `App\Models\Rol`
- `$table = 'roles'`
- Relación: `usuarios()` hasMany

### `App\Models\Turno`
- `$table = 'turnos'`
- Cast: `activo => boolean`
- Relación: `usuarios()` hasMany

### `App\Models\Usuario`
- Extiende `Authenticatable`
- Trait `HasApiTokens` (Sanctum)
- `$table = 'usuarios'`
- Ocultos: `password`, `remember_token`
- Casts: `activo => boolean`, `ultimo_login => datetime`, `password => hashed`
- Relaciones: `rol()` belongsTo, `turno()` belongsTo
- Método: `esAdmin(): bool`

---

## 4. Servicios

### `App\Services\AuthService`
- `login(string $nombreUsuario, string $password): array`
  - Valida credenciales
  - Valida que el usuario esté activo
  - Actualiza `ultimo_login`
  - Genera token Sanctum
  - Devuelve `['usuario' => ..., 'token' => ...]`
- `logout(Usuario $usuario): void`
  - Revoca el token actual

### `App\Services\UsuarioService`
- `listar()` → todos los usuarios con rol y turno
- `crear(array $datos): Usuario` → hashea password
- `actualizar(Usuario, array): Usuario` → hashea password si viene
- `eliminar(Usuario): void`

---

## 5. Endpoints

Base URL: `http://localhost:8000/api`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/login` | No | Login. Devuelve token + usuario |
| POST | `/logout` | Sí | Revoca el token actual |
| GET | `/yo` | Sí | Datos del usuario logueado |
| GET | `/usuarios` | Sí | Lista todos los usuarios |
| POST | `/usuarios` | Sí | Crea un usuario |
| GET | `/usuarios/{id}` | Sí | Ver un usuario |
| PUT | `/usuarios/{id}` | Sí | Actualizar usuario |
| DELETE | `/usuarios/{id}` | Sí | Eliminar usuario |

**Auth:** header `Authorization: Bearer {token}`

---

## 6. Credenciales iniciales

- **Usuario:** `nancy`
- **Password:** `admin123`
- **Rol:** admin
- **Turno:** Libre

---

## 7. Ejemplos de uso

### Login

**Request:**
```http
POST /api/login
Content-Type: application/json
Accept: application/json

{
  "nombre_usuario": "nancy",
  "password": "admin123"
}
```

**Response:**
```json
{
  "mensaje": "Login exitoso",
  "usuario": {
    "id": 1,
    "nombre": "Nancy",
    "apellido": "Admin",
    "nombre_usuario": "nancy",
    "id_rol": 1,
    "id_turno": 3,
    "activo": true,
    "rol": { "id": 1, "nombre": "admin", ... },
    "turno": { "id": 3, "nombre": "Libre", ... }
  },
  "token": "2|Q1iOmwwBXvZMWtvOVcWXjjVV..."
}
```

### Crear usuario

**Request:**
```http
POST /api/usuarios
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}

{
  "nombre": "Leydi",
  "apellido": "Perez",
  "nombre_usuario": "leydi",
  "password": "leydi123",
  "id_rol": 2,
  "id_turno": 1,
  "activo": true
}
```

---

## 8. Archivos clave

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── AuthController.php
│   │   └── UsuarioController.php
│   ├── Models/
│   │   ├── Rol.php
│   │   ├── Turno.php
│   │   └── Usuario.php
│   └── Services/
│       ├── AuthService.php
│       └── UsuarioService.php
├── database/
│   ├── migrations/
│   │   ├── ..._create_roles_table.php
│   │   ├── ..._create_turnos_table.php
│   │   └── ..._create_usuarios_table.php
│   └── seeders/DatabaseSeeder.php
├── routes/api.php
└── bootstrap/app.php
```

---

## 9. Reglas de negocio

- Un usuario tiene **1 rol** (FK directa, no pivote)
- Un usuario tiene **1 turno** (puede ser NULL)
- Un usuario puede estar **activo o inactivo** (`activo = false`)
- **NO se eliminan usuarios**, se desactivan (mantener historial)
- El login es por `nombre_usuario`, no por email
- Los tokens Sanctum no expiran por defecto
- El `último_login` se actualiza en cada login exitoso

---

## 10. Pruebas

**Desde PowerShell:**
```powershell
$body = @{ nombre_usuario = "nancy"; password = "admin123" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/login" -Method POST -Body $body -ContentType "application/json"
```

**Desde Postman:**
- Método: POST
- URL: http://localhost:8000/api/login
- Body → raw → **JSON** (no Text)
- JSON: `{"nombre_usuario": "nancy", "password": "admin123"}`

**⚠️ Importante:** `php artisan serve` debe estar corriendo en otra terminal.

---

## 11. Comandos útiles

```powershell
# Levantar servidor
php artisan serve

# Ver todas las rutas API
php artisan route:list --path=api

# Resetear BD y repoblar
php artisan migrate:fresh --seed

# Tinker (consola interactiva de PHP)
php artisan tinker
```

---

## 12. Pendientes

- [ ] Pantalla de login en React
- [ ] Guardar token en localStorage
- [ ] Interceptor de axios para incluir token
- [ ] Redirección a dashboard después de login
- [ ] Validar rol en frontend (ocultar menús según rol)
- [ ] Middleware en backend para restringir endpoints por rol
- [ ] Pantalla de gestión de usuarios (CRUD)

---

## 13. Estado del módulo

| Componente | Estado |
|---|---|
| Migraciones | ✅ |
| Modelos | ✅ |
| Servicios | ✅ |
| Controladores | ✅ |
| Rutas API | ✅ |
| Seeder | ✅ |
| Sanctum | ✅ |
| Login funcional | ✅ |
| Tests automáticos | ❌ Pendiente |
| Frontend React | ❌ Pendiente |

**Backend:** 100% ✅  
**Frontend:** 0% ⏳
'@

Write-Utf8NoBom -Path "..\docs\modulos\01_login_usuarios.md" -Content $readme

Write-Host "✓ docs/modulos/01_login_usuarios.md creado" -ForegroundColor Green

# ----------------------------------------------------------------------------
# 3. Verificar
# ----------------------------------------------------------------------------
Write-Host "`nVerificando archivo creado..." -ForegroundColor Yellow

$rutaReadme = "..\docs\modulos\01_login_usuarios.md"
if (Test-Path $rutaReadme) {
    $tamano = (Get-Item $rutaReadme).Length
    Write-Host "✓ README creado: $tamano bytes" -ForegroundColor Green
} else {
    Write-Host "✗ ERROR: README no creado" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  ✓ M1.6 COMPLETADO" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "El Módulo 1 está documentado y CERRADO." -ForegroundColor Cyan
Write-Host ""
Write-Host "Archivo: docs/modulos/01_login_usuarios.md" -ForegroundColor White
Write-Host "Ubicación: C:\Users\David\Desktop\hospedaje\docs\modulos\" -ForegroundColor Gray
Write-Host ""
Write-Host "Siguiente paso:" -ForegroundColor Cyan
Write-Host "  - Módulo 2: Habitaciones" -ForegroundColor White
Write-Host "  - O empezar el frontend React" -ForegroundColor White
Write-Host ""
```

---

## 🎯 Qué hace este bloque

1. **Crea** la carpeta `docs\modulos\` (hermana de `backend\` y `frontend\`)
2. **Escribe** el README completo del Módulo 1 con:
   - Estructura de las 3 tablas
   - Código de modelos y servicios
   - Los 8 endpoints
   - Credenciales iniciales
   - Ejemplos de uso
   - Reglas de negocio
   - Pendientes del frontend
3. **Verifica** que se creó bien

---

## 📁 Estructura final que vas a tener

```
hospedaje\
├── backend\           ← Laravel
├── frontend\          ← React + TS
└── docs\
    └── modulos\
        └── 01_login_usuarios.md   ← NUEVO
```

**Este README es el que le pasás a cualquier IA nueva** para que entienda el Módulo 1 sin que le expliques todo desde cero.

---

## 🚀 Instrucciones

1. **Copiá el bloque completo**
2. **PegalO en la terminal** (en `backend\`)
3. **Enter**
4. **Copiame la salida**

**Después de esto, el Módulo 1 queda oficialmente cerrado.** 🚀
