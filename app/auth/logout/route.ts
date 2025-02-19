import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function GET(request: Request) {
  "use server"
  console.log("logout from keycloak")

  const supabase = await createClient()

  const keycloak_base_url = process.env.KEYCLOAK_BASE_URL!
  const login_redirect_url = process.env.LOGIN_REDIRECT_URL!

  supabase.auth.signOut()
  //return redirect(keycloak_base_url+"/protocol/openid-connect/logout?post_logout_redirect_uri="+encodeURIComponent(login_redirect_url)+"&id_token_hint="+encodeURIComponent(provider_token))
  return redirect(keycloak_base_url + "/protocol/openid-connect/logout")
}
