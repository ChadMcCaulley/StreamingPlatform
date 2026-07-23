# Signal

**Cinema, engineered.** React + TypeScript frontend with a **Django REST** API.

## Architecture

| Layer | Stack | Dev |
|--------|--------|-----|
| UI | React, Vite, TypeScript | `npm run dev` → http://localhost:5173 |
| API | Django 4.2, DRF, Token auth, SQLite | `npm run api` → http://127.0.0.1:8000 |
| Deploy | Frontend → Netlify; API → Railway / Render / Fly / etc. | Django is not Netlify-native |

Vite proxies `/api/*` to Django in development.

## Quick start

### 1. Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\python manage.py migrate
.venv\Scripts\python manage.py seed_signal
.venv\Scripts\python manage.py runserver
```

Or from repo root after venv exists:

```bash
npm run api:migrate
npm run api:seed
npm run api
```

### 2. Frontend

```bash
npm install
npm run dev
```

### Demo login

- **Email:** `demo@signal.app`
- **Password:** `demo1234`

## API surface

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/auth/register/` | `{ name, email, password }` |
| POST | `/api/auth/login/` | `{ email, password }` → token |
| POST | `/api/auth/logout/` | Token required |
| GET | `/api/auth/me/` | Current user + profiles |
| GET/POST | `/api/profiles/` | List / create profile |
| DELETE | `/api/profiles/:id/` | Remove profile |
| GET | `/api/catalog/home/` | Featured, rows, genres |
| GET | `/api/catalog/` | Filter: `type`, `q`, `genre` |
| GET | `/api/catalog/:slug/` | Title detail |
| GET/POST/DELETE | `/api/my-list/` | Header `X-Profile-Id` |
| POST | `/api/my-list/toggle/` | `{ titleId }` |
| GET/PUT/DELETE | `/api/continue/` | Progress upsert |

Auth header: `Authorization: Token <key>`  
Profile-scoped routes: `X-Profile-Id: <profile pk>`

Admin: `python manage.py createsuperuser` → `/admin/`

## Project layout

```
src/                 React app
  api/               HTTP client (auth, catalog, lists)
backend/
  config/            Django settings
  catalog/           Titles + seed
  accounts/          Profiles, my list, continue watching
```

## Production notes

- Set `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=0`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`
- Use Postgres in production (swap `DATABASES`)
- Frontend: set `VITE_API_URL=https://your-api.example.com/api`
- Never use demo passwords in production

## Test footage

Playback uses short sample clips in `public/videos/` (bundled with the frontend).
The old Google “gtv-videos-bucket” sample URLs now return 403, so titles point at
local paths like `/videos/big-buck-bunny.mp4`. After changing seed data, re-run:

```bash
npm run api:seed
```

## License

Demo project — sample media rights belong to their respective owners.
