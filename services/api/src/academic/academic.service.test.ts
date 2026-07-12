import { BadRequestException } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { AcademicService } from "./academic.service.js";

describe("AcademicService", () => {
  it("returns a dashboard summary with academic context", () => {
    const summary = new AcademicService().getDashboardSummary();

    expect(summary.academicOverview.programmeName).toBe("Computer Science");
    expect(summary.subjects.length).toBeGreaterThan(0);
    expect(summary.blieRecommendation.title).toBeTruthy();
  });

  it("creates a subject enrollment placeholder", () => {
    const service = new AcademicService();
    const subject = service.createSubject({
      code: "PHY101",
      creditHours: 3,
      name: "Physics I",
    });

    expect(subject.status).toBe("active");
    expect(service.listSubjects()).toContainEqual(subject);
  });

  it("rejects invalid academic profile updates", () => {
    const service = new AcademicService();

    expect(() => service.updateProfile({ currentSemesterSequence: 0 })).toThrow(
      BadRequestException,
    );
  });
});
