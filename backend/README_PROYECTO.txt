================================================================================
=== SISTEMA DE HOSPEDAJE - HISTORIAL BACKEND ===
=== Fecha: 08/10/2026 ===
=== Sesion: Sistema de Descuentos + Bloqueo Dinamico + Bug Fixes ===
================================================================================

================================================================================
=== 1. CONTEXTO DEL BACKEND ===
================================================================================

API REST para sistema de hospedaje de rotacion rapida.

TECNOLOGIAS:
- Laravel 12
- PHP 8.2.12
- MySQL 8 (MariaDB 10.4)
- Laravel Sanctum (Bearer tokens)
- Eloquent ORM

ARQUITECTURA:
  Controllers delgados (solo orquestan)
  + Services (CRUD + logica de negocio)
  + Models Eloquent (relaciones)
  + Reglas/Config desde BD (R1)

================================================================================
=== 2. REGLAS DEL PROYECTO (NO NEGOCIABLES) ===
================================================================================

R1 - NADA HARDCODEADO
     Todo sale de la BD. Si puede cambiar sin tocar codigo -> va a BD.
     Los porcentajes, configuraciones, descuentos, etc. viven en
     la tabla `configuraciones`.

R2 - POCO CODIGO POR ARCHIVO
     100 archivos de 30 lineas > 10 archivos de 300 lineas.
     1 archivo = 1 responsabilidad.

R3 - FUNCIONAL > ELEGANTE
     Si algo es "elegante pero confuso" -> simplificar.

R4 - ESTADO SE CALCULA EN VIVO
     El estado de habitacion NO se guarda.
     Se calcula en EstadoHabitacionService.

R5 - SISTEMA EN TIEMPO REAL
     NO es un CRUD academico. Es un sistema real usado AHORA.
     Implicaciones:
     - Transacciones DB obligatorias en operaciones multi-tabla
     - Validaciones fuertes en backend
     - Auditoria de quien hizo que
     - Estados calculados en vivo (no guardados)

R9 - BACKEND ES LA FUENTE DE VERDAD
     El frontend solo muestra y captura.

================================================================================
=== 3. TRABAJO REALIZADO EN ESTA SESION ===
================================================================================

--------------------------------------------------------------------------------
3.1. SISTEMA DE DESCUENTOS AUTOMATICOS (R1)
--------------------------------------------------------------------------------

OBJETIVO:
  Aplicar descuentos automaticos al monto de habitacion:
  - Por nivel del cliente (Bronce 0%, Plata 5%, Oro 8%, VIP 12%)
  - Por cumpleanos (10% si fecha_nacimiento coincide con hoy, dia+mes)
  - Por aniversario (15% si casado + fecha_aniversario coincide con hoy)
  NO acumulables por defecto: se aplica SOLO EL MAYOR.
  Configurable: descuento_aplica_a = 'mayor' o 'suma' (tope 100%)

--------------------------------------------------------------------------------
ARCHIVOS CREADOS:

1. app/Services/DescuentoService.php  (NUEVO)
   - obtenerConfiguraciones():
       Devuelve las 5 configs de descuentos desde configuraciones.
   - obtenerManuales():
       Devuelve opciones de descuentos manuales disponibles.
       IMPORTANTE: Solo devuelve 'aniversario' porque cumpleanos
       ya es automatico (no necesita override manual).
   - calcular($cliente, $fechaEntrada, $montoHabitacion, $manualesAplicar = []):
       * Desc. por NIVEL: lee cliente.nivel.descuento
       * Desc. por CUMPLEANOS: verifica fecha_nacimiento (dia+mes)
       * Desc. por ANIVERSARIO: casado + fecha_aniversario (dia+mes)
       * Combina segun config descuento_aplica_a
       * Aplica tope descuento_manual_max_porcentaje
       * Devuelve: {porcentaje, motivo, monto, tipo}

2. app/Http/Controllers/DescuentoController.php  (NUEVO)
   - GET /api/descuentos/config      -> configs automaticas
   - GET /api/descuentos/manuales    -> opciones manuales

3. database/migrations/
     2026_10_08_000002_add_casado_to_clientes_table.php  (NUEVO)
        - Agrega columna 'casado' (boolean, default false) a clientes

     2026_10_08_000003_update_niveles_descuentos.php  (NUEVO)
        - Actualiza porcentajes:
          Bronce: 0% (sin cambio)
          Plata:  5% (sin cambio)
          Oro:    8% (antes 10%)
          VIP:    12% (antes 15%)

     2026_10_07_213244_add_descuento_manual_to_reservas_table.php  (NUEVO)
        - Agrega a reservas:
          * descuento_manual_tipo (string 30, nullable)
          - descuento_manual_motivo (string 255, nullable)
          - descuento_manual_usuario_id (FK usuarios, nullable)

4. Configuraciones agregadas al Seeder:
     Grupo 'descuentos':
       - descuento_cumpleanos_porcentaje = 10
       - descuento_aniversario_porcentaje = 15
       - descuento_cumpleanos_activo = true
       - descuento_aniversario_activo = true
       - descuento_aplica_a = 'mayor'
       - descuento_manual_habilitado = true
       - descuento_manual_motivo_requerido = true
       - descuento_manual_max_porcentaje = 20

     Grupo 'reservas':
       - horas_limpieza_bloqueo_reserva = 1  (NUEVA)

--------------------------------------------------------------------------------
ARCHIVOS MODIFICADOS:

1. app/Services/ReservaService.php
   crearWalkIn():
     - ANTES: descuento hardcodeado (nivel * monto)
     - AHORA: usa DescuentoService::calcular() con manuales opcionales
     - Acepta: descuento_manual_aniversario, descuento_manual_cumpleanos,
               descuento_manual_motivo
     - Guarda: descuento_manual_tipo, descuento_manual_motivo,
               descuento_manual_usuario_id

   crearReserva():
     - Mismos cambios que crearWalkIn()

2. app/Services/EstadoHabitacionService.php
   Bloque "Ocupada" (paso 3):
     - ANTES: contaba como Ocupada si fecha_inicio <= now()
     - AHORA: ADEMAS valida que registro_estadia.fecha_entrada <= now()
       (check-in real, no futuro)

   Bloque "Reserva sin check-in" (paso 4):
     - ANTES: solo reservas confirmadas/pendientes sin check-in
     - AHORA: TAMBIEN detecta 'activas' con fecha_entrada > now()
       (esto captura reservas con check-in falso)

   Bloque de BLOQUEO DINAMICO:
     - ANTES: Configuracion::obtener('horas_antes_bloqueo_reserva', 4)
     - AHORA: calcula dinamicamente:
       $maxHorasTarifa = max horas de tarifas activas del tipo de hab
       $horasLimpieza = config horas_limpieza_bloqueo_reserva (1)
       $horasAntes = $maxHorasTarifa + $horasLimpieza
       (fallback: si no hay tarifas, usa el valor viejo)

3. app/Http/Controllers/ReservaController.php
   walkIn() y store():
     - Agrega validaciones:
       * descuento_manual_aniversario (nullable|boolean)
       * descuento_manual_cumpleanos (nullable|boolean)
       * descuento_manual_motivo (nullable|string|max:255)

4. database/seeders/ConfiguracionSistemaSeeder.php
   - Agrega 8 configs nuevas (5 descuentos + 1 limpieza + 2 manuales)

--------------------------------------------------------------------------------
3.2. BLOQUEO DINAMICO POR HABITACION (R1)
--------------------------------------------------------------------------------

FORMULA:
  horas_bloqueo = max_horas_tarifa_habitacion + horas_limpieza

EJEMPLO:
  Habitacion con tarifa max 8h + 1h limpieza = 9h antes
  Reserva a las 02:00 -> se bloquea a las 17:00 del dia anterior

  Habitacion con tarifa max 12h + 1h limpieza = 13h antes
  Reserva a las 02:00 -> se bloquea a las 13:00 del dia anterior

IMPLEMENTACION:
  EstadoHabitacionService.php -> bloque de "Reserva sin check-in":
  - Query a Tarifa: max('horas') WHERE id_tipo = hab.id_tipo AND activo
  - Config: horas_limpieza_bloqueo_reserva (default 1)
  - $horasAntes = maxHorasTarifa + horasLimpieza
  - $limiteBloqueo = now() + horasAntes
  - Si reserva.fecha_inicio <= limiteBloqueo -> MORADA
  - Si no -> sigue verde con info de reserva_futura

--------------------------------------------------------------------------------
3.3. FIX: RESERVAS CON CHECK-IN FALSO
--------------------------------------------------------------------------------

PROBLEMA:
  Algunas reservas DEC- tenian:
  - estado = 'activa'
  - registro_estadia con fecha_entrada FUTURA

  El EstadoHabitacionService no las detectaba como reserva proxima,
  las mostraba como Disponible (verde).

CAUSA:
  EstadoHabitacionService buscaba:
  - confirmadas/pendientes SIN check-in -> reserva proxima
  - activas CON check-in (fecha_inicio <= now) -> ocupada

  Las DEC- tenian: activas + check-in CON fecha FUTURA
  -> No entraban en ningun caso -> caian en "Disponible"

FIX APLICADO:
  1. Script artisan tinker para limpiar:
     - Borra registro_estadia si fecha_entrada > now()
     - Cambia estado a 'confirmada' si estaba 'activa' con fecha futura

  2. EstadoHabitacionService - Bloque "Ocupada":
     - Verifica que registro_estadia.fecha_entrada <= now()
       (si es futuro -> no cuenta como check-in real)

  3. EstadoHabitacionService - Bloque "Reserva sin check-in":
     - Agrega caso: 'activas' con fecha_entrada > now()
     - Estas se tratan como reserva proxima (morada o rosa)

RESULTADO:
  Hab 105 -> ROSA (Con-Decoracion) ✅
  Hab 301 -> ROSA ✅
  Hab 401 -> ROSA ✅

--------------------------------------------------------------------------------
3.4. LIMPIEZA DE PROMOCIONES VIEJAS
--------------------------------------------------------------------------------

PROBLEMA:
  Las 6 promociones del seeder inicial tenian porcentajes hardcodeados
  que ya no coincidian con las configs:
  - Descuento Cumpleanos 20% (deberia ser 10%)
  - Descuento Aniversario 15% (correcto)
  - Cliente VIP 10% (ya vive en clientes_niveles)

FIX APLICADO:
  Script artisan tinker:
  - DELETE de las 6 promociones viejas
  - INSERT de 3 promociones dinamicas:
    * Descuento Cumpleanos (10% - leido de config)
    * Descuento Aniversario (15% - leido de config)
    * Cliente frecuente (5% - referencia nivel Plata)

RESULTADO:
  /promociones muestra 3 promos dinamicas ✅

================================================================================
=== 4. BUGS ENCONTRADOS Y SOLUCIONADOS ===
================================================================================

BUG #1: EstadoHabitacionService no detectaba reservas DEC- con check-in futuro
  - Archivo: app/Services/EstadoHabitacionService.php
  - Fix: verificar registro_estadia.fecha_entrada <= now()

BUG #2: Bloqueo de habitacion fijo en 4h (hardcodeado via config)
  - Archivo: app/Services/EstadoHabitacionService.php
  - Fix: calculo dinamico max_tarifa + horas_limpieza

BUG #3: Descuentos hardcodeados en ReservaService
  - Archivo: app/Services/ReservaService.php
  - Fix: usar DescuentoService que lee de configuraciones

BUG #4: Promociones viejas con porcentajes desactualizados
  - Fix: eliminar y regenerar desde configuraciones

BUG #5: Falta columna 'casado' en clientes
  - Fix: migracion add_casado_to_clientes_table

BUG #6: Falta columnas de descuento manual en reservas
  - Fix: migracion add_descuento_manual_to_reservas_table

BUG #7: ReservaService metodo privado 'calcularDescuentoAutomatico' duplicado
  - Fix: eliminar el metodo privado, mover logica a DescuentoService

BUG #8: Falta config 'horas_limpieza_bloqueo_reserva'
  - Fix: agregar al seeder y aplicar

BUG #9: Falta endpoint /api/descuentos/manuales
  - Fix: agregar metodo 'manuales()' en DescuentoController

BUG #10: Reservas con estado 'activa' pero fecha futura
  - Fix: script tinker + cambios en EstadoHabitacionService

================================================================================
=== 5. ENDPOINTS DEL SISTEMA ===
================================================================================

AUTH:
  POST   /api/login
  POST   /api/logout
  GET    /api/yo

DESCUENTOS (NUEVOS):
  GET    /api/descuentos/config
  GET    /api/descuentos/manuales

RESERVAS:
  GET    /api/reservas
  POST   /api/reservas/walk-in
  POST   /api/reservas
  GET    /api/reservas/{id}
  PATCH  /api/reservas/{id}/check-in
  PATCH  /api/reservas/{id}/check-out
  PATCH  /api/reservas/{id}/cancelar
  PATCH  /api/reservas/{id}/anular
  PATCH  /api/reservas/{id}/cambiar-habitacion
  POST   /api/reservas/{id}/consumos
  POST   /api/reservas/{id}/consumos-multiple
  DELETE /api/reservas/{id}/consumos/{idConsumo}
  POST   /api/reservas/{id}/pagos
  DELETE /api/reservas/{id}/pagos/{idPago}
  POST   /api/reservas/{id}/entregar-vuelto
  PATCH  /api/reservas/{id}/check-out-con-vuelto
  PATCH  /api/reservas/{id}/check-out-con-deuda
  GET    /api/reservas/{id}/calculo-extension
  GET    /api/reservas/{id}/extensiones
  POST   /api/reservas/{id}/extensiones
  GET    /api/reservas/disponibles
  GET    /api/reservas/proximas
  GET    /api/reservas/hoy
  GET    /api/reservas/solo-reservas
  GET    /api/reservas/solo-walk-ins
  GET    /api/reservas/solo-decoraciones
  GET    /api/reservas/historial
  GET    /api/reservas/{id}/info-check-in
  POST   /api/reservas/{id}/check-in-validado

MAPA HABITACIONES:
  GET    /api/habitaciones-mapa
  GET    /api/habitaciones-mapa/{id}

LIMPIEZA:
  GET    /api/limpieza
  GET    /api/limpieza/pendientes
  POST   /api/limpieza
  PATCH  /api/limpieza/{id}/iniciar
  PATCH  /api/limpieza/{id}/finalizar
  PATCH  /api/limpieza/finalizar-todas

CONFIGURACIONES:
  GET    /api/configuraciones
  GET    /api/configuraciones/grupo/{grupo}
  PUT    /api/configuraciones/{clave}

(Ademas: decenas de CRUDs standard con patron listar/activos/crear/actualizar/
 desactivar/reactivar/eliminar)

================================================================================
=== 6. CONFIGURACIONES ACTIVAS EN BD ===
================================================================================

GRUPO 'reservas':
  tolerancia_extension_minutos = 30
  buffer_limpieza_minutos = 30
  tolerancia_no_show_minutos = 60
  horas_antes_bloqueo_reserva = 4          (fallback)
  horas_antes_decoracion = 24
  anticipacion_minima_reserva_minutos = 30
  horas_limpieza_bloqueo_reserva = 1       (NUEVA)

GRUPO 'descuentos':
  descuento_cumpleanos_porcentaje = 10
  descuento_aniversario_porcentaje = 15
  descuento_cumpleanos_activo = true
  descuento_aniversario_activo = true
  descuento_aplica_a = 'mayor'
  descuento_manual_habilitado = true       (NUEVA)
  descuento_manual_motivo_requerido = true (NUEVA)
  descuento_manual_max_porcentaje = 20     (NUEVA)

GRUPO 'comprobantes':
  igv_porcentaje = 18

GRUPO 'general':
  moneda_simbolo = 'S/'

================================================================================
=== 7. MODELOS Y RELACIONES CLAVE ===
================================================================================

Reserva (tabla reservas):
  - tiene descuento_manual_tipo, descuento_manual_motivo,
    descuento_manual_usuario_id (para auditoria)
  - BelongsTo: cliente, habitacion, tarifa, estado, usuario_creacion
  - HasMany: ocupaciones, pagos, consumos, extensiones, ajustes
  - HasOne: registroEstadia, decoracion
  - Metodo recalcularTotal() suma:
    monto_habitacion + monto_horas_extra + monto_consumos
    + monto_ajustes - descuento

Cliente (tabla clientes):
  - tiene campo 'casado' (boolean)
  - BelongsTo: tipoDocumento, nivel
  - HasMany: historialVisitas, observaciones, reservas

Configuracion (tabla configuraciones):
  - Metodo estatico obtener($clave, $default)
    Devuelve el valor casteado segun tipo (INT/DECIMAL/BOOLEAN/STRING)

ClienteNivel (tabla clientes_niveles):
  - Campo 'descuento' con el porcentaje del nivel
  - Bronce 0%, Plata 5%, Oro 8%, VIP 12%

Tarifa (tabla tarifas):
  - Campo 'horas' (maximo para bloqueo dinamico)
  - Campo 'precio_hora_extra', 'max_horas_extra'
  - Campo 'precio_turno_adicional'

================================================================================
=== 8. SERVICIOS CLAVE ===
================================================================================

DescuentoService (NUEVO):
  - obtenerConfiguraciones()
  - obtenerManuales()
  - calcular($cliente, $fechaEntrada, $montoHabitacion, $manualesAplicar)

ReservaService:
  - crearWalkIn($datos, $idUsuario)
  - crearReserva($datos, $idUsuario)
  - checkIn, checkOut, cancelar, anular
  - cambiarHabitacion
  - agregarConsumo, agregarConsumosMultiple, eliminarConsumo
  - agregarExtension, listarExtensiones
  - agregarPago, anularPago, entregarVuelto
  - checkOutConVuelto, checkOutConDeuda
  - clienteTieneReservaActiva
  - listarProximasConAlerta, listarHoy
  - obtenerInfoCheckIn, checkInValidado
  - listarSoloReservas, listarSoloWalkIns, listarSoloDecoraciones

EstadoHabitacionService:
  - calcular($habitacion):
      Devuelve array con estado + color + datos extra
      Orden de prioridad:
        1. Inactiva
        2. Mantenimiento
        3. Limpieza
        4. Reserva proxima (morada/rosa) <- con bloqueo dinamico
        5. Ocupada / Por vencer / Vencida
        6. Disponible
  - mapa(): devuelve todas las habitaciones con estado

DisponibilidadService:
  - estaDisponible($idHab, $inicio, $fin, $excluirReserva, $horasAntesDeco, $esWalkIn)
  - habitacionesLibres, habitacionesLibresConInfo
  - habitacionesConConflicto, obtenerConflicto

ClienteVisitaService:
  - registrar($idCliente, $idReserva, $idHabitacion, $monto)
      Incrementa visitas, actualiza ultima_visita, suma total_gastado,
      recalcula nivel

================================================================================
=== 9. COMANDOS ARTISAN PROGRAMADOS ===
================================================================================

reservas:procesar-no-show
  Frecuencia: cada minuto
  Marca reservas confirmadas vencidas como 'no-show'

reservas:liberar-vencidas
  Frecuencia: cada minuto
  Libera reservas vencidas sin check-in

================================================================================
=== 10. DECISIONES TECNICAS ===
================================================================================

D1: Yape/Plin/Deposito Duena NO entran a caja (es_de_caja = false)
D2: Cobro de reserva en 2 pasos (modal de cobro al crear reserva)
D3: Catalogos dinamicos (metodos pago y categorias vienen de BD)
D4: Precios con IGV incluido
D5: Buffer de limpieza = 30 min (configurable)
D6: Tolerancia No-Show = 60 min (configurable)
D7: Al anular pago se revierte caja (PagoService)
D8: Estado de habitacion en vivo (EstadoHabitacionService)
D9: RENIEC solo en produccion (ahorro de costos)
D10: Visitas se incrementan en walk-in/check-in (ClienteVisitaService)
D11: Vuelto se entrega al final, no al inicio
D12: Cambio de habitacion mantiene fecha_inicio original
D13: Al cambiar hab, la vieja va a LIMPIEZA
D14: Si no hay tarifa exacta -> usar la mas chica
D15: reserva_ajustes registra todos los cambios
D16: reserva_consumos descuenta stock (R41)
D17: Multiples pagos por reserva
D18: Vuelto como pago NEGATIVO en pagos_reserva
D19: pagado = SUM(pagos) con negativos
D20: NO usar $appends para atributos dinamicos
D21: Permitir pago parcial
D22: 1 cliente = 1 reserva activa
D23: Pago mixto con array pagos[]
D24: Descuentos NO acumulables por defecto (configurable)
D25: Descuento cumpleanos automatico (no manual)
D26: Descuento aniversario manual (requiere verificacion)
D27: Bloqueo dinamico por habitacion (max_tarifa + limpieza)
D28: Validacion de disponibilidad ANTES de crear cliente

================================================================================
=== 11. MIGRACIONES NUEVAS EN ESTA SESION ===
================================================================================

2026_10_08_000002_add_casado_to_clientes_table.php
  - Agrega boolean 'casado' a clientes (default false)

2026_10_08_000003_update_niveles_descuentos.php
  - Actualiza porcentajes de niveles:
    Oro 10% -> 8%
    VIP 15% -> 12%

2026_10_07_213244_add_descuento_manual_to_reservas_table.php
  - Agrega a reservas:
    descuento_manual_tipo (string 30, nullable)
    descuento_manual_motivo (string 255, nullable)
    descuento_manual_usuario_id (FK usuarios, nullable)

================================================================================
=== 12. ESTRUCTURA DE CARPETAS ===
================================================================================

backend/
├── app/
│   ├── Console/
│   │   └── Commands/
│   │       ├── ProcesarNoShowReservas.php
│   │       └── LiberarReservasVencidas.php
│   ├── Http/
│   │   └── Controllers/
│   │       ├── AuthController.php
│   │       ├── CategoriaMovimientoController.php
│   │       ├── CategoriaProductoController.php
│   │       ├── CategoriaPromocionController.php
│   │       ├── ClienteController.php
│   │       ├── ClienteNivelController.php
│   │       ├── ClienteObservacionController.php
│   │       ├── ClienteVisitaController.php
│   │       ├── ConfiguracionController.php
│   │       ├── CuentaPagarController.php
│   │       ├── DecoracionController.php
│   │       ├── DescuentoController.php  (NUEVO)
│   │       ├── EstadoCuentaPagarController.php
│   │       ├── EstadoHabitacionController.php
│   │       ├── EstadoReservaController.php
│   │       ├── GravedadObservacionController.php
│   │       ├── HabitacionController.php
│   │       ├── LimpiezaController.php
│   │       ├── MantenimientoController.php
│   │       ├── MetodoPagoController.php
│   │       ├── PaqueteDecoracionController.php
│   │       ├── PisoController.php
│   │       ├── PrioridadMantenimientoController.php
│   │       ├── ProductoController.php
│   │       ├── PromocionClienteController.php
│   │       ├── PromocionController.php
│   │       ├── ProveedorController.php
│   │       ├── ReservaController.php
│   │       ├── RolController.php
│   │       ├── TarifaController.php
│   │       ├── TipoDocumentoController.php
│   │       ├── TipoHabitacionController.php
│   │       ├── TipoMantenimientoController.php
│   │       ├── TipoObservacionController.php
│   │       ├── TurnoController.php
│   │       └── UsuarioController.php
│   ├── Models/
│   │   ├── CategoriaMovimiento.php
│   │   ├── CategoriaProducto.php
│   │   ├── CategoriaPromocion.php
│   │   ├── Cliente.php
│   │   ├── ClienteNivel.php
│   │   ├── ClienteObservacion.php
│   │   ├── ClienteVisita.php
│   │   ├── Configuracion.php
│   │   ├── CuentaPagar.php
│   │   ├── Decoracion.php
│   │   ├── EstadoCuentaPagar.php
│   │   ├── EstadoReserva.php
│   │   ├── ExtensionReserva.php
│   │   ├── GravedadObservacion.php
│   │   ├── Habitacion.php
│   │   ├── Limpieza.php
│   │   ├── Mantenimiento.php
│   │   ├── MetodoPago.php
│   │   ├── OcupacionHabitacion.php
│   │   ├── PagoProveedor.php
│   │   ├── PagoReserva.php
│   │   ├── PaqueteDecoracion.php
│   │   ├── Piso.php
│   │   ├── PrioridadMantenimiento.php
│   │   ├── Producto.php
│   │   ├── Promocion.php
│   │   ├── PromocionCliente.php
│   │   ├── Proveedor.php
│   │   ├── RegistroEstadia.php
│   │   ├── Reserva.php
│   │   ├── ReservaAjuste.php
│   │   ├── ReservaConsumo.php
│   │   ├── Rol.php
│   │   ├── Tarifa.php
│   │   ├── TipoDocumento.php
│   │   ├── TipoHabitacion.php
│   │   ├── TipoMantenimiento.php
│   │   ├── TipoObservacion.php
│   │   ├── Turno.php
│   │   └── Usuario.php
│   └── Services/
│       ├── AuthService.php
│       ├── CategoriaMovimientoService.php
│       ├── CategoriaProductoService.php
│       ├── CategoriaPromocionService.php
│       ├── ClienteNivelService.php
│       ├── ClienteObservacionService.php
│       ├── ClienteService.php
│       ├── ClienteVisitaService.php
│       ├── CuentaPagarService.php
│       ├── DecoracionService.php
│       ├── DescuentoService.php  (NUEVO)
│       ├── DisponibilidadService.php
│       ├── EstadoCuentaPagarService.php
│       ├── EstadoHabitacionService.php
│       ├── ExtensionService.php
│       ├── GravedadObservacionService.php
│       ├── HabitacionService.php
│       ├── LimpiezaService.php
│       ├── MantenimientoService.php
│       ├── MetodoPagoService.php
│       ├── PaqueteDecoracionService.php
│       ├── PisoService.php
│       ├── PrioridadMantenimientoService.php
│       ├── ProductoService.php
│       ├── PromocionClienteService.php
│       ├── PromocionService.php
│       ├── ProveedorService.php
│       ├── ReservaService.php
│       ├── RolService.php
│       ├── TarifaService.php
│       ├── TipoDocumentoService.php
│       ├── TipoHabitacionService.php
│       ├── TipoMantenimientoService.php
│       ├── TipoObservacionService.php
│       ├── TurnoService.php
│       └── UsuarioService.php
├── database/
│   ├── migrations/  (~45 archivos, ver tree)
│   └── seeders/     (~17 archivos)
└── routes/
    ├── api.php
    ├── console.php
    └── web.php

================================================================================
=== 13. COMANDOS UTILES ===
================================================================================

DESARROLLO:
  php artisan serve
  php artisan migrate
  php artisan migrate:fresh --seed
  php artisan db:seed --class=ConfiguracionSistemaSeeder
  php artisan tinker
  php artisan optimize:clear
  php artisan route:list --path=api/descuentos

VER LOGS:
  Get-Content storage\logs\laravel.log -Tail 50

TINKER - TESTEAR DESCUENTOS:
  $svc = app(\App\Services\DescuentoService::class);
  $hoy = \Carbon\Carbon::now();
  $c = new \App\Models\Cliente();
  $c->fecha_nacimiento = '1990-' . $hoy->format('m-d');
  $c->casado = false;
  $r = $svc->calcular($c, $hoy, 100.0);
  echo $r['porcentaje'] . '% -> S/ ' . $r['monto'] . ' (' . $r['motivo'] . ')';

TINKER - VER ESTADO DE HABITACION:
  $svc = app(\App\Services\EstadoHabitacionService::class);
  $h = \App\Models\Habitacion::where('numero', '105')->first();
  $estado = $svc->calcular($h);
  echo $estado['estado'] . ' -> ' . $estado['color'];

================================================================================
=== FIN DEL DOCUMENTO ===
================================================================================