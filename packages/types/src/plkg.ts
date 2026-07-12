export type PlkgNodeType = "subject" | "topic" | "concept" | "resource" | "learning_activity";

export type PlkgLearningStatus =
  "introduced" | "learning" | "understanding" | "mastered" | "needs_review";

export type PlkgEdgeType =
  "contains" | "requires" | "related_to" | "explains" | "generated_from" | "reinforces";

export interface PlkgNode {
  id: string;
  studentId: string;
  subjectId: string | null;
  type: PlkgNodeType;
  label: string;
  description: string | null;
  learningStatus: PlkgLearningStatus;
  confidenceLevel: number;
  masteryScore: number;
  sourceType: "academic_profile" | "document" | "blie_interaction" | "manual";
  sourceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlkgEdge {
  id: string;
  studentId: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: PlkgEdgeType;
  label: string;
  strength: number;
  createdAt: string;
}

export interface PlkgKnowledgeGap {
  nodeId: string;
  label: string;
  reason: string;
  recommendedAction: string;
}

export interface PlkgSummary {
  studentId: string;
  statusLabel: string;
  growthLabel: string;
  nodeCount: number;
  edgeCount: number;
  averageMasteryScore: number;
  nodes: PlkgNode[];
  edges: PlkgEdge[];
  knowledgeGaps: PlkgKnowledgeGap[];
}

export interface CreatePlkgLearningActivityInput {
  subjectId?: string | null;
  label: string;
  description?: string | null;
  sourceId?: string | null;
}
