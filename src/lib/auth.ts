import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "./supabase";
import { clearEntitlementsCache, refreshEntitlements } from "./entitlements";

const AUTH_KEY = "skillwrite_auth_user";
export const AUTH_EVENT = "skillwrite-auth-change";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  provider: "email" | "google";
};

let cachedUser: AuthUser | null = null;
let authReady = false;

function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function mapUser(user: User): AuthUser {
  const meta = user.user_metadata ?? {};
  const name =
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.name === "string" && meta.name) ||
    user.email?.split("@")[0] ||
    "SkillWrite Learner";
  const provider =
    user.app_metadata?.provider === "google" || meta.provider === "google" ? "google" : "email";
  return {
    id: user.id,
    name,
    email: user.email ?? "",
    provider,
  };
}

function loadDemoUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed.id) {
      parsed.id = `demo_${parsed.email}`;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveDemoUser(user: AuthUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function isAuthReady(): boolean {
  return authReady;
}

export async function initAuth(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    cachedUser = loadDemoUser();
    authReady = true;
    notifyAuthChange();
    return;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  cachedUser = session?.user ? mapUser(session.user) : null;
  authReady = true;
  notifyAuthChange();

  supabase.auth.onAuthStateChange((_event, nextSession) => {
    cachedUser = nextSession?.user ? mapUser(nextSession.user) : null;
    if (!cachedUser) {
      clearEntitlementsCache();
    }
    notifyAuthChange();
    void refreshEntitlements();
  });

  await refreshEntitlements();
}

export function getCurrentUser(): AuthUser | null {
  if (isSupabaseConfigured) {
    return cachedUser;
  }
  return loadDemoUser();
}

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  const cleanEmail = email.trim().toLowerCase();
  if (!isSupabaseConfigured || !supabase) {
    const user: AuthUser = {
      id: `demo_${cleanEmail}`,
      email: cleanEmail,
      name: cleanEmail.split("@")[0] || "SkillWrite Learner",
      provider: "email",
    };
    saveDemoUser(user);
    cachedUser = user;
    notifyAuthChange();
    return user;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });
  if (error) throw error;
  if (!data.user) throw new Error("Sign in failed.");
  cachedUser = mapUser(data.user);
  notifyAuthChange();
  await refreshEntitlements();
  return cachedUser;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name?: string,
): Promise<AuthUser> {
  const cleanEmail = email.trim().toLowerCase();
  if (!isSupabaseConfigured || !supabase) {
    const user: AuthUser = {
      id: `demo_${cleanEmail}`,
      email: cleanEmail,
      name: name?.trim() || cleanEmail.split("@")[0] || "SkillWrite Learner",
      provider: "email",
    };
    saveDemoUser(user);
    cachedUser = user;
    notifyAuthChange();
    return user;
  }

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: { full_name: name?.trim() || cleanEmail.split("@")[0] },
    },
  });
  if (error) throw error;
  if (!data.user) throw new Error("Sign up failed.");
  cachedUser = mapUser(data.user);
  notifyAuthChange();
  await refreshEntitlements();
  return cachedUser;
}

export async function signInWithGoogle(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    const user: AuthUser = {
      id: "demo_google",
      name: "Google Demo Learner",
      email: "demo.google@skillwrite.local",
      provider: "google",
    };
    saveDemoUser(user);
    cachedUser = user;
    notifyAuthChange();
    return;
  }

  const redirectTo = `${window.location.origin}/login`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
    cachedUser = null;
    clearEntitlementsCache();
    notifyAuthChange();
    return;
  }
  localStorage.removeItem(AUTH_KEY);
  cachedUser = null;
  notifyAuthChange();
}
