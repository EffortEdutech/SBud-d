import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import type {
  CreatePlkgLearningActivityInput,
  PlkgEdge,
  PlkgNode,
  PlkgSummary,
} from "@sbud-d/types";

import { PlkgService } from "./plkg.service.js";

@Controller("plkg")
export class PlkgController {
  private readonly plkgService = new PlkgService();

  @Get("summary")
  getSummary(@Headers("authorization") authorizationHeader?: string): Promise<PlkgSummary> {
    return this.plkgService.getSummary({ authorizationHeader });
  }

  @Get("nodes")
  listNodes(@Headers("authorization") authorizationHeader?: string): Promise<PlkgNode[]> {
    return this.plkgService.listNodes({ authorizationHeader });
  }

  @Get("edges")
  listEdges(@Headers("authorization") authorizationHeader?: string): Promise<PlkgEdge[]> {
    return this.plkgService.listEdges({ authorizationHeader });
  }

  @Post("learning-activity")
  addLearningActivity(
    @Body() input: CreatePlkgLearningActivityInput,
    @Headers("authorization") authorizationHeader?: string,
  ): Promise<PlkgNode> {
    return this.plkgService.addLearningActivity(input, { authorizationHeader });
  }
}
