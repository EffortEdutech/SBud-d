import { describe, expect, it } from "vitest";

import { StudyService } from "./study.service.js";

describe("StudyService", () => {
  it("builds preparation and revision guidance from subject and PLKG context", async () => {
    const service = new StudyService();
    const summary = await service.getSummary();

    expect(summary.preparationPlans.length).toBeGreaterThan(0);
    expect(summary.revisionItems.length).toBeGreaterThan(0);
    expect(summary.preparationPlans[0]?.trace.plkgNodeIds.length).toBeGreaterThan(0);
    expect(summary.revisionItems[0]?.flashcards.length).toBeGreaterThan(0);
    expect(summary.revisionItems[0]?.quizQuestions.length).toBeGreaterThan(0);
  });

  it("records revision reflection as completed when confidence is strong", async () => {
    const service = new StudyService();
    const revisionItem = (await service.getSummary()).revisionItems[0];

    expect(revisionItem).toBeDefined();

    const updated = await service.recordReflection({
      revisionItemId: revisionItem!.id,
      confidenceLevel: 80,
      reflection: "I can explain the idea now.",
    });

    expect(updated.status).toBe("completed");
  });
});
