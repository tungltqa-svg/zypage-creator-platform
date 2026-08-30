import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Webhook nhận biến động số dư ngân hàng tự động từ PayOS / SePAY
 * Khi fan chuyển khoản xong, ngân hàng gọi webhook này -> Tự động nổ alert trên OBS
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // PayOS Data format: { code: "00", desc: "success", data: { orderCode, amount, description, ... } }
    const transactionData = payload.data || payload;
    const { amount, description } = transactionData;

    // Tìm mã donate trong nội dung chuyển khoản (VD: ZY9482)
    const match = (description || '').match(/ZY\d{4}/i);
    const paymentCode = match ? match[0].toUpperCase() : null;

    if (!paymentCode) {
      return NextResponse.json({ message: 'Không tìm thấy mã thanh toán hợp lệ' });
    }

    if (isSupabaseConfigured && supabase) {
      // 1. Cập nhật trạng thái đơn donate thành PAID
      const { data: donation } = await supabase
        .from('donations')
        .update({ status: 'PAID' })
        .eq('payment_code', paymentCode)
        .select('*, creators(obs_token, goal_current)')
        .single();

      if (donation) {
        // 2. Broadcast sự kiện sang OBS Streamer
        await supabase.channel(`obs:${donation.creators.obs_token}`).send({
          type: 'broadcast',
          event: 'NEW_DONATE',
          payload: {
            id: donation.id,
            donorName: donation.donor_name,
            amount: donation.amount,
            message: donation.message,
            timestamp: Date.now(),
          },
        });

        // 3. Tăng tiến độ mục tiêu Goal
        await supabase
          .from('creators')
          .update({
            goal_current: (donation.creators.goal_current || 0) + donation.amount,
          })
          .eq('obs_token', donation.creators.obs_token);
      }
    }

    return NextResponse.json({ success: true, paymentCode, amount });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
