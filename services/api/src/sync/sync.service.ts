import type {
  SyncConflictRule,
  SyncPushRequest,
  SyncPushResponse,
  SyncStatusSummary,
} from "@sbud-d/types";

import { SyncRepository } from "./sync.repository.js";
import { getAuthenticatedUserAndTokenFromHeader } from "../auth/supabase-auth-client.js";
import { getApiEnvironment, type ApiEnvironment } from "../config/environment.js";

interface SyncRequestContext {
  authorizationHeader?: string | undefined;
}

export class SyncService {
  constructor(
    private readonly repository: SyncRepository = new SyncRepository(),
    private readonly environment: ApiEnvironment = getApiEnvironment(),
  ) {}

  async getStatus(context: SyncRequestContext = {}): Promise<SyncStatusSummary> {
    return this.repository.getStatus(await this.getRepositoryContext(context));
  }

  getConflictRules(): SyncConflictRule[] {
    return this.repository.getConflictRules();
  }

  async pushPending(
    request: SyncPushRequest,
    context: SyncRequestContext = {},
  ): Promise<SyncPushResponse> {
    return this.repository.pushPending(request, await this.getRepositoryContext(context));
  }

  private async getRepositoryContext(context: SyncRequestContext) {
    if (this.environment.dataMode !== "supabase") {
      return {};
    }

    const user = await getAuthenticatedUserAndTokenFromHeader(context.authorizationHeader);

    return {
      accessToken: user.accessToken,
      studentId: user.id,
    };
  }
}
