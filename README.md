# ⚽ Football Manager PWA

A full-featured Progressive Web App for managing your football team.

**Built with:** React + Vite · Tailwind CSS · Firebase (Auth + Firestore) · PWA

## Features
- 🔐 Email/password authentication
- 👥 Player management (profiles, positions, jersey numbers)
- 📅 Match scheduling (upcoming/past, home/away)
- ✅ Attendance tracking per match
- 📊 Stats dashboard with charts (goals, assists)
- 📱 Installable PWA with offline caching

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template and fill in your Firebase keys
cp .env.example .env

# 3. Run locally
npm run dev
```

See the full setup guide in `SETUP_GUIDE.md` for Firebase configuration and deployment instructions.

## Deployment

- **Frontend:** [Vercel](https://vercel.com) (auto-deploy from GitHub)
- **Backend:** [Firebase](https://console.firebase.google.com) (Auth + Firestore)
