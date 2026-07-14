import { Body, Controller, Get, Headers, Post, Put } from "@nestjs/common";
import type {
  AcademicProfile,
  AcademicSubject,
  CreateAcademicSubjectInput,
  DashboardSummary,
  UpdateAcademicProfileInput,
} from "@sbud-d/types";

import { AcademicService } from "./academic.service.js";

@Controller()
export class AcademicController {
  private readonly academicService = new AcademicService();

  @Get("academic/profile")
  getProfile(@Headers("authorization") authorizationHeader?: string): Promise<AcademicProfile> {
    return this.academicService.getProfile({ authorizationHeader });
  }

  @Put("academic/profile")
  updateProfile(
    @Body() input: UpdateAcademicProfileInput,
    @Headers("authorization") authorizationHeader?: string,
  ): Promise<AcademicProfile> {
    return this.academicService.updateProfile(input, { authorizationHeader });
  }

  @Get("academic/subjects")
  listSubjects(@Headers("authorization") authorizationHeader?: string): Promise<AcademicSubject[]> {
    return this.academicService.listSubjects({ authorizationHeader });
  }

  @Post("academic/subjects")
  createSubject(
    @Body() input: CreateAcademicSubjectInput,
    @Headers("authorization") authorizationHeader?: string,
  ): Promise<AcademicSubject> {
    return this.academicService.createSubject(input, { authorizationHeader });
  }

  @Get("dashboard")
  getDashboard(@Headers("authorization") authorizationHeader?: string): Promise<DashboardSummary> {
    return this.academicService.getDashboardSummary({ authorizationHeader });
  }
}
