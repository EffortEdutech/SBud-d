import { Body, Controller, Get, Post } from "@nestjs/common";
import type {
  CreateStudyReflectionInput,
  StudyPreparationPlan,
  StudyRevisionItem,
  StudySummary,
} from "@sbud-d/types";

import { StudyService } from "./study.service.js";

@Controller("study")
export class StudyController {
  private readonly studyService = new StudyService();

  @Get("summary")
  getSummary(): StudySummary {
    return this.studyService.getSummary();
  }

  @Get("preparation")
  listPreparationPlans(): StudyPreparationPlan[] {
    return this.studyService.listPreparationPlans();
  }

  @Get("revision")
  listRevisionItems(): StudyRevisionItem[] {
    return this.studyService.listRevisionItems();
  }

  @Post("revision/reflection")
  recordReflection(@Body() input: CreateStudyReflectionInput): StudyRevisionItem {
    return this.studyService.recordReflection(input);
  }
}
