import { BadRequestException, NotFoundException } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { DocumentService } from "./document.service.js";

describe("DocumentService", () => {
  it("returns a library summary with upload constraints", () => {
    const summary = new DocumentService().getLibrarySummary();

    expect(summary.documents.length).toBeGreaterThan(0);
    expect(summary.upload.storagePathPattern).toContain("{studentId}");
    expect(summary.upload.acceptedMimeTypes).toContain("application/pdf");
  });

  it("creates a student-owned document metadata record", () => {
    const service = new DocumentService();
    const document = service.createDocument({
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
    expect(service.getDocument(document.id)).toEqual(document);
  });

  it("rejects unsupported document types", () => {
    const service = new DocumentService();

    expect(() =>
      service.createDocument({
        subjectId: "subject-programming",
        fileName: "archive.zip",
        mimeType: "application/zip",
        fileSizeBytes: 2048,
      }),
    ).toThrow(BadRequestException);
  });

  it("returns not found for unknown documents", () => {
    const service = new DocumentService();

    expect(() => service.getDocument("missing")).toThrow(NotFoundException);
  });
});
