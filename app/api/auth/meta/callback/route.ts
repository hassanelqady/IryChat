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
    const { access_token: shor    const { access_token: shor    const { access_es    const { access_token: shor    consorLo    const { access_token: shor    const { access_tit     const { access_token: shor    const { access_tokeupab    const { access_token: shor    const { access_token: shor    const { access_es    const { access_token:  con    const { access_token: shor    const 
                                                   for (const page of pages) {
      const pageToken       const pageToken       const paged)      const pageToken       const pageTogeToken)

      await adminSupabase.from('connected_accounts').upsert({
        user_id: user.id,
        account_type: 'facebook_page',
                                     ac                                     ac                ct                                     ac                   en                                     ac              r_i                                     ac                                     ac oke                   {
                                                                                                                                                                                                                                                                                                                                                                                                     UB                                                                             er                                                                                                             unts?error=failed`)
  }
}
