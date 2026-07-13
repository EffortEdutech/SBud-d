import type {
  SyncConflictRule,
  SyncPushRequest,
  SyncPushResponse,
  SyncStatusSummary,
} from "@sbud-d/types";

import { SyncRepository } from "./sync.repository.js";

export class SyncService {
  constructor(private readonly repository: SyncRepository = new SyncRepository()) {}

  getStatus(): SyncStatusSummary {
    return this.repository.getStatus();
  }

  getConflictRules(): SyncConflictRule[] {
    return this.repository.getConflictRules();
  }

  pushPending(request: SyncPushRequest): SyncPushResponse {
    return this.repository.pushPending(request);
  }
}
