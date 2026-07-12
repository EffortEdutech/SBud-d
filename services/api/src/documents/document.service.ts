import { BadRequestException, NotFoundException } from "@nestjs/common";
import type {
  CreateLearningDocumentInput,
  DocumentLibrarySummary,
  LearningDocument,
} from "@sbud-d/types";

import {
  ACCEPTED_DOCUMENT_MIME_TYPES,
  DOCUMENT_STORAGE_BUCKET,
  MAX_DOCUMENT_FILE_SIZE_BYTES,
} from "./document.fixtures.js";
import { DocumentRepository } from "./document.repository.js";

export class DocumentService {
  constructor(private readonly repository: DocumentRepository = new DocumentRepository()) {}

  getLibrarySummary(): DocumentLibrarySummary {
    const documents = this.repository.listDocuments();

    return {
      documents,
      upload: {
        acceptedMimeTypes: ACCEPTED_DOCUMENT_MIME_TYPES,
        maxFileSizeBytes: MAX_DOCUMENT_FILE_SIZE_BYTES,
        storageBucket: DOCUMENT_STORAGE_BUCKET,
        storagePathPattern: "{studentId}/{subjectId}/{documentId}/{fileName}",
      },
      emptyState: {
        title: "No learning materials yet",
        body: "Upload lecture notes, PDFs, images, or personal notes to start building document context.",
      },
    };
  }

  listDocuments(): LearningDocument[] {
    return this.repository.listDocuments();
  }

  getDocument(id: string): LearningDocument {
    const document = this.repository.getDocument(id);

    if (!document) {
      throw new NotFoundException("Document not found.");
    }

    return document;
  }

  createDocument(input: CreateLearningDocumentInput): LearningDocument {
    if (!input.subjectId?.trim()) {
      throw new BadRequestException("subjectId is required.");
    }

    if (!input.fileName?.trim()) {
      throw new BadRequestException("fileName is required.");
    }

    if (!input.mimeType?.trim()) {
      throw new BadRequestException("mimeType is required.");
    }

    if (!ACCEPTED_DOCUMENT_MIME_TYPES.includes(input.mimeType)) {
      throw new BadRequestException("Unsupported document type.");
    }

    if (!Number.isInteger(input.fileSizeBytes) || input.fileSizeBytes <= 0) {
      throw new BadRequestException("fileSizeBytes must be a positive integer.");
    }

    if (input.fileSizeBytes > MAX_DOCUMENT_FILE_SIZE_BYTES) {
      throw new BadRequestException("Document exceeds the maximum supported size.");
    }

    return this.repository.createDocument(input);
  }
}
