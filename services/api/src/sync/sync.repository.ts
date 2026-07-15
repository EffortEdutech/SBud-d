import type {
  Database,
  SyncConflictRule,
  SyncPushRequest,
  SyncPushResponse,
  SyncQueueItem,
  SyncStatusSummary,
} from "@sbud-d/types";
import type { SupabaseClient } from "@supabase/supabase-js";

import { DEMO_STUDENT_ID } from "../academic/academic.fixtures.js";
import { getApiEnvironment, type ApiEnvironment } from "../config/environment.js";
import { createSupabaseApiClient } from "../supabase/supabase-api-client.js";

const CREATED_AT = "2026-07-13T00:00:00.000Z";

interface SyncRequestContext {
  accessToken?: string | undefined;
  studentId?: string | undefined;
}

type SyncQueueEventRow = Database["public"]["Tables"]["sync_queue_events"]["Row"];

function mapQueueEvent(row: SyncQueueEventRow): SyncQueueItem {
  return {
    createdAt: row.created_at,
    entityId: row.entity_id,
    entityType: row.entity_type,
    id: row.id,
    lastError: row.last_error,
    operation: row.operation,
    payload: row.payload,
    retryCount: row.retry_count,
    status: row.status,
    studentId: row.student_id,
    updatedAt: row.updated_at,
  };
}

const conflictRules: SyncConflictRule[] = [
  {
    entityType: "document_metadata",
    strategy: "server_authoritative",
    description: "Cloud document metadata wins; offline client may retry metadata creation.",
  },
  {
    entityType: "plkg_learning_activity",
    strategy: "append_only",
    description: "Offline learning events are appended so PLKG growth is never overwritten.",
  },
  {
    entityType: "study_reflection",
    strategy: "client_merge",
    description: "Reflection confidence and text are merged by newest valid timestamp.",
  },
  {
    entityType: "dashboard_snapshot",
    strategy: "server_authoritative",
    description: "Dashboard snapshots are refreshed from cloud when online returns.",
  },
  {
    entityType: "study_snapshot",
    strategy: "server_authoritative",
    description: "Study plans are cached locally but regenerated from cloud context online.",
  },
];

export class SyncRepository {
  private queue: SyncQueueItem[] = [
    {
      id: "sync-demo-study-reflection",
      studentId: DEMO_STUDENT_ID,
      entityType: "study_reflection",
      entityId: "study-revision-plkg-concept-recursion",
      operation: "update",
      status: "synced",
      payload: {
        confidenceLevel: 75,
        reflection: "Demo reflection already synchronized.",
      },
      retryCount: 0,
      lastError: null,
      createdAt: CREATED_AT,
      updatedAt: CREATED_AT,
    },
  ];

  constructor(
    private readonly environment: ApiEnvironment = getApiEnvironment(),
    private readonly createClient: (accessToken?: string) => SupabaseClient = (
      accessToken?: string,
    ) => createSupabaseApiClient(accessToken, this.environment),
  ) {}

  async getStatus(context: SyncRequestContext = {}): Promise<SyncStatusSummary> {
    if (this.environment.dataMode === "supabase") {
      return this.getSupabaseStatus(context);
    }

    return {
      studentId: DEMO_STUDENT_ID,
      connectionStatus: "online",
      cloudIsSystemOfRecord: true,
      pendingCount: this.queue.filter((item) => item.status === "pending").length,
      syncingCount: this.queue.filter((item) => item.status === "syncing").length,
      failedCount: this.queue.filter((item) => item.status === "failed").length,
      lastSyncedAt: this.queue.find((item) => item.status === "synced")?.updatedAt ?? null,
      offlineAvailableSections: ["Dashboard", "Study", "Library metadata", "PLKG summary"],
      queue: structuredClone(this.queue),
      conflictRules,
    };
  }

  getConflictRules(): SyncConflictRule[] {
    return structuredClone(conflictRules);
  }

  async pushPending(
    request: SyncPushRequest,
    context: SyncRequestContext = {},
  ): Promise<SyncPushResponse> {
    if (this.environment.dataMode === "supabase") {
      return this.pushSupabasePending(request, context);
    }

    const now = new Date().toISOString();
    const syncedItems = request.items.map((item) => ({
      ...item,
      status: "synced" as const,
      retryCount: item.retryCount,
      lastError: null,
      updatedAt: now,
    }));

    this.queue = [...syncedItems, ...this.queue.filter((item) => item.status !== "synced")];

    return {
      acceptedCount: syncedItems.length,
      rejectedCount: 0,
      syncedItems,
    };
  }

  private buildStatus(studentId: string, queue: SyncQueueItem[]): SyncStatusSummary {
    return {
      studentId,
      connectionStatus: "online",
      cloudIsSystemOfRecord: true,
      pendingCount: queue.filter((item) => item.status === "pending").length,
      syncingCount: queue.filter((item) => item.status === "syncing").length,
      failedCount: queue.filter((item) => item.status === "failed").length,
      lastSyncedAt: queue.find((item) => item.status === "synced")?.updatedAt ?? null,
      offlineAvailableSections: ["Dashboard", "Study", "Library metadata", "PLKG summary"],
      queue: structuredClone(queue),
      conflictRules,
    };
  }

  private getSupabaseContext(context: SyncRequestContext): {
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

  private async getSupabaseStatus(context: SyncRequestContext): Promise<SyncStatusSummary> {
    const { client, studentId } = this.getSupabaseContext(context);
    const queue = await this.listSupabaseQueue(client, studentId);

    return this.buildStatus(studentId, queue);
  }

  private async listSupabaseQueue(
    client: SupabaseClient,
    studentId: string,
  ): Promise<SyncQueueItem[]> {
    const { data, error } = await client
      .from("sync_queue_events")
      .select("*")
      .eq("student_id", studentId)
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data as SyncQueueEventRow[]).map(mapQueueEvent);
  }

  private async pushSupabasePending(
    request: SyncPushRequest,
    context: SyncRequestContext,
  ): Promise<SyncPushResponse> {
    const { client, studentId } = this.getSupabaseContext(context);
    const now = new Date().toISOString();
    const acceptedItems = request.items.filter((item) => item.studentId === studentId);
    const rejectedCount = request.items.length - acceptedItems.length;

    if (acceptedItems.length === 0) {
      return {
        acceptedCount: 0,
        rejectedCount,
        syncedItems: [],
      };
    }

    const syncedItems = acceptedItems.map((item) => ({
      ...item,
      lastError: null,
      status: "synced" as const,
      studentId,
      updatedAt: now,
    }));

    const { error } = await client.from("sync_queue_events").insert(
      syncedItems.map((item) => ({
        entity_id: item.entityId,
        entity_type: item.entityType,
        last_error: null,
        operation: item.operation,
        payload: item.payload,
        retry_count: item.retryCount,
        status: item.status,
        student_id: studentId,
        updated_at: now,
      })),
    );

    if (error) {
      throw error;
    }

    return {
      acceptedCount: acceptedItems.length,
      rejectedCount,
      syncedItems,
    };
  }
}
