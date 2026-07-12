import type { BlieChatRequest, BlieIntent, BlieRetrievedContext } from "@sbud-d/types";

import { demoAcademicProfile, demoSubjects } from "../academic/academic.fixtures.js";
import { demoDocuments } from "../documents/document.fixtures.js";
import { PlkgService } from "../plkg/plkg.service.js";

export interface BlieContextPackage {
  intent: BlieIntent;
  subjectId: string | null;
  subjectName: string | null;
  topicLabel: string | null;
  retrievedContext: BlieRetrievedContext[];
  contextSummary: string;
}

export function detectBlieIntent(message: string): BlieIntent {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("revise") ||
    normalized.includes("revision") ||
    normalized.includes("quiz")
  ) {
    return "revision";
  }

  if (
    normalized.includes("document") ||
    normalized.includes("note") ||
    normalized.includes("lecture")
  ) {
    return "document_question";
  }

  if (normalized.includes("prepare") || normalized.includes("study plan")) {
    return "study_guidance";
  }

  if (
    normalized.includes("explain") ||
    normalized.includes("what is") ||
    normalized.includes("why")
  ) {
    return "concept_explanation";
  }

  return "general_learning";
}

export function assembleBlieContext(input: BlieChatRequest): BlieContextPackage {
  const plkgService = new PlkgService();
  const intent = detectBlieIntent(input.message);
  const requestedSubject = demoSubjects.find((subject) => subject.id === input.subjectId);
  const subject = requestedSubject ?? demoSubjects[0] ?? null;
  const subjectDocuments = subject
    ? demoDocuments.filter((document) => document.subjectId === subject.id)
    : [];

  const retrievedContext: BlieRetrievedContext[] = [
    {
      sourceId: demoAcademicProfile.studentId,
      sourceType: "academic_profile",
      title: demoAcademicProfile.programmeName,
      snippet: `${demoAcademicProfile.currentSemester.label}; goals: ${demoAcademicProfile.academicGoals.join(", ")}`,
      relevanceLabel: "Student academic context",
    },
  ];

  if (subject) {
    retrievedContext.push({
      sourceId: subject.id,
      sourceType: "subject",
      title: `${subject.code} - ${subject.name}`,
      snippet: `Current topic: ${subject.currentTopic ?? "topic pending"}; status: ${subject.learningStatus}`,
      relevanceLabel: "Selected subject context",
    });
  }

  retrievedContext.push(
    ...subjectDocuments.slice(0, 2).map((document) => ({
      sourceId: document.id,
      sourceType: "document" as const,
      title: document.title,
      snippet:
        document.summary ??
        `${document.processing.label} Topic: ${document.topicLabel ?? "topic pending"}.`,
      relevanceLabel: "Retrieved learning material",
    })),
  );

  retrievedContext.push(...plkgService.retrieveContextForBlie(subject?.id ?? null));

  return {
    intent,
    subjectId: subject?.id ?? null,
    subjectName: subject?.name ?? null,
    topicLabel: subject?.currentTopic ?? null,
    retrievedContext,
    contextSummary: `${retrievedContext.length} context items assembled before generation.`,
  };
}
