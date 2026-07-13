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

  getSummary(): StudySummary {
    return this.repository.getSummary();
  }

  listPreparationPlans(): StudyPreparationPlan[] {
    return this.repository.listPreparationPlans();
  }

  listRevisionItems(): StudyRevisionItem[] {
    return this.repository.listRevisionItems();
  }

  recordReflection(input: CreateStudyReflectionInput): StudyRevisionItem {
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
      return this.repository.recordReflection(input);
    } catch {
      throw new NotFoundException("Revision item was not found.");
    }
  }
}
