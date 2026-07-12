import { BadRequestException, Injectable } from "@nestjs/common";
import type {
  AcademicProfile,
  AcademicSubject,
  CreateAcademicSubjectInput,
  DashboardSummary,
  UpdateAcademicProfileInput,
} from "@sbud-d/types";

import { AcademicRepository } from "./academic.repository.js";

@Injectable()
export class AcademicService {
  constructor(private readonly repository: AcademicRepository = new AcademicRepository()) {}

  getProfile(): AcademicProfile {
    return this.repository.getProfile();
  }

  updateProfile(input: UpdateAcademicProfileInput): AcademicProfile {
    if (input.programmeName !== undefined && input.programmeName.trim().length === 0) {
      throw new BadRequestException("programmeName cannot be empty.");
    }

    if (
      input.currentSemesterSequence !== undefined &&
      (!Number.isInteger(input.currentSemesterSequence) || input.currentSemesterSequence < 1)
    ) {
      throw new BadRequestException("currentSemesterSequence must be a positive integer.");
    }

    return this.repository.updateProfile(input);
  }

  listSubjects(): AcademicSubject[] {
    return this.repository.listSubjects();
  }

  createSubject(input: CreateAcademicSubjectInput): AcademicSubject {
    if (!input.name?.trim()) {
      throw new BadRequestException("Subject name is required.");
    }

    if (!input.code?.trim()) {
      throw new BadRequestException("Subject code is required.");
    }

    if (
      input.creditHours !== undefined &&
      input.creditHours !== null &&
      (!Number.isInteger(input.creditHours) || input.creditHours < 0)
    ) {
      throw new BadRequestException("creditHours must be a non-negative integer.");
    }

    return this.repository.createSubject(input);
  }

  getDashboardSummary(): DashboardSummary {
    const profile = this.repository.getProfile();
    const subjects = this.repository.listSubjects();

    return {
      academicOverview: profile,
      subjects,
      learningStatus: {
        stage: "Academic profile baseline",
        knowledgeGrowthLabel: "Initial PLKG preparation pending",
        readinessLabel: `${subjects.length} active subjects ready for setup`,
      },
      blieRecommendation: {
        title: "Prepare your first subject",
        body: "Choose one active subject and upload or summarize the first lecture topic when Document Intelligence is ready.",
        actionLabel: "Open subject workspace",
      },
    };
  }
}
