import { Body, Controller, Get, Headers, Param, Post } from "@nestjs/common";
import type {
  CreateLearningDocumentInput,
  DocumentLibrarySummary,
  LearningDocument,
} from "@sbud-d/types";

import { DocumentService } from "./document.service.js";

@Controller()
export class DocumentController {
  private readonly documentService = new DocumentService();

  @Get("documents/library")
  getLibrarySummary(
    @Headers("authorization") authorizationHeader?: string,
  ): Promise<DocumentLibrarySummary> {
    return this.documentService.getLibrarySummary({ authorizationHeader });
  }

  @Get("documents")
  listDocuments(
    @Headers("authorization") authorizationHeader?: string,
  ): Promise<LearningDocument[]> {
    return this.documentService.listDocuments({ authorizationHeader });
  }

  @Get("documents/:id")
  getDocument(
    @Param("id") id: string,
    @Headers("authorization") authorizationHeader?: string,
  ): Promise<LearningDocument> {
    return this.documentService.getDocument(id, { authorizationHeader });
  }

  @Post("documents")
  createDocument(
    @Body() input: CreateLearningDocumentInput,
    @Headers("authorization") authorizationHeader?: string,
  ): Promise<LearningDocument> {
    return this.documentService.createDocument(input, { authorizationHeader });
  }
}
