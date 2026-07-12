import type {
  CreatePlkgLearningActivityInput,
  PlkgEdge,
  PlkgNode,
  PlkgSummary,
} from "@sbud-d/types";

import { DEMO_STUDENT_ID } from "../academic/academic.fixtures.js";
import { demoPlkgEdges, demoPlkgNodes } from "./plkg.fixtures.js";

export class PlkgRepository {
  private nodes: PlkgNode[] = structuredClone(demoPlkgNodes);
  private edges: PlkgEdge[] = structuredClone(demoPlkgEdges);

  getSummary(): PlkgSummary {
    const averageMasteryScore =
      this.nodes.length === 0
        ? 0
        : Math.round(
            this.nodes.reduce((total, node) => total + node.masteryScore, 0) / this.nodes.length,
          );
    const knowledgeGaps = this.nodes
      .filter((node) => node.learningStatus === "needs_review" || node.masteryScore < 25)
      .map((node) => ({
        nodeId: node.id,
        label: node.label,
        reason: `${node.label} has low mastery or needs review.`,
        recommendedAction: `Ask BLIE to explain ${node.label} step by step, then add one practice example.`,
      }));

    return {
      studentId: DEMO_STUDENT_ID,
      statusLabel: this.nodes.length > 4 ? "Growing" : "New Student",
      growthLabel: `${this.nodes.length} knowledge nodes connected by ${this.edges.length} relationships`,
      nodeCount: this.nodes.length,
      edgeCount: this.edges.length,
      averageMasteryScore,
      nodes: structuredClone(this.nodes),
      edges: structuredClone(this.edges),
      knowledgeGaps,
    };
  }

  listNodes(): PlkgNode[] {
    return structuredClone(this.nodes);
  }

  listEdges(): PlkgEdge[] {
    return structuredClone(this.edges);
  }

  addLearningActivity(input: CreatePlkgLearningActivityInput): PlkgNode {
    const now = new Date().toISOString();
    const nodeId = `plkg-activity-${this.nodes.length + 1}`;
    const node: PlkgNode = {
      id: nodeId,
      studentId: DEMO_STUDENT_ID,
      subjectId: input.subjectId ?? null,
      type: "learning_activity",
      label: input.label.trim(),
      description: input.description?.trim() || null,
      learningStatus: "introduced",
      confidenceLevel: 10,
      masteryScore: 10,
      sourceType: "blie_interaction",
      sourceId: input.sourceId ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.nodes = [node, ...this.nodes];

    if (input.subjectId) {
      const subjectNode = this.nodes.find(
        (candidate) => candidate.type === "subject" && candidate.subjectId === input.subjectId,
      );

      if (subjectNode) {
        this.edges = [
          {
            id: `plkg-edge-${this.edges.length + 1}`,
            studentId: DEMO_STUDENT_ID,
            sourceNodeId: subjectNode.id,
            targetNodeId: node.id,
            type: "generated_from",
            label: `${node.label} was generated from a learning activity in ${subjectNode.label}.`,
            strength: 0.5,
            createdAt: now,
          },
          ...this.edges,
        ];
      }
    }

    return structuredClone(node);
  }
}
