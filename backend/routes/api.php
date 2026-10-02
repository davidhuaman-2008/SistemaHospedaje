<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\TurnoController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/yo', [AuthController::class, 'yo']);

    Route::apiResource('usuarios', UsuarioController::class);

    Route::apiResource('roles', RolController::class);

    Route::apiResource('turnos', TurnoController::class);
});
