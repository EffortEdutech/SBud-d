import { Module } from "@nestjs/common";

import { BlieController } from "./blie.controller.js";
import { BlieService } from "./blie.service.js";

@Module({
  controllers: [BlieController],
  providers: [BlieService],
})
export class BlieModule {}
