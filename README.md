# 🎬 AtoZ Movies (Cineverse)

**AtoZ Movies** (internally known as **Cineverse**) is a modern, high-performance movie platform and blog built with the latest web technologies. It offers a seamless experience for discovering movies, reading news, and participating in discussions.

---

## 🚀 Key Features

### 🎞️ Movie Management

- **Extensive Database**: Browse Bollywood, Hollywood, and South Hindi Dubbed movies.
- **Categorization**: Filter by genres, latest uploads, and top-rated movies.
- **Dynamic Search**: High-speed search functionality for finding specific titles.

### 📝 Blog System

- **Rich Content**: Engaging blog posts about the latest movie trends and news.
- **Comments & Engagement**: User-interactive comment sections for every post.
- **Newsletter**: Automated subscription system for platform updates.

### 🛡️ Core Infrastructure

- **Secure Authentication**: Robust system using NextAuth with OTP-based verification.
- **Admin Dashboard**: Full-featured control panel for managing movies, blogs, users, and comments.
- **Cloud Media**: High-performance image hosting via Cloudinary.
- **SEO Optimized**: Fully optimized for search engines with dynamic sitemaps and robots.txt.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Media Hosting**: [Cloudinary](https://cloudinary.com/)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- MongoDB instance (Atlas or local)
- Cloudinary account for media storage

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/atoz-movies.git
   cd atoz-movies
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your credentials.

   ```bash
   cp .env.example .env
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 📄 Project Structure

```text
├── app/            # Next.js App Router (Pages, API Routes)
├── components/     # Reusable UI components
├── lib/            # Shared utilities (DB connection, Auth config)
├── models/         # Mongoose schemas (Movie, Blog, User, etc.)
├── public/         # Static assets
├── types/          # TypeScript definitions
└── tailwind.config.ts # Styling configuration
```

---

## 📡 Deployment

This project is optimized for **Vercel**.

1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Configure the environment variables in the Vercel dashboard.
4. Deploy!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
