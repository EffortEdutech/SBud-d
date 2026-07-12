import { Module } from "@nestjs/common";

import { AcademicController } from "./academic.controller.js";
import { AcademicRepository } from "./academic.repository.js";
import { AcademicService } from "./academic.service.js";

@Module({
  controllers: [AcademicController],
  providers: [AcademicRepository, AcademicService],
})
export class AcademicModule {}
