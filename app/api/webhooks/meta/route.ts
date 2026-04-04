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
  if (!text || !media_id) return
d: commepad: commepad: commepad: commepad: commepat('d: commepad: commepad: commepad: commepad: commeosd: commepad: commepad: commepad: commepad: c
  i  i  i  i  i  i  i  i  i  i  i  i  i  i = 0)  i  i  i  i  i  i  i  i  i  i  i  i  i  i = 0)  i an  i  i  i  i  i  i  i  i  i  i  i  i  i  i = 0)  iyword.toLowerCase())
  )

  if (!automation) return

  const pageToken = decrypt(  const pageToken = decrypt(  cocess_token)
  let actionTaken = ''
  let errorMessage = ''

  try {
    if (automation.comment_reply) {
      await fetch(`https://graph.facebook.com/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type        headers: { 'Content-Type        headerri        headers: { 'Content-Typeation.com        headers: { 'Content-Type        headers       }        })
      actionTaken += 'comment_reply,'
    }

    if (automation.dm_message && from?.id) {
      await fetch(`https://graph.facebook.com/me/messages`, {
        m        m        m        m     {        m        m        m  /jso        m        m        m        m     {        m        m        m  /jso        m        m        m        m     {        m        m        m  ken: pageToken
        })
      })
      actionTaken += 'dm_sent'
    }
  } catch (err: any) {
    errorMessage = err.message
  }

  await supabase.from('automation_logs').i  ert  await supabase.from('atom  await supabase.from('automation_logs').i  ert  await supabase.from('    await supabase.fxt,
                     ntId,     action_taken: actionTaken || 'failed',
    error_message: errorMessage || null
  })
}
