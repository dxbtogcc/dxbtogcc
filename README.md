# DXB to GCC — Starter (Next.js + Supabase + Nomod)
This repo contains the front-end (and API routes) you can deploy on Vercel. Follow these steps.

## 1) Create Supabase
1. Go to https://supabase.com → New Project.
2. Copy your `PROJECT URL` and `ANON KEY`.
3. In **Authentication → Providers → Phone**, enable **Phone** and add your SMS provider (e.g., Twilio). Use a UAE-capable sender ID.
4. In **Storage**, create a private bucket named `invoices`.

## 2) Run Database Schema
- In Supabase: **SQL Editor → New Query** → paste the contents of `db/schema.sql` → **Run**.

## 3) Download this repo & deploy to Vercel
- Create a GitHub repo and upload these files (or import directly from GitHub).
- On https://vercel.com → **Add New → Project → Import from GitHub**.
- Set Environment Variables (Production and Preview):
  - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase Project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase ANON Key
  - `SUPABASE_SERVICE_ROLE_KEY` = your Service Role key (needed only for admin webhooks later)
  - `SITE_URL` = https://dxbtogcc.com
  - (Optional, for API mode) `NOMOD_API_BASE`, `NOMOD_API_KEY`, `NOMOD_WEBHOOK_SECRET`

## 4) Domain (dxbtogcc.com)
- In Vercel → Project → **Settings → Domains** → Add `dxbtogcc.com`.
- Update your DNS:
  - Apex `dxbtogcc.com` → A record `76.76.21.21`
  - `www` → CNAME `cname.vercel-dns.com`

## 5) Test the flow
1. Visit `/login`, sign in with a UAE number `+9715XXXXXXXX` (OTP).
2. Go to `/new-shipment`, enter details, and submit.
3. The app will create an order and (if no Nomod API) show “We will send you a payment link shortly.”
4. In your **Admin** (later), paste a Nomod Payment Link into the order (manual flow) or extend the API to generate links automatically.

## Notes
- Pricing logic is in `lib/quote.ts` (10% margin + 5% VAT + UAE pickup fee AED 60).
- Food/perishables are blocked on the server.
- Invoices upload to the private `invoices` bucket. Consider using **signed URLs** to view files.