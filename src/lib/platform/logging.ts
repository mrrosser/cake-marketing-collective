export interface StructuredLogPayload {
  service: string;
  event: string;
  correlationId: string;
  [key: string]: unknown;
}

export function createCorrelationId(namespace: string, seed?: string): string {
  const suffix = seed ?? crypto.randomUUID().split('-')[0];
  return `${namespace}-${suffix}`;
}

export function emitStructuredLog(payload: StructuredLogPayload): string {
  const serialized = JSON.stringify(payload);
  console.info(serialized);
  return serialized;
}
