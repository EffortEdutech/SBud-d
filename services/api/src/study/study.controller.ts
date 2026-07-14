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
  getSummary(): Promise<StudySummary> {
    return this.studyService.getSummary();
  }

  @Get("preparation")
  listPreparationPlans(): Promise<StudyPreparationPlan[]> {
    return this.studyService.listPreparationPlans();
  }

  @Get("revision")
  listRevisionItems(): Promise<StudyRevisionItem[]> {
    return this.studyService.listRevisionItems();
  }

  @Post("revision/reflection")
  recordReflection(@Body() input: CreateStudyReflectionInput): Promise<StudyRevisionItem> {
    return this.studyService.recordReflection(input);
  }
}
