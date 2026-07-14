import { BadRequestException } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { PlkgService } from "./plkg.service.js";

describe("PlkgService", () => {
  it("returns a student-owned PLKG summary", async () => {
    const summary = await new PlkgService().getSummary();

    expect(summary.studentId).toBe("demo-student");
    expect(summary.nodeCount).toBeGreaterThan(0);
    expect(summary.edgeCount).toBeGreaterThan(0);
    expect(summary.knowledgeGaps.length).toBeGreaterThan(0);
  });

  it("adds a learning activity node and connects it to a subject", async () => {
    const service = new PlkgService();
    const node = await service.addLearningActivity({
      subjectId: "subject-programming",
      label: "Asked BLIE about recursion",
      description: "Student asked for a simple recursion example.",
      sourceId: "blie-test",
    });
    const summary = await service.getSummary();

    expect(node.type).toBe("learning_activity");
    expect(summary.nodes[0]).toEqual(node);
    expect(summary.edges[0]?.targetNodeId).toBe(node.id);
  });

  it("rejects empty learning activity labels", async () => {
    await expect(new PlkgService().addLearningActivity({ label: "" })).rejects.toThrow(
      BadRequestException,
    );
  });

  it("returns PLKG context for BLIE retrieval", async () => {
    const context = await new PlkgService().retrieveContextForBlie("subject-programming");

    expect(context.length).toBeGreaterThan(0);
    expect(context[0]?.sourceType).toBe("plkg");
  });
});
