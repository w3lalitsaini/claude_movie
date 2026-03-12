"use client";
import Link from "next/link";
import { useState } from "react";
import { FiFacebook, FiTwitter, FiYoutube, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(data.error || "Failed to subscribe");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#080808] border-t border-[#1a1a1a] mt-16">
      <div className="max-w-[1400px] mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <div className="flex items-center gap-0 font-display font-bold text-2xl tracking-wider">
                <span className="text-white uppercase">CINE</span>
                <span className="bg-[#e50914] text-white px-2 py-0.5 uppercase tracking-wider">
                  VERSE
                </span>
              </div>
            </Link>
            <p className="text-[#777] text-sm leading-relaxed mb-6">
              CineVerse is the premier destination for Bollywood, Hollywood, and
              South Hindi Dubbed content. Watch trailers, read reviews, and
              discover your next favorite film.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: FiFacebook, href: "#", label: "Facebook" },
                { icon: FiTwitter, href: "#", label: "Twitter" },
                { icon: FiYoutube, href: "#", label: "YouTube" },
                { icon: FiSend, href: "#", label: "Telegram" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-[#1a1a1a] hover:bg-[#e50914] border border-[#2a2a2a] flex items-center justify-center text-[#888] hover:text-white transition-all duration-200 rounded-sm"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-display font-semibold text-sm uppercase tracking-widest mb-5 flex items-center gap-3">
              <span className="w-1 h-5 bg-[#e50914] inline-block rounded-sm"></span>
              EXPLORE CINEVERSE
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "SEARCH DATABASE", href: "/search" },
                { label: "TRENDING NOW", href: "/movies?trending=true" },
                { label: "DUAL AUDIO", href: "/movies?category=dual-audio" },
                {
                  label: "NETFLIX SERIES",
                  href: "/movies?category=web-series&platform=netflix",
                },
                { label: "TOP RATED", href: "/movies?topRated=true" },
                { label: "BLOG & REVIEWS", href: "/blog" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[#666] hover:text-[#e50914] text-xs font-semibold uppercase tracking-widest transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-display font-semibold text-sm uppercase tracking-widest mb-5 flex items-center gap-3">
              <span className="w-1 h-5 bg-[#e50914] inline-block rounded-sm"></span>
              CATEGORIES
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "ACTION & SCI-FI", href: "/movies?genre=Action" },
                {
                  label: "BOLLYWOOD HINDI",
                  href: "/movies?category=bollywood",
                },
                {
                  label: "HOLLYWOOD ENGLISH",
                  href: "/movies?category=hollywood",
                },
                {
                  label: "SOUTH HINDI DUBBED",
                  href: "/movies?category=south-hindi",
                },
                { label: "WEB SERIES", href: "/movies?category=web-series" },
                { label: "ROMANCE & DRAMA", href: "/movies?genre=Romance" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[#666] hover:text-[#e50914] text-xs font-semibold uppercase tracking-widest transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-display font-semibold text-sm uppercase tracking-widest mb-5 flex items-center gap-3">
              <span className="w-1 h-5 bg-[#e50914] inline-block rounded-sm"></span>
              NEWSLETTER
            </h4>
            <p className="text-[#666] text-sm mb-5 leading-relaxed">
              Subscribe for the latest uploads, reviews, and entertainment news.
            </p>
            <form onSubmit={handleNewsletter} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER EMAIL ADDRESS"
                className="flex-1 bg-[#111] border border-[#2a2a2a] text-white text-xs placeholder-[#444] px-4 py-3 outline-none focus:border-[#e50914] transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#e50914] hover:bg-[#ff1e2d] text-white px-4 py-3 transition-colors flex items-center disabled:opacity-50"
              >
                <FiSend size={15} />
              </button>
            </form>

            <div className="mt-6">
              <h5 className="text-[#555] text-xs uppercase tracking-widest font-semibold mb-3">
                QUICK QUALITY
              </h5>
              <div className="flex gap-2">
                {["4K", "1080P", "720P", "480P"].map((q) => (
                  <Link
                    key={q}
                    href={`/movies?quality=${q.toLowerCase()}`}
                    className="bg-[#1a1a1a] hover:bg-[#e50914] border border-[#2a2a2a] text-[#888] hover:text-white text-xs font-bold px-2.5 py-1 transition-all duration-200 rounded-sm"
                  >
                    {q}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1a1a1a] py-5">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#444] text-xs">
            © {new Date().getFullYear()} CineVerse. All rights reserved. For
            entertainment purposes only.
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Use", href: "/terms" },
              { label: "DMCA", href: "/dmca" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[#444] hover:text-[#e50914] text-xs transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
