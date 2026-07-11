import { Injectable } from "@nestjs/common";
import { createHealthStatus } from "@sbud-d/shared";
import type { HealthStatus } from "@sbud-d/types";

const API_SERVICE_NAME = "ai-study-buddy-api";
const API_VERSION = "0.0.0";

@Injectable()
export class HealthService {
  getHealth(): HealthStatus {
    return createHealthStatus({
      service: API_SERVICE_NAME,
      version: API_VERSION,
      environment: process.env.NODE_ENV ?? "development",
    });
  }
}
