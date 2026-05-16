import type { CourseLesson } from "../../types";
import { compareCourseLessons } from "../../lib/lessonNav";

export type VideoSegment = { start: number; end: number; label: string };

/** Curated public videos + non-overlapping segment ladders (seconds). */
const VIDEO_META: Record<string, { title: string; channel: string }> = {
  zjkBMFhNj_g: { title: "[1hr Talk] Intro to Large Language Models", channel: "Andrej Karpathy" },
  Mw8JDKV0Wxg: { title: "Google AI Studio in 22 Minutes", channel: "Google Cloud Tech" },
  MIcTnpyGQ5Q: { title: "Generative AI with Vertex AI: Prompt Design", channel: "Google Cloud Tech" },
  FSGkKHbveWA: { title: "Accelerating generative AI with Vertex AI Studio", channel: "Google Cloud Tech" },
  cfqtFvWOfg0: { title: "Why Large Language Models Hallucinate", channel: "IBM Technology" },
  ZFKvTIADp0k: { title: "Tuning Your AI Model to Reduce Hallucinations", channel: "IBM Technology" },
  BB7oznnz3lQ: { title: "Plain Language — Writing for the Web", channel: "DigitalGov (US government)" },
  u5ZeUFI5VVY: { title: "Justice without Jargon: Plain Language Writing", channel: "Illinois Legal Aid Online" },
  "OwEC-PEbG3o": { title: "Getting started with GDPR compliance: Introduction to the GDPR", channel: "OneTrust" },
};

const SEGMENT_LADDERS: Record<string, VideoSegment[]> = {
  zjkBMFhNj_g: [
    { start: 0, end: 600, label: "0:00–10:00 — what an LLM is (high level)" },
    { start: 600, end: 1200, label: "10:00–20:00 — inference and limitations mindset" },
    { start: 1200, end: 1800, label: "20:00–30:00 — security / misuse angles relevant to workplace tools" },
    { start: 1800, end: 2400, label: "30:00–40:00 — tooling and practical guardrails" },
    { start: 2400, end: 3000, label: "40:00–50:00 — where models fail in real workflows" },
    { start: 3000, end: 3600, label: "50:00–60:00 — wrap-up themes you can apply in prompts" },
  ],
  Mw8JDKV0Wxg: [
    { start: 0, end: 420, label: "0:00–7:00 — AI Studio tour and prompt iteration loop" },
    { start: 420, end: 900, label: "7:00–15:00 — comparing outputs and tightening instructions" },
    { start: 900, end: 1320, label: "15:00–22:00 — grounding and evaluation habits" },
  ],
  MIcTnpyGQ5Q: [
    { start: 0, end: 600, label: "0:00–10:00 — prompt design patterns (zero/one/few shot framing)" },
    { start: 600, end: 1200, label: "10:00–20:00 — specificity and constraints" },
    { start: 1200, end: 1800, label: "20:00–30:00 — formatting outputs for handoffs" },
  ],
  FSGkKHbveWA: [
    { start: 0, end: 540, label: "0:00–9:00 — prompt lifecycle in a studio environment" },
    { start: 540, end: 1080, label: "9:00–18:00 — evaluation and iteration loops" },
    { start: 1080, end: 1560, label: "18:00–26:00 — moving from prototype to repeatable workflow" },
  ],
  cfqtFvWOfg0: [
    { start: 0, end: 300, label: "0:00–5:00 — what “hallucination” means in practice" },
    { start: 300, end: 600, label: "5:00–10:00 — categories of failure" },
  ],
  ZFKvTIADp0k: [
    { start: 0, end: 300, label: "0:00–5:00 — prompting to reduce confident mistakes" },
    { start: 300, end: 600, label: "5:00–10:00 — grounding and review habits" },
  ],
  BB7oznnz3lQ: [
    { start: 0, end: 900, label: "0:00–15:00 — plain language principles" },
    { start: 900, end: 1800, label: "15:00–30:00 — structure for scanning and comprehension" },
    { start: 1800, end: 2700, label: "30:00–45:00 — editing dense text into clear updates" },
  ],
  u5ZeUFI5VVY: [
    { start: 0, end: 900, label: "0:00–15:00 — removing jargon without losing meaning" },
    { start: 900, end: 1800, label: "15:00–30:00 — neutral, factual tone for sensitive topics" },
  ],
  "OwEC-PEbG3o": [
    { start: 0, end: 240, label: "0:00–4:00 — GDPR principles overview" },
    { start: 240, end: 480, label: "4:00–8:00 — minimisation and purpose limitation" },
  ],
};

const VIDEO_POOL = Object.keys(VIDEO_META);

function ladderFor(id: string): VideoSegment[] {
  return SEGMENT_LADDERS[id] ?? [
    { start: 0, end: 600, label: "0:00–10:00 — focused segment" },
    { start: 600, end: 1200, label: "10:00–20:00 — next segment" },
    { start: 1200, end: 1800, label: "20:00–30:00 — next segment" },
  ];
}

function lessonOrder(a: CourseLesson, b: CourseLesson): number {
  return compareCourseLessons(a, b);
}

function nextAvailableVideo(segIdx: Map<string, number>, startIndex: number): string {
  for (let k = 0; k < VIDEO_POOL.length; k += 1) {
    const id = VIDEO_POOL[(startIndex + k) % VIDEO_POOL.length]!;
    const idx = segIdx.get(id) ?? 0;
    if (idx < ladderFor(id).length) return id;
  }
  return VIDEO_POOL[startIndex % VIDEO_POOL.length]!;
}

/**
 * Assigns non-overlapping segments per video id in stable lesson order.
 * Preserves original `lessons` array order in the returned array.
 */
export function allocateLessonVideos(lessons: CourseLesson[]): CourseLesson[] {
  const sorted = [...lessons].sort(lessonOrder);
  const segIdx = new Map<string, number>();
  const byId = new Map<string, CourseLesson>();

  sorted.forEach((lesson, i) => {
    if (
      lesson.youtubeStartSeconds != null &&
      lesson.youtubeEndSeconds != null &&
      lesson.videoSegmentLabel?.trim()
    ) {
      byId.set(lesson.id, lesson);
      return;
    }

    let vid = lesson.youtubeVideoId?.trim();
    if (!vid) {
      vid = nextAvailableVideo(segIdx, i);
    }

    let idx = segIdx.get(vid) ?? 0;
    let ladder = ladderFor(vid);
    if (idx >= ladder.length) {
      vid = nextAvailableVideo(segIdx, i + VIDEO_POOL.length);
      idx = segIdx.get(vid) ?? 0;
      ladder = ladderFor(vid);
    }

    const seg = ladder[Math.min(idx, ladder.length - 1)]!;
    segIdx.set(vid, idx + 1);

    const meta = VIDEO_META[vid] ?? { title: "Lesson video", channel: "YouTube" };

    byId.set(lesson.id, {
      ...lesson,
      youtubeVideoId: vid,
      youtubeVideoTitle: lesson.youtubeVideoTitle?.trim() || meta.title,
      youtubeChannel: lesson.youtubeChannel?.trim() || meta.channel,
      youtubeStartSeconds: seg.start,
      youtubeEndSeconds: seg.end,
      videoSegmentLabel: seg.label,
    });
  });

  return lessons.map((l) => {
    const u = byId.get(l.id);
    return u ?? l;
  });
}
