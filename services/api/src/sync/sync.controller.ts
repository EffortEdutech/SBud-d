import { Body, Controller, Get, Post } from "@nestjs/common";
import type {
  SyncConflictRule,
  SyncPushRequest,
  SyncPushResponse,
  SyncStatusSummary,
} from "@sbud-d/types";

import { SyncService } from "./sync.service.js";

@Controller("sync")
export class SyncController {
  private readonly syncService = new SyncService();

  @Get("status")
  getStatus(): SyncStatusSummary {
    return this.syncService.getStatus();
  }

  @Get("conflict-rules")
  getConflictRules(): SyncConflictRule[] {
    return this.syncService.getConflictRules();
  }

  @Post("push")
  pushPending(@Body() request: SyncPushRequest): SyncPushResponse {
    return this.syncService.pushPending(request);
  }
}
