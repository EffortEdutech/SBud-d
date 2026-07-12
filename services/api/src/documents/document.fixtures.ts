import type { LearningDocument } from "@sbud-d/types";

export const DOCUMENT_STORAGE_BUCKET = "student-documents";
export const MAX_DOCUMENT_FILE_SIZE_BYTES = 50 * 1024 * 1024;
export const ACCEPTED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
];

export const demoDocuments: LearningDocument[] = [
  {
    id: "document-database-lecture",
    studentId: "demo-student",
    subjectId: "subject-programming",
    subjectName: "Programming Fundamentals",
    title: "Lecture 3 - Functions",
    fileName: "lecture-3-functions.pdf",
    mimeType: "application/pdf",
    kind: "pdf",
    fileSizeBytes: 1843200,
    storageBucket: DOCUMENT_STORAGE_BUCKET,
    storagePath:
      "demo-student/subject-programming/document-database-lecture/lecture-3-functions.pdf",
    topicLabel: "Functions and control flow",
    summary: "Processing placeholder for extracted lecture concepts.",
    conceptCount: 4,
    createdAt: "2026-07-12T00:00:00.000Z",
    processing: {
      status: "connected",
      label: "Knowledge added to your learning journey.",
      progressPercent: 100,
      updatedAt: "2026-07-12T00:00:00.000Z",
      errorMessage: null,
    },
  },
  {
    id: "document-calculus-notes",
    studentId: "demo-student",
    subjectId: "subject-calculus",
    subjectName: "Calculus I",
    title: "Limits Whiteboard",
    fileName: "limits-whiteboard.png",
    mimeType: "image/png",
    kind: "image",
    fileSizeBytes: 864000,
    storageBucket: DOCUMENT_STORAGE_BUCKET,
    storagePath: "demo-student/subject-calculus/document-calculus-notes/limits-whiteboard.png",
    topicLabel: "Limits and continuity",
    summary: null,
    conceptCount: 0,
    createdAt: "2026-07-12T00:05:00.000Z",
    processing: {
      status: "processing",
      label: "AI is understanding your material.",
      progressPercent: 45,
      updatedAt: "2026-07-12T00:05:00.000Z",
      errorMessage: null,
    },
  },
];
