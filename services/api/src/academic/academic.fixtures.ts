import type { AcademicProfile, AcademicSubject } from "@sbud-d/types";

export const DEMO_STUDENT_ID = "demo-student";

export const demoAcademicProfile: AcademicProfile = {
  studentId: DEMO_STUDENT_ID,
  university: null,
  programmeName: "Computer Science",
  fieldOfStudy: "Software Engineering",
  academicYear: 1,
  currentSemester: {
    id: "semester-1",
    label: "Semester 1",
    sequence: 1,
    academicPeriod: "2026/2027",
  },
  academicGoals: ["Build consistent study habits", "Prepare before each lecture"],
};

export const demoSubjects: AcademicSubject[] = [
  {
    id: "subject-programming",
    name: "Programming Fundamentals",
    code: "CS101",
    semesterId: "semester-1",
    creditHours: 3,
    lecturerName: null,
    status: "active",
    currentTopic: "Functions and control flow",
    learningStatus: "Getting started",
    progressPercent: 12,
  },
  {
    id: "subject-calculus",
    name: "Calculus I",
    code: "MTH101",
    semesterId: "semester-1",
    creditHours: 3,
    lecturerName: null,
    status: "active",
    currentTopic: "Limits and continuity",
    learningStatus: "Needs preparation",
    progressPercent: 8,
  },
];
