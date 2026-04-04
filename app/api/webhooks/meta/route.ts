import { createAdminClient } from '@/lib/supabase/admin'
import { decrypt } from '@/lib/encryption'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge)
  }
  return new Response('Forbidden', { status: 403 })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const supabase = createAdminClient()

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field === 'comments') {
        await handleNewComment(change.value, supabase)
      }
    }
  }

  return new Response('OK')
}

async function handleNewComment(comment: any, supabase: any) {
  const { media_id, text, from, id: commentId } = comment

  if (!text || !media_id) return

  const { data: automations } = await supabase
    .from('automations')
    .select('*, connected_accounts(access_token)')
    .eq('post_id', media_id)
    .eq('is_active', true)

  if (!automations || automations.length === 0) return

  const automation = automations.find((a: any) =>
    text.toLowerCase().includes(a.trigger_keyword.toLowerCase())
  )

  if (!automation) return

  const pageToken = decrypt(automation.connected_accounts.access_token)
  let actionTaken = ''
  let errorMessage = ''

  try {
    if (automation.comment_reply) {
      await fetch(`https://graph.facebook.com/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: automation.comment_reply,
          access_token: pageToken
        })
      })
      actionTaken += 'comment_reply,'
    }

    if (automation.dm_message && from?.id) {
      await fetch(`https://graph.facebook.com/me/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: { id: from.id },
          message: { text: automation.dm_message },
          access_token: pageToken
        })
      })
      actionTaken += 'dm_sent'
    }
  } catch (err: any) {
    errorMessage = err.message
  }

  await supabase.from('automation_logs').insert({
    automation_id: automation.id,
    commenter_id: from?.id,
    commenter_name: from?.name,
    comment_text: text,
    comment_id: commentId,
    action_taken: actionTaken || 'failed',
    error_message: errorMessage || null
  })
}
