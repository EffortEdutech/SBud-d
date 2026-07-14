import { BadRequestException, NotFoundException } from "@nestjs/common";
import type {
  CreateStudyReflectionInput,
  StudyPreparationPlan,
  StudyRevisionItem,
  StudySummary,
} from "@sbud-d/types";

import { StudyRepository } from "./study.repository.js";

export class StudyService {
  constructor(private readonly repository: StudyRepository = new StudyRepository()) {}

  async getSummary(): Promise<StudySummary> {
    return this.repository.getSummary();
  }

  async listPreparationPlans(): Promise<StudyPreparationPlan[]> {
    return this.repository.listPreparationPlans();
  }

  async listRevisionItems(): Promise<StudyRevisionItem[]> {
    return this.repository.listRevisionItems();
  }

  async recordReflection(input: CreateStudyReflectionInput): Promise<StudyRevisionItem> {
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
      return await this.repository.recordReflection(input);
    } catch {
      throw new NotFoundException("Revision item was not found.");
    }
  }
}
