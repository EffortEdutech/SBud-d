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

  it("uploads a PDF and marks it ready for extraction", async () => {
    const service = new DocumentService();
    const document = await service.uploadDocument(
      {
        subjectId: "subject-programming",
        topicLabel: "Recursion",
      },
      {
        buffer: Buffer.from("%PDF-1.4\n%%EOF"),
        mimetype: "application/pdf",
        originalname: "lecture 4 recursion.pdf",
        size: 2048,
      },
    );

    expect(document.processing.status).toBe("processing");
    expect(document.processing.label).toBe("PDF uploaded. Waiting for text extraction.");
    expect(document.storagePath).toBe(
      "demo-student/subject-programming/document-3/lecture-4-recursion.pdf",
    );
  });

  it("extracts readable baseline text from an uploaded PDF", async () => {
    const service = new DocumentService();
    const document = await service.uploadDocument(
      {
        subjectId: "subject-programming",
        topicLabel: "Recursion",
      },
      {
        buffer: Buffer.from("%PDF-1.4\nRecursion calls a function from itself.\n%%EOF"),
        mimetype: "application/pdf",
        originalname: "lecture recursion.pdf",
        size: 2048,
      },
    );

    const extractedDocument = await service.extractDocumentText(document.id);

    expect(extractedDocument.extractedText).toBe("Recursion calls a function from itself.");
    expect(extractedDocument.processing.status).toBe("understanding");
    expect(extractedDocument.processing.label).toBe(
      "Readable text extracted. Ready for concept extraction.",
    );
  });

  it("maps extracted concepts into the PLKG", async () => {
    const service = new DocumentService();
    const document = await service.uploadDocument(
      {
        subjectId: "subject-programming",
        topicLabel: "Recursion",
      },
      {
        buffer: Buffer.from(
          "%PDF-1.4\nRecursion breaks a problem into smaller repeated steps. Functions provide reusable inputs and outputs.\n%%EOF",
        ),
        mimetype: "application/pdf",
        originalname: "lecture recursion.pdf",
        size: 2048,
      },
    );
    const extractedDocument = await service.extractDocumentText(document.id);

    const connectedDocument = await service.extractDocumentConcepts(extractedDocument.id);

    expect(connectedDocument.processing.status).toBe("connected");
    expect(connectedDocument.processing.label).toBe("Concepts mapped to your PLKG.");
    expect(connectedDocument.conceptCount).toBeGreaterThan(0);
    expect(connectedDocument.extractedConcepts[0]?.label).toBe("Recursion");
  });

  it("requires extracted text before concept mapping", async () => {
    const service = new DocumentService();
    const document = await service.createDocument({
      subjectId: "subject-programming",
      fileName: "lecture 4 recursion.pdf",
      mimeType: "application/pdf",
      fileSizeBytes: 2048,
      topicLabel: "Recursion",
    });

    await expect(service.extractDocumentConcepts(document.id)).rejects.toThrow(BadRequestException);
  });

  it("rejects upload without a PDF file", async () => {
    const service = new DocumentService();

    await expect(
      service.uploadDocument(
        {
          subjectId: "subject-programming",
        },
        undefined,
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it("rejects non-PDF upload files for Sprint 12", async () => {
    const service = new DocumentService();

    await expect(
      service.uploadDocument(
        {
          subjectId: "subject-programming",
        },
        {
          buffer: Buffer.from("plain text"),
          mimetype: "text/plain",
          originalname: "notes.txt",
          size: 128,
        },
      ),
    ).rejects.toThrow(BadRequestException);
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
