import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";
import type { Mode } from "../../types/auth.types";
import {
  signInViaEmail,
  signInViaGoogle,
  signUpViaEmail,
} from "../../services/auth.services";

const Login = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutateAsync: auth, isPending } = useAuth();
  const isSignup = mode === "signup";
  
  

  const handleAuth = async () => {
    try {
      if (!email || !password) {
        toast.error("Please enter all fields");
        return;
      }
      if (isSignup) {
        if (!confirmPassword) {
          toast.error("Please confirm your password");
          return;
        }
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        await signUpViaEmail({ email, password, confirmPassword });
        await auth();
        toast.success("Account created successfully");
      } else {
        await signInViaEmail({ email, password });
        await auth();
        toast.success("Logged in successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInViaGoogle();
      await auth();
      toast.success("Logged in successfully");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Google sign in failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#121212] flex flex-col lg:flex-row font-sans">
      <div className="relative flex flex-col justify-between px-6 pt-8 pb-10 lg:w-[52%] lg:px-14 lg:pt-12 overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-1/3 h-105 w-105 rounded-full bg-orange-600/20 blur-[120px]" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-500/40">
            <span className="text-base font-bold text-white tracking-tight">
              C
            </span>
          </div>
          <span className="text-[17px] font-semibold text-white tracking-tight">
            CoLiving
          </span>
        </div>

        <div className="relative z-10 mt-14 lg:mt-0">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-400">
            Co-Living Platform
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-[3.25rem]">
            Find your perfect
            <br />
            <span className="text-orange-500">space &amp; roommate</span>
          </h1>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-zinc-400">
            Verified listings, compatible roommates, and hassle-free move-in —
            all in one place.
          </p>

          <div className="mt-8 flex items-center gap-8">
            {[
              { value: "12K+", label: "Listings" },
              { value: "8K+", label: "Matches" },
              { value: "20+", label: "Cities" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 grid grid-cols-2 gap-2.5 max-w-xs">
            {[
              "Verified profiles",
              "Smart matching",
              "Zero broker fee",
              "Instant booking",
            ].map((feat) => (
              <div
                key={feat}
                className="flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/50 px-3.5 py-1.5"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                <span className="text-[12px] text-zinc-300">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-4 lg:hidden" />
      </div>

      <div className="flex flex-col justify-center px-6 pb-12 pt-6 lg:w-[48%] lg:px-14 lg:py-16">
        <div className="mx-auto w-full max-w-100">
          <div className="mb-8 flex overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-800/60 p-1">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-2 text-[13px] font-semibold transition-all duration-200 ${
                  mode === m
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-white">
            {isSignup ? "Create account" : "Welcome back"}
          </h2>
          <p className="mt-1 text-[13px] text-zinc-500">
            {isSignup
              ? "Join CoLiving and find your perfect space"
              : "Sign in to your CoLiving account"}
          </p>

          <button
            onClick={handleGoogleAuth}
            disabled={isPending}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700/60 bg-zinc-800/50 py-3 text-[14px] font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800 active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="h-4.5 w-4.5" viewBox="0 0 18 18" fill="none">
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-700/50" />
            <span className="text-[11px] text-zinc-600">or</span>
            <div className="h-px flex-1 bg-zinc-700/50" />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-4 py-3 text-[14px] text-white placeholder-zinc-600 outline-none transition focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-4 py-3 pr-11 text-[14px] text-white placeholder-zinc-600 outline-none transition focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {!isSignup && (
                <div className="mt-1.5 text-right">
                  <button className="text-[12px] text-zinc-500 hover:text-orange-400 transition">
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            {isSignup && (
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-4 py-3 pr-11 text-[14px] text-white placeholder-zinc-600 outline-none transition focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAuth}
            disabled={isPending}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-[14px] font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400 active:scale-[0.98] disabled:opacity-60"
          >
            {isPending ? (
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                {isSignup ? "Create Account" : "Sign In"}
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="mt-5 text-center text-[13px] text-zinc-600">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => setMode(isSignup ? "login" : "signup")}
              className="font-semibold text-orange-500 hover:text-orange-400 transition"
            >
              {isSignup ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
