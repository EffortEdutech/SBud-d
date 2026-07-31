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
  extracted_concepts: [],
  extracted_text: null,
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

function createDocumentClient(
  results: Record<string, unknown>,
  storageFailure: Error | null = null,
  downloadedBytes = Buffer.from("%PDF-1.4\nBaseline extraction text\n%%EOF"),
): SupabaseClient {
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
        update: () => chain,
      };

      return chain;
    },
    storage: {
      from: () => ({
        download: async () => ({
          data: new Blob([downloadedBytes], { type: "application/pdf" }),
          error: storageFailure,
        }),
        remove: async () => ({ data: [], error: null }),
        upload: async () => ({
          data: { path: "student-1/subject-1/document-1/lecture-1.pdf" },
          error: storageFailure,
        }),
      }),
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
        extractedConcepts: [],
        extractedText: null,
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

  it("uploads Supabase file bytes before creating extraction-pending metadata", async () => {
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
          learning_documents: {
            ...documentRow,
            processing_label: "PDF uploaded. Waiting for text extraction.",
            processing_progress_percent: 20,
            processing_status: "processing",
          },
        }),
    );

    const document = await repository.uploadDocument(
      {
        fileBytes: Buffer.from("%PDF-1.4\n%%EOF"),
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

    expect(document.processing).toMatchObject({
      label: "PDF uploaded. Waiting for text extraction.",
      progressPercent: 20,
      status: "processing",
    });
  });

  it("does not create Supabase metadata when storage upload fails", async () => {
    const repository = new DocumentRepository(
      {
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      },
      () =>
        createDocumentClient(
          {
            academic_subjects: [{ id: "subject-1", name: "Programming Fundamentals" }],
            learning_documents: documentRow,
          },
          new Error("Storage upload failed"),
        ),
    );

    await expect(
      repository.uploadDocument(
        {
          fileBytes: Buffer.from("%PDF-1.4\n%%EOF"),
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
      ),
    ).rejects.toThrow("Storage upload failed");
  });

  it("extracts Supabase PDF text from stored file bytes", async () => {
    const repository = new DocumentRepository(
      {
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      },
      () =>
        createDocumentClient(
          {
            academic_subjects: [{ id: "subject-1", name: "Programming Fundamentals" }],
            learning_documents: {
              ...documentRow,
              extracted_text: "Baseline extraction text",
              extracted_concepts: [],
              processing_label: "Readable text extracted. Ready for concept extraction.",
              processing_progress_percent: 45,
              processing_status: "understanding",
              summary: "Baseline extraction text",
            },
          },
          null,
          Buffer.from("%PDF-1.4\nBaseline extraction text\n%%EOF"),
        ),
    );

    const document = await repository.extractDocumentText("document-1", {
      accessToken: "token",
      studentId: "student-1",
    });

    expect(document?.extractedText).toBe("Baseline extraction text");
    expect(document?.processing).toMatchObject({
      label: "Readable text extracted. Ready for concept extraction.",
      progressPercent: 45,
      status: "understanding",
    });
  });

  it("stores extracted concepts after PLKG enrichment", async () => {
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
          learning_documents: {
            ...documentRow,
            concept_count: 1,
            extracted_concepts: [
              {
                confidence: 82,
                description: "Recursion was identified from the uploaded learning material.",
                label: "Recursion",
                sourceSnippet: "Recursion breaks problems into smaller steps.",
              },
            ],
            processing_label: "Concepts mapped to your PLKG.",
            processing_progress_percent: 100,
            processing_status: "connected",
          },
        }),
    );

    const document = await repository.connectDocumentConcepts(
      "document-1",
      [
        {
          confidence: 82,
          description: "Recursion was identified from the uploaded learning material.",
          label: "Recursion",
          sourceSnippet: "Recursion breaks problems into smaller steps.",
        },
      ],
      {
        accessToken: "token",
        studentId: "student-1",
      },
    );

    expect(document?.conceptCount).toBe(1);
    expect(document?.extractedConcepts[0]?.label).toBe("Recursion");
    expect(document?.processing).toMatchObject({
      label: "Concepts mapped to your PLKG.",
      progressPercent: 100,
      status: "connected",
    });
  });
});
