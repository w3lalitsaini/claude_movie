"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", { ...form, redirect: false });
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Welcome back!");
      router.push("/");
    }
  };

  return (
    <div className="pt-[90px] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-0 font-display font-bold text-3xl tracking-wider mb-3">
            <span className="text-white uppercase">ATOZ</span>
            <span className="bg-[#e50914] text-white px-2 py-0.5 uppercase tracking-wider">
              MOVIES
            </span>
          </div>
          <h1 className="text-white font-display font-bold text-2xl uppercase tracking-widest">
            Sign In
          </h1>
          <p className="text-[#666] text-sm mt-1">Welcome back, movie lover</p>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <FiMail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  placeholder="you@example.com"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm pl-10 pr-4 py-3 rounded-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <FiLock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]"
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm pl-10 pr-10 py-3 rounded-sm outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#aaa] transition-colors"
                >
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              <div className="text-right mt-2">
                <Link
                  href="/auth/reset-password"
                  className="text-[#666] hover:text-[#aaa] text-xs transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-red text-white font-bold py-3 rounded-sm uppercase tracking-widest text-sm disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-[#1a1a1a] text-center">
            <p className="text-[#666] text-sm">
              New to AtoZ Movies?{" "}
              <Link
                href="/auth/register"
                className="text-[#e50914] hover:text-[#ff1e2d] font-semibold transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
