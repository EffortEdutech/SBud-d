import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
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
  getSummary(@Headers("authorization") authorizationHeader?: string): Promise<StudySummary> {
    return this.studyService.getSummary({ authorizationHeader });
  }

  @Get("preparation")
  listPreparationPlans(
    @Headers("authorization") authorizationHeader?: string,
  ): Promise<StudyPreparationPlan[]> {
    return this.studyService.listPreparationPlans({ authorizationHeader });
  }

  @Get("revision")
  listRevisionItems(
    @Headers("authorization") authorizationHeader?: string,
  ): Promise<StudyRevisionItem[]> {
    return this.studyService.listRevisionItems({ authorizationHeader });
  }

  @Post("revision/reflection")
  recordReflection(
    @Body() input: CreateStudyReflectionInput,
    @Headers("authorization") authorizationHeader?: string,
  ): Promise<StudyRevisionItem> {
    return this.studyService.recordReflection(input, { authorizationHeader });
  }
}
