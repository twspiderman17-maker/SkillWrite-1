import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from "../lib/auth";
import { isSupabaseConfigured } from "../lib/supabase";

export function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectTo = params.get("redirect") || "/courses";
  const [mode, setMode] = useState<"login" | "create">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function complete() {
    navigate(redirectTo);
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (isSupabaseConfigured && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      if (mode === "create") {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      await complete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    setError("");
    try {
      await signInWithGoogle();
      if (!isSupabaseConfigured) {
        await complete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 py-12 lg:grid-cols-[1fr_28rem]">
      <section className="flex flex-col justify-center">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">SkillWrite account</p>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-slate-900">Save your course access and progress.</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
          {isSupabaseConfigured
            ? "Sign in to unlock paid tracks. Purchases are tied to your account and enforced server-side."
            : "Demo mode: accounts and unlocks stay in this browser until Supabase env vars are configured."}
        </p>
        {!isSupabaseConfigured && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800">
            Demo note: without VITE_SUPABASE_URL, progress and unlocks use local storage only.
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${
              mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("create")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${
              mode === "create" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Create account
          </button>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => void handleGoogle()}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-60"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-extrabold text-blue-600">
            G
          </span>
          Continue with Google
          {!isSupabaseConfigured && <span className="text-xs font-medium text-slate-400">(demo)</span>}
        </button>

        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={(e) => void handleEmailSubmit(e)} className="space-y-5">
          {mode === "create" && (
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
                placeholder="Your name"
              />
            </label>
          )}
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <input
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
              placeholder={isSupabaseConfigured ? "At least 8 characters" : "Any password (demo)"}
              type="password"
              autoComplete={mode === "create" ? "new-password" : "current-password"}
            />
          </label>

          {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "create" ? "Create account" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to="/" className="font-semibold text-blue-600 hover:text-blue-700">
            Back to SkillWrite
          </Link>
        </p>
      </section>
    </div>
  );
}
