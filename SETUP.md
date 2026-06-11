# VibeBuild — Backend Setup Guide

> **Time Required:** ~10 minutes  
> **Cost:** Free (Supabase free tier)

---

## Quick Start (3 Steps)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → Sign up / Log in
2. Click **"New Project"**
3. Give it a name (e.g., `vibebuild`)
4. Set a strong database password (save it somewhere!)
5. Choose the closest region to your users
6. Click **"Create new project"** — wait ~2 minutes for setup

### Step 2: Set Up Database

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open the file `supabase-schema.sql` from this repository
4. **Copy the entire contents** and paste into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see "Success. No rows returned" — that means it worked!

### Step 3: Add Your Credentials

1. In Supabase dashboard, go to **Settings** → **API** (left sidebar)
2. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy the **anon public** key (long string starting with `eyJ...`)
4. Open `config.js` in this repository
5. Replace `YOUR_SUPABASE_URL_HERE` with your Project URL
6. Replace `YOUR_SUPABASE_ANON_KEY_HERE` with your anon key
7. Save the file

**That's it!** Your website now saves all data to Supabase. 🎉

---

## Setting Up Admin Access

### Create Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **"Add User"** → **"Create New User"**
3. Enter your admin email and a strong password
4. Click **"Create User"**
5. Now go to your website: `https://your-site.github.io/vibes-sprint/admin.html`
6. Log in with the email/password you just created

### Admin Dashboard Features

| Tab | What You See |
|-----|-------------|
| **Overview** | Total visitors, ratings, signups, and best-performing slides |
| **Ratings** | All ratings with averages per slide — find the best design! |
| **Emails** | All collected emails with CSV export |
| **Feedback** | User suggestions, questions, and social links |
| **Analytics** | Page views, time spent per slide, mascot engagement |

---

## Deploying to GitHub Pages

1. Commit all changes:
```bash
git add .
git commit -m "Add Supabase backend + admin panel"
git push origin main
```

2. Your site auto-deploys to GitHub Pages
3. Visit `https://your-username.github.io/vibes-sprint/` to verify
4. Visit `https://your-username.github.io/vibes-sprint/admin.html` for admin

---

## What Data Gets Collected

| Data Point | When | Where Stored |
|-----------|------|-------------|
| **Visitor ID** | First visit | `visitors` table |
| **Design Rating** (1-10) | Star click on any slide | `ratings` table |
| **Content Rating** (1-10) | Star click on any slide | `ratings` table |
| **Email Signup** | Email form submission | `email_signups` table |
| **Feedback** | Final review slide form | `feedback` table |
| **Page Views** | Slide navigation | `page_views` table |
| **Mascot Events** | Mascot interactions | `mascot_events` table |

---

## Troubleshooting

### "Data not saving"
- Check browser console (F12) for errors
- Verify `config.js` has correct URL and key (no quotes around the values that shouldn't be there)
- Make sure you ran `supabase-schema.sql` in the SQL Editor

### "Admin login not working"
- Make sure you created a user in Supabase Auth → Users
- Check that the email/password is correct
- Try resetting the password in Supabase dashboard

### "RLS policy error"
- Re-run `supabase-schema.sql` in SQL Editor
- Make sure RLS is enabled on all tables

---

## Security Notes

- The `anon key` is safe to expose in frontend code — it only allows INSERT operations due to RLS policies
- Admin access requires authentication — only authenticated users can READ data
- No personal data is collected without user consent (email is optional)
- Visitor fingerprinting uses random UUIDs — no actual device fingerprinting

---

## Files Reference

| File | Purpose |
|------|---------|
| `config.js` | Your Supabase credentials (edit this) |
| `supabase-schema.sql` | Database setup script (run once in Supabase) |
| `supabase-client.js` | Frontend ↔ Supabase integration layer |
| `admin.html` | Admin dashboard page |
| `admin.css` | Admin dashboard styles |
| `SETUP.md` | This file |
