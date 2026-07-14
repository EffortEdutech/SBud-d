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
import { getAuthenticatedUserAndTokenFromHeader } from "../auth/supabase-auth-client.js";
import { getApiEnvironment, type ApiEnvironment } from "../config/environment.js";

interface DocumentRequestContext {
  authorizationHeader?: string | undefined;
}

export class DocumentService {
  constructor(
    private readonly repository: DocumentRepository = new DocumentRepository(),
    private readonly environment: ApiEnvironment = getApiEnvironment(),
  ) {}

  async getLibrarySummary(context: DocumentRequestContext = {}): Promise<DocumentLibrarySummary> {
    const documents = await this.repository.listDocuments(await this.getRepositoryContext(context));

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

  async listDocuments(context: DocumentRequestContext = {}): Promise<LearningDocument[]> {
    return this.repository.listDocuments(await this.getRepositoryContext(context));
  }

  async getDocument(id: string, context: DocumentRequestContext = {}): Promise<LearningDocument> {
    const document = await this.repository.getDocument(
      id,
      await this.getRepositoryContext(context),
    );

    if (!document) {
      throw new NotFoundException("Document not found.");
    }

    return document;
  }

  async createDocument(
    input: CreateLearningDocumentInput,
    context: DocumentRequestContext = {},
  ): Promise<LearningDocument> {
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

    return this.repository.createDocument(input, await this.getRepositoryContext(context));
  }

  private async getRepositoryContext(context: DocumentRequestContext) {
    if (this.environment.dataMode !== "supabase") {
      return {};
    }

    const user = await getAuthenticatedUserAndTokenFromHeader(context.authorizationHeader);

    return {
      accessToken: user.accessToken,
      studentId: user.id,
    };
  }
}
