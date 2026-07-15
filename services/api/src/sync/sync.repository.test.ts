import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

import { SyncRepository } from "./sync.repository.js";

const queueRow = {
  created_at: "2026-07-15T00:00:00.000Z",
  entity_id: "study-revision-1",
  entity_type: "study_reflection",
  id: "11111111-1111-1111-1111-111111111111",
  last_error: null,
  operation: "update",
  payload: {
    confidenceLevel: 80,
    reflection: "I can explain the idea now.",
  },
  retry_count: 0,
  status: "synced",
  student_id: "student-1",
  updated_at: "2026-07-15T00:05:00.000Z",
};

function createSyncClient(options: { queueRows?: unknown[]; insertedRows?: unknown[] }) {
  const insertedRows: unknown[] = options.insertedRows ?? [];

  return {
    insertedRows,
    client: {
      from(tableName: string) {
        const chain = {
          eq: () => chain,
          insert: async (payload: unknown) => {
            insertedRows.push(...(Array.isArray(payload) ? payload : [payload]));

            return { data: null, error: null };
          },
          order: async () => ({
            data: tableName === "sync_queue_events" ? (options.queueRows ?? []) : [],
            error: null,
          }),
          select: () => chain,
        };

        return chain;
      },
    } as unknown as SupabaseClient,
  };
}

describe("SyncRepository", () => {
  it("maps Supabase sync queue rows into status counts", async () => {
    const { client } = createSyncClient({ queueRows: [queueRow] });
    const repository = new SyncRepository(
      {
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      },
      () => client,
    );

    const status = await repository.getStatus({
      accessToken: "token",
      studentId: "student-1",
    });

    expect(status).toMatchObject({
      failedCount: 0,
      lastSyncedAt: "2026-07-15T00:05:00.000Z",
      pendingCount: 0,
      studentId: "student-1",
      syncingCount: 0,
    });
    expect(status.queue[0]).toMatchObject({
      entityId: "study-revision-1",
      id: "11111111-1111-1111-1111-111111111111",
      status: "synced",
    });
  });

  it("persists accepted Supabase queue items and rejects cross-student items", async () => {
    const syncClient = createSyncClient({});
    const repository = new SyncRepository(
      {
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      },
      () => syncClient.client,
    );

    const response = await repository.pushPending(
      {
        items: [
          {
            createdAt: "2026-07-15T00:00:00.000Z",
            entityId: "study-revision-1",
            entityType: "study_reflection",
            id: "local-sync-1",
            lastError: null,
            operation: "update",
            payload: { confidenceLevel: 80 },
            retryCount: 0,
            status: "pending",
            studentId: "student-1",
            updatedAt: "2026-07-15T00:00:00.000Z",
          },
          {
            createdAt: "2026-07-15T00:00:00.000Z",
            entityId: "study-revision-2",
            entityType: "study_reflection",
            id: "local-sync-2",
            lastError: null,
            operation: "update",
            payload: { confidenceLevel: 40 },
            retryCount: 0,
            status: "pending",
            studentId: "other-student",
            updatedAt: "2026-07-15T00:00:00.000Z",
          },
        ],
      },
      {
        accessToken: "token",
        studentId: "student-1",
      },
    );

    expect(response.acceptedCount).toBe(1);
    expect(response.rejectedCount).toBe(1);
    expect(response.syncedItems[0]).toMatchObject({
      id: "local-sync-1",
      status: "synced",
      studentId: "student-1",
    });
    expect(syncClient.insertedRows).toEqual([
      expect.objectContaining({
        entity_id: "study-revision-1",
        status: "synced",
        student_id: "student-1",
      }),
    ]);
  });
});
