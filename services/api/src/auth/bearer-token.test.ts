import { describe, expect, it } from "vitest";

import { extractBearerToken } from "./bearer-token.js";

describe("extractBearerToken", () => {
  it("extracts a bearer token", () => {
    expect(extractBearerToken("Bearer abc123")).toBe("abc123");
  });

  it("rejects missing and non-bearer headers", () => {
    expect(extractBearerToken(undefined)).toBeNull();
    expect(extractBearerToken("Basic abc123")).toBeNull();
  });
});
