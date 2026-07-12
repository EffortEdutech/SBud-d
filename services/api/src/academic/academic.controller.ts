import { Body, Controller, Get, Post, Put } from "@nestjs/common";
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
  getProfile(): AcademicProfile {
    return this.academicService.getProfile();
  }

  @Put("academic/profile")
  updateProfile(@Body() input: UpdateAcademicProfileInput): AcademicProfile {
    return this.academicService.updateProfile(input);
  }

  @Get("academic/subjects")
  listSubjects(): AcademicSubject[] {
    return this.academicService.listSubjects();
  }

  @Post("academic/subjects")
  createSubject(@Body() input: CreateAcademicSubjectInput): AcademicSubject {
    return this.academicService.createSubject(input);
  }

  @Get("dashboard")
  getDashboard(): DashboardSummary {
    return this.academicService.getDashboardSummary();
  }
}
