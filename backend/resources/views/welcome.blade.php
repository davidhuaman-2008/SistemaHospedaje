<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hospedaje API</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .card {
            background: #1e293b;
            padding: 3rem 5rem;
            border-radius: 16px;
            text-align: center;
            border: 1px solid #334155;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        h1 { color: #22c55e; margin-bottom: 1rem; font-size: 2rem; }
        p { color: #94a3b8; margin: 0.5rem 0; }
        .badge {
            display: inline-block;
            background: rgba(34, 197, 94, 0.15);
            color: #22c55e;
            padding: 0.4rem 1rem;
            border-radius: 99px;
            font-size: 0.85rem;
            margin-top: 1.5rem;
            font-weight: 600;
        }
        .info { font-size: 0.85rem; color: #64748b; margin-top: 1.5rem; }
    </style>
</head>
<body>
    <div class="card">
        <h1>✅ API Hospedaje</h1>
        <p>Backend Laravel funcionando correctamente</p>
        <p>Base de datos: <strong>hospedaje</strong></p>
        <span class="badge">Conexión exitosa</span>
        <p class="info">Laravel v{{ app()->version() }} · PHP {{ phpversion() }}</p>
    </div>
</body>
</html>
