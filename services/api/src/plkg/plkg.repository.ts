import { randomUUID } from "node:crypto";

import type {
  CreatePlkgLearningActivityInput,
  Database,
  PlkgEdge,
  PlkgNode,
  PlkgSummary,
} from "@sbud-d/types";
import type { SupabaseClient } from "@supabase/supabase-js";

import { DEMO_STUDENT_ID } from "../academic/academic.fixtures.js";
import { getApiEnvironment, type ApiEnvironment } from "../config/environment.js";
import { createSupabaseApiClient } from "../supabase/supabase-api-client.js";
import { demoPlkgEdges, demoPlkgNodes } from "./plkg.fixtures.js";

interface PlkgRequestContext {
  accessToken?: string | undefined;
  studentId?: string | undefined;
}

type PlkgNodeRow = Database["public"]["Tables"]["plkg_nodes"]["Row"];
type PlkgEdgeRow = Database["public"]["Tables"]["plkg_edges"]["Row"];

function mapNode(row: PlkgNodeRow): PlkgNode {
  return {
    confidenceLevel: row.confidence_level,
    createdAt: row.created_at,
    description: row.description,
    id: row.id,
    label: row.label,
    learningStatus: row.learning_status,
    masteryScore: row.mastery_score,
    sourceId: row.source_id,
    sourceType: row.source_type,
    studentId: row.student_id,
    subjectId: row.subject_id,
    type: row.type,
    updatedAt: row.updated_at,
  };
}

function mapEdge(row: PlkgEdgeRow): PlkgEdge {
  return {
    createdAt: row.created_at,
    id: row.id,
    label: row.label,
    sourceNodeId: row.source_node_id,
    strength: row.strength,
    studentId: row.student_id,
    targetNodeId: row.target_node_id,
    type: row.type,
  };
}

function buildSummary(studentId: string, nodes: PlkgNode[], edges: PlkgEdge[]): PlkgSummary {
  const averageMasteryScore =
    nodes.length === 0
      ? 0
      : Math.round(nodes.reduce((total, node) => total + node.masteryScore, 0) / nodes.length);
  const knowledgeGaps = nodes
    .filter((node) => node.learningStatus === "needs_review" || node.masteryScore < 25)
    .map((node) => ({
      nodeId: node.id,
      label: node.label,
      reason: `${node.label} has low mastery or needs review.`,
      recommendedAction: `Ask BLIE to explain ${node.label} step by step, then add one practice example.`,
    }));

  return {
    studentId,
    statusLabel: nodes.length > 4 ? "Growing" : "New Student",
    growthLabel: `${nodes.length} knowledge nodes connected by ${edges.length} relationships`,
    nodeCount: nodes.length,
    edgeCount: edges.length,
    averageMasteryScore,
    nodes: structuredClone(nodes),
    edges: structuredClone(edges),
    knowledgeGaps,
  };
}

export class PlkgRepository {
  private nodes: PlkgNode[] = structuredClone(demoPlkgNodes);
  private edges: PlkgEdge[] = structuredClone(demoPlkgEdges);

  constructor(
    private readonly environment: ApiEnvironment = getApiEnvironment(),
    private readonly createClient: (accessToken?: string) => SupabaseClient = (
      accessToken?: string,
    ) => createSupabaseApiClient(accessToken, this.environment),
  ) {}

  async getSummary(context: PlkgRequestContext = {}): Promise<PlkgSummary> {
    if (this.environment.dataMode === "supabase") {
      const { studentId } = this.getSupabaseContext(context);
      const [nodes, edges] = await Promise.all([
        this.listSupabaseNodes(context),
        this.listSupabaseEdges(context),
      ]);

      return buildSummary(studentId, nodes, edges);
    }

    return buildSummary(DEMO_STUDENT_ID, this.nodes, this.edges);
  }

  async listNodes(context: PlkgRequestContext = {}): Promise<PlkgNode[]> {
    if (this.environment.dataMode === "supabase") {
      return this.listSupabaseNodes(context);
    }

    return structuredClone(this.nodes);
  }

  async listEdges(context: PlkgRequestContext = {}): Promise<PlkgEdge[]> {
    if (this.environment.dataMode === "supabase") {
      return this.listSupabaseEdges(context);
    }

    return structuredClone(this.edges);
  }

  async addLearningActivity(
    input: CreatePlkgLearningActivityInput,
    context: PlkgRequestContext = {},
  ): Promise<PlkgNode> {
    if (this.environment.dataMode === "supabase") {
      return this.addSupabaseLearningActivity(input, context);
    }

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

  private getSupabaseContext(context: PlkgRequestContext): {
    client: SupabaseClient;
    studentId: string;
  } {
    if (!context.accessToken || !context.studentId) {
      throw new Error("Authenticated student context is required for supabase data mode.");
    }

    return {
      client: this.createClient(context.accessToken),
      studentId: context.studentId,
    };
  }

  private async listSupabaseNodes(context: PlkgRequestContext): Promise<PlkgNode[]> {
    const { client, studentId } = this.getSupabaseContext(context);
    const { data, error } = await client
      .from("plkg_nodes")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data as PlkgNodeRow[]).map(mapNode);
  }

  private async listSupabaseEdges(context: PlkgRequestContext): Promise<PlkgEdge[]> {
    const { client, studentId } = this.getSupabaseContext(context);
    const { data, error } = await client
      .from("plkg_edges")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data as PlkgEdgeRow[]).map(mapEdge);
  }

  private async addSupabaseLearningActivity(
    input: CreatePlkgLearningActivityInput,
    context: PlkgRequestContext,
  ): Promise<PlkgNode> {
    const { client, studentId } = this.getSupabaseContext(context);
    const nodeId = randomUUID();
    const { data, error } = await client
      .from("plkg_nodes")
      .insert({
        description: input.description?.trim() || null,
        id: nodeId,
        label: input.label.trim(),
        source_id: input.sourceId ?? null,
        source_type: "blie_interaction",
        student_id: studentId,
        subject_id: input.subjectId ?? null,
        type: "learning_activity",
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    const node = mapNode(data as PlkgNodeRow);

    if (input.subjectId) {
      await this.linkActivityToSubject(client, studentId, input.subjectId, node);
    }

    return node;
  }

  private async linkActivityToSubject(
    client: SupabaseClient,
    studentId: string,
    subjectId: string,
    node: PlkgNode,
  ): Promise<void> {
    const { data: subjectNodeData, error: subjectNodeError } = await client
      .from("plkg_nodes")
      .select("*")
      .eq("student_id", studentId)
      .eq("subject_id", subjectId)
      .eq("type", "subject")
      .maybeSingle();

    if (subjectNodeError) {
      throw subjectNodeError;
    }

    if (!subjectNodeData) {
      return;
    }

    const subjectNode = mapNode(subjectNodeData as PlkgNodeRow);
    const { error } = await client.from("plkg_edges").insert({
      id: randomUUID(),
      label: `${node.label} was generated from a learning activity in ${subjectNode.label}.`,
      source_node_id: subjectNode.id,
      strength: 0.5,
      student_id: studentId,
      target_node_id: node.id,
      type: "generated_from",
    });

    if (error) {
      throw error;
    }
  }
}
