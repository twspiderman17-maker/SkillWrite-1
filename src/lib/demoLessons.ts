import type { CourseLesson, Program, Track } from "../types";
import { compareCourseLessons } from "./lessonNav";
import { hasLessonAccess } from "./progress";

/** First lesson in a program (week order) — used as the free preview for Graduate only. */
export function getFirstLessonForProgram(track: Track, program: Program): CourseLesson | undefined {
  const lessons = track.course?.lessons.filter((l) => l.program === program) ?? [];
  if (!lessons.length) return undefined;
  return [...lessons].sort(compareCourseLessons)[0];
}

/** Week-one Graduate lesson is free on every paid course so buyers can preview quality. */
export function getDemoLesson(track: Track): CourseLesson | undefined {
  return getFirstLessonForProgram(track, "graduate");
}

export function getDemoLessonPath(track: Track): string | undefined {
  const lesson = getDemoLesson(track);
  if (!lesson) return undefined;
  return `/courses/${track.slug}/lessons/${lesson.id}`;
}

export function isDemoLesson(track: Track, lesson: CourseLesson): boolean {
  const demo = getDemoLesson(track);
  return demo?.id === lesson.id;
}

export function canAccessLesson(track: Track, lesson: CourseLesson): boolean {
  if (isDemoLesson(track, lesson)) return true;
  return hasLessonAccess(track.slug, lesson.program);
}
