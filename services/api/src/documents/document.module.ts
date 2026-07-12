import { Module } from "@nestjs/common";

import { DocumentController } from "./document.controller.js";
import { DocumentRepository } from "./document.repository.js";
import { DocumentService } from "./document.service.js";

@Module({
  controllers: [DocumentController],
  providers: [DocumentRepository, DocumentService],
})
export class DocumentModule {}
