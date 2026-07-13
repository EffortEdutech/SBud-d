import { describe, expect, it } from "vitest";

import { SyncService } from "./sync.service.js";

describe("SyncService", () => {
  it("returns sync status with offline sections and conflict rules", () => {
    const service = new SyncService();
    const status = service.getStatus();

    expect(status.connectionStatus).toBe("online");
    expect(status.cloudIsSystemOfRecord).toBe(true);
    expect(status.offlineAvailableSections).toContain("Study");
    expect(status.conflictRules.length).toBeGreaterThan(0);
  });

  it("marks pushed pending queue items as synced", () => {
    const service = new SyncService();
    const response = service.pushPending({
      items: [
        {
          id: "sync-test-item",
          studentId: "demo-student",
          entityType: "study_reflection",
          entityId: "revision-1",
          operation: "update",
          status: "pending",
          payload: { confidenceLevel: 80 },
          retryCount: 0,
          lastError: null,
          createdAt: "2026-07-13T00:00:00.000Z",
          updatedAt: "2026-07-13T00:00:00.000Z",
        },
      ],
    });

    expect(response.acceptedCount).toBe(1);
    expect(response.syncedItems[0]?.status).toBe("synced");
  });
});
