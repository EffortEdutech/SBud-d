import type { AcademicProfile, AcademicSubject } from "./academic.js";

export interface DashboardSummary {
  academicOverview: AcademicProfile;
  subjects: AcademicSubject[];
  learningStatus: {
    stage: string;
    knowledgeGrowthLabel: string;
    readinessLabel: string;
  };
  blieRecommendation: {
    title: string;
    body: string;
    actionLabel: string;
  };
}
