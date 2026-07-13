export type SyncConnectionStatus = "online" | "offline" | "degraded";

export type SyncQueueStatus = "pending" | "syncing" | "synced" | "failed";

export type SyncOperation = "create" | "update" | "delete";

export type SyncEntityType =
  | "dashboard_snapshot"
  | "document_metadata"
  | "plkg_learning_activity"
  | "study_reflection"
  | "study_snapshot";

export interface SyncQueueItem {
  id: string;
  studentId: string;
  entityType: SyncEntityType;
  entityId: string;
  operation: SyncOperation;
  status: SyncQueueStatus;
  payload: Record<string, unknown>;
  retryCount: number;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SyncConflictRule {
  entityType: SyncEntityType;
  strategy: "server_authoritative" | "client_merge" | "append_only";
  description: string;
}

export interface SyncStatusSummary {
  studentId: string;
  connectionStatus: SyncConnectionStatus;
  cloudIsSystemOfRecord: boolean;
  pendingCount: number;
  syncingCount: number;
  failedCount: number;
  lastSyncedAt: string | null;
  offlineAvailableSections: string[];
  queue: SyncQueueItem[];
  conflictRules: SyncConflictRule[];
}

export interface SyncPushRequest {
  items: SyncQueueItem[];
}

export interface SyncPushResponse {
  acceptedCount: number;
  rejectedCount: number;
  syncedItems: SyncQueueItem[];
}
