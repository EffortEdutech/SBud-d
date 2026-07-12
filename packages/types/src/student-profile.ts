export type SubscriptionStatus = "free" | "premium" | "group" | "expired";

export type OnboardingStatus = "profile_pending" | "academic_pending" | "completed";

export interface StudentProfile {
  id: string;
  displayName: string;
  email: string;
  preferredLearningLanguage: string;
  academicLevel: string | null;
  profileImageUrl: string | null;
  subscriptionStatus: SubscriptionStatus;
  onboardingStatus: OnboardingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentProfileInput {
  id: string;
  displayName: string;
  email: string;
  preferredLearningLanguage?: string;
  academicLevel?: string | null;
}
