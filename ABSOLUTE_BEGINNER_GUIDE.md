# 🚀 GlobalCo AI Job Board — The Absolute Beginner's Guide

> **Live App:** [https://globalco-ai-job-board.vercel.app](https://globalco-ai-job-board.vercel.app)
>
> This document is your one-stop resource. It explains **everything**: what each file does, how the pieces fit together, every error we hit during development (and how we fixed it), common interview questions, and full-stack concepts that every developer should know.

---

## 📖 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack Explained for Beginners](#-tech-stack-explained-for-beginners)
3. [Full Directory Structure & File-by-File Explanation](#-full-directory-structure--file-by-file-explanation)
4. [System Architecture & Data Flow](#-system-architecture--data-flow)
5. [All Errors Faced & How We Fixed Them](#-all-errors-faced--how-we-fixed-them)
6. [CI/CD Pipeline (GitHub Actions & Vercel)](#-cicd-pipeline-github-actions--vercel)
7. [Interview Questions & Answers](#-interview-questions--answers)
8. [Full-Stack Concepts Explained](#-full-stack-concepts-explained)
9. [Common Commands Cheat Sheet](#-common-commands-cheat-sheet)

---

## 🧠 Project Overview

**HireAI** is a full-stack web application that connects **recruiters** and **candidates** using the power of AI. Think of it like a smarter LinkedIn Jobs or Indeed — but with AI-powered resume reviews, job matching, and job description generation built right in.

### Who uses it?

| Role | What They Can Do |
|------|------------------|
| **Candidate** | Browse jobs, apply, upload resume for AI review, see how well they match a job |
| **Recruiter** | Post/edit/delete jobs, view applicants, change application statuses, generate job descriptions with AI |

### Core Features

1. **🔐 Role-based Auth** — Sign up as Candidate or Recruiter, get a tailored dashboard
2. **💼 Job Management** — Full CRUD (Create, Read, Update, Delete) for job listings
3. **🤖 AI Resume Review** — Upload a PDF/TXT resume, get scores, skills analysis, grammar tips, ATS score
4. **🎯 AI Job Match** — See how well your profile matches a specific job
5. **📝 AI Job Description Generator** — Type a role + skills, get a complete job description
6. **📊 Dashboards** — Recruiters see applicant stats; Candidates see application statuses
7. **🌓 Dark Mode** — Theme toggle with localStorage persistence

---

## 🛠 Tech Stack Explained for Beginners

### Frontend (what you see in the browser)

| Technology | What It Is | Why We Used It |
|---|---|---|
| **Next.js 16** | React framework for building full-stack web apps | Gives us server-side rendering, file-based routing, API routes, all in one project |
| **React 19** | JavaScript library for building user interfaces | Component-based architecture — reusable pieces of UI |
| **TypeScript** | JavaScript with types | Catches bugs at build time instead of runtime |
| **Tailwind CSS v4** | Utility-first CSS framework | Rapid styling without writing custom CSS files |
| **shadcn/ui** | Component library (Radix UI + Tailwind) | Beautiful, accessible, copy-paste components we own |
| **TanStack React Query** | Server state management | Handles caching, loading states, refetching for API calls |
| **React Hook Form + Zod** | Form handling + validation | Type-safe form validation with minimal re-renders |
| **Lucide React** | Icon library | Consistent SVG icons throughout the app |

### Backend (server-side logic)

| Technology | What It Is | Why We Used It |
|---|---|---|
| **Next.js API Routes** | Serverless functions in `app/api/` | No separate backend needed — frontend + backend in one project |
| **Supabase Auth** | Authentication as a service | Handles user sign-up, sign-in, session management for us |
| **Supabase PostgreSQL** | Hosted Postgres database | Managed, scalable, has a free tier |
| **Prisma 7** | Type-safe ORM (Object-Relational Mapper) | Lets us talk to the database using TypeScript instead of SQL |
| **Groq SDK** | AI inference API | Powers all AI features (resume review, job match, description gen) |

### Infrastructure

| Technology | What It Is | Why We Used It |
|---|---|---|
| **Vercel** | Cloud platform for frontend apps | Deploys Next.js apps seamlessly (created by the same team) |
| **GitHub Actions** | CI/CD automation | Automatically lints code and deploys on every push |
| **Git** | Version control | Track all changes, collaborate, rollback if needed |

---

## 📁 Full Directory Structure & File-by-File Explanation

```
globalco-assignment-ai-job-board/
│
├── .github/workflows/deploy.yml     # CI/CD pipeline — auto lint + deploy to Vercel
├── prisma/
│   ├── schema.prisma                 # Database schema (tables, relations, enums)
│   └── seed.ts                       # Test data seeder (creates users + jobs)
├── public/                           # Static assets (SVG icons, favicon)
├── src/
│   ├── app/                          # Next.js App Router — every folder = a route
│   │   ├── layout.tsx                # Root layout — fonts, theme script, providers
│   │   ├── page.tsx                  # Landing page (/) — 8-section marketing page
│   │   ├── globals.css               # Tailwind imports + CSS variables for theming
│   │   ├── sign-in/[[...rest]]/page.tsx   # Auth sign-in page
│   │   ├── sign-up/[[...rest]]/page.tsx   # Auth sign-up page with role selection
│   │   ├── jobs/
│   │   │   ├── page.tsx              # Browse jobs listing with search + pagination
│   │   │   └── [id]/page.tsx         # Single job detail page
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Dashboard layout — checks auth, sidebar nav
│   │   │   ├── page.tsx              # Role-based home (stats for recruiter/candidate)
│   │   │   ├── profile/page.tsx      # View + edit profile
│   │   │   ├── resume/page.tsx       # Upload resume for AI review (candidate only)
│   │   │   ├── applications/page.tsx # My applications list (candidate)
│   │   │   ├── applicants/page.tsx   # Applicants for my jobs (recruiter)
│   │   │   ├── jobs/page.tsx         # My job listings (recruiter)
│   │   │   ├── jobs/create/page.tsx  # Create a job (with AI pre-fill support)
│   │   │   ├── jobs/create/ai/page.tsx    # AI job description generator
│   │   │   └── jobs/[id]/edit/page.tsx    # Edit a job
│   │   └── api/                      # REST API routes (serverless functions)
│   │       ├── profile/route.ts      # GET/PUT user profile
│   │       ├── user/role/route.ts    # PUT switch role
│   │       ├── jobs/route.ts         # GET list / POST create job
│   │       ├── jobs/[id]/route.ts    # GET/PUT/DELETE single job
│   │       ├── applications/route.ts # GET list / POST apply
│   │       ├── applications/[id]/route.ts  # PATCH application status
│   │       └── ai/
│   │           ├── resume-review/route.ts          # POST AI resume analysis
│   │           ├── job-match/route.ts              # POST AI job match score
│   │           ├── extract-text/route.ts           # POST PDF text extraction
│   │           ├── parse-resume/route.ts           # POST AI resume parsing
│   │           └── generate-job-description/route.ts # POST AI job desc gen
│   │
│   ├── components/                   # Shared UI components
│   │   ├── ui/                       # shadcn/ui primitives
│   │   │   ├── button.tsx            # Reusable button with variants
│   │   │   ├── card.tsx              # Card container components
│   │   │   └── badge.tsx             # Status/role badges
│   │   ├── auth/
│   │   │   └── auth-layout.tsx       # Split-screen layout for auth pages
│   │   ├── landing/                  # Landing page section components
│   │   │   ├── header.tsx            # Fixed nav bar with logo + links
│   │   │   ├── hero.tsx              # Hero section with CTA
│   │   │   ├── features.tsx          # Feature grid cards
│   │   │   ├── how-it-works.tsx      # 4-step process
│   │   │   ├── ai-showcase.tsx       # AI demo with resume scores
│   │   │   ├── recruiter-dashboard.tsx # Mock dashboard stats
│   │   │   ├── cta-section.tsx       # Final call-to-action
│   │   │   └── footer.tsx            # Site footer
│   │   ├── providers/
│   │   │   ├── index.ts              # Barrel exports
│   │   │   └── query-provider.tsx    # TanStack Query client wrapper
│   │   ├── auth-listener.tsx         # Listens to Supabase auth state changes
│   │   ├── dashboard-nav.tsx         # Sidebar nav (different links per role)
│   │   ├── pagination.tsx            # Page numbers with ellipsis
│   │   ├── role-switcher.tsx         # Toggle between CANDIDATE/RECRUITER
│   │   ├── status-updater.tsx        # Application status badge + quick actions
│   │   ├── theme-toggle.tsx          # Dark/light mode toggle
│   │   └── user-menu.tsx             # Dropdown: avatar, name, sign-out
│   │
│   ├── features/                     # Feature-specific components
│   │   ├── jobs/components/
│   │   │   ├── job-card.tsx          # Job listing card
│   │   │   ├── job-search.tsx        # Search bar with URL params
│   │   │   ├── job-match-score.tsx   # AI match score display
│   │   │   ├── job-form.tsx          # Create/edit job form (react-hook-form)
│   │   │   ├── job-description-generator.tsx # AI job desc input + output
│   │   │   └── apply-button.tsx      # Apply with optional resume upload
│   │   ├── profile/components/
│   │   │   └── profile-form.tsx      # Full profile editor with PDF upload
│   │   └── resume/components/
│   │       └── resume-review-page.tsx # Resume upload + AI analysis display
│   │
│   ├── lib/                          # Utility and service modules
│   │   ├── utils.ts                  # cn() — Tailwind class merger
│   │   ├── validations.ts            # Zod schemas for all forms
│   │   ├── auth.ts                   # Server-side auth helpers
│   │   ├── api-error.ts              # Standardized API error handling
│   │   ├── groq.ts                   # Groq AI client singleton
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   └── supabase/
│   │       ├── client.ts             # Browser-side Supabase client
│   │       └── server.ts             # Server-side Supabase client (cookies)
│   │
│   ├── types/index.ts                # Shared TypeScript type definitions
│   └── proxy.ts                      # Next.js middleware — auth redirects
│
├── .env                              # Environment variables (gitignored)
├── .env.example                      # Template for environment variables
├── .gitignore                        # What git should ignore
├── next.config.ts                    # Next.js configuration
├── vercel.json                       # Vercel deployment config
├── prisma.config.ts                  # Prisma 7 configuration
├── components.json                   # shadcn/ui configuration
├── tsconfig.json                     # TypeScript configuration
├── postcss.config.mjs               # PostCSS config for Tailwind
├── eslint.config.mjs                 # ESLint config for code quality
├── package.json                      # Dependencies + scripts
├── AGENTS.md                         # AI agent instructions
├── CLAUDE.md                         # AI agent instructions (legacy)
└── README.md                         # Project README
```

---

## 🏗 System Architecture & Data Flow

### Architecture Diagram (Conceptual)

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Landing  │  │ Pages    │  │ React Query Cache     │  │
│  │  Page    │  │ (Dashboard,│  │ (auto-manages API    │  │
│  │          │  │  Jobs,    │  │  data freshness)      │  │
│  │          │  │  etc.)    │  │                       │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP requests
                       ▼
┌─────────────────────────────────────────────────────────┐
│                Next.js Server (Vercel)                    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │          Server Components (RSC)                  │    │
│  │  - Most pages are Server Components              │    │
│  │  - Fetch data directly from DB on the server      │    │
│  │  - No JavaScript sent to client for these parts   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │         API Routes (REST endpoints)               │    │
│  │  /api/profile, /api/jobs, /api/applications,     │    │
│  │  /api/ai/resume-review, /api/ai/job-match, etc.  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │           Middleware (src/proxy.ts)               │    │
│  │  Runs on EVERY request before the page loads     │    │
│  │  Checks auth, redirects if needed                 │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌──────────────┐
│  Supabase  │ │  Supabase  │ │   Groq AI    │
│   Auth     │ │PostgreSQL  │ │   (LLaMA)    │
│(Auth mgmt) │ │ (Database) │ │(AI features) │
└────────────┘ └────────────┘ └──────────────┘
```

### How a Request Flows (Example: Candidate applies for a job)

```
1. User clicks "Apply" on a job page
2. apply-button.tsx sends POST /api/applications
3. Middleware (proxy.ts) runs first — checks auth cookie
4. If not authenticated → redirect to /sign-in
5. If authenticated → request reaches the API route
6. API route calls requireAuth() → verifies Supabase session
7. API route validates request body with Zod (applyJobSchema)
8. API route writes to database via Prisma (Application.create)
9. API route returns JSON response
10. React Query invalidates the applications cache
11. UI updates to show "Applied" state
```

### How AI Features Work

```
User uploads resume (PDF) → /api/ai/extract-text (custom PDF parser)
                                        ↓
                              Raw text extracted
                                        ↓
User clicks "Review Resume" → /api/ai/resume-review
                                        ↓
                        Sends prompt + text to Groq AI
                        (llama-3.3-70b-versatile model)
                                        ↓
                        AI returns structured JSON with:
                        scores, skills, strengths, weaknesses, etc.
                                        ↓
                        Stored in ResumeReview table
                                        ↓
                        Displayed in beautiful UI cards
```

---

## 🐛 All Errors Faced & How We Fixed Them

This is the **most important section** if you're new. Every error below was hit during real development. Understanding them will save you hours of debugging.

### 🔴 Phase 1: TypeScript & Lint Errors

#### Error 1: Missing types everywhere
```
Type '"CANDIDATE"' is not assignable to type 'Role'
Property 'map' does not exist on type 'string'
```

**Why:** TypeScript strict mode was on, and we were using `any` implicitly.

**Fix:** Created `src/types/index.ts` with explicit interfaces. Used `as` casting where necessary but preferred proper type annotations.

```ts
// ❌ Before
const role = authUser.user_metadata?.role ?? "CANDIDATE";

// ✅ After
const role = (authUser.user_metadata?.role as Role) ?? "CANDIDATE";
```

---

#### Error 2: `lucide-react` import issues
```
Module '"lucide-react"' has no exported member 'Sun'
```

**Why:** We mistyped icon names (e.g., `Sun` instead of `SunIcon`).

**Fix:** Checked the [Lucide docs](https://lucide.dev/icons) for exact icon names. Fixed to use `Sun`, `Moon`, `Menu`, etc. (these ARE actual exports in newer versions).

---

#### Error 3: Zod validation type mismatches in `job-form.tsx`
```
Type 'string | undefined' is not assignable to type 'string'
```

**Why:** Zod schemas had `z.string().optional()` but form state expected `string | undefined` while Prisma expected `string | null`.

**Fix:** Used `z.preprocess()` to convert empty strings to `null`:

```ts
companySize: z.preprocess(
  (v) => (v === "" ? null : v),
  z.string().optional().nullable()
),
```

---

#### Error 4: Lint warnings in `theme-toggle.tsx` and `seed.ts`
```
React Hook useEffect has a missing dependency: 'setTheme'
'vs' is defined but never used
```

**Why:** ESLint rules enforcing the `react-hooks/exhaustive-deps` rule. Unused variables from copy-paste.

**Fix:** Added missing deps to dependency arrays. Removed unused variables.

---

#### Error 5: `requireAuth()` returning void when expect user
```
Property 'role' does not exist on type 'void | User'
```

**Why:** `requireAuth()` threw an `ApiError` exception for unauthorized users, but TypeScript didn't know that (thrown errors aren't reflected in return types).

**Fix:** Made `requireAuth()` return `Promise<User>` and let the exception propagate naturally.

---

### 🔴 Phase 2: Prisma Client & Database Errors

#### Error 6: "Export prisma doesn't exist in target module"
```
Attempted to import { prisma } but the module has no such export
```

**Why:** Early code tried `import { prisma } from "@/lib/prisma"` but we later refactored to use a lazy singleton pattern with `getPrisma()`.

**Fix:** Changed all imports and usages:

```ts
// ❌ Before
import { prisma } from "@/lib/prisma";
await prisma.user.findUnique(...)

// ✅ After
import { getPrisma } from "@/lib/prisma";
await getPrisma().user.findUnique(...)
```

---

#### Error 7: Build fails when `DATABASE_URL` is missing
```
Error: DATABASE_URL environment variable is not set
  at PrismaClient instantiation
```

**Why:** The Prisma client was initialized at the **module level** (top of file). During build time on Vercel, `DATABASE_URL` isn't available (it's only available at runtime), so the build crashed immediately.

**Fix (Critical!):** Implemented **lazy initialization** — the Prisma client is only created when first called:

```ts
// src/lib/prisma.ts (the fix)
let prismaInstance: PrismaClient | null = null;

export function getPrisma() {
  if (prismaInstance) return prismaInstance;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const adapter = new PrismaPg({ connectionString });
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient({ adapter });
  return prismaInstance;
}
```

---

#### Error 8: Prisma 7 Driver Adapter confusion
```
Error: PrismaClientInitializationError: Prisma requires a driver adapter
```

**Why:** Prisma 7 changed how database connections work. You **must** use a driver adapter (`@prisma/adapter-pg` for PostgreSQL). The old `datasource db.url` approach doesn't work anymore.

**Fix:** Added `@prisma/adapter-pg` and passed `PrismaPg` adapter to `PrismaClient`:

```ts
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
```

Also, the `schema.prisma` must NOT have a `url` in the datasource block:

```prisma
datasource db {
  provider = "postgresql"
  // NO url here — it's passed programmatically
}
```

---

#### Error 9: Prisma 7 `prisma-client` provider vs `prisma-client-js`
```
Generator 'prisma-client-js' is not recognized. Did you mean 'prisma-client'?
```

**Why:** Prisma 7 renamed the generator from `prisma-client-js` to `prisma-client`.

**Fix:** Updated `schema.prisma`:

```prisma
// ❌ Before (Prisma 6 and below)
generator client {
  provider = "prisma-client-js"
}

// ✅ After (Prisma 7)
generator client {
  provider = "prisma-client"
}
```

---

### 🔴 Phase 3: Groq AI Client Errors

#### Error 10: Build fails when `GROQ_API_KEY` is missing
```
Error: Groq API key is required
  at new Groq(client.ts:...)
```

**Why:** Same problem as Prisma — the Groq client was initialized at module level.

**Fix:** Same lazy initialization pattern:

```ts
// src/lib/groq.ts
let groqInstance: Groq | null = null;

export function getGroq(): Groq {
  if (!groqInstance) {
    groqInstance = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groqInstance;
}
```

---

#### Error 11: Groq returns invalid JSON
```
SyntaxError: Unexpected token in JSON at position 1234
```

**Why:** The AI model sometimes returned malformed JSON, especially with long responses.

**Fix:** Added `response_format: { type: "json_object" }` to the API call. Also added try/catch around `JSON.parse()` with a fallback.

---

### 🔴 Phase 4: CI/CD & GitHub Actions Errors

#### Error 12: First deploy attempt — `vercel` command not found
```
Run: npx vercel deploy --prod
Error: Command 'vercel' not found
```

**Why:** The Vercel CLI isn't installed by default in GitHub Actions runners.

**Fix (Commit `f342f27`):** Used `npx vercel@latest` instead of `vercel`:

```yaml
# ❌ Before
run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}

# ✅ After
run: npx vercel@latest deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

#### Error 13: Vercel deploy succeeds but app shows 404
```
Deployment URL generated but app returns 404 on all routes
```

**Why:** The `--scope` flag wasn't being passed, so Vercel deployed to the wrong project scope.

**Fix (Commit `b6e075a`):** Added `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` environment variables and the `--scope` flag:

```yaml
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

run: |
  npx vercel@latest deploy \
    --token=${{ secrets.VERCEL_TOKEN }} \
    --prod \
    --scope=${{ secrets.VERCEL_ORG_ID }}
```

---

#### Error 14: GitHub Actions "amondnet/vercel-action" was unreliable
```
Error: No deployment created
```

**Why:** The `amondnet/vercel-action` GitHub Action (a third-party action) sometimes failed silently due to API rate limits.

**Fix (Commit `13a1a4c`):** Removed the third-party action entirely. Switched to direct CLI commands:

```yaml
# ❌ Before (unreliable third-party action)
- uses: amondnet/vercel-action@v20
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}

# ✅ After (direct CLI — more control, fewer surprises)
- name: Deploy to Vercel
  run: npx vercel@latest deploy --prod --token=${{ secrets.VERCEL_TOKEN }} --scope=${{ secrets.VERCEL_ORG_ID }}
```

---

#### Error 15: Node.js version mismatch
```
Error: The engine "node" is incompatible with this module
```

**Why:** GitHub Actions was using an older Node.js version.

**Fix:** Pinned Node.js to version 24 in the workflow:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 24
```

---

#### Error 16: Vercel deploy — build succeeded but routes returned 500
```
Error: PrismaClient is not configured to run in Vercel Edge Functions
```

**Why:** We accidentally used Prisma in a server component that was being rendered on the Edge Runtime.

**Fix:** Ensured all Prisma calls happen in **Server Components** or **API Routes** (Node.js runtime), not Edge functions. Vercel automatically detects this from `next.config.ts`.

---

### 🔴 Phase 5: Runtime & Logic Errors

#### Error 17: Theme toggle flashing on page load
```
Sees a flash of light mode before dark mode kicks in
```

**Why:** React hydration happens after the initial HTML is painted. If the user has dark mode set, the page would flash light mode for a split second.

**Fix (Commit `cd04ee0`):** Added an inline `<script>` in the `<head>` that runs BEFORE React hydration:

```tsx
<head>
  <script dangerouslySetInnerHTML={{
    __html: `
      (function() {
        try {
          var theme = localStorage.getItem('theme');
          if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
          }
        } catch(e) {}
      })();
    `
  }} />
</head>
```

Also simplified the `theme-toggle.tsx` to remove unnecessary `mounted` state.

---

#### Error 18: "document is not defined" / "useEffect is not defined"
```
ReferenceError: document is not defined
ReferenceError: useEffect is not defined
```

**Why:** These are browser APIs (`document`, `useEffect`) that don't exist on the server. A component that uses them was running as a Server Component.

**Fix:** Added `"use client"` directive at the top of any component using browser APIs. Next.js 16 App Router treats all components as Server Components by default.

---

#### Error 19: Application duplicate entries
```
Unique constraint failed on the fields: (`candidateId`,`jobId`)
```

**Why:** A candidate could click "Apply" multiple times before the UI updated.

**Fix:** The Prisma schema already had `@@unique([candidateId, jobId])`. The fix was to catch this error in the API route and return a friendly "You've already applied" message.

---

#### Error 20: PDF text extraction failures
```
Error: Invalid PDF structure
```

**Why:** Some PDFs have non-standard encodings or are scanned images (not text).

**Fix:** Added better error handling in `/api/ai/extract-text` — returns a clear error message telling the user to upload a text-based PDF. Also added `.txt` file support as a fallback.

---

### 📊 Error Summary Table

| # | Error | Severity | Area | Fix Commit |
|---|-------|----------|------|------------|
| 1 | Missing types | Medium | TypeScript | `279c46d` |
| 2 | Icon import errors | Low | UI | `889c18b` |
| 3 | Zod/preprocess type mismatch | Medium | Forms | `279c46d` |
| 4 | ESLint hook/exhaustive-deps | Medium | Linting | `fc3369a` |
| 5 | requireAuth() return type | Low | Auth | `889c18b` |
| 6 | prisma import name mismatch | High | Prisma | Dev-time |
| 7 | Build crash: DATABASE_URL missing | **CRITICAL** | Build | `660fe15` |
| 8 | Prisma 7 driver adapter required | **CRITICAL** | Database | Dev-time |
| 9 | prisma-client vs prisma-client-js | **CRITICAL** | Prisma | Dev-time |
| 10 | Build crash: GROQ_API_KEY missing | **CRITICAL** | Build | `82e2d28` |
| 11 | Groq invalid JSON response | Medium | AI | Dev-time |
| 12 | vercel command not found in CI | High | CI/CD | `f342f27` |
| 13 | Wrong Vercel project scope | High | CI/CD | `b6e075a` |
| 14 | amondnet/vercel-action unreliable | High | CI/CD | `13a1a4c` |
| 15 | Node version mismatch | Medium | CI/CD | `13a1a4c` |
| 16 | Prisma in Edge Runtime | High | Deployment | Dev-time |
| 17 | Dark mode flash on load | Medium | UI | `cd04ee0` |
| 18 | document/useEffect SSR errors | Medium | Components | Dev-time |
| 19 | Duplicate job applications | Low | Backend | Schema-level |
| 20 | PDF parsing failure | Low | AI | Dev-time |

---

## 🔄 CI/CD Pipeline (GitHub Actions & Vercel)

### What is CI/CD?

- **CI (Continuous Integration):** Every time you push code, it's automatically tested (lint, type-check).
- **CD (Continuous Deployment):** If tests pass, the code is automatically deployed to production.

### Our Pipeline (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to Vercel

on:                              # TRIGGER: When does this run?
  push:
    branches: [master, main]      # On every push to master/main
  pull_request:
    branches: [master, main]      # On every PR to master/main

jobs:
  lint-and-deploy:
    runs-on: ubuntu-latest        # Runs on GitHub's Ubuntu servers

    env:                          # Environment variables available in all steps
      VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
      VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

    steps:
      - uses: actions/checkout@v4        # Step 1: Get the code from GitHub
      
      - name: Setup Node.js
        uses: actions/setup-node@v4      # Step 2: Install Node.js
        with:
          node-version: 24
          cache: npm                     # Cache node_modules for speed

      - name: Install dependencies
        run: npm ci                      # Step 3: Clean install (uses package-lock.json)

      - name: Run lint
        run: npm run lint                # Step 4: Check code quality

      - name: Deploy to Vercel
        run: |                           # Step 5: Deploy!
          npx vercel@latest deploy \
            --token=${{ secrets.VERCEL_TOKEN }} \
            --prod \
            --scope=${{ secrets.VERCEL_ORG_ID }}
```

### Secrets Required in GitHub

These are stored in GitHub → Settings → Secrets and Variables → Actions:

| Secret | Where to Get It |
|--------|----------------|
| `VERCEL_TOKEN` | Vercel Account → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | Vercel Project → Settings → General → Project ID (actually the Team ID) |
| `VERCEL_PROJECT_ID` | Vercel Project → Settings → General → Project ID |

### How to Set Up from Scratch

1. **Create Vercel account** at [vercel.com](https://vercel.com) (sign in with GitHub)
2. **Import your GitHub repo** in Vercel Dashboard → Add New → Project
3. **Get your IDs:**
   - Token: Vercel Dashboard → Settings → Tokens → Create
   - Org ID: Vercel Dashboard → Team settings → ID
   - Project ID: Vercel Dashboard → Project → Settings → General
4. **Add secrets to GitHub:** Repo → Settings → Secrets and variables → Actions → New repository secret

### Vercel Configuration (`vercel.json`)

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

This tells Vercel exactly how to build the project. Since we're using Next.js, the defaults work fine — we just explicitly set them.

---

## 🎤 Interview Questions & Answers

### Basic Level

**Q: What is Next.js and why use it over plain React?**

A: Next.js is a React framework that adds server-side rendering (SSR), file-based routing, API routes, and optimizations out of the box. Plain React only handles the client-side UI — you'd need to add React Router for routing, Express for APIs, and configure SSR yourself. Next.js gives you all of this in one framework.

---

**Q: What is the App Router in Next.js 16?**

A: The App Router is a newer routing system based on the file system. Each folder inside `src/app/` becomes a route. Files named `page.tsx` define the UI for that route. Files named `layout.tsx` define shared layouts. Files named `route.ts` define API endpoints. It supports Server Components by default, nested layouts, loading states, and error boundaries.

---

**Q: What is the difference between Server Components and Client Components?**

A: Server Components render on the server and send only HTML to the browser. They can directly access databases, file systems, and server-side resources. Client Components (marked with `"use client"`) render in the browser and can use React hooks (`useState`, `useEffect`), browser APIs, and event handlers. In Next.js App Router, **all components are Server Components by default** — you only add `"use client"` when you need interactivity.

---

**Q: What is Prisma and what problem does it solve?**

A: Prisma is an ORM (Object-Relational Mapper). Instead of writing raw SQL like `SELECT * FROM users WHERE email = '...'`, you write TypeScript like `prisma.user.findUnique({ where: { email } })`. Benefits: type safety (TypeScript catches column name typos), auto-completion in your IDE, schema migrations, and a clean API.

---

**Q: What is an ORM?**

A: ORM stands for Object-Relational Mapping. It's a technique that lets you interact with your database using objects and methods in your programming language, instead of writing raw SQL queries. Think of it as a translator between your code (TypeScript objects) and the database (SQL tables).

---

**Q: What is Supabase and how does it compare to Firebase?**

A: Supabase is an open-source Firebase alternative. It provides PostgreSQL database, authentication, storage, and real-time subscriptions. Unlike Firebase (which uses NoSQL), Supabase uses PostgreSQL — a powerful relational database with proper joins, constraints, and SQL. We use Supabase for both database (PostgreSQL) and authentication (Supabase Auth).

---

**Q: What is TanStack React Query used for?**

A: React Query manages server state — data that comes from an API. It handles caching (so you don't refetch the same data), background refetching (keeps data fresh), loading states (`isLoading`), error states (`isError`), and automatic cache invalidation (when you mutate data, it refetches related queries). It eliminates the need for manual `useState` + `useEffect` for API calls.

---

**Q: What is Zod and why use it?**

A: Zod is a TypeScript-first schema validation library. You define a schema (e.g., `z.string().min(1).max(200)`) and Zod validates data against it. It automatically infers the TypeScript type from the schema. We use it to validate API request bodies and form inputs before processing them, catching malformed data early.

---

**Q: Explain the `.env` file — what goes in it and why is it gitignored?**

A: The `.env` file stores sensitive configuration like database URLs, API keys, and secrets. It's gitignored (listed in `.gitignore`) so these secrets never get committed to GitHub. Instead, we provide `.env.example` as a template with placeholder values. On Vercel, you set the same variables in the dashboard under Project Settings → Environment Variables.

---

### Intermediate Level

**Q: Explain the middleware (`proxy.ts`) — what does it do and how does it work?**

A: Middleware runs on every request before the page loads. Our middleware:
1. Creates a Supabase server client (reads the auth cookie)
2. Checks if the user is authenticated
3. If not authenticated and trying to access protected routes → redirects to `/sign-in`
4. If authenticated and trying to access auth pages (`/sign-in`, `/sign-up`) → redirects to `/dashboard`
5. Allows public routes (`/`, `/jobs`, `/api/*`) without auth

The matcher config tells Next.js which routes to run middleware on (we skip `_next/static`, `_next/image`, `favicon.ico`).

---

**Q: How does authentication work in this app (the full flow)?**

A: 
1. **Sign Up:** User fills form → POST to Supabase Auth API → creates user in Supabase → auto-creates a `User` record in our DB (via `requireAuth()` or `currentUser()`) → session cookie set
2. **Auth Check:** Middleware reads the cookie on every request. Server components use `createClient()` from `supabase/server.ts` which reads cookies. `currentUser()` checks Supabase session + syncs user in DB.
3. **Protected Routes:** `requireAuth()` throws 401 if no session. `requireRole(...roles)` does the same + checks the user's role.
4. **Sign Out:** Supabase session is destroyed, cookie cleared, redirect to `/`.

---

**Q: Explain the lazy singleton pattern — why do we use it for Prisma and Groq?**

A: A singleton ensures only one instance exists. Lazy means the instance is created only when first needed. We use this pattern because:

- **Build-time safety:** During `next build`, environment variables like `DATABASE_URL` aren't available on Vercel. If we create PrismaClient at module load time, the build crashes. Lazy init defers creation until runtime.
- **Performance:** Reuse the same database connection (connection pooling) rather than creating a new one for every request.
- **Hot reloading:** In development, Next.js hot-reloads modules. The global variable persists across reloads, preventing connection exhaustion.

```ts
// The pattern
let instance: Type | null = null;
export function getInstance() {
  if (!instance) {
    instance = new Type();  // Lazy creation
  }
  return instance;
}
```

---

**Q: What is the difference between `npm install` and `npm ci`?**

A: `npm install` reads `package.json` and can update `package-lock.json`. It's for development when adding/removing packages. `npm ci` (clean install) reads ONLY `package-lock.json`, installs exact versions, and fails if `package-lock.json` is out of sync. It's faster and deterministic — perfect for CI/CD pipelines.

---

**Q: How does Tailwind CSS v4 differ from v3?**

A: Tailwind v4 uses a new CSS-first configuration model. Instead of `tailwind.config.js`, you use CSS `@import` and `@theme` directives. The build process uses `@tailwindcss/postcss` instead of `@tailwindcss/postcss` (it's built on Lightning CSS now). It's smaller, faster, and uses native CSS features like `@layer`.

---

**Q: Explain the dark mode implementation in this project.**

A: The implementation has three parts:

1. **Inline script in `<head>`** (`layout.tsx`): Reads `localStorage.getItem('theme')` and applies `dark` class to `<html>` BEFORE React hydrates. This prevents the flash of wrong theme.
2. **ThemeToggle component**: Client component that toggles between `dark`/`light`/`system` modes, saves to `localStorage`, and updates the `<html>` class.
3. **Tailwind dark mode**: Uses the `dark:` prefix (e.g., `dark:bg-gray-900`) which activates when the parent has class `dark`. This is Tailwind's default strategy (class-based).

---

**Q: How does the AI resume review work step-by-step?**

A: 
1. User uploads a `.pdf` or `.txt` file
2. If PDF: `/api/ai/extract-text` parses the PDF and extracts raw text
3. User clicks "Review with AI"
4. `/api/ai/resume-review` receives the resume text
5. Constructs a system prompt ("You are an expert resume reviewer...") + user prompt with the resume text
6. Sends to Groq's `llama-3.3-70b-versatile` model with `response_format: { type: "json_object" }`
7. AI returns structured JSON with score, skills, strengths, weaknesses, etc.
8. The API stores the review in the `ResumeReview` table
9. The frontend displays the results in score cards, skill tags, and suggestion lists

---

### Advanced Level

**Q: Explain the Prisma 7 driver adapters pattern.**

A: Prisma 7 decoupled the database connection from the ORM. Instead of Prisma managing the connection internally (old way), you now pass an adapter that handles the connection. This allows:
- Using any database driver (pg, @neondatabase/serverless, PlanetScale, etc.)
- Better connection pooling control
- Compatibility with serverless environments

```ts
// Prisma 7 pattern
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

---

**Q: What are Server Actions and why don't we use them in this project?**

A: Server Actions are functions that run on the server but can be called from Client Components, like a mutation API. They're defined with `"use server"`. We chose REST API routes instead because:
- Clearer separation of concerns (API layer vs page layer)
- Reusable — the same API can be called from any client (mobile app, curl, etc.)
- Familiar REST patterns are easier to understand for beginners
- Works better with TanStack Query's mutation system

---

**Q: How does Supabase SSR work in this project?**

A: Supabase SSR uses cookie-based sessions for server-side auth. The `supabase/server.ts` creates a Supabase client that reads the auth session from cookies:

```ts
const cookieStore = await cookies();
const supabase = createServerClient(URL, ANON_KEY, {
  cookies: {
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value, options }) =>
        cookieStore.set(name, value, options)
      );
    },
  },
});
```

The browser client (`supabase/client.ts`) uses `localStorage` by default for the session. The middleware ties them together — it refreshes the session cookie on every request so server components always have a valid session.

---

**Q: How does role-based access control work?**

A: Three layers:
1. **Database level:** `User` model has a `role` field (CANDIDATE/RECRUITER enum). API routes check this.
2. **API level:** `requireRole("RECRUITER")` throws 403 if the user lacks the right role.
3. **UI level:** Dashboard nav shows different links per role. `RoleSwitcher` component lets users toggle roles. Some pages (like `/dashboard/resume`) check role and redirect if wrong.

---

**Q: Explain the pagination implementation.**

A: The `pagination.tsx` component is a Server Component (no client JS). It receives `currentPage`, `totalPages`, and `baseUrl` as props. It generates page links with correct URLs:

```
/jobs?page=1 | /jobs?page=2 | /jobs?page=3 | ... | /jobs?page=10
```

It shows ellipsis for large gaps (e.g., 1 ... 5 6 7 ... 20). The API route calculates total pages from the total count divided by items per page (12). The `searchJobsSchema` validates query params.

---

**Q: What security measures are in place?**

A: 
1. **Authentication:** Supabase Auth with HTTP-only cookies (prevents XSS from stealing tokens)
2. **Authorization:** `requireRole()` ensures only recruiters can create/edit jobs
3. **Ownership checks:** Only the job creator can edit/delete their job
4. **Input validation:** Zod validates all API inputs (prevents injection, malformed data)
5. **TypeScript strict mode:** Prevents type confusion vulnerabilities
6. **`.env` gitignored:** Secrets never committed to the repo
7. **Supabase Row Level Security (RLS):** Can be enabled at the database level (we handle it in the API layer instead)
8. **CORS:** Not relevant here since it's a single app (not a public API)

---

## 📚 Full-Stack Concepts Explained

### What is "Full-Stack" Development?

Full-stack means you work on both the **frontend** (what users see and interact with) and the **backend** (servers, databases, APIs). This project is a great example because it has:

- **Frontend:** React components, styling, user interactions, client state
- **Backend:** API routes, database queries, authentication, AI integration
- **DevOps:** CI/CD pipeline, deployment, environment management

### Key Concepts with Real Examples from This Project

#### 1. Server-Side Rendering (SSR) vs Client-Side Rendering (CSR)

| Aspect | Server Component | Client Component |
|--------|-----------------|-----------------|
| Where it renders | Server | Browser |
| Can use hooks? | No | Yes |
| Can access DB? | Yes | No (must use API) |
| JS sent to browser? | No (just HTML) | Yes |
| Example in project | `dashboard/layout.tsx` | `job-form.tsx` |

#### 2. State Management — 3 Types in This Project

1. **Server State:** Data from the API (jobs list, applications) → Managed by **TanStack React Query**
2. **Client State:** UI state (form inputs, theme, modals) → Managed by **React useState/useReducer**
3. **URL State:** Search params, page numbers → Managed by **Next.js searchParams**

#### 3. REST API Design Principles

Our API routes follow REST conventions:

| HTTP Method | Action | Example |
|-------------|--------|---------|
| GET | Read | `GET /api/jobs` → list all jobs |
| POST | Create | `POST /api/jobs` → create a job |
| PUT | Update (full) | `PUT /api/jobs/abc123` → update job |
| PATCH | Update (partial) | `PATCH /api/applications/xyz` → update status |
| DELETE | Delete | `DELETE /api/jobs/abc123` → delete job |

Each endpoint:
- Validates input (Zod)
- Checks auth (Supabase)
- Checks permissions (role check, ownership)
- Returns consistent JSON responses
- Handles errors uniformly (`handleApiError()`)

#### 4. Database Relationships

Our Prisma schema has these relationships:

```
User ──hasMany──> Job           (one recruiter has many jobs)
Job  ──belongsTo──> User        (one job belongs to one recruiter)

User ──hasMany──> Application   (one candidate has many applications)
Application ──belongsTo──> User (one application belongs to one candidate)

Job ──hasMany──> Application    (one job has many applications)
Application ──belongsTo──> Job  (one application belongs to one job)

User ──hasMany──> ResumeReview  (one candidate has many reviews)
```

The `@@unique([candidateId, jobId])` constraint ensures a candidate can only apply once per job.

#### 5. Type Safety: A Layered Approach

```
Layer 1: TypeScript types (src/types/index.ts)
Layer 2: Zod schemas (lib/validations.ts) — validates AT RUNTIME
Layer 3: Prisma types (auto-generated from schema) — database-level
Layer 4: React Hook Form types — form-level validation
```

All layers must agree. If the Prisma schema says `salaryMin: Int?`, the Zod schema validates it as `z.number().int().positive().optional()`, and the TypeScript type reflects `salaryMin: number | null`.

#### 6. Environment Variables: Development vs Production

| Environment | Where `.env` comes from |
|-------------|------------------------|
| Local dev | `.env` file (gitignored) |
| CI/CD (GitHub Actions) | GitHub Secrets |
| Production (Vercel) | Vercel Dashboard → Environment Variables |

The `.env.example` file documents what variables are needed without exposing real values.

#### 7. The Request-Response Cycle in Next.js

```
1. User types URL → Browser requests page
2. Vercel routes to Next.js server
3. Middleware runs (proxy.ts) — auth check
4. Layout renders (layout.tsx) — wraps page
5. Page renders (page.tsx) — Server Component fetches data
6. Client Components hydrate in browser
7. User interacts → API calls → React Query manages state
8. User navigates → client-side transition (no full page reload)
```

---

## 📋 Common Commands Cheat Sheet

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npx tsc --noEmit        # TypeScript type-check (no output files)

# Database
npm run db:generate      # Generate Prisma client from schema
npm run db:push          # Push schema changes to database
npm run db:seed          # Seed database with test data
npm run db:studio        # Open Prisma Studio (GUI for DB)

# Prisma (low-level)
npx prisma validate      # Validate schema.prisma
npx prisma format        # Format schema.prisma

# Git
git status               # Check changed files
git log --oneline        # View commit history
git diff                 # View unstaged changes

# Deployment
npx vercel               # Deploy preview to Vercel
npx vercel --prod        # Deploy to production
```

---

## 🔗 Useful Resources

| Resource | Link |
|----------|------|
| Next.js Docs | https://nextjs.org/docs |
| Prisma 7 Docs | https://prisma.io/docs |
| Supabase Docs | https://supabase.com/docs |
| Groq API Docs | https://console.groq.com/docs |
| Tailwind CSS v4 | https://tailwindcss.com/docs |
| shadcn/ui | https://ui.shadcn.com |
| TanStack Query | https://tanstack.com/query |
| React Hook Form | https://react-hook-form.com |
| Zod | https://zod.dev |
| GitHub Actions | https://docs.github.com/en/actions |
| Vercel CLI | https://vercel.com/docs/cli |

---

## 💡 Tips for Beginners

1. **Read error messages carefully.** They tell you exactly what's wrong and often where. The fix is usually in the error message itself.

2. **Use `git log` and `git diff`** to see what changed between commits. This is how we documented all the fixes in this guide.

3. **Don't memorize — understand patterns.** The lazy singleton pattern, REST API pattern, Zod validation pattern — once you understand the pattern, you can apply it anywhere.

4. **TypeScript is your friend.** It feels annoying at first, but it catches mistakes before they reach production. Every red squiggle is a bug that won't happen.

5. **CI/CD failures are learning opportunities.** Every failed GitHub Actions run teaches you something about how your app is built and deployed.

6. **Start the dev server** (`npm run dev`) and make one small change at a time. Watch what happens. Break things on purpose to understand how they work.

7. **The network tab** (F12 → Network) is your best debugging tool. See exactly what API calls are made, what data is sent, and what the server responds with.

---

*"The best way to learn is to build something real. This project is real. Every error listed here was a lesson. Every fix made the app stronger."*
