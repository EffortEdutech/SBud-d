export type LearningDocumentStatus =
  "uploaded" | "processing" | "understanding" | "connected" | "failed";

export type LearningDocumentKind = "pdf" | "image" | "note" | "slide" | "reference";

export interface LearningDocumentProcessing {
  status: LearningDocumentStatus;
  label: string;
  progressPercent: number;
  updatedAt: string;
  errorMessage: string | null;
}

export interface LearningDocument {
  id: string;
  studentId: string;
  subjectId: string;
  subjectName: string;
  title: string;
  fileName: string;
  mimeType: string;
  kind: LearningDocumentKind;
  fileSizeBytes: number;
  storageBucket: string;
  storagePath: string;
  topicLabel: string | null;
  summary: string | null;
  conceptCount: number;
  createdAt: string;
  processing: LearningDocumentProcessing;
}

export interface CreateLearningDocumentInput {
  subjectId: string;
  title?: string | null;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  topicLabel?: string | null;
}

export interface DocumentLibrarySummary {
  documents: LearningDocument[];
  upload: {
    acceptedMimeTypes: string[];
    maxFileSizeBytes: number;
    storageBucket: string;
    storagePathPattern: string;
  };
  emptyState: {
    title: string;
    body: string;
  };
}
