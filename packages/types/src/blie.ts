export type BlieIntent =
  "concept_explanation" | "study_guidance" | "revision" | "document_question" | "general_learning";

export type BlieChatStatus = "ready" | "thinking" | "responding" | "learning" | "error";

export interface BlieChatRequest {
  message: string;
  subjectId?: string | null;
  preferredMode?: "simple" | "detailed" | "example" | "step_by_step" | null;
}

export interface BlieRetrievedContext {
  sourceId: string;
  sourceType: "academic_profile" | "subject" | "document" | "plkg" | "plkg_placeholder";
  title: string;
  snippet: string;
  relevanceLabel: string;
}

export interface BlieLearningResponse {
  explanation: string;
  connection: string;
  example: string;
  checkUnderstanding: string;
  nextStep: string;
}

export interface BlieReasoningTrace {
  intent: BlieIntent;
  retrievalStatus: "grounded" | "partial" | "placeholder";
  provider: string;
  validationStatus: "passed" | "needs_more_context";
  contextSummary: string;
}

export interface BlieChatResponse {
  id: string;
  status: BlieChatStatus;
  subjectId: string | null;
  subjectName: string | null;
  topicLabel: string | null;
  response: BlieLearningResponse;
  retrievedContext: BlieRetrievedContext[];
  trace: BlieReasoningTrace;
  createdAt: string;
}
