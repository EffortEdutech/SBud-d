import { describe, expect, it } from "vitest";

import { AcademicService } from "../../services/api/src/academic/academic.service.js";
import { BlieService } from "../../services/api/src/blie/blie.service.js";
import { DocumentService } from "../../services/api/src/documents/document.service.js";
import { PlkgService } from "../../services/api/src/plkg/plkg.service.js";
import { StudyService } from "../../services/api/src/study/study.service.js";
import { SyncService } from "../../services/api/src/sync/sync.service.js";

describe("MVP release readiness", () => {
  it("supports the core student learning journey across MVP services", () => {
    const academic = new AcademicService();
    const documents = new DocumentService();
    const blie = new BlieService();
    const plkg = new PlkgService();
    const study = new StudyService();
    const sync = new SyncService();

    const dashboard = academic.getDashboardSummary();
    const library = documents.getLibrarySummary();
    const chat = blie.chat({
      message: "Explain recursion for revision",
      subjectId: "subject-programming",
    });
    const graph = plkg.getSummary();
    const studySummary = study.getSummary();
    const syncStatus = sync.getStatus();

    expect(dashboard.subjects.length).toBeGreaterThan(0);
    expect(library.documents.length).toBeGreaterThan(0);
    expect(chat.trace.retrievalStatus).toBe("grounded");
    expect(chat.retrievedContext.map((item) => item.sourceType)).toContain("plkg");
    expect(graph.nodeCount).toBeGreaterThan(0);
    expect(studySummary.revisionItems.length).toBeGreaterThan(0);
    expect(syncStatus.cloudIsSystemOfRecord).toBe(true);
  });

  it("keeps synchronization append-safe for offline learning evidence", () => {
    const sync = new SyncService();
    const response = sync.pushPending({
      items: [
        {
          id: "mvp-readiness-sync-item",
          studentId: "demo-student",
          entityType: "plkg_learning_activity",
          entityId: "offline-learning-evidence",
          operation: "create",
          status: "pending",
          payload: {
            label: "Offline revision evidence",
          },
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
