# Scripts

> Automation scripts for Slovor Marketplace

## Available Scripts

### Setup

```bash
npm run setup
```

Runs automatic setup:
- Checks Node.js, npm, Git
- Checks/installs Supabase CLI
- Creates .env.local from .env.example
- Verifies migrations exist
- Shows next steps

**Runs automatically after `npm install`**

### Check CLI Tools

```bash
npm run check-cli
```

Verifies all required CLI tools are installed:
- ✅ Node.js
- ✅ npm
- ✅ Git
- ⚠️ Supabase CLI (optional)

### Database Migration

```bash
npm run db:migrate
```

Runs all SQL migrations from `database/migrations/` folder.

**Requirements:**
- `.env.local` with Supabase credentials
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**Note:** If automatic migration fails, copy SQL manually to Supabase Dashboard → SQL Editor.

### Development

```bash
npm run dev
```

Starts Next.js development server on http://localhost:3000

### Build

```bash
npm run build
```

Creates production build. **Must pass before pushing to dev!**

### Lint

```bash
npm run lint
```

Runs ESLint to check code quality.

---

## Manual Setup (if postinstall fails)

### 1. Install Supabase CLI

```bash
# Global installation
npm install -g supabase

# Or use via npx
npx supabase --version
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Run Migrations

**Option A: Via script**
```bash
npm run db:migrate
```

**Option B: Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select your project
3. SQL Editor → New query
4. Copy content from `database/migrations/*.sql`
5. Run

---

## Troubleshooting

### `supabase: command not found`

Solution:
```bash
npm install -g supabase
# Or use: npx supabase [command]
```

### Migration fails

Use Supabase Dashboard for manual execution:
1. Dashboard → SQL Editor
2. Copy SQL from migration file
3. Paste and run

### `.env.local` missing variables

Get credentials from Supabase Dashboard:
- Settings → API
- Copy Project URL and anon/service_role key

---

## Files

- `setup.js` - Main setup script (runs on postinstall)
- `check-cli.js` - Verify CLI tools
- `migrate.js` - Database migrations
- `README.md` - This file
