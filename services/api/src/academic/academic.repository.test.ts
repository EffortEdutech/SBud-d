import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import { AcademicRepository } from "./academic.repository.js";

function createSingleResultClient(results: Record<string, unknown>): SupabaseClient {
  return {
    from(tableName: string) {
      const result = results[tableName];
      const chain = {
        eq: () => chain,
        maybeSingle: async () => ({ data: result, error: null }),
        order: async () => ({ data: result, error: null }),
        select: () => chain,
      };

      return chain;
    },
  } as unknown as SupabaseClient;
}

describe("AcademicRepository", () => {
  it("maps Supabase academic profile and current semester rows", async () => {
    const repository = new AcademicRepository(
      {
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      },
      () =>
        createSingleResultClient({
          academic_profiles: {
            academic_goals: ["Pass calculus"],
            academic_year: 1,
            field_of_study: "Mathematics",
            programme_name: "Applied Mathematics",
            student_id: "student-1",
            university: "Demo University",
          },
          academic_semesters: {
            academic_period: "2026/2027",
            id: "semester-1",
            label: "Semester 1",
            sequence: 1,
          },
        }),
    );

    const profile = await repository.getProfile({
      accessToken: "token",
      studentId: "student-1",
    });

    expect(profile).toMatchObject({
      academicGoals: ["Pass calculus"],
      currentSemester: {
        id: "semester-1",
        label: "Semester 1",
      },
      programmeName: "Applied Mathematics",
      studentId: "student-1",
    });
  });

  it("maps Supabase subject rows", async () => {
    const repository = new AcademicRepository(
      {
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      },
      () =>
        createSingleResultClient({
          academic_subjects: [
            {
              code: "MAT101",
              credit_hours: 3,
              current_topic: "Limits",
              id: "subject-1",
              learning_status: "Ready",
              lecturer_name: null,
              name: "Calculus I",
              progress_percent: 15,
              semester_id: "semester-1",
              status: "active",
            },
          ],
        }),
    );

    const subjects = await repository.listSubjects({
      accessToken: "token",
      studentId: "student-1",
    });

    expect(subjects).toEqual([
      {
        code: "MAT101",
        creditHours: 3,
        currentTopic: "Limits",
        id: "subject-1",
        learningStatus: "Ready",
        lecturerName: null,
        name: "Calculus I",
        progressPercent: 15,
        semesterId: "semester-1",
        status: "active",
      },
    ]);
  });
});
