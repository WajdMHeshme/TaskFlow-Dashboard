// src/pages/Auth/TaskMasterRegister.tsx
import React, { useRef, useState, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "../../api/api";
import { fetchAndCacheCurrentUser } from "../../api/user.api";
import { showError, showSuccess } from "../../utils/toast/toastUtils/toastUtils";
import { useTranslation } from "react-i18next";
import { PiEyeBold } from "react-icons/pi";
import { LuEyeClosed } from "react-icons/lu";

export default function TaskMasterRegister(): JSX.Element {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function scorePassword(pw: string) {
    let score = 0;
    if (!pw) return 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 5);
  }

  const strength = scorePassword(password);
  const strengthPct = `${(strength / 5) * 100}%`;
  const strengthLabel = t("password_strength")[strength];

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFileName(f.name);
    setPhotoFile(f);

    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  }

  function clearPhoto() {
    setPhotoPreview(null);
    setPhotoFile(null);
    setFileName(null);
    if (fileRef.current) fileRef.current.value = "";
  }

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
    return err?.message ?? t("create_account_btn") ?? "Registration failed";
  };

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await register(formData);
    },
    onSuccess: async (res: any) => {
      try {
        const data = res?.data ?? res;
        const user = data?.user ?? data?.data?.user ?? null;
        const token = data?.token ?? data?.data?.token ?? null;

        if (!token) {
          showError(t("registration_no_token") ?? "Registration succeeded but login failed.");
          // still navigate to login page
          navigate("/login", { replace: true });
          return;
        }

        // store token + user
        try {
          localStorage.setItem("token", token);
          if (user) localStorage.setItem("user", JSON.stringify(user));
        } catch {
          // ignore storage errors
        }

        // cache current user: either use returned user or fetch fresh
        if (user) {
          queryClient.setQueryData(["currentUser"], user);
        } else {
          try {
            const fetched = await fetchAndCacheCurrentUser();
            queryClient.setQueryData(["currentUser"], fetched);
          } catch {
            // ignore
          }
        }

        showSuccess(t("account_created") ?? "Account created");
        // clear form
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirm("");
        clearPhoto();
        setAgree(false);

        navigate("/dashboard", { replace: true });
      } catch (e: any) {
        showError(extractErrorMessage(e));
      }
    },
    onError: (err: any) => {
      console.error("Register mutation error:", err);
      const data = err?.response?.data;
      if (data?.errors) {
        const msgs = Object.values(data.errors).flat();
        showError(Array.isArray(msgs) ? msgs.join("\n") : String(msgs));
      } else if (data?.message) {
        showError(String(data.message));
      } else {
        showError(extractErrorMessage(err));
      }
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!fullName.trim() || !email.trim()) {
      showError(t("fill_name_email"));
      return;
    }
    if (password.length < 8) {
      showError(t("password_short"));
      return;
    }
    if (password !== confirm) {
      showError(t("password_mismatch"));
      return;
    }
    if (!agree) {
      showError(t("accept_terms"));
      return;
    }

    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", confirm);
    if (photoFile) formData.append("photo", photoFile);

    mutation.mutate(formData);
  }

  const loading = mutation.isLoading;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-[linear-gradient(180deg,#09221a,rgba(0,0,0,0.35))] rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-linear-to-r from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-bold text-lg shadow-sm">TF</div>
            <div>
              <h2 className="text-white text-2xl md:text-3xl font-bold">{t("create_account")}</h2>
              <p className="text-slate-300 text-sm md:text-base mt-1">{t("join_taskmaster")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block">
              <span className="text-sm text-slate-300">{t("full_name")}</span>
              <div className="mt-2">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Alex Morgan" required className="w-full rounded-2xl bg-[#071612] border border-transparent placeholder-slate-600 text-slate-100 px-5 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-[#0fd67a]/40 text-sm md:text-base"/>
              </div>
            </label>

            <label className="block">
              <span className="text-sm text-slate-300">{t("email")}</span>
              <div className="mt-2">
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="name@company.com" required className="w-full rounded-2xl bg-[#071612] border border-transparent placeholder-slate-600 text-slate-100 px-5 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-[#0fd67a]/40 text-sm md:text-base"/>
              </div>
            </label>

            <label className="block">
              <span className="text-sm text-slate-300">{t("password")}</span>
              <div className="mt-2 relative">
                <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="••••••••" required className="w-full rounded-2xl bg-[#071612] border border-transparent placeholder-slate-600 text-slate-100 px-5 py-3 pr-14 md:pr-16 focus:outline-none focus:ring-2 focus:ring-[#0fd67a]/40 text-sm md:text-base"/>
                <button type="button" onClick={() => setShowPassword((s)=>!s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-sm md:text-base">{showPassword ? <LuEyeClosed /> : <PiEyeBold />}</button>
              </div>
              <div className="mt-3">
                <div className="w-full h-2 md:h-2.5 rounded-full bg-emerald-900/20 overflow-hidden">
                  <div className="h-full rounded-full transition-all ease-out duration-200" style={{ width: strengthPct, background: "linear-gradient(90deg,#34d399,#10b981)" }}/>
                </div>
                <div className="text-xs md:text-sm text-emerald-200/60 mt-2">{strengthLabel}</div>
              </div>
            </label>

            <label className="block">
              <span className="text-sm text-slate-300">{t("confirm_password")}</span>
              <div className="mt-2 relative">
                <input value={confirm} onChange={(e)=>setConfirm(e.target.value)} type={showConfirm?"text":"password"} placeholder="••••••••" required className="w-full rounded-2xl bg-[#071612] border border-transparent placeholder-slate-600 text-slate-100 px-5 py-3 pr-14 md:pr-16 focus:outline-none focus:ring-2 focus:ring-[#0fd67a]/40 text-sm md:text-base"/>
                <button type="button" onClick={()=>setShowConfirm((s)=>!s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-sm md:text-base">{showConfirm ? <LuEyeClosed /> : <PiEyeBold />}</button>
              </div>
            </label>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-slate-300 text-sm md:text-base">
                <input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} className="w-5 h-5 rounded text-green-400 bg-[#071612] border-gray-700"/>
                <span className="text-sm md:text-base">{t("agree_terms")}</span>
              </label>
            </div>



            <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-linear-to-r from-[#0fe07a] to-[#11e079] text-black px-6 py-3 md:py-4 font-semibold shadow-[0_10px_30px_rgba(16,185,129,0.18)] hover:brightness-105 focus:outline-none text-sm md:text-base disabled:opacity-60">
              {loading ? t("creating") : t("create_account_btn")}
            </button>

            <div className="pt-2 text-center">
              <p className="text-sm text-slate-400">{t("already_account")} <Link className="text-emerald-400 hover:underline" to={'/login'}>{t("sign_in")}</Link></p>
            </div>
          </form>

          <div className="mt-6 text-slate-600 text-xs">&copy; TaskFlow — Titos ;)</div>
        </div>
      </div>
    </div>
  );
}
