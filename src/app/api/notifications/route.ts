import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import webpush from 'web-push'

if (process.env.VAPID_PRIVATE_KEY && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:admin@levelup.app',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action, subscription } = await req.json()

  if (action === 'subscribe') {
    await supabase.from('push_subscriptions').upsert(
      { user_id: user.id, subscription },
      { onConflict: 'user_id' }
    )
    return NextResponse.json({ ok: true })
  }

  if (action === 'send') {
    const { data: sub } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', user.id)
      .single()

    if (!sub) return NextResponse.json({ error: 'No subscription' }, { status: 404 })

    const { title, body, url } = req.body as unknown as { title: string; body: string; url: string }

    await webpush.sendNotification(
      sub.subscription,
      JSON.stringify({ title, body, url })
    )

    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
