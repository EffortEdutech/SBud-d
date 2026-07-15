import { BadRequestException, Injectable } from "@nestjs/common";
import type {
  AcademicProfile,
  AcademicSubject,
  CreateAcademicSubjectInput,
  DashboardSummary,
  DocumentLibrarySummary,
  PlkgSummary,
  StudySummary,
  UpdateAcademicProfileInput,
} from "@sbud-d/types";

import { AcademicRepository } from "./academic.repository.js";
import { getApiEnvironment, type ApiEnvironment } from "../config/environment.js";
import { getAuthenticatedUserAndTokenFromHeader } from "../auth/supabase-auth-client.js";
import { DocumentService } from "../documents/document.service.js";
import { PlkgService } from "../plkg/plkg.service.js";
import { StudyService } from "../study/study.service.js";

interface AcademicRequestContext {
  authorizationHeader?: string | undefined;
}

@Injectable()
export class AcademicService {
  constructor(
    private readonly repository: AcademicRepository = new AcademicRepository(),
    private readonly environment: ApiEnvironment = getApiEnvironment(),
    private readonly documentService: Pick<
      DocumentService,
      "getLibrarySummary"
    > = new DocumentService(),
    private readonly plkgService: Pick<PlkgService, "getSummary"> = new PlkgService(),
    private readonly studyService: Pick<StudyService, "getSummary"> = new StudyService(),
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
    const [profile, subjects, documentLibrary, plkgSummary, studySummary] = await Promise.all([
      this.repository.getProfile(repositoryContext),
      this.repository.listSubjects(repositoryContext),
      this.documentService.getLibrarySummary(context),
      this.plkgService.getSummary(context),
      this.studyService.getSummary(context),
    ]);

    return {
      academicOverview: profile,
      subjects,
      learningStatus: this.buildLearningStatus(
        subjects,
        documentLibrary,
        plkgSummary,
        studySummary,
      ),
      blieRecommendation: this.buildDashboardRecommendation(
        subjects,
        documentLibrary,
        plkgSummary,
        studySummary,
      ),
    };
  }

  private buildLearningStatus(
    subjects: AcademicSubject[],
    documentLibrary: DocumentLibrarySummary,
    plkgSummary: PlkgSummary,
    studySummary: StudySummary,
  ): DashboardSummary["learningStatus"] {
    const activeSubjectCount = subjects.filter((subject) => subject.status === "active").length;
    const connectedDocumentCount = documentLibrary.documents.filter(
      (document) => document.processing.status === "connected",
    ).length;
    const needsSupportCount = studySummary.revisionItems.filter(
      (item) => item.status === "needs_support",
    ).length;
    const stage =
      needsSupportCount > 0
        ? "Revision focus"
        : connectedDocumentCount > 0
          ? "Learning materials connected"
          : activeSubjectCount > 0
            ? "Academic profile baseline"
            : "Academic setup pending";

    return {
      stage,
      knowledgeGrowthLabel: `${plkgSummary.nodeCount} PLKG nodes, ${plkgSummary.edgeCount} relationships, ${documentLibrary.documents.length} learning materials`,
      readinessLabel: studySummary.preparationReadinessLabel,
    };
  }

  private buildDashboardRecommendation(
    subjects: AcademicSubject[],
    documentLibrary: DocumentLibrarySummary,
    plkgSummary: PlkgSummary,
    studySummary: StudySummary,
  ): DashboardSummary["blieRecommendation"] {
    const priorityGap = plkgSummary.knowledgeGaps[0];

    if (priorityGap) {
      return {
        title: `Review ${priorityGap.label}`,
        body: priorityGap.recommendedAction,
        actionLabel: "Ask BLIE",
      };
    }

    const priorityRevision = studySummary.revisionItems.find(
      (item) => item.status === "needs_support" || item.status === "queued",
    );

    if (priorityRevision) {
      return {
        title: `Revise ${priorityRevision.topicLabel}`,
        body: priorityRevision.recommendedAction,
        actionLabel: "Open revision",
      };
    }

    const priorityPreparation = studySummary.preparationPlans.find(
      (plan) => plan.readinessStatus !== "ready",
    );

    if (priorityPreparation) {
      return {
        title: `Prepare ${priorityPreparation.topicLabel}`,
        body: `Start with ${priorityPreparation.prerequisiteLabels[0] ?? "the next prerequisite"} before the next learning session.`,
        actionLabel: "Open preparation",
      };
    }

    if (documentLibrary.documents.length === 0 && subjects.length > 0) {
      return {
        title: "Upload your first learning material",
        body: "Add lecture notes or a short personal note so BLIE can ground study guidance in your own materials.",
        actionLabel: "Open library",
      };
    }

    return {
      title: "Keep your study rhythm",
      body: "Review the next recommended topic, then ask BLIE to connect it to your PLKG.",
      actionLabel: "Continue studying",
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
