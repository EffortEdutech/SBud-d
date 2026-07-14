import { randomUUID } from "node:crypto";

import type {
  CreateLearningDocumentInput,
  Database,
  LearningDocument,
  LearningDocumentKind,
} from "@sbud-d/types";
import type { SupabaseClient } from "@supabase/supabase-js";

import { demoSubjects } from "../academic/academic.fixtures.js";
import { getApiEnvironment, type ApiEnvironment } from "../config/environment.js";
import { createSupabaseApiClient } from "../supabase/supabase-api-client.js";
import { DOCUMENT_STORAGE_BUCKET, demoDocuments } from "./document.fixtures.js";

const DEMO_STUDENT_ID = "demo-student";

interface DocumentRequestContext {
  accessToken?: string | undefined;
  studentId?: string | undefined;
}

type LearningDocumentRow = Database["public"]["Tables"]["learning_documents"]["Row"];
type AcademicSubjectRow = Database["public"]["Tables"]["academic_subjects"]["Row"];

function inferDocumentKind(mimeType: string, fileName: string): LearningDocumentKind {
  if (mimeType === "application/pdf") {
    return "pdf";
  }

  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (fileName.toLowerCase().includes("slide")) {
    return "slide";
  }

  if (mimeType === "text/plain") {
    return "note";
  }

  return "reference";
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapDocument(
  row: LearningDocumentRow,
  subjectNamesById: Record<string, string> = {},
): LearningDocument {
  return {
    conceptCount: row.concept_count,
    createdAt: row.created_at,
    fileName: row.file_name,
    fileSizeBytes: row.file_size_bytes,
    id: row.id,
    kind: row.kind,
    mimeType: row.mime_type,
    processing: {
      errorMessage: row.processing_error_message,
      label: row.processing_label,
      progressPercent: row.processing_progress_percent,
      status: row.processing_status,
      updatedAt: row.updated_at,
    },
    storageBucket: row.storage_bucket,
    storagePath: row.storage_path,
    studentId: row.student_id,
    subjectId: row.subject_id,
    subjectName: subjectNamesById[row.subject_id] ?? "Subject pending",
    summary: row.summary,
    title: row.title,
    topicLabel: row.topic_label,
  };
}

export class DocumentRepository {
  private documents: LearningDocument[] = structuredClone(demoDocuments);

  constructor(
    private readonly environment: ApiEnvironment = getApiEnvironment(),
    private readonly createClient: (accessToken?: string) => SupabaseClient = (
      accessToken?: string,
    ) => createSupabaseApiClient(accessToken, this.environment),
  ) {}

  async listDocuments(context: DocumentRequestContext = {}): Promise<LearningDocument[]> {
    if (this.environment.dataMode === "supabase") {
      return this.listSupabaseDocuments(context);
    }

    return structuredClone(this.documents);
  }

  async getDocument(
    id: string,
    context: DocumentRequestContext = {},
  ): Promise<LearningDocument | null> {
    if (this.environment.dataMode === "supabase") {
      return this.getSupabaseDocument(id, context);
    }

    const document = this.documents.find((item) => item.id === id);

    return document ? structuredClone(document) : null;
  }

  async createDocument(
    input: CreateLearningDocumentInput,
    context: DocumentRequestContext = {},
  ): Promise<LearningDocument> {
    if (this.environment.dataMode === "supabase") {
      return this.createSupabaseDocument(input, context);
    }

    const subject = demoSubjects.find((item) => item.id === input.subjectId);
    const documentId = `document-${this.documents.length + 1}`;
    const safeFileName = sanitizeFileName(input.fileName);
    const now = new Date().toISOString();
    const title = input.title?.trim() || safeFileName;

    const document: LearningDocument = {
      id: documentId,
      studentId: DEMO_STUDENT_ID,
      subjectId: input.subjectId,
      subjectName: subject?.name ?? "Subject pending",
      title,
      fileName: safeFileName,
      mimeType: input.mimeType,
      kind: inferDocumentKind(input.mimeType, safeFileName),
      fileSizeBytes: input.fileSizeBytes,
      storageBucket: DOCUMENT_STORAGE_BUCKET,
      storagePath: `${DEMO_STUDENT_ID}/${input.subjectId}/${documentId}/${safeFileName}`,
      topicLabel: input.topicLabel?.trim() || null,
      summary: null,
      conceptCount: 0,
      createdAt: now,
      processing: {
        status: "uploaded",
        label: "Document received.",
        progressPercent: 10,
        updatedAt: now,
        errorMessage: null,
      },
    };

    this.documents = [document, ...this.documents];

    return structuredClone(document);
  }

  private getSupabaseContext(context: DocumentRequestContext): {
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

  private async getSubjectNamesById(
    client: SupabaseClient,
    studentId: string,
    subjectIds: string[],
  ): Promise<Record<string, string>> {
    const uniqueSubjectIds = [...new Set(subjectIds)].filter(Boolean);

    if (uniqueSubjectIds.length === 0) {
      return {};
    }

    const { data, error } = await client
      .from("academic_subjects")
      .select("id,name")
      .eq("student_id", studentId)
      .in("id", uniqueSubjectIds);

    if (error) {
      throw error;
    }

    return Object.fromEntries(
      (data as Pick<AcademicSubjectRow, "id" | "name">[]).map((subject) => [
        subject.id,
        subject.name,
      ]),
    );
  }

  private async listSupabaseDocuments(
    context: DocumentRequestContext,
  ): Promise<LearningDocument[]> {
    const { client, studentId } = this.getSupabaseContext(context);
    const { data, error } = await client
      .from("learning_documents")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const rows = data as LearningDocumentRow[];
    const subjectNamesById = await this.getSubjectNamesById(
      client,
      studentId,
      rows.map((row) => row.subject_id),
    );

    return rows.map((row) => mapDocument(row, subjectNamesById));
  }

  private async getSupabaseDocument(
    id: string,
    context: DocumentRequestContext,
  ): Promise<LearningDocument | null> {
    const { client, studentId } = this.getSupabaseContext(context);
    const { data, error } = await client
      .from("learning_documents")
      .select("*")
      .eq("student_id", studentId)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    const row = data as LearningDocumentRow;
    const subjectNamesById = await this.getSubjectNamesById(client, studentId, [row.subject_id]);

    return mapDocument(row, subjectNamesById);
  }

  private async createSupabaseDocument(
    input: CreateLearningDocumentInput,
    context: DocumentRequestContext,
  ): Promise<LearningDocument> {
    const { client, studentId } = this.getSupabaseContext(context);
    const documentId = randomUUID();
    const safeFileName = sanitizeFileName(input.fileName);
    const title = input.title?.trim() || safeFileName;
    const storagePath = `${studentId}/${input.subjectId}/${documentId}/${safeFileName}`;

    const { data, error } = await client
      .from("learning_documents")
      .insert({
        file_name: safeFileName,
        file_size_bytes: input.fileSizeBytes,
        id: documentId,
        kind: inferDocumentKind(input.mimeType, safeFileName),
        mime_type: input.mimeType,
        storage_path: storagePath,
        student_id: studentId,
        subject_id: input.subjectId,
        title,
        topic_label: input.topicLabel?.trim() || null,
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    const row = data as LearningDocumentRow;
    const subjectNamesById = await this.getSubjectNamesById(client, studentId, [row.subject_id]);

    return mapDocument(row, subjectNamesById);
  }
}
