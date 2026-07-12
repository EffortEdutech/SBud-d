export type SubjectEnrollmentStatus = "active" | "completed" | "dropped";

export interface AcademicProfile {
  studentId: string;
  university: string | null;
  programmeName: string;
  fieldOfStudy: string | null;
  academicYear: number | null;
  currentSemester: AcademicSemester;
  academicGoals: string[];
}

export interface AcademicSemester {
  id: string;
  label: string;
  sequence: number;
  academicPeriod: string | null;
}

export interface AcademicSubject {
  id: string;
  name: string;
  code: string;
  semesterId: string;
  creditHours: number | null;
  lecturerName: string | null;
  status: SubjectEnrollmentStatus;
  currentTopic: string | null;
  learningStatus: string;
  progressPercent: number;
}

export interface UpdateAcademicProfileInput {
  university?: string | null;
  programmeName?: string;
  fieldOfStudy?: string | null;
  academicYear?: number | null;
  currentSemesterLabel?: string;
  currentSemesterSequence?: number;
  academicPeriod?: string | null;
  academicGoals?: string[];
}

export interface CreateAcademicSubjectInput {
  name: string;
  code: string;
  creditHours?: number | null;
  lecturerName?: string | null;
}
