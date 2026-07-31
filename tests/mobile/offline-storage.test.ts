import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getOfflineStorageStatus,
  readOfflineValue,
  writeOfflineValue,
} from "../../apps/mobile/src/sync/offline-storage.js";

function createFakeLocalStorage() {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

describe("offline storage adapter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses durable web local storage when available", async () => {
    vi.stubGlobal("localStorage", createFakeLocalStorage());

    await writeOfflineValue("sbud-test-key", { value: "cached" });

    await expect(readOfflineValue("sbud-test-key", { value: "fallback" })).resolves.toEqual({
      value: "cached",
    });
    expect(getOfflineStorageStatus()).toMatchObject({
      isDurable: true,
      storageKind: "web_local_storage",
    });
  });

  it("falls back to volatile memory storage when durable storage is unavailable", () => {
    vi.stubGlobal("localStorage", undefined);

    expect(getOfflineStorageStatus()).toMatchObject({
      isDurable: false,
      storageKind: "memory",
    });
  });
});
