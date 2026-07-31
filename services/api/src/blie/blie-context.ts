import type { BlieChatRequest, BlieIntent, BlieRetrievedContext } from "@sbud-d/types";

import { AcademicService } from "../academic/academic.service.js";
import { DocumentService } from "../documents/document.service.js";
import { PlkgService } from "../plkg/plkg.service.js";

export interface BlieRequestContext {
  authorizationHeader?: string | undefined;
}

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

export async function assembleBlieContext(
  input: BlieChatRequest,
  requestContext: BlieRequestContext = {},
): Promise<BlieContextPackage> {
  const academicService = new AcademicService();
  const documentService = new DocumentService();
  const plkgService = new PlkgService();
  const intent = detectBlieIntent(input.message);
  const [academicProfile, subjects, documents] = await Promise.all([
    academicService.getProfile(requestContext),
    academicService.listSubjects(requestContext),
    documentService.listDocuments(requestContext),
  ]);
  const requestedSubject = subjects.find((subject) => subject.id === input.subjectId);
  const subject = requestedSubject ?? subjects[0] ?? null;
  const subjectDocuments = subject
    ? documents.filter((document) => document.subjectId === subject.id)
    : [];

  const retrievedContext: BlieRetrievedContext[] = [
    {
      sourceId: academicProfile.studentId,
      sourceType: "academic_profile",
      title: academicProfile.programmeName,
      snippet: `${academicProfile.currentSemester.label}; goals: ${academicProfile.academicGoals.join(", ")}`,
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
      snippet: [
        document.summary ??
          `${document.processing.label} Topic: ${document.topicLabel ?? "topic pending"}.`,
        document.extractedConcepts.length > 0
          ? `Concepts: ${document.extractedConcepts.map((concept) => concept.label).join(", ")}.`
          : null,
      ]
        .filter(Boolean)
        .join(" "),
      relevanceLabel: "Retrieved learning material",
    })),
  );

  retrievedContext.push(
    ...(await plkgService.retrieveContextForBlie(subject?.id ?? null, requestContext)),
  );

  return {
    intent,
    subjectId: subject?.id ?? null,
    subjectName: subject?.name ?? null,
    topicLabel: subject?.currentTopic ?? null,
    retrievedContext,
    contextSummary: `${retrievedContext.length} context items assembled before generation.`,
  };
}
