# 🚀 Deployment Guide: Vercel + Hostinger

Follow these steps to get **AtoZ Movies** live and generating revenue.

## 1. Prepare your GitHub Repo

- I have already initialized the repository and pushed the code to: `https://github.com/w3lalitsaini/claude_movie.git`
- Ensure no sensitive data (like your real `.env`) is in the repo. (Checked: `.gitignore` is active).

## 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in with GitHub.
2. Click **"New Project"**.
3. Import the `claude_movie` repository.
4. **Environment Variables**: This is the most important step. Expand the "Environment Variables" section and copy the keys from `.env.example`. Enter your real values for:
   - `MONGODB_URI`: From your MongoDB Atlas dashboard.
   - `NEXTAUTH_SECRET`: Generate a random string (e.g., run `openssl rand -base64 32`).
   - `NEXTAUTH_URL`: `https://atozmovies.in`
   - `CLOUDINARY_*`: From your Cloudinary dashboard.
   - `NEXT_PUBLIC_GA_ID`: `G-KQKT2E0W2C`
   - `NEXT_PUBLIC_ADSENSE_CLIENT`: `ca-pub-2610891548777436`
   - `NEXT_PUBLIC_AD_SLOT_*`: Use the IDs from `txt.txt`.
   - `SITE_URL`: `https://atozmovies.in`
5. Click **"Deploy"**. Vercel will build the project and give you a `.vercel.app` URL.

## 3. Connect Hostinger Domain

1. Log in to your **Hostinger** control panel.
2. Go to **Domains** -> **atozmovies.in**.
3. Change your **DNS records** or **Nameservers** according to Vercel's instructions:
   - Usually, Vercel will ask you to add an **A record** pointing to `@` -> `76.76.21.21`
   - Or a **CNAME record** for `www` -> `cname.vercel-dns.com`
4. In Vercel, go to **Settings** -> **Domains**.
5. Add `atozmovies.in` and `www.atozmovies.in`.
6. Wait for the SSL certificate to generate (usually 5-10 minutes).

## 4. Final Revenue Setup

- **Google AdSense**: Log in to AdSense and ensure `atozmovies.in` is added to your "Sites" list and verified.
- **Ads.txt**: If AdSense asks for an `ads.txt`, create it in the `/public` folder with the content they provide, commit, and push.
- **MongoDB**: In MongoDB Atlas, go to **Network Access** and ensure Vercel can connect (White-list `0.0.0.0/0` temporarily or use Vercel's integration).

## 5. Maintenance

- To update the site, simply push changes to the `main` branch on GitHub. Vercel will automatically redeploy.

---

**Done!** Your site should now be live at [atozmovies.in](https://www.atozmovies.in).
