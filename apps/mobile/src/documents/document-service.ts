import type {
  CreateLearningDocumentInput,
  DocumentLibrarySummary,
  LearningDocument,
} from "@sbud-d/types";

import { apiFetch } from "../lib/api-client";

export const fallbackDocumentLibrarySummary: DocumentLibrarySummary = {
  documents: [],
  upload: {
    acceptedMimeTypes: ["application/pdf", "image/jpeg", "image/png", "image/webp", "text/plain"],
    maxFileSizeBytes: 50 * 1024 * 1024,
    storageBucket: "student-documents",
    storagePathPattern: "{studentId}/{subjectId}/{documentId}/{fileName}",
  },
  emptyState: {
    title: "No learning materials yet",
    body: "Connect the API to load your document library.",
  },
};

export async function fetchDocumentLibrarySummary(): Promise<DocumentLibrarySummary> {
  const response = await apiFetch("/documents/library");

  if (!response.ok) {
    throw new Error(`Document library request failed with status ${response.status}.`);
  }

  return (await response.json()) as DocumentLibrarySummary;
}

export async function createLearningDocument(
  input: CreateLearningDocumentInput,
): Promise<LearningDocument> {
  const response = await apiFetch("/documents", {
    body: JSON.stringify(input),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Document metadata create failed with status ${response.status}.`);
  }

  return (await response.json()) as LearningDocument;
}

export async function uploadSamplePdfDocument(input: {
  subjectId: string;
  topicLabel?: string | null;
}): Promise<LearningDocument> {
  const formData = new FormData();
  const samplePdf = new Blob(
    [
      "%PDF-1.4\nSBud-d sample lecture PDF\nRecursion breaks a problem into smaller repeated steps.\n%%EOF",
    ],
    {
      type: "application/pdf",
    },
  );

  formData.append("subjectId", input.subjectId);
  formData.append("title", "Sample lecture PDF");

  if (input.topicLabel) {
    formData.append("topicLabel", input.topicLabel);
  }

  formData.append("file", samplePdf, "sample-lecture.pdf");

  const response = await apiFetch("/documents/upload", {
    body: formData,
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Document upload failed with status ${response.status}.`);
  }

  return (await response.json()) as LearningDocument;
}

export async function extractLearningDocumentText(documentId: string): Promise<LearningDocument> {
  const response = await apiFetch(`/documents/${documentId}/extract`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Document extraction failed with status ${response.status}.`);
  }

  return (await response.json()) as LearningDocument;
}
