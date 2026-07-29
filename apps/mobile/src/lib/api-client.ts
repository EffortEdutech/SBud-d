import { getApiBaseUrl } from "../config/environment";

let apiAccessToken: string | null = null;

export function setApiAccessToken(accessToken: string | null): void {
  apiAccessToken = accessToken;
}

export function getApiAccessToken(): string | null {
  return apiAccessToken;
}

export function getApiUrl(path: string): string {
  return `${getApiBaseUrl()}${path}`;
}

export function createApiHeaders(headers?: HeadersInit): Headers {
  const nextHeaders = new Headers(headers);

  if (apiAccessToken) {
    nextHeaders.set("Authorization", `Bearer ${apiAccessToken}`);
  }

  return nextHeaders;
}

export function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(getApiUrl(path), {
    ...init,
    headers: createApiHeaders(init.headers),
  });
}
