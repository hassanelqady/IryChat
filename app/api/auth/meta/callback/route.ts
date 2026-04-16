import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { exchangeForLongLivedToken, getPageToken, getInstagramAccountId, getUserPages } from '@/lib/meta-auth'
import { encrypt } from '@/lib/encryption'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?error=cancelled`)
  }

  try {
    const tokenRes = await fetch(
      `https://graph.facebook.com/oauth/access_token?` +
      `client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&` +
      `client_secret=${process.env.META_APP_SECRET}&` +
      `redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/auth/meta/callback&` +
      `code=${code}`
    )
    const tokenData = await tokenRes.json()
if (!tokenData.access_token) {
  console.error('Meta token error:', tokenData)
  return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?error=token_failed`)
}
const shortToken = tokenData.access_token

    const longTokenData = await exchangeForLongLivedToken(shortToken)
    const longToken = longTokenData.access_token

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`)
    }

    const pages = await getUserPages(longToken)
    const adminSupabase = createAdminClient()

    for (const page of pages) {
      const pageToken = await getPageToken(longToken, page.id)
      const encryptedToken = encrypt(pageToken)

      await adminSupabase.from('connected_accounts').upsert({
        user_id: user.id,
        account_type: 'facebook_page',
        account_id: page.id,
        account_name: page.name,
        access_token: encryptedToken,
        is_active: true
      }, { onConflict: 'user_id,account_id' })

      const igId = await getInstagramAccountId(page.id, pageToken)
      if (igId) {
        await adminSupabase.from('connected_accounts').upsert({
          user_id: user.id,
          account_type: 'instagram',
          account_id: igId,
          account_name: `${page.name} (Instagram)`,
          access_token: encryptedToken,
          is_active: true
        }, { onConflict: 'user_id,account_id' })
      }
    }

    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?success=true`)
  } catch (err) {
    console.error('Meta OAuth error:', err)
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?error=failed`)
  }
}
