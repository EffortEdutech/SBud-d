import { BadRequestException } from "@nestjs/common";
import type {
  BlieRetrievedContext,
  CreatePlkgLearningActivityInput,
  PlkgEdge,
  PlkgNode,
  PlkgSummary,
} from "@sbud-d/types";

import { PlkgRepository } from "./plkg.repository.js";
import { getAuthenticatedUserAndTokenFromHeader } from "../auth/supabase-auth-client.js";
import { getApiEnvironment, type ApiEnvironment } from "../config/environment.js";

interface PlkgRequestContext {
  authorizationHeader?: string | undefined;
}

export class PlkgService {
  constructor(
    private readonly repository: PlkgRepository = new PlkgRepository(),
    private readonly environment: ApiEnvironment = getApiEnvironment(),
  ) {}

  async getSummary(context: PlkgRequestContext = {}): Promise<PlkgSummary> {
    return this.repository.getSummary(await this.getRepositoryContext(context));
  }

  async listNodes(context: PlkgRequestContext = {}): Promise<PlkgNode[]> {
    return this.repository.listNodes(await this.getRepositoryContext(context));
  }

  async listEdges(context: PlkgRequestContext = {}): Promise<PlkgEdge[]> {
    return this.repository.listEdges(await this.getRepositoryContext(context));
  }

  async addLearningActivity(
    input: CreatePlkgLearningActivityInput,
    context: PlkgRequestContext = {},
  ): Promise<PlkgNode> {
    if (!input.label?.trim()) {
      throw new BadRequestException("label is required.");
    }

    return this.repository.addLearningActivity(input, await this.getRepositoryContext(context));
  }

  async retrieveContextForBlie(
    subjectId: string | null,
    context: PlkgRequestContext = {},
  ): Promise<BlieRetrievedContext[]> {
    const summary = await this.repository.getSummary(await this.getRepositoryContext(context));
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

  private async getRepositoryContext(context: PlkgRequestContext) {
    if (this.environment.dataMode !== "supabase") {
      return {};
    }

    const user = await getAuthenticatedUserAndTokenFromHeader(context.authorizationHeader);

    return {
      accessToken: user.accessToken,
      studentId: user.id,
    };
  }
}
