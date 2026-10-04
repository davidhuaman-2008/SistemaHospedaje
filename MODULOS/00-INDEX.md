📄 1. MODULOS/00-INDEX.md (completo)
Abrí MODULOS/00-INDEX.md, seleccioná todo (Ctrl+A), borrá y pegá esto:

markdown
# 📘 Índice de Módulos — Sistema de Hospedaje

**Última actualización:** 03/10/2026

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

## 📊 Estado de los módulos

| # | Módulo | Backend | Frontend | Estado |
|---|--------|---------|----------|--------|
| 01 | AUTH (usuarios, roles, turnos) | OK | OK | CERRADO |
| 02 | CONFIG-BASE (6 tablas) | OK | OK | CERRADO |
| 03 | TARIFAS | OK | OK | CERRADO |
| 04 | CLIENTES (5 tablas) | OK | OK | CERRADO |
| 05 | PRODUCTOS - Fase 1 (3 tablas) | OK | OK | CERRADO |
| 06 | PROMOCIONES | FALTA | FALTA | Pendiente |
| 07 | HABITACIONES | FALTA | FALTA | Pendiente |
| 08 | RESERVAS | FALTA | FALTA | Pendiente |
| 09 | DECORACIONES | FALTA | FALTA | Pendiente |
| 10 | CAJA | FALTA | FALTA | Pendiente |
| 11 | INVENTARIO / KARDEX | FALTA | FALTA | Pendiente |
| 12 | LIMPIEZA | FALTA | FALTA | Pendiente |
| 13 | MANTENIMIENTO | FALTA | FALTA | Pendiente |
| 14 | COMPROBANTES | FALTA | FALTA | Pendiente |
| 15 | ALERTAS | FALTA | FALTA | Pendiente |
| 16 | REPORTES | FALTA | FALTA | Pendiente |
| 17 | AUDITORÍA | FALTA | FALTA | Pendiente |
| 18 | ASISTENCIA DE PERSONAL | FALTA | FALTA | Pendiente |
| 19 | INTEGRACIÓN RENIEC | FALTA | FALTA | Pendiente (producción) |

---

## 🎯 Cómo continuar (para la próxima IA)

1. Leer este archivo (`00-INDEX.md`)
2. Leer el archivo del módulo actual (ej: `05-PRODUCTOS.md`)
3. Continuar desde donde quedó

**No hace falta leer más. Con 2 archivos entiende el sistema.**

---

## 🎯 Orden recomendado de los próximos módulos
PROMOCIONES (catálogo, 1 sesión)

HABITACIONES (1 tabla, 32 filas, 1 sesión)

RESERVAS (el corazón, 2-3 sesiones)

DECORACIONES (necesita Reservas)

CAJA (necesita Reservas)

INVENTARIO (necesita Reservas)

LIMPIEZA (necesita Reservas)

MANTENIMIENTO (independiente)

COMPROBANTES (necesita Reservas + Clientes)

ALERTAS (necesita Reservas + Productos)

REPORTES (necesita todo)

AUDITORÍA (transversal)

ASISTENCIA (independiente)

RENIEC (solo producción)