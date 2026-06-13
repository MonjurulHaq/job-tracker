# Job Application Tracker + AI Cover Letters

Track job applications and generate personalized cover letters using Nemotron 3 Ultra.

## Features

- 📋 Track applications (company, role, status, notes, job description)
- 🤖 Generate tailored cover letters with Nemotron 3 Ultra
- 📄 Upload resume (PDF/TXT) for AI context
- 🔐 Supabase authentication
- 🎨 Clean, responsive UI with Tailwind CSS

## Quick Start (30 min setup)

### 1. Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor → Run `database.sql`
3. Enable Email auth in Authentication → Providers
4. Copy Project URL & Anon Key from Settings → API

### 2. Nemotron API Key
1. Go to [build.nvidia.com](https://build.nvidia.com)
2. Search "Nemotron 3 Ultra" → Get API Key
3. Copy the key (format: `nvapi-...`)

### 3. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your keys
```

### 4. Run Locally
```bash
bun install
bun dev
```
Open http://localhost:3000

## Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── applications/     # CRUD for applications
│   │   ├── generate-letter/  # Nemotron cover letter generation
│   │   └── resumes/          # Resume upload/retrieval
│   ├── auth/login/           # Sign in / sign up
│   ├── dashboard/            # Main app (protected)
│   └── dashboard/settings/   # Resume management
├── components/
│   ├── ApplicationForm.tsx
│   ├── ApplicationList.tsx
│   └── CoverLetterGenerator.tsx
├── lib/
│   ├── supabase.ts           # Supabase client & types
│   └── nemotron.ts           # Nemotron API wrapper
└── middleware.ts             # Auth protection
```

## Hackathon Demo Flow

1. **Sign up** → Land on empty dashboard
2. **Add application** → Fill company, role, paste job description
3. **Go to Settings** → Upload your resume (PDF/TXT)
4. **Back to Dashboard** → Click "Generate with AI" on any application
5. **Watch** → Nemotron writes personalized cover letter in seconds
6. **Edit/Save** → Tweak the letter, save it to the application

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Auth/DB**: Supabase (PostgreSQL + Auth)
- **AI**: NVIDIA Nemotron 3 Ultra via OpenAI-compatible API
- **Styling**: Tailwind CSS v4
- **Package Manager**: Bun

## Deploy

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Supabase Edge Functions (Alternative)
For production, move `/api/generate-letter` to a Supabase Edge Function to keep API keys server-side.

## Time Breakdown (3 Hours)

| Task | Time |
|------|------|
| Supabase setup + schema | 15 min |
| Next.js scaffold + auth | 30 min |
| Application CRUD UI | 45 min |
| Resume upload + text extraction | 30 min |
| Nemotron integration | 30 min |
| Cover letter UI + polish | 30 min |
| **Total** | **~3 hours** |

## Customization Ideas

- Add interview prep: generate questions from job description
- Email notifications for status changes
- Export applications to CSV
- Company research: AI summary of company from website
- Salary negotiation talking points generator