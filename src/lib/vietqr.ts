import { VietQRParams } from '@/types';

/**
 * Tạo URL mã QR thanh toán chuẩn VietQR (Miễn phí 100%, tích hợp mọi App Ngân hàng Việt Nam)
 * Dịch vụ VietQR.io Quick Link: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>
 */
export function generateVietQRUrl({
  bankId = 'MB',
  accountNo,
  accountName,
  amount,
  description,
}: VietQRParams): string {
  const cleanBank = encodeURIComponent(bankId.trim());
  const cleanAccount = encodeURIComponent(accountNo.trim());
  const cleanName = encodeURIComponent(accountName.trim());
  const cleanDesc = encodeURIComponent(description.trim());

  // Template compact2 tạo QR có khung ngân hàng và số tiền rõ ràng
  return `https://img.vietqr.io/image/${cleanBank}-${cleanAccount}-compact2.png?amount=${amount}&addInfo=${cleanDesc}&accountName=${cleanName}`;
}

export const POPULAR_BANKS = [
  { id: 'MB', code: 'MBBANK', name: 'MB Bank (Quân Đội)' },
  { id: 'VCB', code: 'VIETCOMBANK', name: 'Vietcombank' },
  { id: 'TCB', code: 'TECHCOMBANK', name: 'Techcombank' },
  { id: 'ACB', code: 'ACB', name: 'ACB Á Châu' },
  { id: 'VPB', code: 'VPBANK', name: 'VPBank' },
  { id: 'TPB', code: 'TPBANK', name: 'TPBank' },
  { id: 'BIDV', code: 'BIDV', name: 'BIDV' },
  { id: 'CTG', code: 'VIETINBANK', name: 'VietinBank' },
];
