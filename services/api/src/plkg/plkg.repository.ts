import { randomUUID } from "node:crypto";

import type {
  CreatePlkgLearningActivityInput,
  Database,
  LearningDocument,
  LearningDocumentConcept,
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

export interface PlkgDocumentEnrichmentResult {
  conceptNodes: PlkgNode[];
  edges: PlkgEdge[];
  resourceNode: PlkgNode;
}

function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

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

  async enrichFromDocumentConcepts(
    document: LearningDocument,
    concepts: LearningDocumentConcept[],
    context: PlkgRequestContext = {},
  ): Promise<PlkgDocumentEnrichmentResult> {
    if (this.environment.dataMode === "supabase") {
      return this.enrichSupabaseFromDocumentConcepts(document, concepts, context);
    }

    const now = new Date().toISOString();
    const resourceNode = this.ensureFixtureDocumentResourceNode(document, now);
    const conceptNodes: PlkgNode[] = [];
    const createdEdges: PlkgEdge[] = [];

    for (const concept of concepts) {
      const conceptNode = this.ensureFixtureDocumentConceptNode(document, concept, now);
      conceptNodes.push(conceptNode);
      createdEdges.push(
        this.ensureFixtureEdge({
          createdAt: now,
          label: `${document.title} explains ${concept.label}.`,
          sourceNodeId: resourceNode.id,
          strength: concept.confidence / 100,
          targetNodeId: conceptNode.id,
          type: "explains",
        }),
      );

      const subjectNode = this.nodes.find(
        (node) => node.type === "subject" && node.subjectId === document.subjectId,
      );

      if (subjectNode) {
        createdEdges.push(
          this.ensureFixtureEdge({
            createdAt: now,
            label: `${subjectNode.label} contains ${concept.label}.`,
            sourceNodeId: subjectNode.id,
            strength: 0.65,
            targetNodeId: conceptNode.id,
            type: "contains",
          }),
        );
      }
    }

    this.nodes = [
      ...conceptNodes.filter((node) => !this.nodes.some((candidate) => candidate.id === node.id)),
      ...(this.nodes.some((node) => node.id === resourceNode.id) ? [] : [resourceNode]),
      ...this.nodes,
    ];
    this.edges = [
      ...createdEdges.filter((edge) => !this.edges.some((candidate) => candidate.id === edge.id)),
      ...this.edges,
    ];

    return {
      conceptNodes: structuredClone(conceptNodes),
      edges: structuredClone(createdEdges),
      resourceNode: structuredClone(resourceNode),
    };
  }

  private buildDocumentResourceNode(document: LearningDocument, now: string): PlkgNode {
    return {
      confidenceLevel: 65,
      createdAt: now,
      description: document.summary ?? `Learning resource for ${document.title}.`,
      id: `plkg-resource-${document.id}`,
      label: document.title,
      learningStatus: "understanding",
      masteryScore: 45,
      sourceId: document.id,
      sourceType: "document",
      studentId: document.studentId,
      subjectId: document.subjectId,
      type: "resource",
      updatedAt: now,
    };
  }

  private buildDocumentConceptNode(
    document: LearningDocument,
    concept: LearningDocumentConcept,
    now: string,
  ): PlkgNode {
    return {
      confidenceLevel: concept.confidence,
      createdAt: now,
      description: `${concept.description} Source: ${concept.sourceSnippet}`,
      id: `plkg-concept-${document.id}-${slugify(concept.label)}`,
      label: concept.label,
      learningStatus: "introduced",
      masteryScore: Math.max(15, Math.round(concept.confidence * 0.35)),
      sourceId: document.id,
      sourceType: "document",
      studentId: document.studentId,
      subjectId: document.subjectId,
      type: "concept",
      updatedAt: now,
    };
  }

  private ensureFixtureDocumentResourceNode(document: LearningDocument, now: string): PlkgNode {
    return (
      this.nodes.find(
        (node) =>
          node.type === "resource" &&
          node.sourceType === "document" &&
          node.sourceId === document.id,
      ) ?? this.buildDocumentResourceNode(document, now)
    );
  }

  private ensureFixtureDocumentConceptNode(
    document: LearningDocument,
    concept: LearningDocumentConcept,
    now: string,
  ): PlkgNode {
    const existingNode = this.nodes.find(
      (node) =>
        node.type === "concept" &&
        node.sourceType === "document" &&
        node.sourceId === document.id &&
        node.label.toLowerCase() === concept.label.toLowerCase(),
    );

    if (existingNode) {
      return existingNode;
    }

    return this.buildDocumentConceptNode(document, concept, now);
  }

  private ensureFixtureEdge(input: {
    createdAt: string;
    label: string;
    sourceNodeId: string;
    strength: number;
    targetNodeId: string;
    type: PlkgEdge["type"];
  }): PlkgEdge {
    const existingEdge = this.edges.find(
      (edge) =>
        edge.sourceNodeId === input.sourceNodeId &&
        edge.targetNodeId === input.targetNodeId &&
        edge.type === input.type,
    );

    if (existingEdge) {
      return existingEdge;
    }

    return {
      createdAt: input.createdAt,
      id: `plkg-edge-${slugify(input.sourceNodeId)}-${slugify(input.type)}-${slugify(
        input.targetNodeId,
      )}`,
      label: input.label,
      sourceNodeId: input.sourceNodeId,
      strength: Math.max(0.1, Math.min(1, input.strength)),
      studentId: DEMO_STUDENT_ID,
      targetNodeId: input.targetNodeId,
      type: input.type,
    };
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

  private async enrichSupabaseFromDocumentConcepts(
    document: LearningDocument,
    concepts: LearningDocumentConcept[],
    context: PlkgRequestContext,
  ): Promise<PlkgDocumentEnrichmentResult> {
    const { client, studentId } = this.getSupabaseContext(context);
    const resourceNode = await this.ensureSupabaseDocumentResourceNode(client, studentId, document);
    const conceptNodes: PlkgNode[] = [];
    const edges: PlkgEdge[] = [];

    for (const concept of concepts) {
      const conceptNode = await this.createSupabaseDocumentConceptNode(
        client,
        studentId,
        document,
        concept,
      );
      conceptNodes.push(conceptNode);
      edges.push(
        await this.createSupabaseEdge(client, studentId, {
          label: `${document.title} explains ${concept.label}.`,
          sourceNodeId: resourceNode.id,
          strength: concept.confidence / 100,
          targetNodeId: conceptNode.id,
          type: "explains",
        }),
      );

      const subjectNode = await this.getSupabaseSubjectNode(client, studentId, document.subjectId);

      if (subjectNode) {
        edges.push(
          await this.createSupabaseEdge(client, studentId, {
            label: `${subjectNode.label} contains ${concept.label}.`,
            sourceNodeId: subjectNode.id,
            strength: 0.65,
            targetNodeId: conceptNode.id,
            type: "contains",
          }),
        );
      }
    }

    return { conceptNodes, edges, resourceNode };
  }

  private async ensureSupabaseDocumentResourceNode(
    client: SupabaseClient,
    studentId: string,
    document: LearningDocument,
  ): Promise<PlkgNode> {
    const { data: existingData, error: existingError } = await client
      .from("plkg_nodes")
      .select("*")
      .eq("student_id", studentId)
      .eq("source_type", "document")
      .eq("source_id", document.id)
      .eq("type", "resource")
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingData) {
      return mapNode(existingData as PlkgNodeRow);
    }

    const { data, error } = await client
      .from("plkg_nodes")
      .insert({
        confidence_level: 65,
        description: document.summary ?? `Learning resource for ${document.title}.`,
        id: randomUUID(),
        label: document.title,
        learning_status: "understanding",
        mastery_score: 45,
        source_id: document.id,
        source_type: "document",
        student_id: studentId,
        subject_id: document.subjectId,
        type: "resource",
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapNode(data as PlkgNodeRow);
  }

  private async createSupabaseDocumentConceptNode(
    client: SupabaseClient,
    studentId: string,
    document: LearningDocument,
    concept: LearningDocumentConcept,
  ): Promise<PlkgNode> {
    const { data: existingData, error: existingError } = await client
      .from("plkg_nodes")
      .select("*")
      .eq("student_id", studentId)
      .eq("source_type", "document")
      .eq("source_id", document.id)
      .eq("type", "concept")
      .eq("label", concept.label)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingData) {
      return mapNode(existingData as PlkgNodeRow);
    }

    const { data, error } = await client
      .from("plkg_nodes")
      .insert({
        confidence_level: concept.confidence,
        description: `${concept.description} Source: ${concept.sourceSnippet}`,
        id: randomUUID(),
        label: concept.label,
        learning_status: "introduced",
        mastery_score: Math.max(15, Math.round(concept.confidence * 0.35)),
        source_id: document.id,
        source_type: "document",
        student_id: studentId,
        subject_id: document.subjectId,
        type: "concept",
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapNode(data as PlkgNodeRow);
  }

  private async getSupabaseSubjectNode(
    client: SupabaseClient,
    studentId: string,
    subjectId: string,
  ): Promise<PlkgNode | null> {
    const { data, error } = await client
      .from("plkg_nodes")
      .select("*")
      .eq("student_id", studentId)
      .eq("subject_id", subjectId)
      .eq("type", "subject")
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? mapNode(data as PlkgNodeRow) : null;
  }

  private async createSupabaseEdge(
    client: SupabaseClient,
    studentId: string,
    input: {
      label: string;
      sourceNodeId: string;
      strength: number;
      targetNodeId: string;
      type: PlkgEdge["type"];
    },
  ): Promise<PlkgEdge> {
    const { data: existingData, error: existingError } = await client
      .from("plkg_edges")
      .select("*")
      .eq("student_id", studentId)
      .eq("source_node_id", input.sourceNodeId)
      .eq("target_node_id", input.targetNodeId)
      .eq("type", input.type)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existingData) {
      return mapEdge(existingData as PlkgEdgeRow);
    }

    const { data, error } = await client
      .from("plkg_edges")
      .insert({
        id: randomUUID(),
        label: input.label,
        source_node_id: input.sourceNodeId,
        strength: Math.max(0.1, Math.min(1, input.strength)),
        student_id: studentId,
        target_node_id: input.targetNodeId,
        type: input.type,
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapEdge(data as PlkgEdgeRow);
  }
}
