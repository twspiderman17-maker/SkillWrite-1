export type Program = "graduate" | "masters";
export type PurchaseTier = Program | "certificate";

export type WeekModule = {
  week: number;
  title: string;
  bullets: string[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explain: string;
};

export type Flashcard = { id: string; front: string; back: string };

export type MatchPair = { id: string; term: string; definition: string };

export type LessonBlock = {
  heading: string;
  body: string;
};

export type CourseLesson = {
  id: string;
  program: Program;
  week: number;
  title: string;
  description: string;
  durationMinutes: number;
  outcomes: string[];
  blocks: LessonBlock[];
  promptTemplate: string;
  workplaceChecklist: string[];
  practiceTask: string;
  miniTest?: QuizQuestion[];
  /** When set, this exact video is embedded. Otherwise a curated public video is chosen automatically. */
  youtubeVideoId?: string;
  youtubeVideoTitle?: string;
  youtubeChannel?: string;
  /** Inclusive start time (seconds) for the embedded segment. */
  youtubeStartSeconds?: number;
  /** Inclusive end time (seconds) for the embedded segment (YouTube iframe `end` param). */
  youtubeEndSeconds?: number;
  /** What to focus on inside the segment (shown next to the player). */
  videoSegmentLabel?: string;
};

export type PaidPlan = {
  program: Program;
  name: string;
  priceUsd: number;
  durationLabel: string;
  description: string;
  includes: string[];
};

export type CertificateTest = {
  priceUsd: number;
  title: string;
  description: string;
  tasks: string[];
  rubric: { label: string; passCriteria: string }[];
};

export type PaidCourse = {
  plans: Record<Program, PaidPlan>;
  certificate: CertificateTest;
  lessons: CourseLesson[];
};

export type Track = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  audience: string;
  disclaimer: string;
  graduate: {
    durationWeeks: 4;
    summary: string;
    weeks: WeekModule[];
    capstone: string;
  };
  masters: {
    durationWeeks: 12;
    summary: string;
    extraThemes: string[];
    weeks: WeekModule[];
    capstone: string;
  };
  quizzes: QuizQuestion[];
  flashcards: Flashcard[];
  matchPairs: MatchPair[];
  course?: PaidCourse;
};
