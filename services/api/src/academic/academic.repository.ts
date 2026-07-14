import type {
  AcademicProfile,
  AcademicSemester,
  AcademicSubject,
  CreateAcademicSubjectInput,
  Database,
  UpdateAcademicProfileInput,
} from "@sbud-d/types";
import type { SupabaseClient } from "@supabase/supabase-js";

import { DEMO_STUDENT_ID, demoAcademicProfile, demoSubjects } from "./academic.fixtures.js";
import { getApiEnvironment, type ApiEnvironment } from "../config/environment.js";
import { createSupabaseApiClient } from "../supabase/supabase-api-client.js";

interface AcademicRequestContext {
  accessToken?: string | undefined;
  studentId?: string | undefined;
}

type AcademicProfileRow = Database["public"]["Tables"]["academic_profiles"]["Row"];
type AcademicSemesterRow = Database["public"]["Tables"]["academic_semesters"]["Row"];
type AcademicSubjectRow = Database["public"]["Tables"]["academic_subjects"]["Row"];

function mapSemester(row: AcademicSemesterRow | null, studentId: string): AcademicSemester {
  if (!row) {
    return {
      ...demoAcademicProfile.currentSemester,
      id: `semester-${studentId}`,
    };
  }

  return {
    academicPeriod: row.academic_period,
    id: row.id,
    label: row.label,
    sequence: row.sequence,
  };
}

function mapProfile(
  row: AcademicProfileRow | null,
  semester: AcademicSemester,
  studentId: string,
): AcademicProfile {
  if (!row) {
    return {
      ...structuredClone(demoAcademicProfile),
      currentSemester: semester,
      studentId,
    };
  }

  return {
    academicGoals: row.academic_goals,
    academicYear: row.academic_year,
    currentSemester: semester,
    fieldOfStudy: row.field_of_study,
    programmeName: row.programme_name,
    studentId: row.student_id,
    university: row.university,
  };
}

function mapSubject(row: AcademicSubjectRow): AcademicSubject {
  return {
    code: row.code,
    creditHours: row.credit_hours,
    currentTopic: row.current_topic,
    id: row.id,
    learningStatus: row.learning_status,
    lecturerName: row.lecturer_name,
    name: row.name,
    progressPercent: row.progress_percent,
    semesterId: row.semester_id,
    status: row.status,
  };
}

export class AcademicRepository {
  private profile: AcademicProfile = structuredClone(demoAcademicProfile);
  private subjects: AcademicSubject[] = structuredClone(demoSubjects);

  constructor(
    private readonly environment: ApiEnvironment = getApiEnvironment(),
    private readonly createClient: (accessToken?: string) => SupabaseClient = (
      accessToken?: string,
    ) => createSupabaseApiClient(accessToken, this.environment),
  ) {}

  async getProfile(context: AcademicRequestContext = {}): Promise<AcademicProfile> {
    if (this.environment.dataMode === "supabase") {
      return this.getSupabaseProfile(context);
    }

    return structuredClone(this.profile);
  }

  async updateProfile(
    input: UpdateAcademicProfileInput,
    context: AcademicRequestContext = {},
  ): Promise<AcademicProfile> {
    if (this.environment.dataMode === "supabase") {
      return this.updateSupabaseProfile(input, context);
    }

    this.profile = {
      ...this.profile,
      university: input.university ?? this.profile.university,
      programmeName: input.programmeName ?? this.profile.programmeName,
      fieldOfStudy: input.fieldOfStudy ?? this.profile.fieldOfStudy,
      academicYear: input.academicYear ?? this.profile.academicYear,
      academicGoals: input.academicGoals ?? this.profile.academicGoals,
      currentSemester: {
        ...this.profile.currentSemester,
        label: input.currentSemesterLabel ?? this.profile.currentSemester.label,
        sequence: input.currentSemesterSequence ?? this.profile.currentSemester.sequence,
        academicPeriod: input.academicPeriod ?? this.profile.currentSemester.academicPeriod,
      },
    };

    return this.getProfile();
  }

  async listSubjects(context: AcademicRequestContext = {}): Promise<AcademicSubject[]> {
    if (this.environment.dataMode === "supabase") {
      return this.listSupabaseSubjects(context);
    }

    return structuredClone(this.subjects);
  }

  async createSubject(
    input: CreateAcademicSubjectInput,
    context: AcademicRequestContext = {},
  ): Promise<AcademicSubject> {
    if (this.environment.dataMode === "supabase") {
      return this.createSupabaseSubject(input, context);
    }

    const subject: AcademicSubject = {
      id: `subject-${this.subjects.length + 1}`,
      name: input.name,
      code: input.code,
      semesterId: this.profile.currentSemester.id,
      creditHours: input.creditHours ?? null,
      lecturerName: input.lecturerName ?? null,
      status: "active",
      currentTopic: null,
      learningStatus: "New subject workspace ready",
      progressPercent: 0,
    };

    this.subjects = [...this.subjects, subject];

    return structuredClone(subject);
  }

  getStudentId(): string {
    return DEMO_STUDENT_ID;
  }

  private getSupabaseContext(context: AcademicRequestContext): {
    client: SupabaseClient;
    studentId: string;
  } {
    if (!context.accessToken || !context.studentId) {
      throw new Error("Authenticated student context is required for supabase data mode.");
    }

    return {
      client: this.createClient(context.accessToken),
      studentId: context.studentId,
    };
  }

  private async getCurrentSemester(
    client: SupabaseClient,
    studentId: string,
  ): Promise<AcademicSemester> {
    const { data, error } = await client
      .from("academic_semesters")
      .select("*")
      .eq("student_id", studentId)
      .eq("is_current", true)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return mapSemester(data as AcademicSemesterRow | null, studentId);
  }

  private async getSupabaseProfile(context: AcademicRequestContext): Promise<AcademicProfile> {
    const { client, studentId } = this.getSupabaseContext(context);
    const { data, error } = await client
      .from("academic_profiles")
      .select("*")
      .eq("student_id", studentId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    const semester = await this.getCurrentSemester(client, studentId);

    return mapProfile(data as AcademicProfileRow | null, semester, studentId);
  }

  private async updateSupabaseProfile(
    input: UpdateAcademicProfileInput,
    context: AcademicRequestContext,
  ): Promise<AcademicProfile> {
    const { client, studentId } = this.getSupabaseContext(context);
    const currentProfile = await this.getSupabaseProfile(context);
    const now = new Date().toISOString();

    const { error: profileError } = await client.from("academic_profiles").upsert(
      {
        academic_goals: input.academicGoals ?? currentProfile.academicGoals,
        academic_year: input.academicYear ?? currentProfile.academicYear,
        field_of_study: input.fieldOfStudy ?? currentProfile.fieldOfStudy,
        programme_name: input.programmeName ?? currentProfile.programmeName,
        student_id: studentId,
        university: input.university ?? currentProfile.university,
        updated_at: now,
      },
      { onConflict: "student_id" },
    );

    if (profileError) {
      throw profileError;
    }

    const semester = {
      academic_period: input.academicPeriod ?? currentProfile.currentSemester.academicPeriod,
      id: currentProfile.currentSemester.id,
      is_current: true,
      label: input.currentSemesterLabel ?? currentProfile.currentSemester.label,
      sequence: input.currentSemesterSequence ?? currentProfile.currentSemester.sequence,
      student_id: studentId,
      updated_at: now,
    };

    const { error: semesterError } = await client
      .from("academic_semesters")
      .upsert(semester, { onConflict: "id" });

    if (semesterError) {
      throw semesterError;
    }

    return this.getSupabaseProfile(context);
  }

  private async listSupabaseSubjects(context: AcademicRequestContext): Promise<AcademicSubject[]> {
    const { client, studentId } = this.getSupabaseContext(context);
    const { data, error } = await client
      .from("academic_subjects")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return (data as AcademicSubjectRow[]).map(mapSubject);
  }

  private async createSupabaseSubject(
    input: CreateAcademicSubjectInput,
    context: AcademicRequestContext,
  ): Promise<AcademicSubject> {
    const { client, studentId } = this.getSupabaseContext(context);
    const semester = await this.getCurrentSemester(client, studentId);
    const { data, error } = await client
      .from("academic_subjects")
      .insert({
        code: input.code,
        credit_hours: input.creditHours ?? null,
        lecturer_name: input.lecturerName ?? null,
        name: input.name,
        semester_id: semester.id,
        student_id: studentId,
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapSubject(data as AcademicSubjectRow);
  }
}
