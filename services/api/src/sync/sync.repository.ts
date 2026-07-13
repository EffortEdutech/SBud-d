import type {
  SyncConflictRule,
  SyncPushRequest,
  SyncPushResponse,
  SyncQueueItem,
  SyncStatusSummary,
} from "@sbud-d/types";

import { DEMO_STUDENT_ID } from "../academic/academic.fixtures.js";

const CREATED_AT = "2026-07-13T00:00:00.000Z";

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

  getStatus(): SyncStatusSummary {
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

  pushPending(request: SyncPushRequest): SyncPushResponse {
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
}
