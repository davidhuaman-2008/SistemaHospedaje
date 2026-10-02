<?php

namespace Database\Seeders;

use App\Models\Rol;
use App\Models\Turno;
use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['nombre' => 'admin', 'descripcion' => 'Acceso total al sistema'],
            ['nombre' => 'encargado', 'descripcion' => 'Turno día, supervisa'],
            ['nombre' => 'recepcionista', 'descripcion' => 'Recepción y limpieza noche'],
            ['nombre' => 'limpieza', 'descripcion' => 'Solo habitaciones'],
            ['nombre' => 'cajero', 'descripcion' => 'Solo caja y pagos'],
        ];

        foreach ($roles as $rol) {
            Rol::create($rol);
        }

        $turnos = [
            ['nombre' => 'Mañana', 'hora_inicio' => '08:00:00', 'hora_fin' => '20:00:00', 'descripcion' => 'Turno día'],
            ['nombre' => 'Noche', 'hora_inicio' => '20:00:00', 'hora_fin' => '08:00:00', 'descripcion' => 'Turno noche'],
            ['nombre' => 'Libre', 'hora_inicio' => '00:00:00', 'hora_fin' => '23:59:59', 'descripcion' => 'Sin restricción (admin)'],
        ];

        foreach ($turnos as $turno) {
            Turno::create($turno);
        }

        Usuario::create([
            'nombre' => 'Nancy',
            'apellido' => 'Admin',
            'nombre_usuario' => 'nancy',
            'password' => Hash::make('admin123'),
            'id_rol' => 1,
            'id_turno' => 3,
            'activo' => true,
        ]);
    }
}