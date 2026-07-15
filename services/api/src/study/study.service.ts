import { BadRequestException, NotFoundException } from "@nestjs/common";
import type {
  CreateStudyReflectionInput,
  StudyPreparationPlan,
  StudyRevisionItem,
  StudySummary,
} from "@sbud-d/types";

import { StudyRepository } from "./study.repository.js";
import { getAuthenticatedUserAndTokenFromHeader } from "../auth/supabase-auth-client.js";
import { getApiEnvironment, type ApiEnvironment } from "../config/environment.js";

interface StudyRequestContext {
  authorizationHeader?: string | undefined;
}

export class StudyService {
  constructor(
    private readonly repository: StudyRepository = new StudyRepository(),
    private readonly environment: ApiEnvironment = getApiEnvironment(),
  ) {}

  async getSummary(context: StudyRequestContext = {}): Promise<StudySummary> {
    return this.repository.getSummary(await this.getRepositoryContext(context));
  }

  async listPreparationPlans(context: StudyRequestContext = {}): Promise<StudyPreparationPlan[]> {
    return this.repository.listPreparationPlans(await this.getRepositoryContext(context));
  }

  async listRevisionItems(context: StudyRequestContext = {}): Promise<StudyRevisionItem[]> {
    return this.repository.listRevisionItems(await this.getRepositoryContext(context));
  }

  async recordReflection(
    input: CreateStudyReflectionInput,
    context: StudyRequestContext = {},
  ): Promise<StudyRevisionItem> {
    if (!input.revisionItemId?.trim()) {
      throw new BadRequestException("revisionItemId is required.");
    }

    if (!input.reflection?.trim()) {
      throw new BadRequestException("reflection is required.");
    }

    if (input.confidenceLevel < 0 || input.confidenceLevel > 100) {
      throw new BadRequestException("confidenceLevel must be between 0 and 100.");
    }

    try {
      return await this.repository.recordReflection(
        input,
        await this.getRepositoryContext(context),
      );
    } catch (error) {
      if (error instanceof Error && error.message === "Revision item was not found.") {
        throw new NotFoundException("Revision item was not found.");
      }

      throw error;
    }
  }

  private async getRepositoryContext(context: StudyRequestContext) {
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
