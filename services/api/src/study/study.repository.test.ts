import type { PlkgSummary } from "@sbud-d/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import { StudyRepository } from "./study.repository.js";

const subjectRow = {
  code: "CS101",
  created_at: "2026-07-15T00:00:00.000Z",
  credit_hours: 3,
  current_topic: "Recursion",
  id: "subject-1",
  learning_status: "Needs recursion practice",
  lecturer_name: null,
  name: "Programming Fundamentals",
  progress_percent: 20,
  semester_id: "semester-1",
  status: "active",
  student_id: "student-1",
  updated_at: "2026-07-15T00:00:00.000Z",
};

const plkgSummary: PlkgSummary = {
  averageMasteryScore: 18,
  edgeCount: 0,
  edges: [],
  growthLabel: "1 knowledge nodes connected by 0 relationships",
  knowledgeGaps: [],
  nodeCount: 1,
  nodes: [
    {
      confidenceLevel: 15,
      createdAt: "2026-07-15T00:00:00.000Z",
      description: "Recursion needs more practice.",
      id: "plkg-node-1",
      label: "Recursion",
      learningStatus: "needs_review",
      masteryScore: 18,
      sourceId: "document-1",
      sourceType: "document",
      studentId: "student-1",
      subjectId: "subject-1",
      type: "concept",
      updatedAt: "2026-07-15T00:00:00.000Z",
    },
  ],
  statusLabel: "New Student",
  studentId: "student-1",
};

const revisionRow = {
  created_at: "2026-07-15T00:00:00.000Z",
  due_label: "Today",
  flashcards: [
    {
      back: "A recursive function calls itself with a smaller problem.",
      front: "What is recursion?",
      id: "flashcard-1",
      linkedPlkgNodeIds: ["plkg-node-1"],
    },
  ],
  id: "study-revision-plkg-node-1",
  mastery_score: 18,
  priority_label: "high",
  quiz_questions: [
    {
      answer: "Name base case and recursive case.",
      explanation: "This checks conceptual structure.",
      id: "quiz-1",
      linkedPlkgNodeIds: ["plkg-node-1"],
      prompt: "Explain recursion.",
    },
  ],
  recommended_action: "Review Recursion, answer one practice question, then record confidence.",
  status: "needs_support",
  student_id: "student-1",
  subject_id: "subject-1",
  topic_label: "Recursion",
  trace: {
    plkgNodeIds: ["plkg-node-1"],
    reason: "Revision item generated from PLKG status, mastery score, and knowledge gap priority.",
    subjectId: "subject-1",
  },
  updated_at: "2026-07-15T00:00:00.000Z",
};

function createStudyClient(options: {
  preparationRows?: unknown[];
  revisionRows?: unknown[];
  updatedRevisionRow?: unknown;
}): SupabaseClient {
  return {
    from(tableName: string) {
      let operation: "insert" | "update" | null = null;
      let payload: unknown = null;

      const chain = {
        eq: () => chain,
        insert: (nextPayload: unknown) => {
          operation = "insert";
          payload = nextPayload;
          return chain;
        },
        maybeSingle: async () => ({
          data: options.updatedRevisionRow ?? revisionRow,
          error: null,
        }),
        order: async () => {
          if (operation === "insert") {
            const rows = Array.isArray(payload) ? payload : [payload];
            const data = rows.map((row, index) => {
              const generatedId =
                tableName === "study_preparation_plans"
                  ? `study-preparation-${index + 1}`
                  : `study-revision-${index + 1}`;

              return {
                created_at: "2026-07-15T00:00:00.000Z",
                id: generatedId,
                updated_at: "2026-07-15T00:00:00.000Z",
                ...(row as Record<string, unknown>),
              };
            });

            return { data, error: null };
          }

          if (tableName === "academic_subjects") {
            return { data: [subjectRow], error: null };
          }

          if (tableName === "study_preparation_plans") {
            return { data: options.preparationRows ?? [], error: null };
          }

          return { data: options.revisionRows ?? [], error: null };
        },
        select: () => chain,
        update: (nextPayload: unknown) => {
          operation = "update";
          payload = nextPayload;
          return chain;
        },
      };

      return chain;
    },
  } as unknown as SupabaseClient;
}

describe("StudyRepository", () => {
  it("seeds Supabase preparation and revision rows from subjects and PLKG context", async () => {
    const repository = new StudyRepository(
      { getSummary: async () => plkgSummary } as never,
      {
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      },
      () => createStudyClient({}),
    );

    const summary = await repository.getSummary({
      accessToken: "token",
      studentId: "student-1",
    });

    expect(summary.studentId).toBe("student-1");
    expect(summary.preparationPlans[0]).toMatchObject({
      subjectId: "subject-1",
      subjectName: "Programming Fundamentals",
      topicLabel: "Recursion",
    });
    expect(summary.revisionItems[0]).toMatchObject({
      status: "needs_support",
      subjectId: "subject-1",
      topicLabel: "Recursion",
    });
  });

  it("updates a Supabase revision item when reflection confidence is recorded", async () => {
    const repository = new StudyRepository(
      { getSummary: async () => plkgSummary } as never,
      {
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      },
      () =>
        createStudyClient({
          updatedRevisionRow: {
            ...revisionRow,
            recommended_action: "Keep this concept in light weekly review.",
            status: "completed",
            updated_at: "2026-07-15T00:05:00.000Z",
          },
        }),
    );

    const revisionItem = await repository.recordReflection(
      {
        confidenceLevel: 80,
        reflection: "I can explain recursion now.",
        revisionItemId: "study-revision-plkg-node-1",
      },
      {
        accessToken: "token",
        studentId: "student-1",
      },
    );

    expect(revisionItem).toMatchObject({
      recommendedAction: "Keep this concept in light weekly review.",
      status: "completed",
      subjectName: "Programming Fundamentals",
    });
  });
});
