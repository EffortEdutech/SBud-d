interface CreateHealthStatusInput {
  service: string;
  version: string;
  environment?: string;
  now?: Date;
}

export function createHealthStatus(input: CreateHealthStatusInput) {
  return {
    status: "ok" as const,
    service: input.service,
    version: input.version,
    timestamp: (input.now ?? new Date()).toISOString(),
    environment: input.environment ?? "development",
  };
}
