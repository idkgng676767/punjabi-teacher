export type LessonStage = "learn" | "recognize" | "write" | "quiz";

export interface Letter {
  character: string;
  name: string;
  pronunciation: string;
  order: number;
}
