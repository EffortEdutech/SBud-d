import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import { PlkgRepository } from "./plkg.repository.js";

const subjectNodeRow = {
  confidence_level: 30,
  created_at: "2026-07-14T00:00:00.000Z",
  description: "Programming subject node.",
  id: "plkg-subject-1",
  label: "Programming Fundamentals",
  learning_status: "learning",
  mastery_score: 30,
  source_id: "subject-1",
  source_type: "academic_profile",
  student_id: "student-1",
  subject_id: "subject-1",
  type: "subject",
  updated_at: "2026-07-14T00:00:00.000Z",
};

const conceptNodeRow = {
  confidence_level: 20,
  created_at: "2026-07-14T00:01:00.000Z",
  description: "Recursion concept.",
  id: "plkg-concept-1",
  label: "Recursion",
  learning_status: "needs_review",
  mastery_score: 18,
  source_id: "document-1",
  source_type: "document",
  student_id: "student-1",
  subject_id: "subject-1",
  type: "concept",
  updated_at: "2026-07-14T00:01:00.000Z",
};

const edgeRow = {
  created_at: "2026-07-14T00:02:00.000Z",
  id: "plkg-edge-1",
  label: "Programming contains recursion.",
  source_node_id: "plkg-subject-1",
  strength: 0.8,
  student_id: "student-1",
  target_node_id: "plkg-concept-1",
  type: "contains",
};

const activityNodeRow = {
  confidence_level: 10,
  created_at: "2026-07-14T00:03:00.000Z",
  description: "Student asked for a recursion example.",
  id: "plkg-activity-1",
  label: "Asked BLIE about recursion",
  learning_status: "introduced",
  mastery_score: 10,
  source_id: "blie-test",
  source_type: "blie_interaction",
  student_id: "student-1",
  subject_id: "subject-1",
  type: "learning_activity",
  updated_at: "2026-07-14T00:03:00.000Z",
};

function createPlkgClient(results: Record<string, unknown>): SupabaseClient {
  let lastTableName = "";

  return {
    from(tableName: string) {
      lastTableName = tableName;
      const chain = {
        eq: () => chain,
        insert: () => chain,
        maybeSingle: async () => ({ data: subjectNodeRow, error: null }),
        order: async () => ({ data: results[lastTableName], error: null }),
        select: () => chain,
        single: async () => ({ data: activityNodeRow, error: null }),
      };

      return chain;
    },
  } as unknown as SupabaseClient;
}

describe("PlkgRepository", () => {
  it("maps Supabase nodes and edges into a PLKG summary", async () => {
    const repository = new PlkgRepository(
      {
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      },
      () =>
        createPlkgClient({
          plkg_edges: [edgeRow],
          plkg_nodes: [subjectNodeRow, conceptNodeRow],
        }),
    );

    const summary = await repository.getSummary({
      accessToken: "token",
      studentId: "student-1",
    });

    expect(summary).toMatchObject({
      averageMasteryScore: 24,
      edgeCount: 1,
      nodeCount: 2,
      studentId: "student-1",
    });
    expect(summary.knowledgeGaps[0]?.label).toBe("Recursion");
    expect(summary.nodes[0]).toMatchObject({
      id: "plkg-subject-1",
      label: "Programming Fundamentals",
      type: "subject",
    });
    expect(summary.edges[0]).toMatchObject({
      sourceNodeId: "plkg-subject-1",
      targetNodeId: "plkg-concept-1",
    });
  });

  it("creates a learning activity node and links it to the subject node", async () => {
    const repository = new PlkgRepository(
      {
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      },
      () => createPlkgClient({}),
    );

    const node = await repository.addLearningActivity(
      {
        description: "Student asked for a recursion example.",
        label: "Asked BLIE about recursion",
        sourceId: "blie-test",
        subjectId: "subject-1",
      },
      {
        accessToken: "token",
        studentId: "student-1",
      },
    );

    expect(node).toMatchObject({
      id: "plkg-activity-1",
      label: "Asked BLIE about recursion",
      sourceType: "blie_interaction",
      studentId: "student-1",
      type: "learning_activity",
    });
  });
});
