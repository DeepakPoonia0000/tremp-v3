/**
 * External proxy bases for `next.config.ts` rewrites and server-side `proxyRequest`.
 * Kept separate from root `proxy.ts` so Next never loads NextAuth while parsing `next.config`.
 */

export const PROXY_PATHS = {
  payment: "/api/proxy/payment",
  shipping: "/api/proxy/shipping",
} as const;

export function getPaymentGatewayBase(): string {
  return (
    process.env.PAYMENT_GATEWAY_BASE_URL ?? "https://api.example-payment-gateway.com"
  );
}

export function getShippingApiBase(): string {
  return process.env.SHIPPING_API_BASE_URL ?? "https://api.example-shipping.com";
}

export function getProxyAuthHeader(): string {
  return process.env.PROXY_SERVICE_AUTH_TOKEN ?? "";
}

export async function buildProxyRewrites() {
  const payment = getPaymentGatewayBase().replace(/\/$/, "");
  const shipping = getShippingApiBase().replace(/\/$/, "");
  return [
    {
      source: "/api/proxy/payment/:path*",
      destination: `${payment}/:path*`,
    },
    {
      source: "/api/proxy/shipping/:path*",
      destination: `${shipping}/:path*`,
    },
  ];
}

export async function proxyRequest(
  kind: "payment" | "shipping",
  path: string,
  init?: RequestInit
): Promise<Response> {
  const base =
    kind === "payment" ? getPaymentGatewayBase() : getShippingApiBase();
  const url = new URL(path.replace(/^\//, ""), base.endsWith("/") ? base : `${base}/`);
  const headers = new Headers(init?.headers);
  const token = getProxyAuthHeader();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(url, { ...init, headers });
}
