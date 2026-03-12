"use client";
import { useState } from "react";
import { FiSend, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubmitted(true);
    toast.success("Successfully subscribed!");
  };

  return (
    <section className="py-10 border-t border-[#1a1a1a] mb-4">
      <div className="bg-gradient-to-r from-[#e50914]/10 via-[#111] to-[#e50914]/5 border border-[#2a1a1a] rounded-sm p-8 md:p-12 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#e50914]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#e50914]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <span className="inline-block bg-[#e50914]/20 text-[#e50914] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm mb-4">
            Newsletter
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white uppercase tracking-wide mb-3">
            Stay Updated with CineVerse
          </h2>
          <p className="text-[#777] text-sm mb-8 max-w-md mx-auto">
            Get the latest movie releases, reviews, and entertainment news delivered straight to your inbox.
          </p>

          {submitted ? (
            <div className="inline-flex items-center gap-3 bg-green-900/30 border border-green-700/50 text-green-400 px-6 py-3 rounded-sm">
              <FiCheck size={18} />
              <span className="font-semibold">You&apos;re subscribed! Check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3.5 outline-none transition-colors rounded-sm sm:rounded-r-none"
              />
              <button
                type="submit"
                className="btn-red flex items-center justify-center gap-2 text-white font-bold px-6 py-3.5 rounded-sm sm:rounded-l-none whitespace-nowrap"
              >
                <FiSend size={14} />
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[#444] text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
