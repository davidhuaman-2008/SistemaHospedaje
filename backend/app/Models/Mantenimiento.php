<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mantenimiento extends Model
{
    protected $table = 'mantenimiento';
    protected $primaryKey = 'id_mantenimiento';

    protected $fillable = [
        'id_habitacion', 'id_tipo_mantenimiento', 'id_prioridad',
        'id_usuario_reporta', 'id_usuario_asignado',
        'descripcion', 'estado',
        'fecha_reporte', 'fecha_inicio', 'fecha_resolucion',
        'observaciones', 'motivo_cancelacion',
    ];

    protected $casts = [
        'fecha_reporte' => 'datetime',
        'fecha_inicio' => 'datetime',
        'fecha_resolucion' => 'datetime',
    ];

    public function habitacion(): BelongsTo
    {
        return $this->belongsTo(Habitacion::class, 'id_habitacion', 'id_habitacion');
    }

    public function tipo(): BelongsTo
    {
        return $this->belongsTo(TipoMantenimiento::class, 'id_tipo_mantenimiento', 'id_tipo_mantenimiento');
    }

    public function prioridad(): BelongsTo
    {
        return $this->belongsTo(PrioridadMantenimiento::class, 'id_prioridad', 'id_prioridad');
    }

    public function usuarioReporta(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_reporta', 'id');
    }

    public function usuarioAsignado(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_asignado', 'id');
    }
}