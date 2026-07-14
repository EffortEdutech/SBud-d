import { BadRequestException } from "@nestjs/common";
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
