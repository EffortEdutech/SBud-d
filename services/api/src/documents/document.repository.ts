import type {
  CreateLearningDocumentInput,
  LearningDocument,
  LearningDocumentKind,
} from "@sbud-d/types";

import { demoSubjects } from "../academic/academic.fixtures.js";
import { DOCUMENT_STORAGE_BUCKET, demoDocuments } from "./document.fixtures.js";

const DEMO_STUDENT_ID = "demo-student";

function inferDocumentKind(mimeType: string, fileName: string): LearningDocumentKind {
  if (mimeType === "application/pdf") {
    return "pdf";
  }

  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (fileName.toLowerCase().includes("slide")) {
    return "slide";
  }

  if (mimeType === "text/plain") {
    return "note";
  }

  return "reference";
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export class DocumentRepository {
  private documents: LearningDocument[] = structuredClone(demoDocuments);

  listDocuments(): LearningDocument[] {
    return structuredClone(this.documents);
  }

  getDocument(id: string): LearningDocument | null {
    const document = this.documents.find((item) => item.id === id);

    return document ? structuredClone(document) : null;
  }

  createDocument(input: CreateLearningDocumentInput): LearningDocument {
    const subject = demoSubjects.find((item) => item.id === input.subjectId);
    const documentId = `document-${this.documents.length + 1}`;
    const safeFileName = sanitizeFileName(input.fileName);
    const now = new Date().toISOString();
    const title = input.title?.trim() || safeFileName;

    const document: LearningDocument = {
      id: documentId,
      studentId: DEMO_STUDENT_ID,
      subjectId: input.subjectId,
      subjectName: subject?.name ?? "Subject pending",
      title,
      fileName: safeFileName,
      mimeType: input.mimeType,
      kind: inferDocumentKind(input.mimeType, safeFileName),
      fileSizeBytes: input.fileSizeBytes,
      storageBucket: DOCUMENT_STORAGE_BUCKET,
      storagePath: `${DEMO_STUDENT_ID}/${input.subjectId}/${documentId}/${safeFileName}`,
      topicLabel: input.topicLabel?.trim() || null,
      summary: null,
      conceptCount: 0,
      createdAt: now,
      processing: {
        status: "uploaded",
        label: "Document received.",
        progressPercent: 10,
        updatedAt: now,
        errorMessage: null,
      },
    };

    this.documents = [document, ...this.documents];

    return structuredClone(document);
  }
}
