import { BadRequestException } from "@nestjs/common";
import type { DocumentLibrarySummary, PlkgSummary, StudySummary } from "@sbud-d/types";
import { describe, expect, it } from "vitest";

import { AcademicService } from "./academic.service.js";
import { AcademicRepository } from "./academic.repository.js";

describe("AcademicService", () => {
  it("returns a dashboard summary with academic context", async () => {
    const summary = await new AcademicService().getDashboardSummary();

    expect(summary.academicOverview.programmeName).toBe("Computer Science");
    expect(summary.subjects.length).toBeGreaterThan(0);
    expect(summary.blieRecommendation.title).toBeTruthy();
  });

  it("creates a subject enrollment placeholder", async () => {
    const service = new AcademicService();
    const subject = await service.createSubject({
      code: "PHY101",
      creditHours: 3,
      name: "Physics I",
    });

    expect(subject.status).toBe("active");
    await expect(service.listSubjects()).resolves.toContainEqual(subject);
  });

  it("aggregates dashboard state from document, PLKG, and study summaries", async () => {
    const documentLibrary: DocumentLibrarySummary = {
      documents: [
        {
          conceptCount: 3,
          createdAt: "2026-07-15T00:00:00.000Z",
          fileName: "recursion.pdf",
          fileSizeBytes: 1024,
          id: "document-1",
          kind: "pdf",
          mimeType: "application/pdf",
          processing: {
            errorMessage: null,
            label: "Connected to PLKG.",
            progressPercent: 100,
            status: "connected",
            updatedAt: "2026-07-15T00:00:00.000Z",
          },
          storageBucket: "student-documents",
          storagePath: "demo-student/subject-programming/document-1/recursion.pdf",
          studentId: "demo-student",
          subjectId: "subject-programming",
          subjectName: "Programming Fundamentals",
          summary: "Recursion lecture notes.",
          title: "Recursion",
          topicLabel: "Recursion",
        },
      ],
      emptyState: {
        body: "Upload materials.",
        title: "No learning materials yet",
      },
      upload: {
        acceptedMimeTypes: ["application/pdf"],
        maxFileSizeBytes: 10_000,
        storageBucket: "student-documents",
        storagePathPattern: "{studentId}/{subjectId}/{documentId}/{fileName}",
      },
    };
    const plkgSummary: PlkgSummary = {
      averageMasteryScore: 20,
      edgeCount: 4,
      edges: [],
      growthLabel: "8 knowledge nodes connected by 4 relationships",
      knowledgeGaps: [
        {
          label: "Recursion",
          nodeId: "plkg-node-1",
          reason: "Low mastery.",
          recommendedAction: "Ask BLIE to explain Recursion step by step.",
        },
      ],
      nodeCount: 8,
      nodes: [],
      statusLabel: "Growing",
      studentId: "demo-student",
    };
    const studySummary: StudySummary = {
      preparationPlans: [],
      preparationReadinessLabel: "1/2 topics ready",
      recommendedFocusLabel: "Recursion",
      revisionItems: [],
      revisionProgressLabel: "0/1 revision items complete",
      studentId: "demo-student",
    };
    const service = new AcademicService(
      new AcademicRepository(),
      undefined,
      { getLibrarySummary: async () => documentLibrary },
      { getSummary: async () => plkgSummary },
      { getSummary: async () => studySummary },
    );

    const summary = await service.getDashboardSummary();

    expect(summary.learningStatus).toMatchObject({
      knowledgeGrowthLabel: "8 PLKG nodes, 4 relationships, 1 learning materials",
      readinessLabel: "1/2 topics ready",
      stage: "Learning materials connected",
    });
    expect(summary.blieRecommendation).toMatchObject({
      actionLabel: "Ask BLIE",
      title: "Review Recursion",
    });
  });

  it("rejects invalid academic profile updates", async () => {
    const service = new AcademicService();

    await expect(service.updateProfile({ currentSemesterSequence: 0 })).rejects.toThrow(
      BadRequestException,
    );
  });

  it("requires authenticated context in supabase data mode", async () => {
    const service = new AcademicService(
      new AcademicRepository({
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      }),
      {
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      },
    );

    await expect(service.getProfile()).rejects.toThrow("Missing bearer token.");
  });
});
