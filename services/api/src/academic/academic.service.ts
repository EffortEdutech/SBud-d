import { BadRequestException, Injectable } from "@nestjs/common";
import type {
  AcademicProfile,
  AcademicSubject,
  CreateAcademicSubjectInput,
  DashboardSummary,
  UpdateAcademicProfileInput,
} from "@sbud-d/types";

import { AcademicRepository } from "./academic.repository.js";
import { getApiEnvironment, type ApiEnvironment } from "../config/environment.js";
import { getAuthenticatedUserAndTokenFromHeader } from "../auth/supabase-auth-client.js";

interface AcademicRequestContext {
  authorizationHeader?: string | undefined;
}

@Injectable()
export class AcademicService {
  constructor(
    private readonly repository: AcademicRepository = new AcademicRepository(),
    private readonly environment: ApiEnvironment = getApiEnvironment(),
  ) {}

  async getProfile(context: AcademicRequestContext = {}): Promise<AcademicProfile> {
    return this.repository.getProfile(await this.getRepositoryContext(context));
  }

  async updateProfile(
    input: UpdateAcademicProfileInput,
    context: AcademicRequestContext = {},
  ): Promise<AcademicProfile> {
    if (input.programmeName !== undefined && input.programmeName.trim().length === 0) {
      throw new BadRequestException("programmeName cannot be empty.");
    }

    if (
      input.currentSemesterSequence !== undefined &&
      (!Number.isInteger(input.currentSemesterSequence) || input.currentSemesterSequence < 1)
    ) {
      throw new BadRequestException("currentSemesterSequence must be a positive integer.");
    }

    return this.repository.updateProfile(input, await this.getRepositoryContext(context));
  }

  async listSubjects(context: AcademicRequestContext = {}): Promise<AcademicSubject[]> {
    return this.repository.listSubjects(await this.getRepositoryContext(context));
  }

  async createSubject(
    input: CreateAcademicSubjectInput,
    context: AcademicRequestContext = {},
  ): Promise<AcademicSubject> {
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

    return this.repository.createSubject(input, await this.getRepositoryContext(context));
  }

  async getDashboardSummary(context: AcademicRequestContext = {}): Promise<DashboardSummary> {
    const repositoryContext = await this.getRepositoryContext(context);
    const profile = await this.repository.getProfile(repositoryContext);
    const subjects = await this.repository.listSubjects(repositoryContext);

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

  private async getRepositoryContext(context: AcademicRequestContext) {
    if (this.environment.dataMode !== "supabase") {
      return {};
    }

    const user = await getAuthenticatedUserAndTokenFromHeader(context.authorizationHeader);

    return {
      accessToken: user.accessToken,
      studentId: user.id,
    };
  }
}
