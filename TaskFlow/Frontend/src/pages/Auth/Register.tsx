// src/components/TaskMasterRegister.tsx
import React, { useRef, useState, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/api"; // تأكد من المسار الصحيح إلى ملف api.ts
import { showError, showSuccess } from "../../utils/toast/toastUtils/toastUtils";

export default function TaskMasterRegister(): JSX.Element {
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
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

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
  const strengthLabel = [
    "Very weak",
    "Weak",
    "Okay",
    "Good",
    "Strong",
    "Very strong",
  ][strength];

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

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!fullName.trim() || !email.trim()) {
    showError("Please fill in name and email.");
    return;
  }
  if (password.length < 8) {
    showError("Password must be at least 8 characters.");
    return;
  }
  if (password !== confirm) {
    showError("Passwords do not match.");
    return;
  }
  if (!agree) {
    showError("Please accept Terms & Conditions.");
    return;
  }

  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", confirm);
    if (photoFile) formData.append("photo", photoFile);

    const res = await register(formData);

    const top = res ?? {};
    const dataLayer = top.data ?? top;
    const payload = dataLayer.data ?? dataLayer;
    const user = payload?.user;
    const token = payload?.token;

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      showSuccess("Account created successfully!");
      navigate("/dashboard", { replace: true });
    } else {
      console.log("register response (unexpected):", res);
      showError(top.message ?? "Registered, but couldn't log you in automatically.");
      navigate("/login", { replace: true });
    }

    // reset form
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirm("");
    clearPhoto();
    setAgree(false);
  } catch (err: any) {
    console.error("register error", err);
    const resp = err?.response?.data;
    if (resp?.errors) {
      const msgs = Object.values(resp.errors).flat().join("\n");
      showError(msgs);
    } else if (resp?.message) {
      showError(resp.message);
    } else {
      showError("Registration failed. Check console for details.");
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-[linear-gradient(180deg,#09221a,rgba(0,0,0,0.35))] rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-bold text-lg shadow-sm">
              TF
            </div>
            <div>
              <h2 className="text-white text-2xl md:text-3xl font-bold">Create your account</h2>
              <p className="text-slate-300 text-sm md:text-base mt-1">Join TaskMaster and start organizing your work.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full name */}
            <label className="block">
              <span className="text-sm text-slate-300">Full name</span>
              <div className="mt-2">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  placeholder="Alex Morgan"
                  required
                  className="w-full rounded-2xl bg-[#071612] border border-transparent placeholder-slate-600 text-slate-100 px-5 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-[#0fd67a]/40 text-sm md:text-base"
                />
              </div>
            </label>

            {/* Email */}
            <label className="block">
              <span className="text-sm text-slate-300">Email address</span>
              <div className="mt-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="w-full rounded-2xl bg-[#071612] border border-transparent placeholder-slate-600 text-slate-100 px-5 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-[#0fd67a]/40 text-sm md:text-base"
                />
              </div>
            </label>

            {/* Password */}
            <label className="block">
              <span className="text-sm text-slate-300">Password</span>
              <div className="mt-2 relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl bg-[#071612] border border-transparent placeholder-slate-600 text-slate-100 px-5 py-3 pr-14 md:pr-16 focus:outline-none focus:ring-2 focus:ring-[#0fd67a]/40 text-sm md:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-sm md:text-base"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* strength */}
              <div className="mt-3">
                <div className="w-full h-2 md:h-2.5 rounded-full bg-emerald-900/20 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all ease-out duration-200"
                    style={{ width: strengthPct, background: "linear-gradient(90deg,#34d399,#10b981)" }}
                  />
                </div>
                <div className="text-xs md:text-sm text-emerald-200/60 mt-2">{strengthLabel}</div>
              </div>
            </label>

            {/* Confirm */}
            <label className="block">
              <span className="text-sm text-slate-300">Confirm password</span>
              <div className="mt-2 relative">
                <input
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl bg-[#071612] border border-transparent placeholder-slate-600 text-slate-100 px-5 py-3 pr-14 md:pr-16 focus:outline-none focus:ring-2 focus:ring-[#0fd67a]/40 text-sm md:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-sm md:text-base"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {/* TOS */}
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-slate-300 text-sm md:text-base">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="w-5 h-5 rounded text-green-400 bg-[#071612] border-gray-700"
                />
                <span className="text-sm md:text-base">I agree to the <a className="text-emerald-400 hover:underline" href="#">Terms & Conditions</a></span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#0fe07a] to-[#11e079] text-black px-6 py-3 md:py-4 font-semibold shadow-[0_10px_30px_rgba(16,185,129,0.18)] hover:brightness-105 focus:outline-none text-sm md:text-base disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <div className="pt-2 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <Link className="text-emerald-400 hover:underline" to={'/login'}>
                  Sign in
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-6 text-slate-600 text-xs">&copy; TaskFlow — Titos ;)</div>
        </div>
      </div>
    </div>
  );
}
