import type {
  CreateLearningDocumentInput,
  DocumentLibrarySummary,
  LearningDocument,
} from "@sbud-d/types";

import { getApiBaseUrl } from "../config/environment";

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
  const response = await fetch(`${getApiBaseUrl()}/documents/library`);

  if (!response.ok) {
    throw new Error(`Document library request failed with status ${response.status}.`);
  }

  return (await response.json()) as DocumentLibrarySummary;
}

export async function createLearningDocument(
  input: CreateLearningDocumentInput,
): Promise<LearningDocument> {
  const response = await fetch(`${getApiBaseUrl()}/documents`, {
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
