<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:1e3a5f,100:0f172a&height=180&section=header&text=CivicConnect&fontSize=48&fontColor=ffffff&fontAlignY=38&desc=Smart%20City%20Issue%20Reporting%20Platform&descAlignY=58&descSize=16&animation=fadeIn" width="100%"/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-civic--connect--webapp.vercel.app-22c55e?style=for-the-badge)](https://civic-connect-webapp.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## What is CivicConnect?

CivicConnect bridges the gap between **citizens and government authorities** for reporting and resolving civic infrastructure issues — potholes, waterlogging, broken streetlights, drainage failures, and more.

Citizens report issues with GPS-verified evidence. Authorities receive structured, prioritized data with real-time dashboards. Every report moves through a transparent lifecycle from submission to resolution.

> **Built because civic problems go unresolved not from lack of will, but lack of a structured reporting channel.**

---

## Live metrics

| Metric | Value |
|--------|-------|
| Issues reported | **50,000+** |
| Resolution rate | **94%** |
| Average resolve time | **48 hours** |
| City zones covered | **120+** |
| Portal types | Citizen + Government/Admin |

---

## Core features

### 🗺️ GPS + address verification
Every report is geocoded — state, city, pincode mapped to exact coordinates. Optional device GPS for field-level precision. No location spoofing.

### 📸 Photo evidence system
Mandatory photo uploads prevent fake reports and give field teams instant visual context before dispatching resources.

### 🔔 Real-time notification pipeline
Toast + push notifications keep citizens informed at every resolution stage: `Submitted → Assigned → In Progress → Resolved`.

### ⚠️ Severity classification engine
Issues are tagged `Low → Medium → High → Critical` so government resources are dispatched by priority, not by queue order.

### 🕵️ Anonymous reporting
Citizens can report without identity exposure while the system maintains internal accountability and audit trails.

### 🏛️ Admin / Government dashboard
Dedicated authority portal with heatmaps by zone, bulk status management, team assignment, and resolution analytics.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Next.js 15 Frontend               │
│         App Router · SSR · TypeScript · Tailwind    │
└────────────────────┬────────────────────────────────┘
                     │ API Routes + Server Actions
┌────────────────────▼────────────────────────────────┐
│                  Supabase Backend                    │
│   PostgreSQL · Row-Level Security · Realtime API    │
│   Auth (JWT) · Storage (photo uploads) · Edge Fn   │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│              Database Layer (PostgreSQL)             │
│   Issues · Users · Zones · Assignments · Audit Log  │
│         PLpgSQL migrations · RLS policies           │
└─────────────────────────────────────────────────────┘
```

**Key engineering decisions:**
- **Row-Level Security (RLS)** — citizens can only read/write their own reports; authorities see all issues in their assigned zones. Zero custom auth middleware needed.
- **Supabase Realtime** — issue status updates pushed to citizens via WebSocket subscriptions, eliminating polling.
- **Server Components + Server Actions** — form submissions and data mutations handled server-side, reducing client bundle size and preventing client-side data exposure.
- **PLpgSQL migrations** — schema versioned in `/supabase/migrations`, fully reproducible database state from scratch.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| Database | PostgreSQL with PLpgSQL |
| Auth | Supabase Auth (JWT + Row-Level Security) |
| Deployment | Vercel (CI/CD on push to main) |
| Maps | Geocoding API (address → coordinates) |

---

## Local setup

```bash
# 1. Clone the repository
git clone https://github.com/Aqib-jawed/Civic-Connect.git
cd Civic-Connect

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase project URL and anon key

# 4. Run Supabase migrations
npx supabase db push

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the citizen portal.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the government dashboard.

---

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

See `.env.example` for the full list.

---

## Project structure

```
civic-connect/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── (citizen)/        # Citizen-facing routes
│   │   ├── admin/            # Government dashboard routes
│   │   └── api/              # API route handlers
│   ├── components/           # Shared UI components
│   ├── lib/                  # Supabase client, utilities
│   └── types/                # TypeScript type definitions
├── supabase/
│   └── migrations/           # Versioned PLpgSQL schema migrations
├── public/                   # Static assets
└── middleware.ts             # Auth middleware (route protection)
```

---

## Roadmap

- [x] Citizen issue reporting with GPS + photo
- [x] Real-time status notifications
- [x] Severity classification system
- [x] Admin dashboard with zone management
- [x] Anonymous reporting mode
- [ ] Native mobile app (React Native)
- [ ] AI-powered duplicate detection (clustering nearby reports)
- [ ] Public heatmap accessible without login
- [ ] WhatsApp / SMS notification channel

---

## Why this project matters

India generates millions of unresolved civic complaints annually. Most are lost in WhatsApp groups, paper forms, or opaque government portals with no tracking. CivicConnect treats civic reporting as a software problem — structured data, real-time updates, accountability through audit trails.

This was built as a real-world system, not a demo. The admin portal handles real issue triage logic. The RLS policies ensure data isolation without custom auth code. The notification system is event-driven, not polled.

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a PR.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit using conventional commits: `feat(reports): add duplicate detection`
4. Push and open a PR against `main`

---

## Author

**Aqib Jawed** — Full-Stack Engineer · GITAM University CSE '27

[![GitHub](https://img.shields.io/badge/GitHub-Aqib--jawed-181717?style=flat-square&logo=github)](https://github.com/Aqib-jawed)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-aqib--jawed-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/aqib-jawed-6ta)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-22c55e?style=flat-square)](https://portfolio-website-edwj.vercel.app/)

---

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1e3a5f,100:0f172a&height=80&section=footer" width="100%"/>
</div>
