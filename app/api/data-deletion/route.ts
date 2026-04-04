import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id } = body

    if (!user_id) {
      return Response.json({ error: 'user_id required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    await supabase.from('connected_accounts').delete().eq('meta_user_id', user_id)

    const confirmationCode = `DEL-${Date.now()}-${user_id}`

    return Response.json({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/data-deletion?code=${confirmationCode}`,
      confirmation_code: confirmationCode
    })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
