<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/logo-dark.svg" />
  <img src="public/logo.svg" alt="Pixel" width="72" />
</picture>

# Pixel

**A multi-tenant website builder for small businesses.**

Pick a template, edit it visually, publish to a subdomain or your own domain in minutes.

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)](#tech-stack)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](#tech-stack)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](#tech-stack)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](#tech-stack)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](#tech-stack)
[![License](https://img.shields.io/badge/license-All%20rights%20reserved-lightgrey)](LICENSE)

Built by **[Eray Pişkin](https://eraypiskin.com)**

</div>

---

## Overview

Pixel is a self-hostable SaaS for small businesses that need a professional website without touching code. Each user gets a site with a live visual editor, a blog, a contact form, analytics and SEO handled for them. Every site is served from its own subdomain (`yoursite.example.com`) or from a custom domain with automatic HTTPS.

> The user-facing UI is in Turkish.

## Features

| Area | What it does |
| --- | --- |
| **Visual editor** | Live, section-based editor with instant preview. Hero variants, card styles, entrance animations and per-section backgrounds. |
| **Sections** | 17 building blocks: hero, about, services, menu, pricing, team, gallery, testimonials, stats, partners, video, FAQ, blog, CTA, contact, header, footer. |
| **Theming** | Global color palette, fonts, social links and a WhatsApp button. Multi-page sites. |
| **Templates** | 8 industry templates: restaurant, agency, portfolio, beauty, fitness, blog, hotel, tech. |
| **Site generator** | 5-step wizard that builds a starting site from sector, tone and color choices. |
| **Publishing** | Instant subdomain publishing via wildcard routing. |
| **Custom domains** | DNS verification and automatic Let's Encrypt certificates through Traefik. |
| **SEO** | Per-site `sitemap.xml`, `robots.txt`, Open Graph and JSON-LD structured data. |
| **Blog & forms** | Built-in post editor and a contact form submissions inbox. |
| **Analytics** | Built-in visit analytics per site, plus a cookie consent banner. |
| **Platform admin** | Super admin panel for user and site management. |

## Architecture

```
  yoursite.example.com        www.customer.com         app.example.com
   (public subdomain)          (custom domain)       (dashboard / editor)
          │                          │                        │
          │              ┌───────────▼───────────┐            │
          │              │ Traefik (Let's Encrypt│            │
          │              │ per-domain routers)   │            │
          │              └───────────┬───────────┘            │
          └──────────────┬───────────┴────────────────────────┘
               ┌─────────▼──────────────────────────────┐
               │  Next.js middleware                    │
               │  host → /sites/<subdomain> rewrite     │
               └─────────┬──────────────────────────────┘
               ┌─────────▼──────────────────────────────┐
               │  Next.js 14 App Router                 │
               │  site renderer · editor · REST API     │
               │  NextAuth (JWT) · Zustand              │
               └─────────┬──────────────────────────────┘
                         │ Prisma
               ┌─────────▼─────────┐
               │   PostgreSQL 16   │
               └───────────────────┘
```

- **Multi-tenancy:** every site belongs to a user and is resolved from the request host. Subdomains are matched in middleware; custom domains are looked up through an internal API and rewritten to the same renderer.
- **Custom domains:** once DNS is verified, the app writes a Traefik dynamic config for the domain so it gets its own router and certificate. Configs are regenerated on every startup.
- **Site config:** each site is a single JSON document (pages, sections, theme) edited in the browser, stored in PostgreSQL and served live once published.
- **Passwords:** stored as bcrypt hashes only. The super admin is created from environment variables, never from source.

## Tech Stack

**Framework:** Next.js 14 (App Router), React 18, TypeScript
**Styling & state:** Tailwind CSS, Zustand
**Data & auth:** PostgreSQL 16, Prisma, NextAuth (credentials, JWT)
**Infrastructure:** Docker, Docker Compose, Traefik, Coolify

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose

### Local development

```bash
# 1. Start PostgreSQL
docker compose up -d db

# 2. Configure environment
cp .env.example .env
# Set ADMIN_PASSWORD and NEXTAUTH_SECRET in .env

# 3. Install dependencies, sync the schema and seed
npm install
npx prisma db push
npm run db:seed

# 4. Run
npm run dev
```

Open `http://localhost:3000` and sign in with the `ADMIN_USERNAME` / `ADMIN_PASSWORD` you set. The admin panel is at `/admin`.

Browsers resolve `*.localhost` natively, so a published site is available at `http://<subdomain>.localhost:3000`.

## Configuration

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_URL` | ✅ | Public URL of the app |
| `NEXTAUTH_SECRET` | ✅ | JWT secret: `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public URL of the app |
| `NEXT_PUBLIC_ROOT_DOMAIN` | ✅ | Root domain for subdomains, e.g. `example.com` |
| `ADMIN_EMAIL` | first run | Super admin email, used by the seed |
| `ADMIN_USERNAME` | first run | Super admin username, used by the seed |
| `ADMIN_PASSWORD` | first run | Super admin password, used by the seed |
| `USER_EMAIL_DOMAIN` | | Domain for internal user emails (default `pixel.local`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | | Contact email shown for custom domain requests |
| `NEXT_PUBLIC_SERVER_IP` | | Server IP shown to users for A-record setup |
| `TRAEFIK_DYNAMIC_DIR` | | Directory Traefik watches for dynamic config |
| `TRAEFIK_SERVICE_URL` | | App URL as seen from Traefik |
| `TRAEFIK_CERT_RESOLVER` | | Traefik cert resolver name (default `letsencrypt`) |

The super admin is created only when none exists. On a fresh database, startup fails until the `ADMIN_*` variables are set.

## Production Deployment

The production image runs `prisma db push`, seeds templates and the super admin, writes Traefik configs and then starts the server.

```bash
cp .env.example .env.prod
# Fill in .env.prod, including POSTGRES_PASSWORD
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

`docker-compose.prod.yml` targets a [Coolify](https://coolify.io) host: it joins the `coolify` network and mounts Traefik's dynamic config directory so custom domains get routed and certified automatically. On other setups, adjust the network and the `TRAEFIK_*` variables.

Point a wildcard DNS record (`*.example.com`) at the server for subdomains to work.

## Project Structure

```
prisma/              Schema and seed scripts
scripts/             Container startup scripts (Traefik config, migrations)
src/
├── app/
│   ├── (auth)/          Login
│   ├── (dashboard)/     Dashboard, editor, blog, analytics, settings
│   ├── (onboarding)/    First-run wizard
│   ├── (superadmin)/    Admin panel
│   ├── api/             REST API routes
│   └── sites/           Public site renderer
├── components/
│   ├── editor/          Visual editor
│   └── templates/       Section renderers
├── lib/             Auth, Prisma, rate limiting, sanitization, Traefik
├── stores/          Zustand stores
├── types/           Shared types
└── middleware.ts    Subdomain and custom domain routing
```

## Scripts

```bash
npm run dev                # Development server
npm run build              # Production build
npm run start              # Start production server
npm run db:push            # Sync schema to the database
npm run db:seed            # Seed templates and super admin
npm run db:studio          # Open Prisma Studio
```

## License

Copyright © 2026 [Eray Pişkin](https://eraypiskin.com). **All rights reserved.**

The source is published for viewing and evaluation only. Using, copying, modifying, hosting or distributing it requires written permission. See [LICENSE](LICENSE). For licensing or commercial inquiries, reach out via [eraypiskin.com](https://eraypiskin.com).
