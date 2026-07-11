import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";

const DEFAULT_API_PORT = 4801;

function getPort(): number {
  const configuredPort = Number.parseInt(process.env.PORT ?? "", 10);

  if (Number.isInteger(configuredPort) && configuredPort > 0) {
    return configuredPort;
  }

  return DEFAULT_API_PORT;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1");
  app.enableCors({
    origin: true,
  });

  await app.listen(getPort());
}

void bootstrap();
