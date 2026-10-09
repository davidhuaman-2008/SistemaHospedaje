================================================================================
=== SISTEMA DE HOSPEDAJE - HISTORIAL COMPLETO DE DESARROLLO ===
=== Fecha: 08/10/2026 ===
=== Sesion: Sistema de Descuentos + Bloqueo Dinamico + Bug Fixes ===
================================================================================

================================================================================
=== 1. CONTEXTO DEL PROYECTO ===
================================================================================

Sistema de gestion para hospedaje de rotacion rapida (alquiler por horas).

TECNOLOGIAS:
- Backend:  Laravel 12, PHP 8.2, MySQL 8, Sanctum
- Frontend: React 19, TypeScript 6, Vite 8, Tailwind CSS v4,
            shadcn/ui, Zustand 5, React Router v7, axios, sonner

MODULOS COMPLETADOS (~19):
- 01 AUTH (login, roles, turnos, usuarios)
- 02 CONFIG-BASE (pisos, tipos-hab, tipos-doc, metodos-pago,
                  categorias-mov, niveles-cliente)
- 03 TARIFAS
- 04 CLIENTES + Observaciones
- 05 PRODUCTOS Fase 1 (productos, categorias, proveedores)
- 06 PROMOCIONES
- 07 PAQUETES DECORACION (catalogo)
- 08 HABITACIONES
- 09A RECEPCION / WALK-IN
- 09B RESERVAS FUTURAS
- 09C EXTENSIONES TIEMPO
- 10 DECORACIONES APLICADAS
- 13 CUENTAS POR PAGAR
- 14 LIMPIEZA
- 15 MANTENIMIENTO
- OBS OBSERVACIONES CLIENTE
- PAGOS PAGOS MIXTOS + VUELTO
- CONS CONSUMOS MULTIPLES
- DESC DESCUENTOS AUTOMATICOS (NUEVO en esta sesion)

MODULOS PENDIENTES:
- 11 CAJA (critico - siguiente)
- 12 KARDEX / Inventario
- 16 SUNAT / Comprobantes
- 17 ALERTAS
- 18 REPORTES
- 19 AUDITORIA
- 20 ASISTENCIA
- 21 RENIEC

================================================================================
=== 2. REGLAS DEL PROYECTO (NO NEGOCIABLES) ===
================================================================================

R1 - NADA HARDCODEADO
     Todo sale de la BD. Si puede cambiar sin tocar codigo -> va a BD.
     Ejemplo: descuentos, tarifas, categorias, etc. se leen de configuraciones.

R2 - POCO CODIGO POR ARCHIVO
     100 archivos de 30 lineas > 10 archivos de 300 lineas.

R3 - FUNCIONAL > ELEGANTE
     Si algo es "elegante pero confuso" -> simplificar.

R4 - ESTADO DE HABITACION SE CALCULA EN VIVO
     No se guarda en la BD. Se calcula en EstadoHabitacionService.

R5 - SISTEMA EN TIEMPO REAL
     Usado AHORA por: duena (celular), recepcionista (tablet),
     limpieza (celular), cajero (PC).

R9 - BACKEND ES LA FUENTE DE VERDAD
     Validaciones en backend. Calculos de dinero vienen del backend.

R10 - PALETA DE COLORES DE ESTADOS (vienen del BACKEND)
      Disponible    -> #10b981 (verde)
      Ocupada       -> #ef4444 (rojo)
      Por vencer    -> #f59e0b (amarillo)
      Vencida       -> #dc2626 (rojo oscuro)
      Limpieza      -> #06b6d4 (celeste)
      Mantenimiento -> #f97316 (naranja)
      Reservada     -> #7c3aed (morado)
      Con-Decoracion-> #ec4899 (rosa)
      Inactiva      -> #475569 (gris)

R11 - MANEJO DE ERRORES
      - Nunca any en catch -> catch (e: unknown)
      - Nunca alert() -> toast.error()
      - Nunca window.confirm() -> ConfirmDialog
      - Usar mensajeDeError(e) para extraer mensaje del backend

R12 - ICONOS DINAMICOS
      Todos los CRUDs con campo icono DEBEN usar <IconPicker /> para editar
      Todas las tablas con columna icono DEBEN usar <IconoDinamico /> para mostrar

================================================================================
=== 3. TRABAJO REALIZADO EN ESTA SESION ===
================================================================================

--------------------------------------------------------------------------------
3.1. SISTEMA DE DESCUENTOS AUTOMATICOS (R1: nada hardcodeado)
--------------------------------------------------------------------------------

OBJETIVO:
  Aplicar descuentos automaticos al monto de habitacion al crear reservas:
  - Por nivel del cliente (Plata 5%, Oro 8%, VIP 12%)
  - Por cumpleanos (10% si fecha nacimiento coincide con hoy)
  - Por aniversario (15% si casado + fecha coincide con hoy)
  NO acumulables por defecto: se aplica SOLO EL MAYOR.

IMPLEMENTACION BACKEND:

  1. Migracion: add_casado_to_clientes_table.php
     - Agrega columna 'casado' (boolean, default false) a clientes

  2. Migracion: update_niveles_descuentos.php
     - Actualiza porcentajes: Bronce 0%, Plata 5%, Oro 8%, VIP 12%

  3. Seeder: ConfiguracionSistemaSeeder.php
     - Agrega 5 configs dinamicas:
       * descuento_cumpleanos_porcentaje = 10
       * descuento_aniversario_porcentaje = 15
       * descuento_cumpleanos_activo = true
       * descuento_aniversario_activo = true
       * descuento_aplica_a = 'mayor' (o 'suma' con tope 100%)

  4. Service NUEVO: DescuentoService.php
     - obtenerConfiguraciones(): devuelve configs para el frontend
     - obtenerManuales(): devuelve opciones manuales (solo aniversario)
     - calcular(cliente, fechaEntrada, montoHabitacion, manuales):
       * Lee nivel del cliente (clientes_niveles.descuento)
       * Verifica cumpleanos (fecha nacimiento = hoy, dia+mes)
       * Verifica aniversario (casado + fecha aniversario = hoy)
       * Combina segun config descuento_aplica_a (mayor o suma)
       * Aplica tope maximo (descuento_manual_max_porcentaje)

  5. Controller NUEVO: DescuentoController.php
     - GET /api/descuentos/config
     - GET /api/descuentos/manuales

  6. Service MODIFICADO: ReservaService.php
     - crearWalkIn(): usa DescuentoService::calcular()
     - crearReserva(): usa DescuentoService::calcular()
     - Acepta parametros manuales del request:
       * descuento_manual_aniversario (bool)
       * descuento_manual_cumpleanos (bool)
       * descuento_manual_motivo (string)
     - Guarda en reservas: descuento_manual_tipo, descuento_manual_motivo,
       descuento_manual_usuario_id (auditoria)

  7. Migracion NUEVA: add_descuento_manual_to_reservas_table.php
     - Agrega 3 columnas a reservas:
       * descuento_manual_tipo (string 30, nullable)
       * descuento_manual_motivo (string 255, nullable)
       * descuento_manual_usuario_id (FK a usuarios, nullable)

  8. Controller MODIFICADO: ReservaController.php
     - Validacion en walkIn() y store():
       * descuento_manual_aniversario (nullable|boolean)
       * descuento_manual_cumpleanos (nullable|boolean)
       * descuento_manual_motivo (nullable|string|max:255)

IMPLEMENTACION FRONTEND:

  1. Type NUEVO: src/types/descuento.ts
     - DescuentoConfig (5 campos)
     - ResultadoDescuento (porcentaje, motivo, monto, tipo)
     - DescuentoManualOpcion (tipo, label, emoji, porcentaje, descripcion)
     - DescuentoManualesConfig (habilitado, motivo_requerido, max_porcentaje, opciones)

  2. Service NUEVO: src/services/descuentoService.ts
     - obtenerConfiguraciones(): GET /api/descuentos/config
     - obtenerManuales(): GET /api/descuentos/manuales

  3. Lib NUEVO: src/lib/descuentos.ts
     - calcularDescuento(cliente, fechaEntrada, montoHabitacion, config, manuales)
     - Funcion interna: coincideDiaMes() -> maneja zona horaria UTC vs local

  4. Componente NUEVO: src/components/DescuentosManualesSwitch.tsx
     - Switch COLAPSADO por defecto
     - Al hacer click se expande
     - SOLO muestra "Aniversario" (cumpleanos ya se aplica automatico)
     - Si hay motivo requerido, lo pide obligatoriamente
     - Muestra "APLICADO" cuando hay descuento activo
     - Al cerrar limpia el estado

  5. Page MODIFICADA: src/pages/recepcion/RegistrarIngresoPage.tsx
     - Carga descuentoService.obtenerConfiguraciones() + obtenerManuales()
     - Banner rosa dinamico cuando hay descuento
     - Switch de descuentos manuales (colapsado)
     - Fix: validar disponibilidad ANTES de crear cliente (evita huerfanos)
     - Fix: mensaje 422 mas claro
     - Cliente virtual para descuento (usa clienteNuevo si no hay cliente)

  6. Page MODIFICADA: src/pages/reservas/NuevaReservaPage.tsx
     - Mismos cambios que RegistrarIngresoPage
     - Aplica a reservas futuras

  7. CRUD Cliente MODIFICADO: ClienteForm.tsx
     - Nuevo checkbox "Casado (acta verificada)"
     - Campo fecha_aniversario con label dinamico
     - Campos normalizados

  8. Tabla Cliente MODIFICADA: ClienteTabla.tsx
     - Columna F. Aniv. con badge 💍 si casado
     - Columna F. Nac. coloreada en rosa

--------------------------------------------------------------------------------
3.2. BLOQUEO DINAMICO POR HABITACION (R1: dinamico)
--------------------------------------------------------------------------------

OBJETIVO:
  La habitacion se bloquea (morada) cuando YA NO ALCANZA el tiempo para
  hacer un walk-in con la duracion MAXIMA + tiempo de limpieza.

EJEMPLO:
  Habitacion con tarifa maxima 8h + 1h limpieza = 9h antes
  Si reserva es a las 02:00 -> se bloquea a las 17:00 del dia anterior

  Si el cajero intenta alquilar a las 17:00 -> PERMITIDO (8h termina 01:00,
  1h limpieza = 02:00, justo antes de la reserva)
  Si el cajero intenta alquilar a las 17:30 -> RECHAZADO (choca con reserva)

FORMULA:
  horas_bloqueo = max_horas_tarifa_habitacion + horas_limpieza

CONFIGURACION NUEVA:
  horas_limpieza_bloqueo_reserva = 1 (INT, grupo 'reservas')

MODIFICACION:
  EstadoHabitacionService.php
  - Antes: usaba Configuracion::obtener('horas_antes_bloqueo_reserva', 4)
  - Ahora: calcula dinamico:
    * Obtiene max_horas_tarifa_habitacion (query a tarifas)
    * Obtiene horas_limpieza_bloqueo_reserva (config)
    * Suma ambas
    * Fallback: si no hay tarifas, usa el valor viejo

EJEMPLOS DE BLOQUEO POR HABITACION:
  Hab 105 (Safari, max 12h)  -> bloqueo 13h antes
  Hab 101 (Estandar, max 12h)-> bloqueo 13h antes
  Hab 107 (Simple, max 4h)   -> bloqueo 5h antes
  Hab 209 (Jacuzzi VIP, 12h) -> bloqueo 13h antes

--------------------------------------------------------------------------------
3.3. FIX: RESERVAS CON CHECK-IN FALSO (bug de sesion anterior)
--------------------------------------------------------------------------------

PROBLEMA DETECTADO:
  Algunas reservas DEC- tenian:
  - estado = 'activa'
  - registro_estadia con fecha_entrada FUTURA
  - Esto se creaba por un bug previo que ya no sabemos de donde viene

  Consecuencia: la habitacion aparecia como DISPONIBLE (verde) cuando
  deberia estar MORADA/ROSA por tener reserva proxima.

CAUSA:
  EstadoHabitacionService buscaba reservas con:
  - estado IN ('confirmada', 'pendiente')
  - whereDoesntHave('registroEstadia')

  Pero las reservas DEC- tenian estado 'activa' + registro_estadia futuro,
  entonces NINGUNA condicion aplicaba -> caia en "Disponible".

FIX APLICADO (3 partes):

  1. Limpieza de datos:
     - Script artisan tinker que borra registro_estadia si fecha_entrada > now()
     - Cambia estado a 'confirmada' si estaba 'activa' con fecha futura

  2. EstadoHabitacionService - Bloque "Ocupada":
     - Antes: contaba como Ocupada si fecha_inicio <= now()
     - Ahora: ADEMAS verifica que registro_estadia.fecha_entrada <= now()
       (si es futuro -> no es check-in real, se maneja como reserva)

  3. EstadoHabitacionService - Bloque "Reserva sin check-in":
     - Antes: solo buscaba confirmadas/pendientes sin check-in
     - Ahora: TAMBIEN busca 'activas' con fecha_entrada FUTURA
       (esto detecta las DEC- con check-in falso)

RESULTADO:
  Hab 105 -> aparece ROSA (Con-Decoracion) ✅
  Hab 301 -> aparece ROSA ✅
  Hab 401 -> aparece ROSA ✅

--------------------------------------------------------------------------------
3.4. FIX: CLIENTE HUERFANO AL CREAR WALK-IN QUE FALLA
--------------------------------------------------------------------------------

PROBLEMA:
  Cuando se intentaba crear un walk-in en hab. NO disponible:
  1. Frontend creaba el cliente (POST /api/clientes) -> EXITO
  2. Frontend intentaba crear walk-in -> FALLA 422
  3. Cliente quedaba HUERFANO en la BD (sin reserva)

FIX APLICADO:
  RegistrarIngresoPage.tsx - funcion registrarIngreso():
  - ANTES de crear el cliente, verifica disponibilidad:
    const estadoHab = await habitacionMapaService.obtener(id)
    if (estadoHab.estado.estado !== 'Disponible') {
      toast.error(...)
      return  // NO crea cliente
    }

RESULTADO:
  Ya no quedan clientes huerfanos. ✅

--------------------------------------------------------------------------------
3.5. FIX: ZONA HORARIA EN COMPARACION DE FECHAS
--------------------------------------------------------------------------------

PROBLEMA:
  Cliente con fecha_nacimiento = '1991-10-07' y hoy = '2026-10-07'
  NO aplicaba el descuento de cumpleanos.

CAUSA:
  - cliente.fecha_nacimiento viene como '1991-10-07T00:00:00.000Z' (UTC)
  - fechaEntrada = new Date() -> hora LOCAL del navegador (Peru = UTC-5)
  - Se comparaba: cumple.getUTCDate() === fechaEntrada.getUTCDate()
  - Si en Peru son las 22:00, en UTC ya es 03:00 del dia siguiente
  - Entonces getUTCDate() daba distinto

FIX APLICADO:
  src/lib/descuentos.ts - funcion coincideDiaMes():
  - Extraer dia+mes del cumple: cumple.getUTCDate() (UTC)
  - Extraer dia+mes de fechaEntrada: fechaEntrada.getDate() (LOCAL)
  - Comparar ambos en su propio contexto (no forzar UTC)

RESULTADO:
  Cliente con fecha nacimiento = hoy -> aplica descuento ✅

--------------------------------------------------------------------------------
3.6. LIMPIEZA: PROMOCIONES VIEJAS (R1: nada hardcodeado)
--------------------------------------------------------------------------------

PROBLEMA:
  Las 6 promociones del seeder inicial tenian porcentajes hardcodeados
  que no coincidian con las nuevas configuraciones:
  - Descuento Cumpleanos 20% (deberia ser 10%)
  - Descuento Aniversario 15% (correcto)
  - Cliente VIP 10% (deberia venir de clientes_niveles)

FIX APLICADO:
  Script artisan tinker:
  - Elimina las 6 promociones viejas
  - Lee porcentajes de configuraciones (R1)
  - Inserta 3 promociones dinamicas:
    * Descuento Cumpleanos (10% - desde config)
    * Descuento Aniversario (15% - desde config)
    * Cliente frecuente (5% - referencia nivel Plata)

RESULTADO:
  /promociones muestra solo 3 promos dinamicas ✅

--------------------------------------------------------------------------------
3.7. UX: PANEL DE DESCUENTOS MANUALES COLAPSADO
--------------------------------------------------------------------------------

PROBLEMA:
  El panel de descuentos manuales estaba SIEMPRE visible,
  ocupando espacio y confundiendo al recepcionista.

FIX APLICADO:
  DescuentosManualesSwitch.tsx:
  - Estado colapsado por defecto (solo 1 linea)
  - Al hacer click se expande
  - Al cerrar (X) se colapsa y limpia el estado
  - SOLO muestra opciones que NO tengan automatico
  - Cumpleanos NO se muestra como manual (ya es automatico)
  - Aniversario SI se muestra como manual (requiere verificacion)

RESULTADO:
  UX mas limpia ✅

--------------------------------------------------------------------------------
3.8. FIX: BUG DE COMPILACION TYPESCRIPT
--------------------------------------------------------------------------------

PROBLEMA:
  Build fallaba con 16 errores de TypeScript:
  - Imports sin usar (TS6133) en 10+ archivos
  - Tipo de CSS side-effect import (TS2882) en main.tsx

FIX APLICADO:

  1. main.tsx: agregar // @ts-ignore al import CSS
     PERO esto rompio el CSS en runtime (Tailwind no cargaba)

  2. main.tsx: REVERTIR y crear src/vite-env.d.ts con:
     declare module "*.css" { const content: string; export default content }

  3. Limpiar imports sin usar en:
     - IconPicker.tsx (Check)
     - SelectorFechaHora.tsx (onChangeHoras)
     - CuentasPorPagarPage.tsx (mensajeDeError)
     - AgregarConsumoModal.tsx (Minus, Wallet, CreditCard, DollarSign)
     - ConfirmarDeudaModal.tsx (idReserva)
     - ConfirmarVueltoModal.tsx (Banknote, idReserva)
     - ModalExtensionTiempo.tsx (nombreCliente, idCliente!)
     - decoracion.ts (Cliente, Habitacion)
     - reserva.ts (MetodoPago)

RESULTADO:
  Build OK ✅ (✓ built in ~1s)

--------------------------------------------------------------------------------
3.9. EXPORTS DE CODIGO PARA OTRA IA
--------------------------------------------------------------------------------

MOTIVO:
  Compartir el codigo completo del proyecto con otra IA para que
  entienda el contexto sin necesidad de pasar archivo por archivo.

ARCHIVOS GENERADOS EN _exports_frontend/:
  - front_00_services.txt (33 services)
  - front_01_types.txt (16 types)
  - front_02_hooks.txt (1 hook)
  - front_03_lib.txt (3 libs)
  - front_04_components.txt (14 components)
  - front_10_pages_ALL.txt (~50 pages)
  - front_99_raiz.txt (App.tsx + main.tsx)

ARCHIVOS GENERADOS EN _exports_backend/:
  - back_00_migraciones.txt (~45 migrations)
  - back_01_seeders.txt (~17 seeders)
  - back_02_models.txt (~40 models)
  - back_03_services.txt (~36 services)
  - back_04_controllers.txt (~36 controllers)

================================================================================
=== 4. BUGS ENCONTRADOS Y SOLUCIONADOS ===
================================================================================

BUG #1: Descuento de cumpleanos no aplicaba por zona horaria
  - Archivo: src/lib/descuentos.ts
  - Fix: coincideDiaMes() usa getDate/getMonth (local) vs getUTCDate/getUTCMonth

BUG #2: Cliente huerfano cuando walk-in fallaba
  - Archivo: RegistrarIngresoPage.tsx
  - Fix: validar disponibilidad antes de crear cliente

BUG #3: Habitacion con reserva DEC- aparecia como Disponible
  - Archivo: EstadoHabitacionService.php
  - Fix: detectar 'activas' con fecha_entrada futura como reserva proxima

BUG #4: Reservas con check-in falso (registro_estadia con fecha futura)
  - Fix: script artisan tinker para limpiar

BUG #5: Descuento por nivel no aplicaba (cliente nuevo con cumpleanos)
  - Archivo: RegistrarIngresoPage.tsx
  - Fix: usar cliente virtual con datos del form (clienteNuevo)

BUG #6: Panel de descuentos manuales siempre visible (UX fea)
  - Archivo: DescuentosManualesSwitch.tsx
  - Fix: colapsado por defecto, expandible

BUG #7: Cumpleanos aparecia 2 veces (automatico + manual)
  - Archivo: DescuentosManualesSwitch.tsx + DescuentoService.php
  - Fix: filtrar opciones automaticas, solo mostrar aniversario

BUG #8: CSS no cargaba en runtime (main.tsx)
  - Fix: crear vite-env.d.ts con declare module "*.css"

BUG #9: 16 errores de TypeScript al compilar
  - Fix: limpiar imports sin usar

BUG #10: Archivo basura main.tsxIconPicker.tsx
  - Fix: eliminar (era un archivo creado por error)

BUG #11: Reserva 105 con fecha futura pero estado 'activa'
  - Fix: script tinker + EstadoHabitacionService cambios

BUG #12: Bloqueo de habitacion fijo en 4h (hardcodeado)
  - Fix: bloqueo dinamico por habitacion (max_tarifa + limpieza)

================================================================================
=== 5. ESTADO ACTUAL DE LA BASE DE DATOS ===
================================================================================

CONFIGURACIONES (tabla configuraciones):

  Grupo 'reservas':
  - tolerancia_extension_minutos = 30
  - buffer_limpieza_minutos = 30
  - tolerancia_no_show_minutos = 60
  - horas_antes_bloqueo_reserva = 4 (FALLBACK)
  - horas_antes_decoracion = 24
  - anticipacion_minima_reserva_minutos = 30
  - horas_limpieza_bloqueo_reserva = 1 (NUEVA)

  Grupo 'descuentos':
  - descuento_cumpleanos_porcentaje = 10
  - descuento_aniversario_porcentaje = 15
  - descuento_cumpleanos_activo = true
  - descuento_aniversario_activo = true
  - descuento_aplica_a = 'mayor'
  - descuento_manual_habilitado = true (NUEVA)
  - descuento_manual_motivo_requerido = true (NUEVA)
  - descuento_manual_max_porcentaje = 20 (NUEVA)

  Grupo 'comprobantes':
  - igv_porcentaje = 18

  Grupo 'general':
  - moneda_simbolo = 'S/'

NIVELES CLIENTE (tabla clientes_niveles):
  - Bronce: 0-4 visitas, 0%
  - Plata: 5-9 visitas, 5%
  - Oro: 10-19 visitas, 8%
  - VIP: 20+ visitas, 12%

PROMOCIONES ACTIVAS (tabla promociones):
  - Descuento Cumpleanos (10%)
  - Descuento Aniversario (15%)
  - Cliente frecuente (5%)

CAMPOS NUEVOS EN RESERVAS:
  - descuento_manual_tipo (string 30, nullable)
  - descuento_manual_motivo (string 255, nullable)
  - descuento_manual_usuario_id (FK usuarios, nullable)

CAMPO NUEVO EN CLIENTES:
  - casado (boolean, default false)

================================================================================
=== 6. FLUJOS DEL SISTEMA ===
================================================================================

--------------------------------------------------------------------------------
6.1. CREAR WALK-IN (RegistrarIngresoPage)
--------------------------------------------------------------------------------

  1. Cliente llega -> recepcionista carga DNI
  2. Si cliente existe -> muestra datos + nivel + descuento
  3. Si cliente es nuevo -> carga datos + fecha nacimiento
  4. Recepcionista elige tarifa
  5. SISTEMA: calcula descuento automatico
     - Por nivel (si aplica)
     - Por cumpleanos (si fecha coincide con hoy)
  6. Banner rosa aparece con el descuento aplicado
  7. Recepcionista elige metodo de pago
  8. Si cliente pide descuento especial (ej: aniversario):
     - Click en "¿El cliente pide descuento especial?"
     - Se expande panel
     - Verifica constancia del cliente
     - Marca "Aniversario" + ingresa motivo
     - Se aplica 15%
  9. Recepcionista click "Registrar Ingreso"

--------------------------------------------------------------------------------
6.2. CREAR RESERVA FUTURA (NuevaReservaPage)
--------------------------------------------------------------------------------

  1. Cliente llama -> reserva para fecha futura
  2. Recepcionista carga DNI
  3. Elegir tipo de servicio (solo reserva o con decoracion)
  4. Elegir fecha + hora
  5. Elegir duracion (4h, 6h, 8h, 12h)
  6. Elegir habitacion disponible
  7. Elegir tarifa
  8. SISTEMA: calcula descuento (igual que walk-in)
  9. Si con decoracion -> elegir paquete
  10. Si aplica -> descuento manual
  11. Ingresar adelanto (opcional)
  12. Click "Crear Reserva"

--------------------------------------------------------------------------------
6.3. BLOQUEO DINAMICO DE HABITACION
--------------------------------------------------------------------------------

  Regla: habitacion morada cuando ya no se puede alquilar por walk-in
  con la duracion MAXIMA + limpieza.

  Ejemplo:
  - Habitacion con tarifa max 8h + 1h limpieza = 9h antes
  - Reserva para 20/10 a las 02:00
  - Se bloquea a las 17:00 del 19/10

  Estado del mapa:
  - Verde: disponible
  - Morado: reserva proxima (<= 9h antes)
  - Rosa: reserva con decoracion proxima
  - Rojo: ocupada
  - Amarillo: por vencer (30 min restantes)

--------------------------------------------------------------------------------
6.4. CICLO DE VIDA DE UNA RESERVA
--------------------------------------------------------------------------------

  Estados:
  - pendiente -> confirmada -> activa -> finalizada
  - cancelada (cliente cancelo)
  - anulada (error del recepcionista)
  - no-show (cliente no llego)

  Codigos:
  - WK-XXXXXX: walk-in (cliente fisico)
  - RES-XXXXXX: reserva futura normal
  - DEC-XXXXXX: reserva con decoracion

================================================================================
=== 7. COSAS PENDIENTES PARA PROXIMAS SESIONES ===
================================================================================

MODULO 11 - CAJA (PRIORIDAD ALTA):
  - Apertura de caja
  - Movimientos (ingresos/egresos)
  - Arqueo por metodo de pago
  - Cierre de caja
  - Reglas R17-R23, R39 ya definidas
  - Solo metodos 'es_de_caja = true' entran

MODULO 16 - SUNAT:
  - Comprobantes (boleta, factura)
  - Series y correlativos
  - IGV 18% (ya configurado)

MODULO 12 - KARDEX:
  - Movimientos de stock
  - Ajustes
  - Mermas

MODULO 18 - REPORTES:
  - Ocupacion
  - Ingresos por turno
  - Top clientes
  - Cierre mensual

MODULO 17 - ALERTAS:
  - Notificaciones en vivo
  - Stock bajo
  - Reservas proximas
  - Clientes morosos

MODULO 19 - AUDITORIA:
  - Log de cambios
  - Quien hizo que
  - IP + user agent

MODULOS 20-21 (baja prioridad):
  - Asistencia personal
  - Integracion RENIEC

================================================================================
=== 8. CREDENCIALES DE PRUEBA ===
================================================================================

  Usuario: nancy
  Password: admin123
  Rol: admin
  Turno: Libre

  Usuarios adicionales:
  - leydi (encargado, Mañana)
  - perez (recepcionista, Noche)
  - miguel (recepcionista, Noche)
  - david (recepcionista, Noche)
  - limpieza (limpieza, Mañana)
  - cajero (cajero, Mañana)

================================================================================
=== 9. COMANDOS UTILES ===
================================================================================

BACKEND:
  cd backend
  php artisan serve
  php artisan migrate
  php artisan db:seed --class=ConfiguracionSistemaSeeder
  php artisan tinker
  php artisan optimize:clear

FRONTEND:
  cd frontend
  npm run dev
  npm run build
  npm install

GIT:
  cd C:\Users\David\Desktop\hospedaje
  git add .
  git commit -m "mensaje"
  git push

================================================================================
=== 10. DECISIONES TECNICAS IMPORTANTES ===
================================================================================

D1: Cada Page.tsx incluye <AppLayout> (pagina autocontenida)
D2: Services devuelven data.data en POST/PUT (backend anida respuesta)
D3: Token en localStorage.token (interceptor axios lo lee)
D4: Interceptor NO muestra toast para 404 (consumidor maneja)
D5: Dropdowns del Sidebar con useState por ruta
D6: Badges con bg-X-900 text-X-300 (legibles en modo oscuro)
D7: Page/Form/Tabla por cada CRUD (cada archivo <100 lineas)
D8: ConfirmDialog en vez de window.confirm()
D9: Normalizar fechas ISO a YYYY-MM-DD en forms
D10: Modo Editar automatico si DNI existe
D11: ProductoPage carga SOLO productos al inicio (optimizacion)
D12: Stock coloreado dinamicamente
D13: IconPicker para campos de icono
D14: IconoDinamico para mostrar iconos
D15: Modales anidados con early return
D16: Mapa auto-refresh cada 15s
D17: Colores de estado vienen del backend
D18: Vuelto final = pagado - total (calculado en CheckoutPage)
D19: Formatear tiempo con formatearTiempo() (evita decimales)
D20: Calculo de diferencia en cambio habitacion en frontend + confirmacion
D21: Filtros en vivo (no guardados)
D22: Chips con contadores
D23: Carrito multiple en consumos
D24: 3 modos de cobro (a cuenta / unico / parcial-mixto)
D25: Iconos dinamicos en pagos
D26: Boton "Limpieza Rapida" masivo
D27: Boton "Reportar" mantenimiento en el mapa
D28: Modal al click en habitacion Limpieza/Mantenimiento
D29: ConfirmarVueltoModal + ConfirmarDeudaModal al check-out
D30: Orden del form: Cliente -> Fecha -> Duracion -> Habitacion -> Tarifa
D31: SelectorFechaHora con toggle visual/manual
D32: Input de hora libre
D33: SelectorDisponibilidad con colores por motivo
D34: CheckInReservaPage con cobro del saldo inline
D35: Boton "Anular Reserva" con motivos rapidos
D36: RecepcionPage navega a check-in al click en morado
D37: CheckoutPage bloquea si no hay check-in
D38: Panel "Estadias" separado de "Reservas"
D39: Descuentos automaticos por nivel/cumpleanos/aniversario (R1)
D40: Toggle "Solo Reserva / Reserva + Decoracion"
D41: Selector de paquete se carga DESPUES de elegir habitacion
D42: Prefijo DEC- para reservas decoradas
D43: Listado separado /reservas-decoradas
D44: Color rosa #ec4899 para Con-Decoracion
D45: Texto del cobro en check-in es explicito
D46: Descuentos manuales con switch colapsado
D47: Cumpleanos automatico (no manual)
D48: Aniversario manual (requiere verificacion constancia)
D49: Bloqueo dinamico por habitacion (max_tarifa + limpieza)
D50: Validacion de disponibilidad ANTES de crear cliente

================================================================================
=== 11. ESTRUCTURA DE CARPETAS ===
================================================================================

FRONTEND:
  src/
  ├── components/
  │   ├── layout/        (AppLayout, Sidebar)
  │   ├── ui/            (shadcn: alert-dialog, button, card, input, label)
  │   ├── ConfirmDialog.tsx
  │   ├── DescuentosManualesSwitch.tsx
  │   ├── IconoDinamico.tsx
  │   ├── IconPicker.tsx
  │   ├── ProtectedRoute.tsx
  │   ├── SelectorDisponibilidad.tsx
  │   └── SelectorFechaHora.tsx
  ├── hooks/             (useAuth)
  ├── lib/               (descuentos, errores, utils)
  ├── pages/
  │   ├── clientes/
  │   ├── configuracion/
  │   ├── cuentasPagar/
  │   ├── decoraciones/
  │   ├── estadias/
  │   ├── limpieza/
  │   ├── mantenimiento/
  │   ├── productos/
  │   ├── promociones/
  │   ├── recepcion/
  │   ├── reservas/
  │   ├── usuarios/
  │   ├── DashboardPage.tsx
  │   └── LoginPage.tsx
  ├── services/
  ├── types/
  ├── App.tsx
  └── main.tsx

BACKEND:
  app/
  ├── Console/Commands/
  ├── Http/Controllers/
  ├── Models/
  └── Services/
  database/
  ├── migrations/
  └── seeders/
  routes/
  ├── api.php
  ├── console.php
  └── web.php

================================================================================
=== FIN DEL DOCUMENTO ===
================================================================================