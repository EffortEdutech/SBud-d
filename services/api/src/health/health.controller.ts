import { Controller, Get } from "@nestjs/common";
import type { HealthStatus } from "@sbud-d/types";

import { HealthService } from "./health.service.js";

@Controller("health")
export class HealthController {
  private readonly healthService = new HealthService();

  @Get()
  getHealth(): HealthStatus {
    return this.healthService.getHealth();
  }
}
