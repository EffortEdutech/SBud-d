import type {
  AcademicProfile,
  AcademicSubject,
  CreateAcademicSubjectInput,
  UpdateAcademicProfileInput,
} from "@sbud-d/types";

import { DEMO_STUDENT_ID, demoAcademicProfile, demoSubjects } from "./academic.fixtures.js";

export class AcademicRepository {
  private profile: AcademicProfile = structuredClone(demoAcademicProfile);
  private subjects: AcademicSubject[] = structuredClone(demoSubjects);

  getProfile(): AcademicProfile {
    return structuredClone(this.profile);
  }

  updateProfile(input: UpdateAcademicProfileInput): AcademicProfile {
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

  listSubjects(): AcademicSubject[] {
    return structuredClone(this.subjects);
  }

  createSubject(input: CreateAcademicSubjectInput): AcademicSubject {
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
}
