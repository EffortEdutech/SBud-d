export interface OfflineStorageStatus {
  isDurable: boolean;
  label: string;
  storageKind: "memory" | "web_local_storage";
}

interface KeyValueStorage {
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

const memoryStore = new Map<string, string>();

const memoryStorage: KeyValueStorage = {
  getItem(key) {
    return memoryStore.get(key) ?? null;
  },
  removeItem(key) {
    memoryStore.delete(key);
  },
  setItem(key, value) {
    memoryStore.set(key, value);
  },
};

interface GlobalWithLocalStorage {
  localStorage?: KeyValueStorage | undefined;
}

function resolveStorage(): { status: OfflineStorageStatus; storage: KeyValueStorage } {
  const candidate = (globalThis as GlobalWithLocalStorage).localStorage;

  if (candidate) {
    return {
      status: {
        isDurable: true,
        label: "Durable offline cache active",
        storageKind: "web_local_storage",
      },
      storage: candidate,
    };
  }

  return {
    status: {
      isDurable: false,
      label: "Volatile offline cache active",
      storageKind: "memory",
    },
    storage: memoryStorage,
  };
}

export function getOfflineStorageStatus(): OfflineStorageStatus {
  return resolveStorage().status;
}

export async function readOfflineValue<T>(key: string, fallback: T): Promise<T> {
  const { storage } = resolveStorage();
  const value = storage.getItem(key);

  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    storage.removeItem(key);

    return fallback;
  }
}

export async function writeOfflineValue<T>(key: string, value: T): Promise<void> {
  const { storage } = resolveStorage();

  storage.setItem(key, JSON.stringify(value));
}
