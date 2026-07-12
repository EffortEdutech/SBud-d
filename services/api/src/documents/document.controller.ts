import { Body, Controller, Get, Param, Post } from "@nestjs/common";
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
  getLibrarySummary(): DocumentLibrarySummary {
    return this.documentService.getLibrarySummary();
  }

  @Get("documents")
  listDocuments(): LearningDocument[] {
    return this.documentService.listDocuments();
  }

  @Get("documents/:id")
  getDocument(@Param("id") id: string): LearningDocument {
    return this.documentService.getDocument(id);
  }

  @Post("documents")
  createDocument(@Body() input: CreateLearningDocumentInput): LearningDocument {
    return this.documentService.createDocument(input);
  }
}
