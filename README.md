# GlobalCo AI Job Board

An AI-powered job board platform built with Next.js 16, Supabase, and Prisma. Recruiters can post and manage job listings while candidates can browse jobs, apply, and receive AI-driven resume reviews.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma 7
- **Authentication:** Supabase Auth
- **AI:** Groq SDK for resume analysis
- **UI:** shadcn/ui (Radix UI), Tailwind CSS v4
- **Forms:** React Hook Form, Zod validation
- **State:** TanStack React Query

## Features

- **Role-based access** – Candidate and Recruiter roles with separate dashboards
- **Job management** – Recruiters can create, edit, and manage listings with rich metadata (salary, tech skills, experience level, employment type, location type, visa sponsorship)
- **Job search & applications** – Candidates can browse and apply to jobs
- **AI resume review** – Upload resumes for AI-powered scoring, ATS analysis, strength/weakness identification, and skill gap detection
- **Responsive design** – Built with Tailwind CSS and Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project (for database and auth)
- A Groq API key

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd globalco-assignment-ai-job-board
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

4. Generate the Prisma client and sync the schema:
   ```bash
   npm run db:generate
   npm run db:push
   ```

   Optionally seed the database:
   ```bash
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to the database |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (Supabase pooler) |
| `DIRECT_URL` | Direct PostgreSQL connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `GROQ_API_KEY` | Groq API key for AI features |
