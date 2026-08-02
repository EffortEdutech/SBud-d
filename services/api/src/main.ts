import "reflect-metadata";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";

const DEFAULT_API_PORT = 4801;
const requestLogger = new Logger("RequestLogger");

interface MetadataOnlyRequest {
  method?: string;
  originalUrl?: string;
  url?: string;
}

interface MetadataOnlyResponse {
  on(event: "finish", listener: () => void): void;
  statusCode?: number;
}

interface RequestTimingNext {
  (): void;
}

function getSafePath(request: MetadataOnlyRequest): string {
  const rawUrl = request.originalUrl ?? request.url ?? "unknown";
  return rawUrl.split("?")[0] ?? "unknown";
}

function metadataOnlyRequestLogger(
  request: MetadataOnlyRequest,
  response: MetadataOnlyResponse,
  next: RequestTimingNext,
): void {
  const startedAt = performance.now();

  response.on("finish", () => {
    const durationMs = Math.round(performance.now() - startedAt);

    requestLogger.log(
      JSON.stringify({
        durationMs,
        event: "api_request_completed",
        method: request.method ?? "unknown",
        path: getSafePath(request),
        statusCode: response.statusCode ?? 0,
      }),
    );
  });

  next();
}

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
  app.use(metadataOnlyRequestLogger);
  app.enableCors({
    origin: true,
  });

  await app.listen(getPort());
}

void bootstrap();
