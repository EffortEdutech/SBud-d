import type {
  DashboardSummary,
  DocumentLibrarySummary,
  PlkgSummary,
  StudySummary,
  SyncEntityType,
  SyncPushResponse,
  SyncQueueItem,
  SyncStatusSummary,
} from "@sbud-d/types";

import { getApiBaseUrl } from "../config/environment";

interface LearningSnapshot {
  cachedAt: string;
  dashboard: DashboardSummary | null;
  documentLibrary: DocumentLibrarySummary | null;
  plkgSummary: PlkgSummary | null;
  studySummary: StudySummary | null;
}

let snapshot: LearningSnapshot = {
  cachedAt: new Date(0).toISOString(),
  dashboard: null,
  documentLibrary: null,
  plkgSummary: null,
  studySummary: null,
};

let pendingQueue: SyncQueueItem[] = [];

export const fallbackSyncStatus: SyncStatusSummary = {
  studentId: "offline-student",
  connectionStatus: "offline",
  cloudIsSystemOfRecord: true,
  pendingCount: 0,
  syncingCount: 0,
  failedCount: 0,
  lastSyncedAt: null,
  offlineAvailableSections: ["Dashboard", "Study", "Library metadata", "PLKG summary"],
  queue: [],
  conflictRules: [
    {
      entityType: "study_reflection",
      strategy: "client_merge",
      description: "Offline reflections are queued and merged when connectivity returns.",
    },
    {
      entityType: "plkg_learning_activity",
      strategy: "append_only",
      description: "Offline PLKG learning events are appended when sync succeeds.",
    },
  ],
};

export function cacheLearningSnapshot(input: Partial<Omit<LearningSnapshot, "cachedAt">>): void {
  snapshot = {
    ...snapshot,
    ...input,
    cachedAt: new Date().toISOString(),
  };
}

export function getLearningSnapshot(): LearningSnapshot {
  return snapshot;
}

export function enqueueOfflineChange(
  entityType: SyncEntityType,
  entityId: string,
  payload: Record<string, unknown>,
): SyncQueueItem {
  const now = new Date().toISOString();
  const item: SyncQueueItem = {
    id: `local-sync-${Date.now()}-${pendingQueue.length + 1}`,
    studentId: snapshot.dashboard?.academicOverview.studentId ?? "offline-student",
    entityType,
    entityId,
    operation: entityType === "document_metadata" ? "create" : "update",
    status: "pending",
    payload,
    retryCount: 0,
    lastError: null,
    createdAt: now,
    updatedAt: now,
  };

  pendingQueue = [item, ...pendingQueue];

  return item;
}

export function getLocalSyncStatus(): SyncStatusSummary {
  return {
    ...fallbackSyncStatus,
    studentId: snapshot.dashboard?.academicOverview.studentId ?? fallbackSyncStatus.studentId,
    pendingCount: pendingQueue.filter((item) => item.status === "pending").length,
    syncingCount: pendingQueue.filter((item) => item.status === "syncing").length,
    failedCount: pendingQueue.filter((item) => item.status === "failed").length,
    lastSyncedAt: snapshot.cachedAt === new Date(0).toISOString() ? null : snapshot.cachedAt,
    queue: pendingQueue,
  };
}

export async function fetchSyncStatus(): Promise<SyncStatusSummary> {
  const response = await fetch(`${getApiBaseUrl()}/sync/status`);

  if (!response.ok) {
    throw new Error(`Sync status request failed with status ${response.status}.`);
  }

  const cloudStatus = (await response.json()) as SyncStatusSummary;

  return {
    ...cloudStatus,
    pendingCount: cloudStatus.pendingCount + pendingQueue.length,
    queue: [...pendingQueue, ...cloudStatus.queue],
  };
}

export async function pushPendingQueue(): Promise<SyncPushResponse> {
  if (pendingQueue.length === 0) {
    return {
      acceptedCount: 0,
      rejectedCount: 0,
      syncedItems: [],
    };
  }

  const response = await fetch(`${getApiBaseUrl()}/sync/push`, {
    body: JSON.stringify({ items: pendingQueue }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    pendingQueue = pendingQueue.map((item) => ({
      ...item,
      status: "failed",
      retryCount: item.retryCount + 1,
      lastError: `Sync push failed with status ${response.status}.`,
      updatedAt: new Date().toISOString(),
    }));
    throw new Error(`Sync push failed with status ${response.status}.`);
  }

  const result = (await response.json()) as SyncPushResponse;
  const syncedIds = new Set(result.syncedItems.map((item) => item.id));
  pendingQueue = pendingQueue.filter((item) => !syncedIds.has(item.id));

  return result;
}
