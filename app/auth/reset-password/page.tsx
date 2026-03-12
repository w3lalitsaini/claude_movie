"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiMail,
  FiKey,
  FiArrowRight,
  FiLock,
  FiEyeOff,
  FiEye,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState<"EMAIL" | "RESET">("EMAIL");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Hotkey sent to your email!");
        setStep("RESET");
      } else {
        toast.error(data.error || "Failed to send Hotkey");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) return toast.error("Please fill all fields");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password reset successfully!");
        router.push("/auth/login");
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
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
            Reset Password
          </h1>
          <p className="text-[#666] text-sm mt-1">
            Regain access to your account
          </p>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-sm p-8">
          {step === "EMAIL" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm pl-10 pr-4 py-3 rounded-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-red flex items-center justify-center gap-2 text-white font-bold py-3 rounded-sm uppercase tracking-widest text-sm disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Hotkey"}{" "}
                <FiArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
                  Authentication Hotkey
                </label>
                <p className="text-[#aaa] text-xs mb-3">
                  A 6-digit code has been sent to{" "}
                  <span className="text-white font-semibold">{email}</span>
                </p>
                <div className="relative">
                  <FiKey
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]"
                  />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-center text-xl tracking-[0.5em] font-bold py-3 rounded-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
                  New Password
                </label>
                <div className="relative">
                  <FiLock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]"
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-red text-white font-bold py-3 rounded-sm uppercase tracking-widest text-sm disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => setStep("EMAIL")}
                className="w-full text-[#666] hover:text-[#aaa] text-xs uppercase tracking-wider font-semibold transition-colors mt-2"
              >
                Use a different email
              </button>
            </form>
          )}

          <div className="mt-5 pt-5 border-t border-[#1a1a1a] text-center">
            <p className="text-[#666] text-sm">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="text-[#e50914] hover:text-[#ff1e2d] font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
