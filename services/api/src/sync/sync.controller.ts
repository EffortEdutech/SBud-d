import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
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
  getStatus(@Headers("authorization") authorizationHeader?: string): Promise<SyncStatusSummary> {
    return this.syncService.getStatus({ authorizationHeader });
  }

  @Get("conflict-rules")
  getConflictRules(): SyncConflictRule[] {
    return this.syncService.getConflictRules();
  }

  @Post("push")
  pushPending(
    @Body() request: SyncPushRequest,
    @Headers("authorization") authorizationHeader?: string,
  ): Promise<SyncPushResponse> {
    return this.syncService.pushPending(request, { authorizationHeader });
  }
}
