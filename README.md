# GlobalCo AI Job Board

An AI-powered job board platform built with Next.js 16, Supabase, and Prisma. Recruiters can post and manage job listings while candidates can browse jobs, apply, and receive AI-driven resume reviews.

**Live Demo:** [https://globalco-ai-job-board.vercel.app](https://globalco-ai-job-board.vercel.app)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma 7
- **Authentication:** Supabase Auth
- **AI:** Groq SDK for resume analysis
- **UI:** shadcn/ui (Radix UI), Tailwind CSS v4
- **Forms:** React Hook Form, Zod validation
- **State:** TanStack React Query
- **CI/CD:** GitHub Actions, Vercel

## Features

- **Role-based access** – Candidate and Recruiter roles with separate dashboards
- **Job management** – Recruiters can create, edit, and manage listings with rich metadata (salary, tech skills, experience level, employment type, location type, visa sponsorship)
- **Job search and applications** – Candidates can browse and apply to jobs
- **AI resume review** – Upload resumes for AI-powered scoring, ATS analysis, strength/weakness identification, and skill gap detection
- **Responsive design** – Built with Tailwind CSS and Radix UI primitives

## Architecture

```
src/
  actions/        # Server actions
  app/            # Next.js App Router pages and API routes
    api/          # REST API endpoints
    dashboard/    # Candidate and recruiter dashboards
    jobs/         # Job listing and detail pages
    sign-in/      # Authentication pages
    sign-up/
  components/     # Shared UI components
  features/       # Feature modules
    applications/ # Application management
    auth/         # Authentication logic
    jobs/         # Job-related components
    resume/       # Resume review feature
  lib/            # Utilities, auth helpers, database client
  types/          # TypeScript type definitions
```

### Database Schema

The application uses PostgreSQL with the following models:

- **User** – Candidates and recruiters with role-based access (CANDIDATE, RECRUITER)
- **Job** – Job listings with title, description, company, location, salary range, tech skills, experience level, employment type, and visa sponsorship details
- **Application** – Tracks candidate applications with status workflow (PENDING, REVIEWING, ACCEPTED, REJECTED)
- **ResumeReview** – Stores AI-generated resume analysis including scores, ATS compatibility, strengths, weaknesses, and skill gap assessment

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project (for database and auth)
- A Groq API key

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/gyancodes/globalco-assignment-job-board.git
   cd globalco-assignment-job-board
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

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment.

### Workflow: `.github/workflows/deploy.yml`

**CI Stage (Lint and Type Check):**
- Triggered on every push and pull request to `master`
- Runs ESLint and TypeScript type checking

**CD Stage (Deploy to Vercel):**
- Triggered on pushes to `master` after CI passes
- Deploys to Vercel production environment automatically

### Required GitHub Secrets

For the CI/CD pipeline to work, the following secrets must be configured in the GitHub repository settings:

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel API authentication token |
| `VERCEL_ORG_ID` | Vercel organization/team ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

## Deployment

The application is deployed on Vercel at [https://globalco-ai-job-board.vercel.app](https://globalco-ai-job-board.vercel.app). Deployments are fully automated via GitHub Actions — pushing to the `master` branch triggers the pipeline to lint, type-check, and deploy.
