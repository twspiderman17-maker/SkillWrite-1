import type { CourseLesson, Track } from "../types";

/** Same ordering as course lesson lists: graduate first, then masters; week; stable id. */
export function compareCourseLessons(a: CourseLesson, b: CourseLesson): number {
  if (a.program !== b.program) return a.program === "graduate" ? -1 : 1;
  if (a.week !== b.week) return a.week - b.week;
  return a.title.localeCompare(b.title);
}

export function orderedCourseLessons(track: Track): CourseLesson[] {
  const lessons = track.course?.lessons;
  if (!lessons?.length) return [];
  return [...lessons].sort(compareCourseLessons);
}

export function adjacentLessons(track: Track, lessonId: string): { prev?: CourseLesson; next?: CourseLesson } {
  const ordered = orderedCourseLessons(track);
  const idx = ordered.findIndex((l) => l.id === lessonId);
  if (idx < 0) return {};
  return {
    prev: idx > 0 ? ordered[idx - 1] : undefined,
    next: idx < ordered.length - 1 ? ordered[idx + 1] : undefined,
  };
}

export function isLastLessonInProgram(track: Track, lesson: CourseLesson): boolean {
  const ordered = orderedCourseLessons(track).filter((l) => l.program === lesson.program);
  if (!ordered.length) return false;
  return ordered[ordered.length - 1]!.id === lesson.id;
}
