import { Module } from "@nestjs/common";

import { StudyController } from "./study.controller.js";

@Module({
  controllers: [StudyController],
})
export class StudyModule {}
