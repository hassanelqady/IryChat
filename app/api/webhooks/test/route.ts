import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { webhookId, url, secret } = await request.json()

    if (!url) {
      return NextResponse.json({ success: false, error: 'No URL provided' }, { status: 400 })
    }

    const testPayload = {
      event: 'test',
      timestamp: new Date().toISOString(),
      account: 'IryChat Test',
      data: {
        message: 'This is a test webhook from IryChat ✅',
        webhook_id: webhookId,
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'IryChat-Webhook/1.0',
      'X-IryChat-Event': 'test',
    }

    if (secret) {
      headers['X-IryChat-Secret'] = secret
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(testPayload),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      return NextResponse.json({
        success: res.ok,
        status: res.status,
        error: res.ok ? null : `HTTP ${res.status}`,
      })
    } catch (fetchErr: any) {
      clearTimeout(timeout)
      const isTimeout = fetchErr.name === 'AbortError'
      return NextResponse.json({
        success: false,
        status: null,
        error: isTimeout ? 'Request timed out (10s)' : fetchErr.message,
      })
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}