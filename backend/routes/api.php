<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\PromocionClienteController;
use App\Http\Controllers\PromocionController;
use App\Http\Controllers\CategoriaPromocionController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\CategoriaProductoController;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\TurnoController;
use App\Http\Controllers\UsuarioController;

use App\Http\Controllers\PisoController;
use App\Http\Controllers\TipoHabitacionController;
use App\Http\Controllers\TipoDocumentoController;
use App\Http\Controllers\MetodoPagoController;
use App\Http\Controllers\CategoriaMovimientoController;
use App\Http\Controllers\ClienteNivelController;
use App\Http\Controllers\TarifaController;
use App\Http\Controllers\ClienteObservacionController;
use App\Http\Controllers\ClienteVisitaController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\GravedadObservacionController;
use App\Http\Controllers\TipoObservacionController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/yo', [AuthController::class, 'yo']);

    Route::apiResource('usuarios', UsuarioController::class)->parameters(['usuarios' => 'usuario']);    
    // Rutas adicionales de usuarios (soft delete)
    Route::patch('usuarios/{id}/desactivar', [UsuarioController::class, 'desactivar']);
    Route::patch('usuarios/{id}/reactivar', [UsuarioController::class, 'reactivar']);

    Route::apiResource('roles', RolController::class)->parameters(['roles' => 'rol']);
    Route::patch('roles/{id}/desactivar', [RolController::class, 'desactivar']);
    Route::patch('roles/{id}/reactivar', [RolController::class, 'reactivar']);

    Route::apiResource('turnos', TurnoController::class)->parameters(['turnos' => 'turno']);
    Route::patch('turnos/{id}/desactivar', [TurnoController::class, 'desactivar']);
    Route::patch('turnos/{id}/reactivar', [TurnoController::class, 'reactivar']);
});


// ============================================================================
// CONFIGURACIÃ“N BASE
// ============================================================================

Route::middleware('auth:sanctum')->group(function () {

    // Pisos
    Route::get('pisos', [PisoController::class, 'index']);
    Route::get('pisos/activos', [PisoController::class, 'activos']);
    Route::get('pisos/{id}', [PisoController::class, 'show']);
    Route::post('pisos', [PisoController::class, 'store']);
    Route::put('pisos/{id}', [PisoController::class, 'update']);
    Route::patch('pisos/{id}/desactivar', [PisoController::class, 'desactivar']);
    Route::patch('pisos/{id}/reactivar', [PisoController::class, 'reactivar']);
    Route::delete('pisos/{id}', [PisoController::class, 'destroy']);

    // Tipos de habitaciÃ³n
    Route::get('tipos-habitacion', [TipoHabitacionController::class, 'index']);
    Route::get('tipos-habitacion/activos', [TipoHabitacionController::class, 'activos']);
    Route::get('tipos-habitacion/{id}', [TipoHabitacionController::class, 'show']);
    Route::post('tipos-habitacion', [TipoHabitacionController::class, 'store']);
    Route::put('tipos-habitacion/{id}', [TipoHabitacionController::class, 'update']);
    Route::patch('tipos-habitacion/{id}/desactivar', [TipoHabitacionController::class, 'desactivar']);
    Route::patch('tipos-habitacion/{id}/reactivar', [TipoHabitacionController::class, 'reactivar']);
    Route::delete('tipos-habitacion/{id}', [TipoHabitacionController::class, 'destroy']);

    // Tipos de documento
    Route::get('tipos-documento', [TipoDocumentoController::class, 'index']);
    Route::get('tipos-documento/activos', [TipoDocumentoController::class, 'activos']);
    Route::get('tipos-documento/{id}', [TipoDocumentoController::class, 'show']);
    Route::post('tipos-documento', [TipoDocumentoController::class, 'store']);
    Route::put('tipos-documento/{id}', [TipoDocumentoController::class, 'update']);
    Route::patch('tipos-documento/{id}/desactivar', [TipoDocumentoController::class, 'desactivar']);
    Route::patch('tipos-documento/{id}/reactivar', [TipoDocumentoController::class, 'reactivar']);
    Route::delete('tipos-documento/{id}', [TipoDocumentoController::class, 'destroy']);

    // MÃ©todos de pago
    Route::get('metodos-pago', [MetodoPagoController::class, 'index']);
    Route::get('metodos-pago/activos', [MetodoPagoController::class, 'activos']);
    Route::get('metodos-pago/de-caja', [MetodoPagoController::class, 'deCaja']);
    Route::get('metodos-pago/de-duenia', [MetodoPagoController::class, 'deDuenia']);
    Route::get('metodos-pago/{id}', [MetodoPagoController::class, 'show']);
    Route::post('metodos-pago', [MetodoPagoController::class, 'store']);
    Route::put('metodos-pago/{id}', [MetodoPagoController::class, 'update']);
    Route::patch('metodos-pago/{id}/desactivar', [MetodoPagoController::class, 'desactivar']);
    Route::patch('metodos-pago/{id}/reactivar', [MetodoPagoController::class, 'reactivar']);
    Route::delete('metodos-pago/{id}', [MetodoPagoController::class, 'destroy']);

    // CategorÃ­as de movimiento
    Route::get('categorias-movimiento', [CategoriaMovimientoController::class, 'index']);
    Route::get('categorias-movimiento/activos', [CategoriaMovimientoController::class, 'activos']);
    Route::get('categorias-movimiento/{id}', [CategoriaMovimientoController::class, 'show']);
    Route::post('categorias-movimiento', [CategoriaMovimientoController::class, 'store']);
    Route::put('categorias-movimiento/{id}', [CategoriaMovimientoController::class, 'update']);
    Route::patch('categorias-movimiento/{id}/desactivar', [CategoriaMovimientoController::class, 'desactivar']);
    Route::patch('categorias-movimiento/{id}/reactivar', [CategoriaMovimientoController::class, 'reactivar']);
    Route::delete('categorias-movimiento/{id}', [CategoriaMovimientoController::class, 'destroy']);

    // Niveles de cliente
    Route::get('clientes-niveles', [ClienteNivelController::class, 'index']);
    Route::get('clientes-niveles/activos', [ClienteNivelController::class, 'activos']);
    Route::get('clientes-niveles/{id}', [ClienteNivelController::class, 'show']);
    Route::post('clientes-niveles', [ClienteNivelController::class, 'store']);
    Route::put('clientes-niveles/{id}', [ClienteNivelController::class, 'update']);
    Route::patch('clientes-niveles/{id}/desactivar', [ClienteNivelController::class, 'desactivar']);
    Route::patch('clientes-niveles/{id}/reactivar', [ClienteNivelController::class, 'reactivar']);
    Route::delete('clientes-niveles/{id}', [ClienteNivelController::class, 'destroy']);
});


// ============================================================================
// TARIFAS
// ============================================================================

Route::middleware('auth:sanctum')->group(function () {
    Route::get('tarifas', [TarifaController::class, 'index']);
    Route::get('tarifas/activos', [TarifaController::class, 'activos']);
    Route::get('tarifas/por-tipo/{idTipo}', [TarifaController::class, 'porTipo']);
    Route::get('tarifas/{id}', [TarifaController::class, 'show']);
    Route::post('tarifas', [TarifaController::class, 'store']);
    Route::put('tarifas/{id}', [TarifaController::class, 'update']);
    Route::patch('tarifas/{id}/desactivar', [TarifaController::class, 'desactivar']);
    Route::patch('tarifas/{id}/reactivar', [TarifaController::class, 'reactivar']);
    Route::delete('tarifas/{id}', [TarifaController::class, 'destroy']);
});



// ============================================================================
// CLIENTES
// ============================================================================

Route::middleware('auth:sanctum')->group(function () {

    // --- Tipos de ObservaciÃ³n ---
    Route::get('tipos-observacion', [TipoObservacionController::class, 'index']);
    Route::get('tipos-observacion/activos', [TipoObservacionController::class, 'activos']);
    Route::get('tipos-observacion/{id}', [TipoObservacionController::class, 'show']);
    Route::post('tipos-observacion', [TipoObservacionController::class, 'store']);
    Route::put('tipos-observacion/{id}', [TipoObservacionController::class, 'update']);
    Route::patch('tipos-observacion/{id}/desactivar', [TipoObservacionController::class, 'desactivar']);
    Route::patch('tipos-observacion/{id}/reactivar', [TipoObservacionController::class, 'reactivar']);
    Route::delete('tipos-observacion/{id}', [TipoObservacionController::class, 'destroy']);

    // --- Gravedades ---
    Route::get('gravedades-observacion', [GravedadObservacionController::class, 'index']);
    Route::get('gravedades-observacion/activos', [GravedadObservacionController::class, 'activos']);
    Route::get('gravedades-observacion/{id}', [GravedadObservacionController::class, 'show']);
    Route::post('gravedades-observacion', [GravedadObservacionController::class, 'store']);
    Route::put('gravedades-observacion/{id}', [GravedadObservacionController::class, 'update']);
    Route::patch('gravedades-observacion/{id}/desactivar', [GravedadObservacionController::class, 'desactivar']);
    Route::patch('gravedades-observacion/{id}/reactivar', [GravedadObservacionController::class, 'reactivar']);
    Route::delete('gravedades-observacion/{id}', [GravedadObservacionController::class, 'destroy']);

    // --- Clientes ---
    Route::get('clientes', [ClienteController::class, 'index']);
    Route::get('clientes/activos', [ClienteController::class, 'activos']);
    Route::get('clientes/buscar', [ClienteController::class, 'buscar']);
    Route::get('clientes/{id}', [ClienteController::class, 'show']);
    Route::post('clientes', [ClienteController::class, 'store']);
    Route::put('clientes/{id}', [ClienteController::class, 'update']);
    Route::patch('clientes/{id}/desactivar', [ClienteController::class, 'desactivar']);
    Route::patch('clientes/{id}/reactivar', [ClienteController::class, 'reactivar']);
    Route::delete('clientes/{id}', [ClienteController::class, 'destroy']);
    Route::get('clientes/{id}/visitas', [ClienteController::class, 'visitas']);

    // --- Visitas ---
    Route::get('clientes/{idCliente}/visitas', [ClienteVisitaController::class, 'index']);
    Route::get('cliente-visitas/{id}', [ClienteVisitaController::class, 'show']);
    Route::post('clientes/{idCliente}/visitas', [ClienteVisitaController::class, 'store']);
    Route::put('cliente-visitas/{id}', [ClienteVisitaController::class, 'update']);
    Route::delete('cliente-visitas/{id}', [ClienteVisitaController::class, 'destroy']);

    // --- Observaciones ---
    Route::get('cliente-observaciones', [ClienteObservacionController::class, 'index']);
    Route::get('clientes/{idCliente}/observaciones', [ClienteObservacionController::class, 'porCliente']);
    Route::get('cliente-observaciones/{id}', [ClienteObservacionController::class, 'show']);
    Route::post('clientes/{idCliente}/observaciones', [ClienteObservacionController::class, 'store']);
    Route::patch('cliente-observaciones/{id}/resolver', [ClienteObservacionController::class, 'resolver']);
    Route::delete('cliente-observaciones/{id}', [ClienteObservacionController::class, 'destroy']);
});


// ============================================================================
// PRODUCTOS (Fase 1) â€” Categorias + Proveedores + Productos
// ============================================================================

Route::middleware('auth:sanctum')->group(function () {

    // --- CategorÃ­as de Producto ---
    Route::get('categorias-producto', [CategoriaProductoController::class, 'index']);
    Route::get('categorias-producto/activos', [CategoriaProductoController::class, 'activos']);
    Route::get('categorias-producto/{id}', [CategoriaProductoController::class, 'show']);
    Route::post('categorias-producto', [CategoriaProductoController::class, 'store']);
    Route::put('categorias-producto/{id}', [CategoriaProductoController::class, 'update']);
    Route::patch('categorias-producto/{id}/desactivar', [CategoriaProductoController::class, 'desactivar']);
    Route::patch('categorias-producto/{id}/reactivar', [CategoriaProductoController::class, 'reactivar']);
    Route::delete('categorias-producto/{id}', [CategoriaProductoController::class, 'destroy']);

    // --- Proveedores ---
    Route::get('proveedores', [ProveedorController::class, 'index']);
    Route::get('proveedores/activos', [ProveedorController::class, 'activos']);
    Route::get('proveedores/{id}', [ProveedorController::class, 'show']);
    Route::post('proveedores', [ProveedorController::class, 'store']);
    Route::put('proveedores/{id}', [ProveedorController::class, 'update']);
    Route::patch('proveedores/{id}/desactivar', [ProveedorController::class, 'desactivar']);
    Route::patch('proveedores/{id}/reactivar', [ProveedorController::class, 'reactivar']);
    Route::delete('proveedores/{id}', [ProveedorController::class, 'destroy']);

    // --- Productos ---
    Route::get('productos', [ProductoController::class, 'index']);
    Route::get('productos/activos', [ProductoController::class, 'activos']);
    Route::get('productos/stock-bajo', [ProductoController::class, 'stockBajo']);
    Route::get('productos/por-categoria/{idCategoria}', [ProductoController::class, 'porCategoria']);
    Route::get('productos/{id}', [ProductoController::class, 'show']);
    Route::post('productos', [ProductoController::class, 'store']);
    Route::put('productos/{id}', [ProductoController::class, 'update']);
    Route::patch('productos/{id}/desactivar', [ProductoController::class, 'desactivar']);
    Route::patch('productos/{id}/reactivar', [ProductoController::class, 'reactivar']);
    Route::delete('productos/{id}', [ProductoController::class, 'destroy']);
});

// ============================================================================
// PROMOCIONES
// ============================================================================

Route::middleware('auth:sanctum')->group(function () {

    // --- CategorÃ­as de PromociÃ³n ---
    Route::get('categorias-promocion', [CategoriaPromocionController::class, 'index']);
    Route::get('categorias-promocion/activos', [CategoriaPromocionController::class, 'activos']);
    Route::get('categorias-promocion/{id}', [CategoriaPromocionController::class, 'show']);
    Route::post('categorias-promocion', [CategoriaPromocionController::class, 'store']);
    Route::put('categorias-promocion/{id}', [CategoriaPromocionController::class, 'update']);
    Route::patch('categorias-promocion/{id}/desactivar', [CategoriaPromocionController::class, 'desactivar']);
    Route::patch('categorias-promocion/{id}/reactivar', [CategoriaPromocionController::class, 'reactivar']);
    Route::delete('categorias-promocion/{id}', [CategoriaPromocionController::class, 'destroy']);

    // --- Promociones ---
    Route::get('promociones', [PromocionController::class, 'index']);
    Route::get('promociones/activas', [PromocionController::class, 'activas']);
    Route::get('promociones/vigentes', [PromocionController::class, 'vigentes']);
    Route::get('promociones/por-categoria/{idCategoria}', [PromocionController::class, 'porCategoria']);
    Route::get('promociones/{id}', [PromocionController::class, 'show']);
    Route::post('promociones', [PromocionController::class, 'store']);
    Route::put('promociones/{id}', [PromocionController::class, 'update']);
    Route::patch('promociones/{id}/desactivar', [PromocionController::class, 'desactivar']);
    Route::patch('promociones/{id}/reactivar', [PromocionController::class, 'reactivar']);
    Route::delete('promociones/{id}', [PromocionController::class, 'destroy']);

    // --- Promociones Cliente ---
    Route::get('promociones-cliente', [PromocionClienteController::class, 'index']);
    Route::get('clientes/{idCliente}/promociones', [PromocionClienteController::class, 'porCliente']);
    Route::get('promociones/{idPromocion}/clientes', [PromocionClienteController::class, 'porPromocion']);
    Route::get('promociones-cliente/{id}', [PromocionClienteController::class, 'show']);
    Route::post('promociones-cliente', [PromocionClienteController::class, 'store']);
    Route::patch('promociones-cliente/{id}/usar', [PromocionClienteController::class, 'marcarUsado']);
    Route::delete('promociones-cliente/{id}', [PromocionClienteController::class, 'destroy']);
});