# 🏠 Manai Mitra — Real Estate Platform for Madurai

A full-stack buyer/seller real estate platform built with **React + Vite**, **Python FastAPI**, and **Supabase**.

---

## 🗂️ Project Structure

```
manamitra/
├── frontend/          React + Vite app
├── backend/           Python FastAPI API
├── supabase/          SQL migrations & seed data
├── start_frontend.bat Double-click to run frontend
└── start_backend.bat  Double-click to run backend
```

---

## ⚡ Quick Start

### Step 1 — Supabase Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → run `supabase/migrations/001_create_tables.sql`
3. Then run `supabase/migrations/002_seed_data.sql`
4. Go to **Authentication → Providers → Google** → enable and add your Google OAuth credentials
5. Go to **Storage** → create bucket named `plot-images` (set to Public)
6. Copy your **Project URL** and **Anon Key** from Settings → API

### Step 2 — Frontend Config
1. Copy `frontend/.env.example` → `frontend/.env`
2. Fill in your Supabase URL and anon key:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OWNER_EMAIL=your@email.com
```

### Step 3 — Backend Config
1. Copy `backend/.env.example` → `backend/.env`
2. Fill in:
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OWNER_EMAIL=your@email.com
FRONTEND_URL=http://localhost:5173
```

### Step 4 — Run
- Double-click **`start_frontend.bat`** → opens at http://localhost:5173
- Double-click **`start_backend.bat`** → API at http://localhost:8000

---

## 🌟 Features

| Feature | Details |
|---------|---------|
| **Landing Page** | Manai Mitra branding, Buyer/Seller entry |
| **Google Auth** | Sign up/in with Google via Supabase |
| **Buyer Flow** | 5 Divisions → 10 Places each → 10 Plots each |
| **Back Navigation** | Back button on every page |
| **Seller Form** | Name, Address, Division, Place, Plot details, Images |
| **AI Auto-Check** | 9-point validation pipeline before submission |
| **Owner Dashboard** | Approve/Reject/Delete listings, manage users |
| **Admin Tab** | Pending listings + user management tabs |
| **About Us** | Company info, mission, contact |
| **Responsive** | Mobile-first responsive design |

---

## 👑 Owner Access
Set `VITE_OWNER_EMAIL` in frontend `.env` and `OWNER_EMAIL` in backend `.env` to your Google account email. When you sign in with that Google account, you automatically get the Owner dashboard.

---

## 🤖 AI Auto-Check Pipeline
Every seller submission runs through:
1. ✅ Completeness — all fields filled
2. ✅ Format validation — area/price > 0
3. ✅ Division & place validity
4. ✅ Plot type validity
5. ✅ Image check — 1–5 images
6. ✅ Description quality — min 20 chars
7. ✅ Spam detection — keyword filter
8. ✅ Price reasonability — ₹50–₹1,00,000/sq ft
9. ✅ Duplicate detection — same seller, same address

---

## 📡 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/divisions` | Public | All 5 divisions |
| GET | `/api/divisions/{id}/places` | Public | 10 places in division |
| GET | `/api/places/{id}/plots` | Public | Approved plots |
| POST | `/api/plots` | Seller | Create listing |
| GET | `/api/admin/pending` | Owner | Pending listings |
| PUT | `/api/admin/plots/{id}/approve` | Owner | Approve |
| PUT | `/api/admin/plots/{id}/reject` | Owner | Reject |
| DELETE | `/api/admin/users/{id}` | Owner | Delete user |
| GET | `/api/profile` | Auth | Current profile |

Interactive API docs: http://localhost:8000/docs
