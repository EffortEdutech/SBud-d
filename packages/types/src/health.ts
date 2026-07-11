export type HealthStatusValue = "ok";

export interface HealthStatus {
  status: HealthStatusValue;
  service: string;
  version: string;
  timestamp: string;
  environment: string;
}
