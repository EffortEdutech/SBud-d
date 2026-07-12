import { Body, Controller, Get, Post } from "@nestjs/common";
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
  getSummary(): PlkgSummary {
    return this.plkgService.getSummary();
  }

  @Get("nodes")
  listNodes(): PlkgNode[] {
    return this.plkgService.listNodes();
  }

  @Get("edges")
  listEdges(): PlkgEdge[] {
    return this.plkgService.listEdges();
  }

  @Post("learning-activity")
  addLearningActivity(@Body() input: CreatePlkgLearningActivityInput): PlkgNode {
    return this.plkgService.addLearningActivity(input);
  }
}
