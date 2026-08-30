import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, donorName, amount, message } = body;

    const alertPayload = {
      id: 'alert_' + Date.now(),
      donorName: donorName || 'Người hâm mộ',
      amount: Number(amount) || 50000,
      message: message || 'Chúc bạn livestream vui vẻ!',
      timestamp: Date.now(),
    };

    // Nếu có kết nối Supabase, bắn Realtime Broadcast
    if (isSupabaseConfigured && supabase) {
      await supabase.channel(`obs:${token}`).send({
        type: 'broadcast',
        event: 'NEW_DONATE',
        payload: alertPayload,
      });
    }

    return NextResponse.json({
      success: true,
      broadcasted: isSupabaseConfigured,
      payload: alertPayload,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
