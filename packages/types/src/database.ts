export interface Database {
  public: {
    Tables: {
      student_profiles: {
        Row: {
          id: string;
          display_name: string;
          email: string;
          preferred_learning_language: string;
          academic_level: string | null;
          profile_image_url: string | null;
          subscription_status: "free" | "premium" | "group" | "expired";
          onboarding_status: "profile_pending" | "academic_pending" | "completed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          email: string;
          preferred_learning_language?: string;
          academic_level?: string | null;
          profile_image_url?: string | null;
          subscription_status?: "free" | "premium" | "group" | "expired";
          onboarding_status?: "profile_pending" | "academic_pending" | "completed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string;
          email?: string;
          preferred_learning_language?: string;
          academic_level?: string | null;
          profile_image_url?: string | null;
          subscription_status?: "free" | "premium" | "group" | "expired";
          onboarding_status?: "profile_pending" | "academic_pending" | "completed";
          updated_at?: string;
        };
      };
    };
  };
}
