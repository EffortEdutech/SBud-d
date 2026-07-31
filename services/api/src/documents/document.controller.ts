import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type {
  CreateLearningDocumentInput,
  DocumentLibrarySummary,
  LearningDocument,
} from "@sbud-d/types";

import {
  DocumentService,
  type UploadedDocumentFile,
  type UploadDocumentRequestBody,
} from "./document.service.js";

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

  @Post("documents/:id/extract")
  extractDocumentText(
    @Param("id") id: string,
    @Headers("authorization") authorizationHeader?: string,
  ): Promise<LearningDocument> {
    return this.documentService.extractDocumentText(id, { authorizationHeader });
  }

  @Post("documents")
  createDocument(
    @Body() input: CreateLearningDocumentInput,
    @Headers("authorization") authorizationHeader?: string,
  ): Promise<LearningDocument> {
    return this.documentService.createDocument(input, { authorizationHeader });
  }

  @Post("documents/upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadDocument(
    @Body() input: UploadDocumentRequestBody,
    @UploadedFile() file: UploadedDocumentFile | undefined,
    @Headers("authorization") authorizationHeader?: string,
  ): Promise<LearningDocument> {
    return this.documentService.uploadDocument(input, file, { authorizationHeader });
  }
}
