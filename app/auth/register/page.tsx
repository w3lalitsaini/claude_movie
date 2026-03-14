"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiMail,
  FiKey,
  FiArrowRight,
  FiUser,
  FiLock,
  FiEyeOff,
  FiEye,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"FORM" | "OTP">("FORM");
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return toast.error("Please fill all fields");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("OTP sent to your email!");
        setStep("OTP");
      } else {
        toast.error(data.error || "Failed to send Hotkey");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the Hotkey");

    setLoading(true);

    // First register the user
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, otp }),
      });
      const data = await res.json();

      if (data.success) {
        // Then sign them in automatically
        const result = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error(
            "Registration successful but login failed. Please login.",
          );
          router.push("/auth/login");
        } else {
          toast.success("Account created successfully!");
          router.push("/");
        }
      } else {
        toast.error(data.error || "Failed to register");
      }
    } catch {
      toast.error("Something went wrong during registration");
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
            Create Account
          </h1>
          <p className="text-[#666] text-sm mt-1">
            Join the ultimate movie community
          </p>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-sm p-8">
          {step === "FORM" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]"
                  />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    required
                    placeholder="John Doe"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm pl-10 pr-4 py-3 rounded-sm outline-none transition-colors"
                  />
                </div>
              </div>
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-red flex items-center justify-center gap-2 text-white font-bold py-3 rounded-sm uppercase tracking-widest text-sm disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}{" "}
                <FiArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
              <div>
                <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
                  Authentication OTP key
                </label>
                <p className="text-[#aaa] text-xs mb-3">
                  A 6-digit code has been sent to{" "}
                  <span className="text-white font-semibold">{form.email}</span>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-red text-white font-bold py-3 rounded-sm uppercase tracking-widest text-sm disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Join"}
              </button>

              <button
                type="button"
                onClick={() => setStep("FORM")}
                className="w-full text-[#666] hover:text-[#aaa] text-xs uppercase tracking-wider font-semibold transition-colors mt-2"
              >
                Go Back
              </button>
            </form>
          )}

          <div className="mt-5 pt-5 border-t border-[#1a1a1a] text-center">
            <p className="text-[#666] text-sm">
              Already have an account?{" "}
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
