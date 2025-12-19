import React, { useState, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/api";

export default function TaskMasterLogin(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await login(email, password);

    // Laravel response shape
    const user = res?.data?.user;
    const token = res?.data?.token;

    if (!token) throw new Error("No token returned from server");

    if (remember) {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    navigate("/dashboard", { replace: true });
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.errors ||
      err?.message ||
      "Login failed";

    alert(msg);
    console.error("Login error:", err);
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-linear-to-r from-black/40 to-black/20 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT: Form */}
        <div className="p-10 md:p-12 bg-[linear-gradient(180deg,#09221a,rgba(0,0,0,0.35))]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-md bg-[#0f5930] flex items-center justify-center text-white font-semibold">TF</div>
            <h2 className="text-white text-2xl font-bold">Welcome back! <span aria-hidden>👋</span></h2>
          </div>

          <p className="text-slate-300 mb-6">Please enter your details to access your workspace.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm text-slate-300">Email Address</span>
              <div className="mt-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="w-full rounded-xl bg-[#071612] border border-transparent placeholder-slate-600 text-slate-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0fd67a]/40"
                />
              </div>
            </label>

            <label className="block">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Password</span>
                <a href="#" className="text-sm text-green-300 hover:underline">Forgot password?</a>
              </div>
              <div className="mt-2 relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl bg-[#071612] border border-transparent placeholder-slate-600 text-slate-100 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#0fd67a]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.28 0 2.5.24 3.63.68M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-slate-300">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded text-green-400 bg-[#071612] border-gray-700" />
                <span className="text-sm">Remember me</span>
              </label>

              <div className="text-sm text-slate-400"> </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full inline-flex items-center justify-center cursor-pointer gap-2 rounded-full bg-gradient-to-r from-[#0fe07a] to-[#11e079] text-black px-6 py-3 font-semibold shadow-[0_10px_30px_rgba(16,185,129,0.18)] hover:brightness-105 focus:outline-none ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? "Signing in..." : "Sign In"}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <div className="pt-4">
              <p className="text-center text-sm text-slate-400">Don't have an account?  <Link className="text-emerald-400" to={"/register"}>Sign Up</Link></p>
            </div>
          </form>

          <div className="mt-6 text-slate-600 text-xs">&copy; TaskFlow — Titos ;)</div>
        </div>

        {/* RIGHT: Marketing / Illustration */}
        <div className="p-8 md:p-12 bg-[radial-gradient(ellipse_at_top_right,#063022,transparent_40%)] flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-2xl p-5 bg-gradient-to-b from-[#071c14]/60 to-transparent shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="text-slate-300 text-sm">Productivity</div>
                <div className="text-green-300 text-sm font-semibold">+24%</div>
              </div>

              {/* Mock chart */}
              <div className="h-28 flex items-end gap-3 mb-6">
                <div className="w-8 h-10 rounded-md bg-slate-800"></div>
                <div className="w-8 h-14 rounded-md bg-slate-800"></div>
                <div className="w-8 h-16 rounded-md bg-slate-800"></div>
                <div className="w-8 h-8 rounded-md bg-slate-800"></div>
                <div className="w-8 h-24 rounded-md bg-[#00ff77] shadow-[0_10px_30px_rgba(0,255,119,0.12)]"></div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#f9d29b] to-[#e6c498] ring-1 ring-black/30"></div>
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#f0e9d8] to-[#d6caa6] ring-1 ring-black/30"></div>
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#bdb8a3] to-[#a69f88] ring-1 ring-black/30"></div>
                </div>
                <div className="text-slate-100 font-bold text-lg">Manage projects with <span className="text-[#0fe07a]">clarity</span> &amp; speed.</div>
              </div>

              <p className="text-slate-400 text-sm">"TaskMaster has completely transformed how our design team collaborates. It's the cleanest, fastest tool we've ever used."</p>
            </div>

            <div className="mt-6 text-xs text-slate-500">+2k teams are already using TaskMaster</div>
          </div>
        </div>
      </div>
    </div>
  );
}
