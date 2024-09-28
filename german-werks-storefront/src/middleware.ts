import { NextRequest, NextResponse } from "next/server"

/**
 * Simplified middleware without region handling and onboarding logic.
 */
export async function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const isOnboarding = searchParams.get("onboarding") === "true"
  const cartId = searchParams.get("cart_id")
  
  // Redirect to home if on onboarding and no cart ID.
  if (isOnboarding && !cartId) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Proceed with the request if there are no conditions to redirect.
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
}
