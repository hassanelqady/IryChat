// lib/triggerWebhooks.ts
// استخدم الدالة دي في أي مكان عايز تبعت webhook event

import { createAdminClient } from '@/lib/supabase/admin'

export type WebhookEvent =
  | 'new_subscriber'
  | 'comment_received'
  | 'dm_received'
  | 'automation_triggered'
  | 'broadcast_sent'

interface TriggerPayload {
  userId: string
  event: WebhookEvent
  accountName?: string
  data: Record<string, any>
}

export async function triggerWebhooks({ userId, event, accountName, data }: TriggerPayload) {
  const supabase = createAdminClient()

  // جيب كل الـ webhooks النشطة للـ user دي والـ event ده
  const { data: webhooks } = await supabase
    .from('webhooks')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .contains('events', [event])

  if (!webhooks || webhooks.length === 0) return

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    account: accountName || 'IryChat',
    data,
  }

  // بعت لكل webhook بشكل متوازي
  const results = await Promise.allSettled(
    webhooks.map(async (webhook) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'IryChat-Webhook/1.0',
        'X-IryChat-Event': event,
      }

      if (webhook.secret) {
        headers['X-IryChat-Secret'] = webhook.secret
      }

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      try {
        const res = await fetch(webhook.url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        clearTimeout(timeout)

        // حدّث الـ stats
        await supabase
          .from('webhooks')
          .update({
            total_triggers: (webhook.total_triggers || 0) + 1,
            last_triggered_at: new Date().toISOString(),
          })
          .eq('id', webhook.id)

        return { webhookId: webhook.id, success: res.ok, status: res.status }
      } catch (err: any) {
        clearTimeout(timeout)
        console.error(`[Webhook] Failed to trigger ${webhook.id}:`, err.message)
        return { webhookId: webhook.id, success: false, error: err.message }
      }
    })
  )

  console.log(`[Webhook] Triggered ${webhooks.length} webhooks for event: ${event}`)
  return results
}