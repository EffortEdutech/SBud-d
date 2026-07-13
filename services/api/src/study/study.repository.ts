import type {
  CreateStudyReflectionInput,
  PlkgSummary,
  StudyPreparationPlan,
  StudyRevisionItem,
  StudySummary,
} from "@sbud-d/types";

import { DEMO_STUDENT_ID, demoSubjects } from "../academic/academic.fixtures.js";
import { PlkgRepository } from "../plkg/plkg.repository.js";

const CREATED_AT = "2026-07-13T00:00:00.000Z";

export class StudyRepository {
  constructor(private readonly plkgRepository: PlkgRepository = new PlkgRepository()) {}

  getSummary(): StudySummary {
    const plkgSummary = this.plkgRepository.getSummary();
    const preparationPlans = this.buildPreparationPlans(plkgSummary);
    const revisionItems = this.buildRevisionItems(plkgSummary);
    const readyCount = preparationPlans.filter((plan) => plan.readinessStatus === "ready").length;
    const completedRevisionCount = revisionItems.filter(
      (item) => item.status === "completed",
    ).length;

    return {
      studentId: DEMO_STUDENT_ID,
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

  listPreparationPlans(): StudyPreparationPlan[] {
    return this.getSummary().preparationPlans;
  }

  listRevisionItems(): StudyRevisionItem[] {
    return this.getSummary().revisionItems;
  }

  recordReflection(input: CreateStudyReflectionInput): StudyRevisionItem {
    const revisionItem = this.getSummary().revisionItems.find(
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

  private buildPreparationPlans(plkgSummary: PlkgSummary): StudyPreparationPlan[] {
    return demoSubjects.map((subject) => {
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
        studentId: DEMO_STUDENT_ID,
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

  private buildRevisionItems(plkgSummary: PlkgSummary): StudyRevisionItem[] {
    const candidateNodes = plkgSummary.nodes
      .filter(
        (node) =>
          node.type === "concept" ||
          node.learningStatus === "needs_review" ||
          node.masteryScore < 35,
      )
      .slice(0, 4);

    return candidateNodes.flatMap((node) => {
      const subject =
        demoSubjects.find((candidate) => candidate.id === node.subjectId) ?? demoSubjects[0];

      if (!subject) {
        return [];
      }

      const priorityLabel = node.masteryScore < 25 ? "high" : "medium";

      return [
        {
          id: `study-revision-${node.id}`,
          studentId: DEMO_STUDENT_ID,
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
}
