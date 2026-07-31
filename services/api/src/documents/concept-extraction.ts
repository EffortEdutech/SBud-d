import type { LearningDocumentConcept } from "@sbud-d/types";

const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "also",
  "and",
  "are",
  "because",
  "before",
  "between",
  "but",
  "can",
  "each",
  "from",
  "has",
  "have",
  "help",
  "into",
  "its",
  "lecture",
  "learning",
  "material",
  "notes",
  "our",
  "pdf",
  "the",
  "their",
  "them",
  "then",
  "this",
  "through",
  "using",
  "when",
  "where",
  "with",
]);

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function toTitleCase(value: string): string {
  return value
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(" ");
}

function getSourceSnippet(text: string, label: string): string {
  const normalizedText = normalizeWhitespace(text);
  const index = normalizedText.toLowerCase().indexOf(label.toLowerCase());

  if (index === -1) {
    return normalizedText.slice(0, 140);
  }

  const start = Math.max(0, index - 50);
  const end = Math.min(normalizedText.length, index + label.length + 90);

  return normalizedText.slice(start, end).trim();
}

function collectCandidates(text: string): Map<string, number> {
  const candidates = new Map<string, number>();
  const normalizedWords = normalizeWhitespace(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 4 && !STOP_WORDS.has(word));

  for (const word of normalizedWords) {
    candidates.set(word, (candidates.get(word) ?? 0) + 1);
  }

  for (let index = 0; index < normalizedWords.length - 1; index += 1) {
    const phrase = `${normalizedWords[index]} ${normalizedWords[index + 1]}`;
    const phraseScore = (candidates.get(phrase) ?? 0) + 2;
    candidates.set(phrase, phraseScore);
  }

  return candidates;
}

export function extractDocumentConceptsBaseline(input: {
  extractedText: string;
  topicLabel?: string | null;
  maxConcepts?: number;
}): LearningDocumentConcept[] {
  const text = normalizeWhitespace(input.extractedText);

  if (!text) {
    throw new Error("Extracted text is required before concept extraction.");
  }

  const maxConcepts = input.maxConcepts ?? 5;
  const candidates = collectCandidates(text);

  if (input.topicLabel?.trim()) {
    candidates.set(input.topicLabel.trim().toLowerCase(), 100);
  }

  return [...candidates.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, maxConcepts)
    .map(([rawLabel], index) => {
      const label = toTitleCase(rawLabel);

      return {
        confidence: Math.max(45, 82 - index * 7),
        description: `${label} was identified from the uploaded learning material and is ready for PLKG review.`,
        label,
        sourceSnippet: getSourceSnippet(text, rawLabel),
      };
    });
}
