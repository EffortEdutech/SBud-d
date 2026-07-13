import { Module } from "@nestjs/common";

import { AcademicModule } from "./academic/academic.module.js";
import { BlieModule } from "./blie/blie.module.js";
import { DocumentModule } from "./documents/document.module.js";
import { HealthModule } from "./health/health.module.js";
import { PlkgModule } from "./plkg/plkg.module.js";
import { StudyModule } from "./study/study.module.js";

@Module({
  imports: [AcademicModule, BlieModule, DocumentModule, HealthModule, PlkgModule, StudyModule],
})
export class AppModule {}
