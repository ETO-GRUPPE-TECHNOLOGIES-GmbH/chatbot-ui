import { NextResponse } from "next/server"
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/lib/supabase/server"
import { supabase } from "@/lib/supabase/browser-client"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/"
  console.log("url", request.url)
  console.log("origin", origin)
  const forwardedHost = request.headers.get("x-forwarded-host") // original origin before load balancer
  console.log("x_forward_header", forwardedHost)

  if (code) {
    console.log("code found", code)

    const supabase = await createClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      console.log("no error")

      console.log("forwardedHost", forwardedHost)
      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
    console.log("error", error)
  }
  console.log("code not found")

  // return the user to an error page with instructions
  return NextResponse.redirect(`https://${forwardedHost}/auth/auth-code-error`)
}
