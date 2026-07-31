export interface PdfTextExtractionResult {
  extractedText: string;
  summary: string;
}

function normalizeExtractedText(value: string): string {
  return value
    .replace(/\r/g, "\n")
    .replace(/[^\t\n\r\x20-\x7e]+/g, " ")
    .replace(/%PDF-\d\.\d/g, "")
    .replace(/%%EOF/g, "")
    .replace(/\b(obj|endobj|stream|endstream|xref|trailer|startxref)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function summarizeExtractedText(extractedText: string): string {
  if (extractedText.length <= 180) {
    return extractedText;
  }

  return `${extractedText.slice(0, 177).trim()}...`;
}

export function extractPdfTextBaseline(fileBytes: Uint8Array): PdfTextExtractionResult {
  const decodedText = new TextDecoder("utf-8", { fatal: false }).decode(fileBytes);
  const extractedText = normalizeExtractedText(decodedText);

  if (!extractedText) {
    throw new Error("No readable text was found in this PDF baseline.");
  }

  return {
    extractedText,
    summary: summarizeExtractedText(extractedText),
  };
}
