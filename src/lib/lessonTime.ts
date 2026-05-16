import type { CourseLesson } from "../types";

const DEFAULT_SEGMENT_MINUTES = 12;
const READING_MINUTES = 18;
const EXERCISE_MINUTES = 14;
const QUIZ_MINUTES = 8;
const MIN_GUIDED = 45;
const MAX_GUIDED = 180;

function segmentWatchMinutes(lesson: CourseLesson): number {
  const start = lesson.youtubeStartSeconds;
  const end = lesson.youtubeEndSeconds;
  if (start != null && end != null && end > start) {
    return (end - start) / 60;
  }
  return DEFAULT_SEGMENT_MINUTES;
}

/** Guided time: assigned video segment + reading + exercises + mini test, clamped. */
export function guidedLessonMinutes(lesson: CourseLesson): number {
  const segmentMinutes = segmentWatchMinutes(lesson);
  const raw = segmentMinutes + READING_MINUTES + EXERCISE_MINUTES + QUIZ_MINUTES;
  return Math.round(Math.min(MAX_GUIDED, Math.max(MIN_GUIDED, raw)));
}
