import type {
  DashboardSummary,
  DocumentLibrarySummary,
  BlieChatResponse,
  PlkgSummary,
  StudySummary,
  SyncEntityType,
  SyncPushResponse,
  SyncQueueItem,
  SyncStatusSummary,
} from "@sbud-d/types";

import { apiFetch } from "../lib/api-client";
import {
  getOfflineStorageStatus,
  readOfflineValue,
  writeOfflineValue,
  type OfflineStorageStatus,
} from "./offline-storage";

export { getOfflineStorageStatus } from "./offline-storage";

interface LearningSnapshot {
  blieResponse: BlieChatResponse | null;
  cachedAt: string;
  dashboard: DashboardSummary | null;
  documentLibrary: DocumentLibrarySummary | null;
  plkgSummary: PlkgSummary | null;
  studySummary: StudySummary | null;
}

let snapshot: LearningSnapshot = {
  blieResponse: null,
  cachedAt: new Date(0).toISOString(),
  dashboard: null,
  documentLibrary: null,
  plkgSummary: null,
  studySummary: null,
};

let pendingQueue: SyncQueueItem[] = [];
let hasHydratedOfflineState = false;

const SNAPSHOT_STORAGE_KEY = "sbud-d.offline.learningSnapshot.v1";
const QUEUE_STORAGE_KEY = "sbud-d.offline.pendingQueue.v1";

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

function persistOfflineState(): void {
  void Promise.all([
    writeOfflineValue(SNAPSHOT_STORAGE_KEY, snapshot),
    writeOfflineValue(QUEUE_STORAGE_KEY, pendingQueue),
  ]);
}

export async function hydrateOfflineState(): Promise<OfflineStorageStatus> {
  if (hasHydratedOfflineState) {
    return getOfflineStorageStatus();
  }

  const [storedSnapshot, storedQueue] = await Promise.all([
    readOfflineValue<LearningSnapshot>(SNAPSHOT_STORAGE_KEY, snapshot),
    readOfflineValue<SyncQueueItem[]>(QUEUE_STORAGE_KEY, pendingQueue),
  ]);

  snapshot = {
    ...snapshot,
    ...storedSnapshot,
  };
  pendingQueue = Array.isArray(storedQueue) ? storedQueue : [];
  hasHydratedOfflineState = true;

  return getOfflineStorageStatus();
}

export function cacheLearningSnapshot(input: Partial<Omit<LearningSnapshot, "cachedAt">>): void {
  snapshot = {
    ...snapshot,
    ...input,
    cachedAt: new Date().toISOString(),
  };
  persistOfflineState();
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
  persistOfflineState();

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
  await hydrateOfflineState();

  const response = await apiFetch("/sync/status");

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
  await hydrateOfflineState();

  if (pendingQueue.length === 0) {
    return {
      acceptedCount: 0,
      rejectedCount: 0,
      syncedItems: [],
    };
  }

  const now = new Date().toISOString();
  const pushableItems = pendingQueue.filter(
    (item) => item.status === "pending" || item.status === "failed",
  );
  const pushableIds = new Set(pushableItems.map((item) => item.id));

  if (pushableItems.length === 0) {
    return { acceptedCount: 0, rejectedCount: 0, syncedItems: [] };
  }

  pendingQueue = pendingQueue.map((item) =>
    pushableIds.has(item.id)
      ? {
          ...item,
          lastError: null,
          status: "syncing",
          updatedAt: now,
        }
      : item,
  );
  persistOfflineState();

  const response = await apiFetch("/sync/push", {
    body: JSON.stringify({
      items: pendingQueue.filter((item) => pushableIds.has(item.id)),
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    pendingQueue = pendingQueue.map((item) => ({
      ...item,
      ...(pushableIds.has(item.id)
        ? {
            lastError: `Sync push failed with status ${response.status}.`,
            retryCount: item.retryCount + 1,
            status: "failed" as const,
            updatedAt: new Date().toISOString(),
          }
        : {}),
    }));
    persistOfflineState();
    throw new Error(`Sync push failed with status ${response.status}.`);
  }

  const result = (await response.json()) as SyncPushResponse;
  const syncedIds = new Set(result.syncedItems.map((item) => item.id));
  pendingQueue = pendingQueue
    .map((item) =>
      pushableIds.has(item.id) && !syncedIds.has(item.id)
        ? {
            ...item,
            lastError: "Sync push did not accept this item.",
            retryCount: item.retryCount + 1,
            status: "failed" as const,
            updatedAt: new Date().toISOString(),
          }
        : item,
    )
    .filter((item) => !syncedIds.has(item.id));
  persistOfflineState();

  return result;
}
