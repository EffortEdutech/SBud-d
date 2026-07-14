import { BadRequestException, NotFoundException } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { DocumentService } from "./document.service.js";

describe("DocumentService", () => {
  it("returns a library summary with upload constraints", async () => {
    const summary = await new DocumentService().getLibrarySummary();

    expect(summary.documents.length).toBeGreaterThan(0);
    expect(summary.upload.storagePathPattern).toContain("{studentId}");
    expect(summary.upload.acceptedMimeTypes).toContain("application/pdf");
  });

  it("creates a student-owned document metadata record", async () => {
    const service = new DocumentService();
    const document = await service.createDocument({
      subjectId: "subject-programming",
      fileName: "lecture 4 recursion.pdf",
      mimeType: "application/pdf",
      fileSizeBytes: 2048,
      topicLabel: "Recursion",
    });

    expect(document.processing.status).toBe("uploaded");
    expect(document.storagePath).toBe(
      "demo-student/subject-programming/document-3/lecture-4-recursion.pdf",
    );
    await expect(service.getDocument(document.id)).resolves.toEqual(document);
  });

  it("rejects unsupported document types", async () => {
    const service = new DocumentService();

    await expect(
      service.createDocument({
        subjectId: "subject-programming",
        fileName: "archive.zip",
        mimeType: "application/zip",
        fileSizeBytes: 2048,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it("returns not found for unknown documents", async () => {
    const service = new DocumentService();

    await expect(service.getDocument("missing")).rejects.toThrow(NotFoundException);
  });

  it("requires authenticated context in supabase data mode", async () => {
    const service = new DocumentService(
      new (await import("./document.repository.js")).DocumentRepository({
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      }),
      {
        dataMode: "supabase",
        nodeEnv: "test",
        supabasePublishableKey: "test-key",
        supabaseUrl: "https://example.supabase.co",
      },
    );

    await expect(service.listDocuments()).rejects.toThrow("Missing bearer token.");
  });
});
