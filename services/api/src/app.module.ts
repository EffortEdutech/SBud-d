import { Module } from "@nestjs/common";

import { AcademicModule } from "./academic/academic.module.js";
import { DocumentModule } from "./documents/document.module.js";
import { HealthModule } from "./health/health.module.js";

@Module({
  imports: [AcademicModule, DocumentModule, HealthModule],
})
export class AppModule {}
