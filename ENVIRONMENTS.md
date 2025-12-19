# Environment Configuration Guide

> How to properly set up Development, Preview, and Production environments

---

## 🎯 Environment Strategy

### Overview

We use **3 separate environments** with different configurations:

1. **Development** — local development (`npm run dev`)
2. **Preview** — Vercel preview deployments (PR branches)
3. **Production** — main branch, live site

---

## 🛠️ Setup Instructions

### Step 1: Create Supabase Projects

#### Option A: Separate Projects (Recommended)

Create 2 separate Supabase projects:

1. **Development Project**
   - Name: `slovor-mp-dev`
   - Purpose: Testing, development
   - URL: `https://xxxdev.supabase.co`

2. **Production Project**
   - Name: `slovor-mp-prod`
   - Purpose: Live users
   - URL: `https://xxxprod.supabase.co`

**Benefits:**
- Real data separation
- Safe testing without affecting prod
- Can use different DB schemas for testing

#### Option B: Same Project (Quick Start)

Use same Supabase project for both:
- Faster setup
- Lower cost (free tier)
- Good for MVP/small projects

**Note:** Use this for now, migrate to separate later.

---

### Step 2: Local Development Setup

#### 1. Copy environment template

```bash
cp .env.local.example .env.local
```

#### 2. Fill with your Supabase credentials

```env
# .env.local (DO NOT COMMIT THIS FILE)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_DEBUG_MODE=true
```

#### 3. Get credentials from Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

### Step 3: Vercel Environment Variables

#### Access Vercel Settings

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select `slovor-mp` project
3. Go to **Settings** → **Environment Variables**

#### Add Variables for Each Environment

**Variable 1: NEXT_PUBLIC_SUPABASE_URL**

| Environment | Value | Notes |
|-------------|-------|-------|
| Production | `https://prod-project.supabase.co` | Live site |
| Preview | `https://dev-project.supabase.co` | PR deploys |
| Development | `https://dev-project.supabase.co` | (optional) |

**Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY**

| Environment | Value | Notes |
|-------------|-------|-------|
| Production | `eyJhbGc...prod` | Prod anon key |
| Preview | `eyJhbGc...dev` | Dev anon key |
| Development | `eyJhbGc...dev` | (optional) |

#### How to Add in Vercel UI:

1. Click **Add New**
2. Enter variable name: `NEXT_PUBLIC_SUPABASE_URL`
3. Enter value: `https://your-project.supabase.co`
4. **Select environments:**
   - ☑️ Production
   - ☑️ Preview
   - ☐ Development (optional)
5. Click **Save**

**Repeat for** `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🔐 Security Best Practices

### 1. Never Commit Secrets

❌ **DO NOT commit:**
```
.env.local          # Your actual secrets
.env.production     # Production secrets
```

✅ **Safe to commit:**
```
.env.example        # Template without secrets
.env.local.example  # Template with placeholders
```

### 2. Use Supabase RLS (Row Level Security)

**Current status:** ⚠️ Disabled (MVP phase)

**Before production launch:**

```sql
-- Enable RLS on all tables
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Example policy: Users can only edit their own listings
CREATE POLICY "Users can update own listings"
ON listings FOR UPDATE
USING (auth.uid() = user_id);
```

### 3. Environment-Specific Behavior

```typescript
// lib/config.ts
export const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Enable debug logs only in dev
  enableDebugLogs: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  
  // Different rate limits
  apiRateLimit: process.env.NEXT_PUBLIC_API_RATE_LIMIT || '100',
}

// Usage
if (config.enableDebugLogs) {
  console.log('API call:', data)
}
```

---

## 📦 Deployment Flow

### Development (Local)

```bash
git checkout -b feature/new-feature
# Make changes
npm run dev  # Uses .env.local
```

**Uses:** `.env.local` (your local file)

### Preview (Vercel)

```bash
git push origin feature/new-feature
# Vercel automatically deploys
```

**Uses:** Vercel **Preview** environment variables  
**URL:** `https://slovor-mp-git-feature-*.vercel.app`

### Production (Vercel)

```bash
git checkout main
git merge feature/new-feature
git push origin main
# Vercel deploys to production
```

**Uses:** Vercel **Production** environment variables  
**URL:** `https://slovor-mp.vercel.app`

---

## 🧰 Database Strategy

### Development Database

**Options:**

1. **Local Supabase** (Docker)
   ```bash
   npx supabase init
   npx supabase start
   ```
   - Pros: Fully isolated, fast
   - Cons: Setup required

2. **Shared Dev Supabase Project**
   - Pros: Easy, no setup
   - Cons: Shared with team

3. **Same as Production**
   - Pros: Simplest
   - Cons: Risk of breaking prod data

**Recommendation for MVP:** Use same project, add RLS later.

### Production Database

- Separate Supabase project
- Backups enabled
- RLS policies active
- Regular monitoring

---

## 📝 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key | `eyJhbGc...` |

### Optional Variables

| Variable | Description | Default | Environments |
|----------|-------------|---------|-------------|
| `NEXT_PUBLIC_DEBUG_MODE` | Enable debug logs | `false` | Dev, Preview |
| `NEXT_PUBLIC_API_RATE_LIMIT` | API rate limit | `100` | All |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | `false` | Production |

---

## ✅ Verification Checklist

### Local Development
- [ ] `.env.local` file created
- [ ] Supabase credentials added
- [ ] `npm run dev` works
- [ ] Can see data from database

### Vercel Preview
- [ ] Environment variables added to Vercel
- [ ] Preview deployment works
- [ ] Database connection successful

### Production
- [ ] Production variables set in Vercel
- [ ] Main branch deploys successfully
- [ ] Live site works: https://slovor-mp.vercel.app
- [ ] Database queries work

---

## 🐛 Troubleshooting

### "Invalid Supabase URL"

**Problem:** Environment variable not set or incorrect

**Solution:**
```bash
# Check .env.local
cat .env.local

# Verify format
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co  # Correct
NEXT_PUBLIC_SUPABASE_URL=project.supabase.co          # Wrong (missing https://)
```

### "Build works locally but fails on Vercel"

**Problem:** Missing environment variables in Vercel

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Verify all variables are set for correct environment
3. Redeploy

### "Database connection works in dev, fails in production"

**Problem:** Using wrong Supabase project URL

**Solution:**
1. Check Vercel Production environment variables
2. Verify URL matches your production Supabase project
3. Ensure anon key is from same project

---

## 🚀 Quick Start (Copy-Paste)

### 1. Local Setup

```bash
# Clone repo
git clone https://github.com/Den3112/slovor-mp.git
cd slovor-mp

# Install dependencies
npm install

# Create .env.local
cp .env.local.example .env.local

# Edit with your credentials
# nano .env.local  (or use any editor)

# Run dev server
npm run dev
```

### 2. Vercel Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variables via CLI (alternative to UI)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste your production URL

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste your production key

# Deploy
vercel --prod
```

---

## 📚 Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Multi-Environment Setup](https://supabase.com/docs/guides/cli/managing-environments)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

**Last Updated:** December 19, 2025  
**Status:** ✅ Active Configuration
