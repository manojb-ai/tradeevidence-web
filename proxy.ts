import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Support-safe correlation ID (Epic E1, AC-08;
 * `docs/engineering/Observability-and-Operations.md`: "Every request
 * receives a support-safe correlation ID"). This is Next.js's "proxy"
 * convention (the successor to "middleware", renamed in Next.js 16.3;
 * see https://nextjs.org/docs/messages/middleware-to-proxy) — it runs
 * for every request, ahead of routing.
 *
 * Reuses an incoming, well-formed correlation ID (so a caller — or a
 * future upstream edge/proxy — can propagate one across hops) and
 * otherwise mints a fresh one. The ID is opaque and contains no
 * infrastructure or secret detail, so it's safe to echo back and safe
 * to log.
 *
 * This only propagates the identifier. Actually attaching it to
 * structured logs awaits an observability provider decision (see
 * `Vertical-Slice-01-Delivery-Foundation.md` Section 10's open
 * question) — until then, this header is what makes correlation
 * possible once that's wired in, and is already useful on its own for
 * matching a support report to a specific request/response pair.
 */
const CORRELATION_HEADER = "x-correlation-id";
const SAFE_CORRELATION_ID = /^[a-zA-Z0-9-]{1,64}$/;

export function proxy(request: NextRequest) {
  const incoming = request.headers.get(CORRELATION_HEADER);
  const correlationId =
    incoming && SAFE_CORRELATION_ID.test(incoming)
      ? incoming
      : crypto.randomUUID();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CORRELATION_HEADER, correlationId);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set(CORRELATION_HEADER, correlationId);
  return response;
}

export const config = {
  // Every route, including /api/*, but not static assets/build output.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
