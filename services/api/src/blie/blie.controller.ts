import { Body, Controller, Post } from "@nestjs/common";
import type { BlieChatRequest, BlieChatResponse } from "@sbud-d/types";

import { BlieService } from "./blie.service.js";

@Controller("blie")
export class BlieController {
  private readonly blieService = new BlieService();

  @Post("chat")
  chat(@Body() input: BlieChatRequest): BlieChatResponse {
    return this.blieService.chat(input);
  }
}
