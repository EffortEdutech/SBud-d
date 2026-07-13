export type StudyReadinessStatus = "not_started" | "preparing" | "ready" | "needs_support";

export type StudyPreparationState = "upcoming" | "preparing" | "learning" | "revising" | "mastered";

export type StudyRevisionStatus = "queued" | "in_progress" | "completed" | "needs_support";

export type StudyActivityKind = "concept_review" | "practice" | "reflection" | "flashcard" | "quiz";

export interface StudyRecommendationTrace {
  subjectId: string;
  plkgNodeIds: string[];
  reason: string;
}

export interface StudyPreparationTask {
  id: string;
  kind: StudyActivityKind;
  title: string;
  guidance: string;
  estimatedMinutes: number;
  linkedPlkgNodeIds: string[];
}

export interface StudyPreparationPlan {
  id: string;
  studentId: string;
  subjectId: string;
  subjectName: string;
  topicLabel: string;
  readinessStatus: StudyReadinessStatus;
  state: StudyPreparationState;
  prerequisiteLabels: string[];
  learningOutcomes: string[];
  tasks: StudyPreparationTask[];
  trace: StudyRecommendationTrace;
  createdAt: string;
  updatedAt: string;
}

export interface StudyFlashcard {
  id: string;
  front: string;
  back: string;
  linkedPlkgNodeIds: string[];
}

export interface StudyQuizQuestion {
  id: string;
  prompt: string;
  answer: string;
  explanation: string;
  linkedPlkgNodeIds: string[];
}

export interface StudyRevisionItem {
  id: string;
  studentId: string;
  subjectId: string;
  subjectName: string;
  topicLabel: string;
  status: StudyRevisionStatus;
  priorityLabel: "low" | "medium" | "high";
  masteryScore: number;
  dueLabel: string;
  recommendedAction: string;
  flashcards: StudyFlashcard[];
  quizQuestions: StudyQuizQuestion[];
  trace: StudyRecommendationTrace;
  createdAt: string;
  updatedAt: string;
}

export interface StudySummary {
  studentId: string;
  preparationReadinessLabel: string;
  revisionProgressLabel: string;
  recommendedFocusLabel: string;
  preparationPlans: StudyPreparationPlan[];
  revisionItems: StudyRevisionItem[];
}

export interface CreateStudyReflectionInput {
  revisionItemId: string;
  confidenceLevel: number;
  reflection: string;
}
