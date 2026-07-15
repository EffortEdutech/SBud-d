import type {
  AcademicSubject,
  CreateStudyReflectionInput,
  Database,
  PlkgSummary,
  StudyPreparationPlan,
  StudyPreparationTask,
  StudyRecommendationTrace,
  StudyRevisionItem,
  StudySummary,
} from "@sbud-d/types";
import type { SupabaseClient } from "@supabase/supabase-js";

import { DEMO_STUDENT_ID, demoSubjects } from "../academic/academic.fixtures.js";
import { getApiEnvironment, type ApiEnvironment } from "../config/environment.js";
import { PlkgRepository } from "../plkg/plkg.repository.js";
import { createSupabaseApiClient } from "../supabase/supabase-api-client.js";

const CREATED_AT = "2026-07-13T00:00:00.000Z";

interface StudyRequestContext {
  accessToken?: string | undefined;
  studentId?: string | undefined;
}

type AcademicSubjectRow = Database["public"]["Tables"]["academic_subjects"]["Row"];
type StudyPreparationPlanRow = Database["public"]["Tables"]["study_preparation_plans"]["Row"];
type StudyRevisionItemRow = Database["public"]["Tables"]["study_revision_items"]["Row"];

function mapSubject(row: AcademicSubjectRow): AcademicSubject {
  return {
    code: row.code,
    creditHours: row.credit_hours,
    currentTopic: row.current_topic,
    id: row.id,
    learningStatus: row.learning_status,
    lecturerName: row.lecturer_name,
    name: row.name,
    progressPercent: row.progress_percent,
    semesterId: row.semester_id,
    status: row.status,
  };
}

function asPreparationTasks(value: unknown[]): StudyPreparationTask[] {
  return value as StudyPreparationTask[];
}

function asRecommendationTrace(value: Record<string, unknown>): StudyRecommendationTrace {
  return value as unknown as StudyRecommendationTrace;
}

function mapPreparationPlan(
  row: StudyPreparationPlanRow,
  subjectNamesById: Record<string, string>,
): StudyPreparationPlan {
  return {
    createdAt: row.created_at,
    id: row.id,
    learningOutcomes: row.learning_outcomes,
    prerequisiteLabels: row.prerequisite_labels,
    readinessStatus: row.readiness_status,
    state: row.state,
    studentId: row.student_id,
    subjectId: row.subject_id,
    subjectName: subjectNamesById[row.subject_id] ?? "Subject pending",
    tasks: asPreparationTasks(row.tasks),
    topicLabel: row.topic_label,
    trace: asRecommendationTrace(row.trace),
    updatedAt: row.updated_at,
  };
}

function mapRevisionItem(
  row: StudyRevisionItemRow,
  subjectNamesById: Record<string, string>,
): StudyRevisionItem {
  return {
    createdAt: row.created_at,
    dueLabel: row.due_label,
    flashcards: row.flashcards as StudyRevisionItem["flashcards"],
    id: row.id,
    masteryScore: row.mastery_score,
    priorityLabel: row.priority_label,
    quizQuestions: row.quiz_questions as StudyRevisionItem["quizQuestions"],
    recommendedAction: row.recommended_action,
    status: row.status,
    studentId: row.student_id,
    subjectId: row.subject_id,
    subjectName: subjectNamesById[row.subject_id] ?? "Subject pending",
    topicLabel: row.topic_label,
    trace: asRecommendationTrace(row.trace),
    updatedAt: row.updated_at,
  };
}

export class StudyRepository {
  constructor(
    private readonly plkgRepository: PlkgRepository = new PlkgRepository(),
    private readonly environment: ApiEnvironment = getApiEnvironment(),
    private readonly createClient: (accessToken?: string) => SupabaseClient = (
      accessToken?: string,
    ) => createSupabaseApiClient(accessToken, this.environment),
  ) {}

  async getSummary(context: StudyRequestContext = {}): Promise<StudySummary> {
    if (this.environment.dataMode === "supabase") {
      return this.getSupabaseSummary(context);
    }

    const plkgSummary = await this.plkgRepository.getSummary();
    const preparationPlans = this.buildPreparationPlans(DEMO_STUDENT_ID, demoSubjects, plkgSummary);
    const revisionItems = this.buildRevisionItems(DEMO_STUDENT_ID, demoSubjects, plkgSummary);

    return this.buildSummary(DEMO_STUDENT_ID, preparationPlans, revisionItems);
  }

  async listPreparationPlans(context: StudyRequestContext = {}): Promise<StudyPreparationPlan[]> {
    return (await this.getSummary(context)).preparationPlans;
  }

  async listRevisionItems(context: StudyRequestContext = {}): Promise<StudyRevisionItem[]> {
    return (await this.getSummary(context)).revisionItems;
  }

  async recordReflection(
    input: CreateStudyReflectionInput,
    context: StudyRequestContext = {},
  ): Promise<StudyRevisionItem> {
    if (this.environment.dataMode === "supabase") {
      return this.recordSupabaseReflection(input, context);
    }

    const revisionItem = (await this.getSummary(context)).revisionItems.find(
      (item) => item.id === input.revisionItemId,
    );

    if (!revisionItem) {
      throw new Error("Revision item was not found.");
    }

    const nextStatus = input.confidenceLevel >= 70 ? "completed" : "needs_support";

    return {
      ...revisionItem,
      status: nextStatus,
      recommendedAction:
        nextStatus === "completed"
          ? "Keep this concept in light weekly review."
          : "Ask BLIE for a simpler explanation, then retry the quiz prompt.",
      updatedAt: new Date().toISOString(),
    };
  }

  private buildSummary(
    studentId: string,
    preparationPlans: StudyPreparationPlan[],
    revisionItems: StudyRevisionItem[],
  ): StudySummary {
    const readyCount = preparationPlans.filter((plan) => plan.readinessStatus === "ready").length;
    const completedRevisionCount = revisionItems.filter(
      (item) => item.status === "completed",
    ).length;

    return {
      studentId,
      preparationReadinessLabel: `${readyCount}/${preparationPlans.length} topics ready`,
      revisionProgressLabel: `${completedRevisionCount}/${revisionItems.length} revision items complete`,
      recommendedFocusLabel:
        revisionItems[0]?.topicLabel ??
        preparationPlans[0]?.topicLabel ??
        "Start with subject setup",
      preparationPlans,
      revisionItems,
    };
  }

  private buildPreparationPlans(
    studentId: string,
    subjects: AcademicSubject[],
    plkgSummary: PlkgSummary,
  ): StudyPreparationPlan[] {
    return subjects.map((subject) => {
      const subjectNodes = plkgSummary.nodes.filter((node) => node.subjectId === subject.id);
      const weakNodes = subjectNodes.filter(
        (node) => node.learningStatus === "needs_review" || node.masteryScore < 30,
      );
      const prerequisiteLabels =
        weakNodes.length > 0 ? weakNodes.map((node) => node.label) : ["Key terminology"];
      const linkedPlkgNodeIds =
        weakNodes.length > 0
          ? weakNodes.map((node) => node.id)
          : subjectNodes.slice(0, 2).map((node) => node.id);
      const readinessStatus =
        weakNodes.length > 0
          ? "needs_support"
          : subject.progressPercent >= 15
            ? "preparing"
            : "not_started";

      return {
        id: `study-prep-${subject.id}`,
        studentId,
        subjectId: subject.id,
        subjectName: subject.name,
        topicLabel: subject.currentTopic ?? "Next topic pending",
        readinessStatus,
        state: readinessStatus === "needs_support" ? "preparing" : "upcoming",
        prerequisiteLabels,
        learningOutcomes: [
          `Explain the main idea of ${subject.currentTopic ?? subject.name}.`,
          "Connect the topic to at least one PLKG concept.",
        ],
        tasks: [
          {
            id: `study-prep-${subject.id}-review`,
            kind: "concept_review",
            title: `Review foundations for ${subject.currentTopic ?? subject.name}`,
            guidance: `Start with ${prerequisiteLabels[0]} before the next learning session.`,
            estimatedMinutes: 12,
            linkedPlkgNodeIds,
          },
          {
            id: `study-prep-${subject.id}-practice`,
            kind: "practice",
            title: "Try one short explanation",
            guidance: "Write a two-sentence explanation in your own words before asking BLIE.",
            estimatedMinutes: 8,
            linkedPlkgNodeIds,
          },
        ],
        trace: {
          subjectId: subject.id,
          plkgNodeIds: linkedPlkgNodeIds,
          reason:
            "Preparation plan generated from current subject topic and low-mastery PLKG nodes.",
        },
        createdAt: CREATED_AT,
        updatedAt: CREATED_AT,
      };
    });
  }

  private buildRevisionItems(
    studentId: string,
    subjects: AcademicSubject[],
    plkgSummary: PlkgSummary,
  ): StudyRevisionItem[] {
    const candidateNodes = plkgSummary.nodes
      .filter(
        (node) =>
          node.type === "concept" ||
          node.learningStatus === "needs_review" ||
          node.masteryScore < 35,
      )
      .slice(0, 4);

    return candidateNodes.flatMap((node) => {
      const subject = subjects.find((candidate) => candidate.id === node.subjectId) ?? subjects[0];

      if (!subject) {
        return [];
      }

      const priorityLabel = node.masteryScore < 25 ? "high" : "medium";

      return [
        {
          id: `study-revision-${node.id}`,
          studentId,
          subjectId: subject.id,
          subjectName: subject.name,
          topicLabel: node.label,
          status: node.learningStatus === "needs_review" ? "needs_support" : "queued",
          priorityLabel,
          masteryScore: node.masteryScore,
          dueLabel: priorityLabel === "high" ? "Today" : "This week",
          recommendedAction: `Review ${node.label}, answer one practice question, then record confidence.`,
          flashcards: [
            {
              id: `flashcard-${node.id}`,
              front: `What should you remember about ${node.label}?`,
              back: node.description ?? `${node.label} is part of ${subject.name}.`,
              linkedPlkgNodeIds: [node.id],
            },
          ],
          quizQuestions: [
            {
              id: `quiz-${node.id}`,
              prompt: `Explain ${node.label} in your own words.`,
              answer: `A good answer names the idea, why it matters, and one example from ${subject.name}.`,
              explanation: "This checks conceptual understanding rather than memorisation.",
              linkedPlkgNodeIds: [node.id],
            },
          ],
          trace: {
            subjectId: subject.id,
            plkgNodeIds: [node.id],
            reason:
              "Revision item generated from PLKG status, mastery score, and knowledge gap priority.",
          },
          createdAt: CREATED_AT,
          updatedAt: CREATED_AT,
        },
      ];
    });
  }

  private getSupabaseContext(context: StudyRequestContext): {
    client: SupabaseClient;
    studentId: string;
  } {
    if (!context.accessToken || !context.studentId) {
      throw new Error("Authenticated student context is required for supabase data mode.");
    }

    return {
      client: this.createClient(context.accessToken),
      studentId: context.studentId,
    };
  }

  private async getSupabaseSummary(context: StudyRequestContext): Promise<StudySummary> {
    const { client, studentId } = this.getSupabaseContext(context);
    const subjects = await this.listSupabaseSubjects(client, studentId);
    const plkgSummary = await this.plkgRepository.getSummary(context);
    const preparationPlans = await this.getOrCreateSupabasePreparationPlans(
      client,
      studentId,
      subjects,
      plkgSummary,
    );
    const revisionItems = await this.getOrCreateSupabaseRevisionItems(
      client,
      studentId,
      subjects,
      plkgSummary,
    );

    return this.buildSummary(studentId, preparationPlans, revisionItems);
  }

  private async listSupabaseSubjects(
    client: SupabaseClient,
    studentId: string,
  ): Promise<AcademicSubject[]> {
    const { data, error } = await client
      .from("academic_subjects")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return (data as AcademicSubjectRow[]).map(mapSubject);
  }

  private async getOrCreateSupabasePreparationPlans(
    client: SupabaseClient,
    studentId: string,
    subjects: AcademicSubject[],
    plkgSummary: PlkgSummary,
  ): Promise<StudyPreparationPlan[]> {
    const rows = await this.listSupabasePreparationPlanRows(client, studentId);
    const subjectNamesById = Object.fromEntries(
      subjects.map((subject) => [subject.id, subject.name]),
    );

    if (rows.length > 0) {
      return rows.map((row) => mapPreparationPlan(row, subjectNamesById));
    }

    const generatedPlans = this.buildPreparationPlans(studentId, subjects, plkgSummary);

    if (generatedPlans.length === 0) {
      return [];
    }

    const { data, error } = await client
      .from("study_preparation_plans")
      .insert(
        generatedPlans.map((plan) => ({
          learning_outcomes: plan.learningOutcomes,
          prerequisite_labels: plan.prerequisiteLabels,
          readiness_status: plan.readinessStatus,
          state: plan.state,
          student_id: studentId,
          subject_id: plan.subjectId,
          tasks: plan.tasks,
          topic_label: plan.topicLabel,
          trace: plan.trace,
        })),
      )
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return (data as StudyPreparationPlanRow[]).map((row) =>
      mapPreparationPlan(row, subjectNamesById),
    );
  }

  private async getOrCreateSupabaseRevisionItems(
    client: SupabaseClient,
    studentId: string,
    subjects: AcademicSubject[],
    plkgSummary: PlkgSummary,
  ): Promise<StudyRevisionItem[]> {
    const rows = await this.listSupabaseRevisionItemRows(client, studentId);
    const subjectNamesById = Object.fromEntries(
      subjects.map((subject) => [subject.id, subject.name]),
    );

    if (rows.length > 0) {
      return rows.map((row) => mapRevisionItem(row, subjectNamesById));
    }

    const generatedItems = this.buildRevisionItems(studentId, subjects, plkgSummary);

    if (generatedItems.length === 0) {
      return [];
    }

    const { data, error } = await client
      .from("study_revision_items")
      .insert(
        generatedItems.map((item) => ({
          due_label: item.dueLabel,
          flashcards: item.flashcards,
          mastery_score: item.masteryScore,
          priority_label: item.priorityLabel,
          quiz_questions: item.quizQuestions,
          recommended_action: item.recommendedAction,
          status: item.status,
          student_id: studentId,
          subject_id: item.subjectId,
          topic_label: item.topicLabel,
          trace: item.trace,
        })),
      )
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return (data as StudyRevisionItemRow[]).map((row) => mapRevisionItem(row, subjectNamesById));
  }

  private async listSupabasePreparationPlanRows(
    client: SupabaseClient,
    studentId: string,
  ): Promise<StudyPreparationPlanRow[]> {
    const { data, error } = await client
      .from("study_preparation_plans")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return data as StudyPreparationPlanRow[];
  }

  private async listSupabaseRevisionItemRows(
    client: SupabaseClient,
    studentId: string,
  ): Promise<StudyRevisionItemRow[]> {
    const { data, error } = await client
      .from("study_revision_items")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return data as StudyRevisionItemRow[];
  }

  private async recordSupabaseReflection(
    input: CreateStudyReflectionInput,
    context: StudyRequestContext,
  ): Promise<StudyRevisionItem> {
    const { client, studentId } = this.getSupabaseContext(context);
    const nextStatus = input.confidenceLevel >= 70 ? "completed" : "needs_support";
    const now = new Date().toISOString();
    const nextRecommendedAction =
      nextStatus === "completed"
        ? "Keep this concept in light weekly review."
        : "Ask BLIE for a simpler explanation, then retry the quiz prompt.";

    const { data, error } = await client
      .from("study_revision_items")
      .update({
        recommended_action: nextRecommendedAction,
        status: nextStatus,
        updated_at: now,
      })
      .eq("student_id", studentId)
      .eq("id", input.revisionItemId)
      .select("*")
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("Revision item was not found.");
    }

    const subjects = await this.listSupabaseSubjects(client, studentId);
    const subjectNamesById = Object.fromEntries(
      subjects.map((subject) => [subject.id, subject.name]),
    );

    return mapRevisionItem(data as StudyRevisionItemRow, subjectNamesById);
  }
}
