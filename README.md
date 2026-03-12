# AtoZ Movies 🎬

A full-stack movie streaming guide built with **Next.js 15**, **MongoDB**, **NextAuth**, and **Cloudinary**. Features Bollywood, Hollywood, South Hindi Dubbed films, Web Series, reviews, blogs, and a complete admin panel.

## 🌐 Live
**[atozmovies.in](https://www.atozmovies.in)**

## ✨ Features
- 🎥 Movie & Web Series catalog with filters (category, genre, year, language, quality, platform)
- 🔍 Full-text search
- ⭐ User reviews & ratings
- 📝 Blog with comments
- 👤 User accounts (watchlist, favorites, profile)
- 🛡️ Admin panel (movies, blogs, users, reviews, analytics)
- 📺 Google AdSense integration
- 📊 Google Analytics 4
- 🖼️ Cloudinary image uploads
- 💌 Newsletter subscription

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB + Mongoose
- **Auth**: NextAuth.js
- **Images**: Cloudinary
- **Styling**: Tailwind CSS v4
- **Email**: Nodemailer

## 🚀 Quick Start

```bash
git clone https://github.com/w3lalitsaini/claude_movie.git
cd claude_movie
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | Random 32+ char secret |
| `NEXTAUTH_URL` | Your production URL |
| `CLOUDINARY_*` | Cloudinary credentials |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense publisher ID |
| `NEXT_PUBLIC_AD_SLOT_*` | AdSense slot IDs |

## 📁 Project Structure

```
app/
├── (auth)         # Login, Register, Reset Password
├── admin/         # Admin dashboard
├── api/           # REST API routes
├── blog/          # Blog listing & detail
├── movies/        # Movie listing & detail
├── search/        # Search page
└── user/          # User profile, watchlist, favorites
components/
├── home/          # Homepage sections
├── layout/        # Header, Footer
├── movies/        # Movie card components
└── ui/            # Shared UI components (AdUnit, etc.)
models/            # Mongoose schemas
lib/               # Auth, DB, helpers
```

## 📦 Deployment

See [DEPLOY.md](./DEPLOY.md) for step-by-step Vercel + Hostinger deployment guide.

## 📄 License
MIT
