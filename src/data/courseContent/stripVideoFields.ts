import type { CourseLesson } from "../../types";

/** Clears video fields so `allocateLessonVideos` can assign segments consistently. */
export function stripVideoFields(lesson: CourseLesson): CourseLesson {
  const l = { ...lesson };
  delete l.youtubeVideoId;
  delete l.youtubeVideoTitle;
  delete l.youtubeChannel;
  delete l.youtubeStartSeconds;
  delete l.youtubeEndSeconds;
  delete l.videoSegmentLabel;
  return l;
}
