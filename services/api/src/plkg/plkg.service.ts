import { BadRequestException } from "@nestjs/common";
import type {
  BlieRetrievedContext,
  CreatePlkgLearningActivityInput,
  PlkgEdge,
  PlkgNode,
  PlkgSummary,
} from "@sbud-d/types";

import { PlkgRepository } from "./plkg.repository.js";

export class PlkgService {
  constructor(private readonly repository: PlkgRepository = new PlkgRepository()) {}

  getSummary(): PlkgSummary {
    return this.repository.getSummary();
  }

  listNodes(): PlkgNode[] {
    return this.repository.listNodes();
  }

  listEdges(): PlkgEdge[] {
    return this.repository.listEdges();
  }

  addLearningActivity(input: CreatePlkgLearningActivityInput): PlkgNode {
    if (!input.label?.trim()) {
      throw new BadRequestException("label is required.");
    }

    return this.repository.addLearningActivity(input);
  }

  retrieveContextForBlie(subjectId: string | null): BlieRetrievedContext[] {
    const summary = this.repository.getSummary();
    const subjectNodes = subjectId
      ? summary.nodes.filter((node) => node.subjectId === subjectId)
      : summary.nodes;
    const priorityNodes = subjectNodes
      .filter((node) => node.learningStatus === "needs_review" || node.type === "concept")
      .slice(0, 2);
    const selectedNodes = priorityNodes.length > 0 ? priorityNodes : subjectNodes.slice(0, 2);

    return selectedNodes.map((node) => ({
      sourceId: node.id,
      sourceType: "plkg",
      title: node.label,
      snippet: `${node.type}; status: ${node.learningStatus}; mastery: ${node.masteryScore}%.`,
      relevanceLabel: "Student PLKG context",
    }));
  }
}
