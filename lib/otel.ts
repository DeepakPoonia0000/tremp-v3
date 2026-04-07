import { trace, type Tracer } from "@opentelemetry/api";

let tracer: Tracer | null = null;

export function getTracer(): Tracer {
  if (!tracer) {
    tracer = trace.getTracer(
      process.env.OTEL_SERVICE_NAME ?? "tremp-ecommerce",
      "1.0.0"
    );
  }
  return tracer;
}

export function recordErrorSpan(
  name: string,
  err: Error & { digest?: string }
): void {
  const t = getTracer();
  const span = t.startSpan(name);
  span.recordException(err);
  span.setAttribute("error.digest", err.digest ?? "");
  span.end();
}
