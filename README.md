# LocalFind

A local business directory platform — users search and review nearby businesses, business owners (providers) list and manage their own listings, and admins moderate everything from a dedicated panel.

## Live

| App | URL |
|---|---|
| Client (public site) | https://localfind-client.vercel.app |
| Admin panel | https://localfind-admin.vercel.app |
| API | https://localfind-server.onrender.com |

The API is on Render's free tier, so it spins down after periods of inactivity — the first request after a while can take 30–60s to wake it up.

## Features

- Email/password auth with short-lived JWT access tokens (RS256) + httpOnly refresh cookies
- Business listings with categories, subcategories, cities, and map view (Leaflet)
- Search with server-side caching (Redis)
- Reviews and ratings, with moderation/flagging
- Provider (business owner) dashboard: create/edit listings, view analytics
- Admin panel: approve/reject listings, manage users and providers, moderate reviews, manage taxonomy (categories/cities)
- Image uploads via Cloudinary

## Tech stack

- **Client & Admin**: React 18, Vite, React Router, TanStack Query, Zustand, Tailwind CSS
- **Server**: Node.js, Express, MongoDB (Mongoose), Redis (ioredis), JWT (RS256), Cloudinary, Nodemailer

## Project structure

```
localfind/
├── client/    # Public-facing site (React + Vite)
├── admin/     # Admin panel (React + Vite)
└── server/    # REST API (Express + MongoDB)
```

Each app is deployed independently — `client` and `admin` on Vercel, `server` on Render.

## Local development

Requires Node 20+, a MongoDB connection string, and a Redis connection string.

```bash
npm run install:all   # installs deps in server, client, and admin
```

Copy `server/.env.example` to `server/.env` and fill in real values, then:

```bash
npm run dev           # runs server (5000), client (5173), and admin (5174) together
```

Or individually: `npm run dev:server`, `npm run dev:client`, `npm run dev:admin`.

Seed initial data (categories, cities, admin account):

```bash
npm run seed
```

### Required environment variables (`server/.env`)

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `REDIS_URL` | Redis connection string (caching, OTP storage) |
| `JWT_PRIVATE_KEY` / `JWT_PUBLIC_KEY` | RSA keypair for signing access tokens (RS256) |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Image uploads |
| `CLIENT_URL` / `ADMIN_URL` | Allowed CORS origins |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` (or `SENDGRID_API_KEY`) | Transactional email; falls back to a local Ethereal test inbox if unset |
| `MSG91_API_KEY` / `MSG91_TEMPLATE_ID` | SMS OTP; silently skipped if unset |
| `ADMIN_EMAIL` / `ADMIN_INITIAL_PASSWORD` | Used only by the seed script to create the first admin account |

Client/admin need `VITE_API_URL` pointing at the API's base URL.

## Deployment

- **Server**: Render web service, root directory `server`, build `npm install`, start `npm start`, health check `/api/v1/health`. Auto-deploys on push to `main`.
- **Client / Admin**: Vercel, root directory `client` / `admin` respectively. Both include a `vercel.json` SPA rewrite since they use client-side routing.
