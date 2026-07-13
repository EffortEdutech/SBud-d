import { describe, expect, it } from "vitest";

import { StudyService } from "./study.service.js";

describe("StudyService", () => {
  it("builds preparation and revision guidance from subject and PLKG context", () => {
    const service = new StudyService();
    const summary = service.getSummary();

    expect(summary.preparationPlans.length).toBeGreaterThan(0);
    expect(summary.revisionItems.length).toBeGreaterThan(0);
    expect(summary.preparationPlans[0]?.trace.plkgNodeIds.length).toBeGreaterThan(0);
    expect(summary.revisionItems[0]?.flashcards.length).toBeGreaterThan(0);
    expect(summary.revisionItems[0]?.quizQuestions.length).toBeGreaterThan(0);
  });

  it("records revision reflection as completed when confidence is strong", () => {
    const service = new StudyService();
    const revisionItem = service.getSummary().revisionItems[0];

    expect(revisionItem).toBeDefined();

    const updated = service.recordReflection({
      revisionItemId: revisionItem!.id,
      confidenceLevel: 80,
      reflection: "I can explain the idea now.",
    });

    expect(updated.status).toBe("completed");
  });
});
