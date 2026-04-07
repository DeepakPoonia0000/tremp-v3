import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export {
  PROXY_PATHS,
  buildProxyRewrites,
  proxyRequest,
  getPaymentGatewayBase,
  getShippingApiBase,
  getProxyAuthHeader,
} from "@/lib/proxy-rewrites";

/**
 * Next.js 16 request proxy (replaces deprecated root `middleware.ts`).
 * Note: Next.js does not allow both `middleware.ts` and `proxy.ts` in the same project.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  if (pathname.startsWith("/admin") && session?.user?.role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (
    (pathname.startsWith("/profile") || pathname.startsWith("/orders")) &&
    !session
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile", "/orders/:path*", "/login"],
};
