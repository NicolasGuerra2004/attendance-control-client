# QuimiControl Frontend

Frontend React + TypeScript + Vite para el control de asistencia y usuarios.

## Requisitos

- Node.js compatible con las versiones instaladas en `package.json`.
- Backend disponible con la API configurada en `VITE_API_URL`.

## Configuración

Crea un archivo `.env` a partir de `.env.example`:

```env
VITE_API_URL=http://localhost:3040
```

El archivo `.env` es local y no debe versionarse.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Rutas

- `/login`: autenticación.
- `/dashboard`: métricas generales.
- `/usuarios`: administración de usuarios.
- `/attendance`: registro de entrada y salida.
- `/reportes`: reportes de asistencia.

Las rutas internas requieren un token válido almacenado por el servicio de autenticación.

## API esperada

El frontend utiliza estos recursos relativos a `VITE_API_URL`:

- `POST /api/auth/login`
- `GET /api/attendance/dashboard`
- `GET /api/attendance/has-checked-in-today`
- `POST /api/attendance/check-in`
- `POST /api/attendance/check-out`
- `GET /api/users?estado=activo`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

El login debe responder un objeto con la propiedad `token`.
