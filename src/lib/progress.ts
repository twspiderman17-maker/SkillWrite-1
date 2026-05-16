import type { PurchaseTier } from "../types";
import { hasEntitlementsLoaded, isEntitled } from "./entitlements";
import { isSupabaseConfigured } from "./supabase";

const PREFIX = "awa_v1_";

export type ProgressState = {
  quizBestScores: Record<string, number>;
  flashKnown: Record<string, string[]>;
  unlocked: Record<string, boolean>;
  finalTestSubmissions: Record<string, boolean>;
  lastStudy: string | null;
};

const defaultProgress: ProgressState = {
  quizBestScores: {},
  flashKnown: {},
  unlocked: {},
  finalTestSubmissions: {},
  lastStudy: null,
};

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(PREFIX + "progress");
    if (!raw) return { ...defaultProgress };
    const p = JSON.parse(raw) as Partial<ProgressState>;
    return {
      quizBestScores: p.quizBestScores ?? {},
      flashKnown: p.flashKnown ?? {},
      unlocked: p.unlocked ?? {},
      finalTestSubmissions: p.finalTestSubmissions ?? {},
      lastStudy: p.lastStudy ?? null,
    };
  } catch {
    return { ...defaultProgress };
  }
}

function save(p: ProgressState) {
  localStorage.setItem(PREFIX + "progress", JSON.stringify(p));
}

export function getProgress(): ProgressState {
  return load();
}

function entitlementKey(trackSlug: string, tier: PurchaseTier): string {
  return `${tier}:${trackSlug}`;
}

export function isUnlocked(trackSlug: string, tier: PurchaseTier): boolean {
  if (isSupabaseConfigured && hasEntitlementsLoaded()) {
    return isEntitled(trackSlug, tier);
  }
  const p = load();
  if (tier === "graduate" && p.unlocked[entitlementKey(trackSlug, "masters")]) {
    return true;
  }
  return Boolean(p.unlocked[entitlementKey(trackSlug, tier)]);
}

export function unlockPurchase(trackSlug: string, tier: PurchaseTier): void {
  if (isSupabaseConfigured) return;
  const p = load();
  p.unlocked[entitlementKey(trackSlug, tier)] = true;
  if (tier === "masters") {
    p.unlocked[entitlementKey(trackSlug, "graduate")] = true;
  }
  p.lastStudy = new Date().toISOString();
  save(p);
}

export function hasLessonAccess(trackSlug: string, program: "graduate" | "masters"): boolean {
  return isUnlocked(trackSlug, program);
}

export function recordFinalTestSubmission(trackSlug: string): void {
  const p = load();
  p.finalTestSubmissions[trackSlug] = true;
  p.lastStudy = new Date().toISOString();
  save(p);
}

export function hasFinalTestSubmission(trackSlug: string): boolean {
  return Boolean(load().finalTestSubmissions[trackSlug]);
}

export function recordQuizBest(trackSlug: string, score: number, max: number) {
  const p = load();
  const key = trackSlug;
  const prev = p.quizBestScores[key] ?? 0;
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;
  p.quizBestScores[key] = Math.max(prev, pct);
  p.lastStudy = new Date().toISOString();
  save(p);
}

export function toggleFlashKnown(trackSlug: string, cardId: string) {
  const p = load();
  const set = new Set(p.flashKnown[trackSlug] ?? []);
  if (set.has(cardId)) set.delete(cardId);
  else set.add(cardId);
  p.flashKnown[trackSlug] = [...set];
  p.lastStudy = new Date().toISOString();
  save(p);
}

export function isFlashKnown(trackSlug: string, cardId: string): boolean {
  const p = load();
  return (p.flashKnown[trackSlug] ?? []).includes(cardId);
}

export function exportProgressJson(): string {
  return JSON.stringify(load(), null, 2);
}

export function importProgressJson(json: string): boolean {
  try {
    const p = JSON.parse(json) as ProgressState;
    if (typeof p !== "object" || p === null) return false;
    save({
      quizBestScores: p.quizBestScores ?? {},
      flashKnown: p.flashKnown ?? {},
      unlocked: p.unlocked ?? {},
      finalTestSubmissions: p.finalTestSubmissions ?? {},
      lastStudy: p.lastStudy ?? null,
    });
    return true;
  } catch {
    return false;
  }
}

export function downloadStudyIcs(trackTitle: string): void {
  const start = new Date();
  start.setMinutes(start.getMinutes() + 5);
  const end = new Date(start.getTime() + 25 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SkillWrite//EN",
    "BEGIN:VEVENT",
    `UID:${uid}@skillwrite.local`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:Study — ${trackTitle.replace(/,/g, "\\,")}`,
    "DESCRIPTION:Revision block (quiz + flashcards + match game).",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "study-block.ics";
  a.click();
  URL.revokeObjectURL(url);
}
