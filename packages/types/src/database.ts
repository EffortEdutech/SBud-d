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
      academic_profiles: {
        Row: {
          student_id: string;
          university: string | null;
          programme_name: string;
          field_of_study: string | null;
          academic_year: number | null;
          academic_goals: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          student_id: string;
          university?: string | null;
          programme_name: string;
          field_of_study?: string | null;
          academic_year?: number | null;
          academic_goals?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          university?: string | null;
          programme_name?: string;
          field_of_study?: string | null;
          academic_year?: number | null;
          academic_goals?: string[];
          updated_at?: string;
        };
      };
      academic_semesters: {
        Row: {
          id: string;
          student_id: string;
          label: string;
          sequence: number;
          academic_period: string | null;
          is_current: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          label: string;
          sequence: number;
          academic_period?: string | null;
          is_current?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          label?: string;
          sequence?: number;
          academic_period?: string | null;
          is_current?: boolean;
          updated_at?: string;
        };
      };
      academic_subjects: {
        Row: {
          id: string;
          student_id: string;
          semester_id: string;
          name: string;
          code: string;
          credit_hours: number | null;
          lecturer_name: string | null;
          status: "active" | "completed" | "dropped";
          current_topic: string | null;
          learning_status: string;
          progress_percent: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          semester_id: string;
          name: string;
          code: string;
          credit_hours?: number | null;
          lecturer_name?: string | null;
          status?: "active" | "completed" | "dropped";
          current_topic?: string | null;
          learning_status?: string;
          progress_percent?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          semester_id?: string;
          name?: string;
          code?: string;
          credit_hours?: number | null;
          lecturer_name?: string | null;
          status?: "active" | "completed" | "dropped";
          current_topic?: string | null;
          learning_status?: string;
          progress_percent?: number;
          updated_at?: string;
        };
      };
      learning_documents: {
        Row: {
          id: string;
          student_id: string;
          subject_id: string;
          title: string;
          file_name: string;
          mime_type: string;
          kind: "pdf" | "image" | "note" | "slide" | "reference";
          file_size_bytes: number;
          storage_bucket: string;
          storage_path: string;
          topic_label: string | null;
          processing_status: "uploaded" | "processing" | "understanding" | "connected" | "failed";
          processing_label: string;
          processing_progress_percent: number;
          processing_error_message: string | null;
          summary: string | null;
          concept_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject_id: string;
          title: string;
          file_name: string;
          mime_type: string;
          kind: "pdf" | "image" | "note" | "slide" | "reference";
          file_size_bytes: number;
          storage_bucket?: string;
          storage_path: string;
          topic_label?: string | null;
          processing_status?: "uploaded" | "processing" | "understanding" | "connected" | "failed";
          processing_label?: string;
          processing_progress_percent?: number;
          processing_error_message?: string | null;
          summary?: string | null;
          concept_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          subject_id?: string;
          title?: string;
          file_name?: string;
          mime_type?: string;
          kind?: "pdf" | "image" | "note" | "slide" | "reference";
          file_size_bytes?: number;
          storage_bucket?: string;
          storage_path?: string;
          topic_label?: string | null;
          processing_status?: "uploaded" | "processing" | "understanding" | "connected" | "failed";
          processing_label?: string;
          processing_progress_percent?: number;
          processing_error_message?: string | null;
          summary?: string | null;
          concept_count?: number;
          updated_at?: string;
        };
      };
      plkg_nodes: {
        Row: {
          id: string;
          student_id: string;
          subject_id: string | null;
          type: "subject" | "topic" | "concept" | "resource" | "learning_activity";
          label: string;
          description: string | null;
          learning_status:
            "introduced" | "learning" | "understanding" | "mastered" | "needs_review";
          confidence_level: number;
          mastery_score: number;
          source_type: "academic_profile" | "document" | "blie_interaction" | "manual";
          source_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject_id?: string | null;
          type: "subject" | "topic" | "concept" | "resource" | "learning_activity";
          label: string;
          description?: string | null;
          learning_status?:
            "introduced" | "learning" | "understanding" | "mastered" | "needs_review";
          confidence_level?: number;
          mastery_score?: number;
          source_type?: "academic_profile" | "document" | "blie_interaction" | "manual";
          source_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          subject_id?: string | null;
          type?: "subject" | "topic" | "concept" | "resource" | "learning_activity";
          label?: string;
          description?: string | null;
          learning_status?:
            "introduced" | "learning" | "understanding" | "mastered" | "needs_review";
          confidence_level?: number;
          mastery_score?: number;
          source_type?: "academic_profile" | "document" | "blie_interaction" | "manual";
          source_id?: string | null;
          updated_at?: string;
        };
      };
      plkg_edges: {
        Row: {
          id: string;
          student_id: string;
          source_node_id: string;
          target_node_id: string;
          type:
            "contains" | "requires" | "related_to" | "explains" | "generated_from" | "reinforces";
          label: string;
          strength: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          source_node_id: string;
          target_node_id: string;
          type:
            "contains" | "requires" | "related_to" | "explains" | "generated_from" | "reinforces";
          label: string;
          strength?: number;
          created_at?: string;
        };
        Update: {
          source_node_id?: string;
          target_node_id?: string;
          type?:
            "contains" | "requires" | "related_to" | "explains" | "generated_from" | "reinforces";
          label?: string;
          strength?: number;
        };
      };
    };
  };
}
