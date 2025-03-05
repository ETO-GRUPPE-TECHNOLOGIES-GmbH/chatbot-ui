import { Brand } from "@/components/ui/brand"
import { SubmitButton } from "@/components/ui/submit-button"
import { createClient } from "@/lib/supabase/server"
import { Database } from "@/supabase/types"
import { createServerClient } from "@supabase/ssr"
import { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
export const metadata: Metadata = {
  title: "Login"
}

async function signInWithKeycloak() {
  "use server"
  console.log("start keycloak login")

  const supabase = await createClient()
  const xhost = headers().get("x-forwarded-host")
  console.log("xhost", xhost)
  const origin = headers().get("origin")
  console.log("origin", origin)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "keycloak",
    options: {
      scopes: "openid",
      redirectTo: `https://${xhost}/auth/callback?next=/login`
    }
  })

  if (error) throw error
  return redirect(data.url)
}

export default async function Login({
  searchParams
}: {
  searchParams: { message: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )
  const user_id = (await supabase.auth.getUser()).data.user?.id

  if (user_id) {
    const { data: homeWorkspace, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", user_id)
      .eq("is_home", true)
      .single()

    if (!homeWorkspace) {
      throw new Error(error.message)
    }

    return redirect(`/${homeWorkspace.id}/chat`)
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form className="animate-in text-foreground flex w-full flex-1 flex-col justify-center gap-2">
        <Brand />
        <br />
        <SubmitButton
          formAction={signInWithKeycloak}
          className="mb-2 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Login with ETOGRUPPE
        </SubmitButton>
        {searchParams?.message && (
          <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
