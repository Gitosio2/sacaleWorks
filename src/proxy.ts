import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Optimistic check only (cookie presence). Real authorization must be
// re-checked on the server wherever data is read or written.
export function proxy(request: NextRequest) {
  const hasSession = getSessionCookie(request);
  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)"],
};
