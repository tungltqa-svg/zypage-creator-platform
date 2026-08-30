import { NextResponse } from 'next/server';
import { generateVietQRUrl } from '@/lib/vietqr';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bankId, accountNo, accountName, amount, donorName, message } = body;

    if (!accountNo || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Thiếu thông tin số tài khoản hoặc số tiền không hợp lệ' },
        { status: 400 }
      );
    }

    // Tạo mã code định danh chuyển khoản độc nhất (VD: ZY7291)
    const paymentCode = 'ZY' + Math.floor(1000 + Math.random() * 9000);

    // Tạo URL VietQR
    const qrUrl = generateVietQRUrl({
      bankId: bankId || 'MB',
      accountNo,
      accountName: accountName || '',
      amount: Number(amount),
      description: `${paymentCode} ${donorName ? donorName.replace(/[^a-zA-Z0-9]/g, '') : ''}`.trim(),
    });

    return NextResponse.json({
      success: true,
      paymentCode,
      qrUrl,
      amount,
      donorName,
      message,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
