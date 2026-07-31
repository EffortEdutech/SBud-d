import { Body, Controller, Headers, Post } from "@nestjs/common";
import type { BlieChatRequest, BlieChatResponse } from "@sbud-d/types";

import { BlieService } from "./blie.service.js";

@Controller("blie")
export class BlieController {
  private readonly blieService = new BlieService();

  @Post("chat")
  chat(
    @Body() input: BlieChatRequest,
    @Headers("authorization") authorizationHeader?: string,
  ): Promise<BlieChatResponse> {
    return this.blieService.chat(input, { authorizationHeader });
  }
}
