import type { Instrumentation } from "next";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { NodeSDK } = await import("@opentelemetry/sdk-node");
    const { getNodeAutoInstrumentations } = await import(
      "@opentelemetry/auto-instrumentations-node"
    );
    const { OTLPTraceExporter } = await import(
      "@opentelemetry/exporter-trace-otlp-http"
    );
    const { resourceFromAttributes } = await import(
      "@opentelemetry/resources"
    );

    const serviceName =
      process.env.OTEL_SERVICE_NAME ?? "tremp-ecommerce";
    const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

    const exporter = new OTLPTraceExporter(
      endpoint ? { url: `${endpoint.replace(/\/$/, "")}/v1/traces` } : undefined
    );

    const sdk = new NodeSDK({
      resource: resourceFromAttributes({
        "service.name": serviceName,
      }),
      traceExporter: exporter,
      instrumentations: [
        getNodeAutoInstrumentations({
          "@opentelemetry/instrumentation-fs": { enabled: false },
        }),
      ],
    });

    sdk.start();
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context
) => {
  const asError =
    err instanceof Error ? err : new Error(typeof err === "string" ? err : "Unknown error");
  const digest =
    asError && "digest" in asError
      ? String((asError as Error & { digest?: string }).digest)
      : undefined;
  const payload = {
    url: request.path,
    method: request.method,
    errorMessage: asError.message,
    digest,
    routePath: context.routePath,
    routeType: context.routeType,
  };
  if (process.env.NODE_ENV === "production") {
    const { getTracer } = await import("./lib/otel");
    const tracer = getTracer();
    const span = tracer.startSpan("onRequestError");
    span.recordException(asError);
    span.setAttributes({
      "http.route": context.routePath,
      "next.route_type": context.routeType,
    });
    span.end();
  } else {
    console.error("[onRequestError]", payload);
  }
};
