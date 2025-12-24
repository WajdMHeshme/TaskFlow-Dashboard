// src/pages/Auth/TaskMasterLogin.tsx
import React, { useState, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../api/api";
import { fetchAndCacheCurrentUser } from "../../api/user.api";
import { showError, showSuccess } from "../../utils/toast/toastUtils/toastUtils";
import { useTranslation } from "react-i18next";

export default function TaskMasterLogin(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const extractErrorMessage = (err: any): string => {
    const data = err?.response?.data;
    if (data?.message) return String(data.message);
    if (data?.errors) {
      const errors = data.errors;
      if (typeof errors === "string") return errors;
      if (typeof errors === "object") {
        const first = Object.values(errors)[0];
        if (Array.isArray(first) && first.length > 0) return String(first[0]);
        if (typeof first === "string") return first;
      }
    }
    return err?.message ?? (t("sign_in") as string) ?? "Login Failed!";
  };

  // useMutation for login
  const mutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      return await login(payload.email, payload.password);
    },
    onSuccess: async (res: any) => {
      try {
        const data = res?.data ?? res;
        const user = data?.user ?? data?.data?.user ?? null;
        const token = data?.token ?? data?.data?.token ?? null;

        if (!token) {
          showError(t("login_failed_no_token") ?? "Login failed");
          return;
        }

        if (remember) localStorage.setItem("token", token);
        else sessionStorage.setItem("token", token);

        // Option 1: if API returns user object, cache it directly
        if (user) {
          try {
            queryClient.setQueryData(["currentUser"], user);
            // also persist to localStorage if you want
            localStorage.setItem("user", JSON.stringify(user));
          } catch {
            // ignore storage errors
          }
        } else {
          // Option 2: fetch user from server and cache it (recommended)
          try {
            const fetched = await fetchAndCacheCurrentUser();
            queryClient.setQueryData(["currentUser"], fetched);
          } catch (e) {
            // If fetching current user fails, ignore but continue
          }
        }

        showSuccess(t("login_success") ?? "Logged in");
        navigate("/dashboard", { replace: true });
      } catch (e: any) {
        showError(extractErrorMessage(e));
      }
    },
    onError: (err: any) => {
      const msg = extractErrorMessage(err);
      showError(msg);
      console.error("Login mutation error:", err);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ email, password });
  }

  const loading = mutation.isLoading;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-5xl w-full bg-linear-to-r from-black/40 to-black/20 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT: Form */}
        <div className="p-10 md:p-12 bg-[linear-gradient(180deg,#09221a,rgba(0,0,0,0.35))]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-md bg-[#0f5930] flex items-center justify-center text-white font-semibold">TF</div>
            <h2 className="text-white text-2xl font-bold">{t("welcome_back")}</h2>
          </div>

          <p className="text-slate-300 mb-6">{t("enter_details")}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm text-slate-300">{t("email")}</span>
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
                <span className="text-sm text-slate-300">{t("password")}</span>
                <a href="#" className="text-sm text-green-300 hover:underline">{t("forgot_password")}</a>
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
                  aria-label={showPassword ? t("hide_password") ?? "Hide password" : t("show_password") ?? "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-slate-300">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded text-green-400 bg-[#071612] border-gray-700" />
                <span className="text-sm">{t("remember_me")}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full inline-flex items-center justify-center cursor-pointer gap-2 rounded-full bg-linear-to-r from-[#0fe07a] to-[#11e079] text-black px-6 py-3 font-semibold shadow-[0_10px_30px_rgba(16,185,129,0.18)] hover:brightness-105 focus:outline-none ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? t("signing_in") : t("sign_in")}
            </button>

            <div className="pt-4">
              <p className="text-center text-sm text-slate-400">{t("dont_have_account")} <Link className="text-emerald-400" to={"/register"}>{t("sign_up")}</Link></p>
            </div>
          </form>

          <div className="mt-6 text-slate-600 text-xs">&copy; TaskFlow — Titos ;)</div>
        </div>

        {/* RIGHT: Marketing / Illustration */}
        <div className="p-8 md:p-12 bg-[radial-gradient(ellipse_at_top_right,#063022,transparent_40%)] flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-2xl p-5 bg-linear-to-b from-[#071c14]/60 to-transparent shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#f9d29b] to-[#e6c498] ring-1 ring-black/30"></div>
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#f0e9d8] to-[#d6caa6] ring-1 ring-black/30"></div>
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#bdb8a3] to-[#a69f88] ring-1 ring-black/30"></div>
                </div>
                <div className="text-slate-100 font-bold text-lg">{t("manage_projects")}</div>
              </div>

              <p className="text-slate-400 text-sm">{t("testimonial")}</p>
            </div>

            <div className="mt-6 text-xs text-slate-500">{t("teams_using")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
