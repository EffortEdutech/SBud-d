import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import { DocumentRepository } from "./document.repository.js";

const documentRow = {
  concept_count: 2,
  created_at: "2026-07-14T00:00:00.000Z",
  file_name: "lecture-1.pdf",
  file_size_bytes: 1024,
  id: "document-1",
  kind: "pdf",
  mime_type: "application/pdf",
  processing_error_message: null,
  processing_label: "Document received.",
  processing_progress_percent: 10,
  processing_status: "uploaded",
  storage_bucket: "student-documents",
  storage_path: "student-1/subject-1/document-1/lecture-1.pdf",
  student_id: "student-1",
  subject_id: "subject-1",
  summary: null,
  title: "Lecture 1",
  topic_label: "Intro",
  updated_at: "2026-07-14T00:00:00.000Z",
};

function createDocumentClient(results: Record<string, unknown>): SupabaseClient {
  return {
    from(tableName: string) {
      const result = results[tableName];
      const chain = {
        eq: () => chain,
        in: async () => ({ data: result, error: null }),
        insert: () => chain,
        maybeSingle: async () => ({ data: result, error: null }),
        order: async () => ({ data: result, error: null }),
        select: () => chain,
        single: async () => ({ data: result, error: null }),
      };

      return chain;
    },
  } as unknown as SupabaseClient;
}

describe("DocumentRepository", () => {
  it("maps Supabase document rows with subject names", async () => {
    const repository = new DocumentRepository(
      {
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      },
      () =>
        createDocumentClient({
          academic_subjects: [{ id: "subject-1", name: "Programming Fundamentals" }],
          learning_documents: [documentRow],
        }),
    );

    const documents = await repository.listDocuments({
      accessToken: "token",
      studentId: "student-1",
    });

    expect(documents).toEqual([
      {
        conceptCount: 2,
        createdAt: "2026-07-14T00:00:00.000Z",
        fileName: "lecture-1.pdf",
        fileSizeBytes: 1024,
        id: "document-1",
        kind: "pdf",
        mimeType: "application/pdf",
        processing: {
          errorMessage: null,
          label: "Document received.",
          progressPercent: 10,
          status: "uploaded",
          updatedAt: "2026-07-14T00:00:00.000Z",
        },
        storageBucket: "student-documents",
        storagePath: "student-1/subject-1/document-1/lecture-1.pdf",
        studentId: "student-1",
        subjectId: "subject-1",
        subjectName: "Programming Fundamentals",
        summary: null,
        title: "Lecture 1",
        topicLabel: "Intro",
      },
    ]);
  });

  it("creates Supabase metadata using student-owned storage path", async () => {
    const repository = new DocumentRepository(
      {
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      },
      () =>
        createDocumentClient({
          academic_subjects: [{ id: "subject-1", name: "Programming Fundamentals" }],
          learning_documents: documentRow,
        }),
    );

    const document = await repository.createDocument(
      {
        fileName: "lecture 1.pdf",
        fileSizeBytes: 1024,
        mimeType: "application/pdf",
        subjectId: "subject-1",
        title: "Lecture 1",
        topicLabel: "Intro",
      },
      {
        accessToken: "token",
        studentId: "student-1",
      },
    );

    expect(document.studentId).toBe("student-1");
    expect(document.storagePath).toBe("student-1/subject-1/document-1/lecture-1.pdf");
  });
});
