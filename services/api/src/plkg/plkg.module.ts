import { Module } from "@nestjs/common";

import { PlkgController } from "./plkg.controller.js";
import { PlkgRepository } from "./plkg.repository.js";
import { PlkgService } from "./plkg.service.js";

@Module({
  controllers: [PlkgController],
  providers: [PlkgRepository, PlkgService],
})
export class PlkgModule {}
