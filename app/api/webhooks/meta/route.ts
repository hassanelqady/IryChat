import { createAdminClient } from '@/lib/supabase/admin'
import { decrypt } from '@/lib/encryption'
import { NextRequest } from 'next/server'

// ============================================================
// GET — Webhook Verification (Meta handshake)
// ============================================================
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    console.log('[Webhook] Verified successfully')
    return new Response(challenge)
  }

  console.warn('[Webhook] Verification failed — wrong token or mode')
  return new Response('Forbidden', { status: 403 })
}

// ============================================================
// POST — Incoming Events from Meta
// ============================================================
export async function POST(request: NextRequest) {
  let body: any

  try {
    body = await request.json()
  } catch {
    return new Response('Bad Request', { status: 400 })
  }

  const supabase = createAdminClient()

  for (const entry of body.entry || []) {
    // ── 1) Comment events (Instagram & Facebook)
    for (const change of entry.changes || []) {
      if (change.field === 'comments') {
        await handleNewComment(change.value, supabase)
      }

      // Instagram Mentions in stories / posts
      if (change.field === 'mentions') {
        // placeholder — يمكن توسيعه لاحقاً
      }
    }

    // ── 2) DM / Messaging events (Instagram Direct)
    for (const messaging of entry.messaging || []) {
      if (messaging.message && !messaging.message.is_echo) {
        await handleDirectMessage(messaging, entry.id, supabase)
      }
    }
  }

  // Meta expects 200 OK fast — أي معالجة تانية تبقى async
  return new Response('OK')
}

// ============================================================
// Helper — pick a random item from an array
// ============================================================
function pickRandom<T>(arr: T[]): T | null {
  if (!arr || arr.length === 0) return null
  return arr[Math.floor(Math.random() * arr.length)]
}

// ============================================================
// Helper — check if comment text matches automation keywords
// Returns true if:
//   - trigger_keywords array has a match  (new format)
//   - OR trigger_keyword string matches   (legacy format)
//   - OR no keywords set → match all comments
// ============================================================
function matchesKeywords(text: string, automation: any): boolean {
  const lower = text.toLowerCase()

  // New format — array of keywords
  if (automation.trigger_keywords && automation.trigger_keywords.length > 0) {
    return automation.trigger_keywords.some((kw: string) =>
      lower.includes(kw.toLowerCase())
    )
  }

  // Legacy format — single keyword string
  if (automation.trigger_keyword) {
    return lower.includes(automation.trigger_keyword.toLowerCase())
  }

  // No keywords defined → trigger on any comment
  return true
}

// ============================================================
// Handler — New Comment on a Post
// ============================================================
async function handleNewComment(comment: any, supabase: any) {
  const { media_id, text, from, id: commentId } = comment

  if (!text || !media_id) return

  // Find all active automations for this media (post)
  // Also try automations with no post_id (apply to all posts)
  const { data: automations } = await supabase
    .from('automations')
    .select(`
      *,
      connected_accounts (
        access_token,
        account_type,
        account_id
      )
    `)
    .eq('is_active', true)
    .or(`post_id.eq.${media_id},post_id.is.null,post_url.ilike.%${media_id}%`)

  if (!automations || automations.length === 0) return

  // Find the FIRST matching automation
  const automation = automations.find((a: any) => matchesKeywords(text, a))
  if (!automation) return

  const account = automation.connected_accounts
  if (!account?.access_token) return

  let pageToken: string
  try {
    pageToken = decrypt(account.access_token)
  } catch {
    console.error('[Webhook] Failed to decrypt token for automation:', automation.id)
    return
  }

  let actionTaken = ''
  let errorMessage = ''

  try {
    // ── A) Reply to Comment (public)
    const commentReply = pickRandom<string>(automation.comment_replies)
      ?? automation.comment_reply  // fallback to legacy field

    if (commentReply && commentId) {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/${commentId}/replies`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: commentReply,
            access_token: pageToken,
          }),
        }
      )
      if (res.ok) {
        actionTaken += 'comment_reply,'
      } else {
        const err = await res.json()
        console.error('[Webhook] Comment reply failed:', err)
        errorMessage += `comment_reply_failed: ${err?.error?.message || 'unknown'} | `
      }
    }

    // ── B) Send DM to commenter
    const dmText = pickRandom<string>(automation.dm_messages)
      ?? automation.dm_message  // fallback to legacy field

    if (dmText && from?.id) {
      // Instagram DMs use the Instagram account ID, Facebook uses page ID
      const recipientField = account.account_type === 'instagram'
        ? { id: from.id }
        : { id: from.id }

      const res = await fetch(
        `https://graph.facebook.com/v19.0/me/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient: recipientField,
            message: { text: dmText },
            access_token: pageToken,
          }),
        }
      )
      if (res.ok) {
        actionTaken += 'dm_sent,'
      } else {
        const err = await res.json()
        console.error('[Webhook] DM failed:', err)
        errorMessage += `dm_failed: ${err?.error?.message || 'unknown'} | `
      }
    }
  } catch (err: any) {
    errorMessage = err.message
    console.error('[Webhook] Unexpected error in handleNewComment:', err)
  }

  // ── Log the action
  await supabase.from('automation_logs').insert({
    automation_id:  automation.id,
    commenter_id:   from?.id   ?? null,
    commenter_name: from?.name ?? null,
    comment_text:   text,
    comment_id:     commentId,
    action_taken:   actionTaken || 'no_action',
    error_message:  errorMessage || null,
    event_type:     'comment',
  })
}

// ============================================================
// Handler — Incoming Direct Message (Instagram DM)
// ============================================================
async function handleDirectMessage(messaging: any, pageId: string, supabase: any) {
  const senderId  = messaging.sender?.id
  const messageText = messaging.message?.text

  if (!senderId || !messageText) return

  // Find automations for this page/account that are active
  // DM automations: match by account_id (the Instagram/page ID)
  const { data: automations } = await supabase
    .from('automations')
    .select(`
      *,
      connected_accounts (
        access_token,
        account_type,
        account_id
      )
    `)
    .eq('is_active', true)
    .eq('connected_accounts.account_id', pageId)

  if (!automations || automations.length === 0) return

  const automation = automations.find((a: any) => matchesKeywords(messageText, a))
  if (!automation) return

  const account = automation.connected_accounts
  if (!account?.access_token) return

  let pageToken: string
  try {
    pageToken = decrypt(account.access_token)
  } catch {
    console.error('[Webhook] Failed to decrypt token for DM automation:', automation.id)
    return
  }

  let actionTaken = ''
  let errorMessage = ''

  try {
    const dmText = pickRandom<string>(automation.dm_messages)
      ?? automation.dm_message

    if (dmText) {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/me/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient: { id: senderId },
            message: { text: dmText },
            access_token: pageToken,
          }),
        }
      )

      if (res.ok) {
        actionTaken = 'dm_sent'
      } else {
        const err = await res.json()
        errorMessage = `dm_failed: ${err?.error?.message || 'unknown'}`
        console.error('[Webhook] DM reply failed:', err)
      }
    }
  } catch (err: any) {
    errorMessage = err.message
    console.error('[Webhook] Unexpected error in handleDirectMessage:', err)
  }

  // ── Log the action
  await supabase.from('automation_logs').insert({
    automation_id:  automation.id,
    commenter_id:   senderId,
    commenter_name: null,
    comment_text:   messageText,
    comment_id:     null,
    action_taken:   actionTaken || 'no_action',
    error_message:  errorMessage || null,
    event_type:     'dm',
  })
}