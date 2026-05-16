import type { CourseLesson } from "../types";

/** Verified public YouTube IDs used for lesson embeds (titles for UI only). */
export type CuratedLessonVideo = {
  youtubeId: string;
  title: string;
  channel: string;
};

const VIDEOS = {
  llmIntro: {
    youtubeId: "zjkBMFhNj_g",
    title: "[1hr Talk] Intro to Large Language Models",
    channel: "Andrej Karpathy",
  },
  aiStudio: {
    youtubeId: "Mw8JDKV0Wxg",
    title: "Google AI Studio in 22 Minutes",
    channel: "Google Cloud Tech",
  },
  vertexPrompts: {
    youtubeId: "FSGkKHbveWA",
    title: "Accelerating generative AI with Vertex AI Studio",
    channel: "Google Cloud Tech",
  },
  promptDesign: {
    youtubeId: "MIcTnpyGQ5Q",
    title: "Generative AI with Vertex AI: Prompt Design",
    channel: "Google Cloud Tech",
  },
  plainLanguageWeb: {
    youtubeId: "BB7oznnz3lQ",
    title: "Plain Language — Writing for the Web",
    channel: "DigitalGov (US government)",
  },
  plainLanguageLegal: {
    youtubeId: "u5ZeUFI5VVY",
    title: "Justice without Jargon: Plain Language Writing",
    channel: "Illinois Legal Aid Online",
  },
  gdprIntro: {
    youtubeId: "OwEC-PEbG3o",
    title: "Getting started with GDPR compliance: Introduction to the GDPR",
    channel: "OneTrust",
  },
  hallucinations: {
    youtubeId: "cfqtFvWOfg0",
    title: "Why Large Language Models Hallucinate",
    channel: "IBM Technology",
  },
  reduceHallucinations: {
    youtubeId: "ZFKvTIADp0k",
    title: "Tuning Your AI Model to Reduce Hallucinations",
    channel: "IBM Technology",
  },
} as const satisfies Record<string, CuratedLessonVideo>;

const FALLBACK_ROTATION: CuratedLessonVideo[] = [
  VIDEOS.llmIntro,
  VIDEOS.aiStudio,
  VIDEOS.vertexPrompts,
  VIDEOS.promptDesign,
  VIDEOS.hallucinations,
];

function hashLessonId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h << 5) - h + id.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function matchThematicVideo(lesson: CourseLesson): CuratedLessonVideo | null {
  const blob = `${lesson.id} ${lesson.title} ${lesson.description}`.toLowerCase();

  if (
    /privacy|gdpr|redact|minimi|data minim|tool-rule|approved-tool|sensitive|pii|personal data/.test(blob)
  ) {
    return VIDEOS.gdprIntro;
  }
  if (/customer|tone|message|handover|communication|neutral language|plain language|jargon|policy-safe/.test(blob)) {
    if (/legal|court|liability|policy|escalation|risk/.test(blob)) {
      return VIDEOS.plainLanguageLegal;
    }
    return VIDEOS.plainLanguageWeb;
  }
  if (/error|hallucin|quality|sampling|taxonomy|correction|evidence|review checklist|fact|unknown/.test(blob)) {
    return /correction|tuning|improve|template test|scenario/.test(blob) ? VIDEOS.reduceHallucinations : VIDEOS.hallucinations;
  }
  if (/prompt|example|output|template|studio|vertex|format|governance|documentation/.test(blob)) {
    if (/vertex|studio|accelerat|metric|volume|queue/.test(blob)) {
      return VIDEOS.vertexPrompts;
    }
    if (/example|few-shot|format|output control/.test(blob)) {
      return VIDEOS.promptDesign;
    }
    return VIDEOS.aiStudio;
  }
  if (/ai basics|foundations|intro|large language|what ai/.test(blob)) {
    return VIDEOS.llmIntro;
  }
  if (/rollout|change management|training|team|coach|manager/.test(blob)) {
    return VIDEOS.vertexPrompts;
  }
  return null;
}

/** Picks a real YouTube video for the lesson: explicit fields win, then thematic match, then stable rotation. */
export function resolveLessonVideo(lesson: CourseLesson): CuratedLessonVideo {
  if (lesson.youtubeVideoId?.trim()) {
    return {
      youtubeId: lesson.youtubeVideoId.trim(),
      title: lesson.youtubeVideoTitle?.trim() || "Lesson video",
      channel: lesson.youtubeChannel?.trim() || "YouTube",
    };
  }
  const thematic = matchThematicVideo(lesson);
  if (thematic) return thematic;
  const idx = hashLessonId(lesson.id) % FALLBACK_ROTATION.length;
  return FALLBACK_ROTATION[idx]!;
}

export function youtubeEmbedUrl(youtubeId: string, opts?: { startSeconds?: number; endSeconds?: number }): string {
  const params = new URLSearchParams({ rel: "0" });
  if (opts?.startSeconds != null) params.set("start", String(Math.max(0, Math.floor(opts.startSeconds))));
  if (opts?.endSeconds != null) params.set("end", String(Math.max(0, Math.floor(opts.endSeconds))));
  const q = params.toString();
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}${q ? `?${q}` : ""}`;
}

/** Embed URL for a lesson (uses resolved video id + optional segment bounds on the lesson). */
export function youtubeLessonEmbedSrc(lesson: CourseLesson): string {
  const v = resolveLessonVideo(lesson);
  return youtubeEmbedUrl(v.youtubeId, {
    startSeconds: lesson.youtubeStartSeconds,
    endSeconds: lesson.youtubeEndSeconds,
  });
}

export function youtubeWatchUrl(youtubeId: string, startSeconds?: number): string {
  const base = `https://www.youtube.com/watch?v=${encodeURIComponent(youtubeId)}`;
  if (startSeconds == null || Number.isNaN(startSeconds)) return base;
  return `${base}&t=${Math.max(0, Math.floor(startSeconds))}s`;
}
