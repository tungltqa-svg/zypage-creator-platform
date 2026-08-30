'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Check, Zap, Crown, Shield, ArrowRight, QrCode, CheckCircle2 } from 'lucide-react';
import { generateVietQRUrl } from '@/lib/vietqr';
import confetti from 'canvas-confetti';

const PLANS = [
  {
    id: 'free',
    name: 'Khởi Đầu (Starter)',
    price: 0,
    period: 'Miễn phí vĩnh viễn',
    desc: 'Phù hợp cho streamer mới bắt đầu, không tốn bất kỳ chi phí ban đầu nào.',
    fee: 'Phí giao dịch 5%',
    features: [
      'Trang Bio cá nhân không giới hạn',
      'Nhận ủng hộ VietQR tự động',
      'Đầy đủ 7 Widget OBS Overlay',
      'Voice Text-To-Speech cơ bản',
      'Bán tối đa 3 sản phẩm số',
      'Hỗ trợ cộng đồng 24/7',
    ],
    buttonText: 'Bắt Đầu Miễn Phí',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Creator PRO (Khuyên Dùng)',
    price: 99000,
    period: 'VNĐ / tháng',
    desc: 'Dành cho Streamer chuyên nghiệp muốn tối đa hóa 100% doanh thu nhận được.',
    fee: '0% Phí giao dịch (Nhận trọn vẹn 100%)',
    features: [
      '0% PHÍ GIAO DỊCH (Tiết kiệm hàng triệu đồng)',
      'Gắn Tên Miền Riêng (VD: mixigaming.com)',
      'Mở khóa toàn bộ Kho Theme & Alert VIP',
      'AI TTS Giọng Đọc Cao Cấp (Celeb & Anime)',
      'Không giới hạn sản phẩm Cửa hàng số',
      'Rút tiền siêu tốc ưu tiên 24/7',
      'Tích xanh xác minh Creator VIP',
    ],
    buttonText: 'NÂNG CẤP PRO NGAY',
    highlight: true,
  },
  {
    id: 'agency',
    name: 'Studio Agency',
    price: 299000,
    period: 'VNĐ / tháng',
    desc: 'Dành cho Gaming House, MCN hoặc công ty quản lý nhiều Streamer cùng lúc.',
    fee: '0% Phí + Đa kênh',
    features: [
      'Tất cả quyền lợi của gói Creator PRO',
      'Quản lý đồng thời tối đa 15 Kênh Streamer',
      'Báo cáo dòng tiền & Kê khai thuế tập trung',
      'API Webhook tùy biến riêng cho Agency',
      'Quản lý phân quyền nhân viên kỹ thuật',
      'Hỗ trợ kỹ thuật 1-1 riêng qua Zalo/Telegram',
    ],
    buttonText: 'Đăng Ký Gói Agency',
    highlight: false,
  },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSelectPlan = (plan: any) => {
    if (plan.price === 0) {
      window.location.href = '/login';
      return;
    }
    setSelectedPlan(plan);
    setIsPaying(true);
    setPaymentSuccess(false);
  };

  const handleSimulateUpgradeSuccess = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    setPaymentSuccess(true);
  };

  const qrUrl = selectedPlan
    ? generateVietQRUrl({
        bankId: 'MB',
        accountNo: '888899998888',
        accountName: 'ZYPAGE PLATFORM JSC',
        amount: selectedPlan.price,
        description: `PRO_${Date.now().toString().slice(-4)} NANG CAP GOI`,
      })
    : '';

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 selection:bg-pink-500 selection:text-white pb-20">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090d16]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center font-black text-sm text-white">
              Z
            </div>
            <span className="font-extrabold text-lg text-white">
              Zy<span className="text-pink-500">Page</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs text-slate-300 hover:text-white transition">
              Đăng nhập
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl shadow"
            >
              Vào Studio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Title */}
      <div className="max-w-5xl mx-auto px-4 text-center pt-16 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-full text-xs font-bold uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Bảng Giá Minh Bạch & Tối Ưu Doanh Thu
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Chọn Gói Dịch Vụ Phù Hợp Để <br />
          <span className="gradient-text">Tăng Trưởng Thu Nhập Của Bạn</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto">
          Bắt đầu miễn phí 100% hoặc nâng cấp lên gói <b>Creator PRO</b> để hưởng <b>0% chiết khấu</b> và sở hữu tên miền riêng.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
              plan.highlight
                ? 'bg-gradient-to-b from-[#19152b] via-[#101326] to-[#0d0f1f] border-2 border-pink-500 shadow-[0_0_40px_rgba(255,46,147,0.25)] lg:-translate-y-2'
                : 'bg-slate-900/60 border border-white/10 hover:border-slate-700'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-[11px] font-black uppercase tracking-widest text-white shadow-lg flex items-center gap-1">
                <Crown className="w-3 h-3" /> PHỔ BIẾN NHẤT
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="text-xs text-slate-400 mt-2 min-h-[36px]">{plan.desc}</p>

              <div className="my-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{plan.period}</span>
                </div>
                <div className="mt-2 inline-block px-2.5 py-1 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-lg text-[11px] font-mono font-bold">
                  {plan.fee}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Quyền lợi bao gồm:
                </span>
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? 'text-pink-400 font-bold' : 'text-cyan-400'}`} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan(plan)}
              className={`w-full mt-8 py-3.5 rounded-2xl text-xs font-extrabold shadow-lg transition flex items-center justify-center gap-2 ${
                plan.highlight
                  ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:opacity-95 text-white shadow-pink-500/25'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {plan.buttonText}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {isPaying && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setIsPaying(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs bg-slate-800 p-1.5 rounded-full"
            >
              ✕
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-500/10 text-pink-400 rounded-full text-xs font-semibold mb-3">
              <Crown className="w-3.5 h-3.5" /> Nâng cấp {selectedPlan.name}
            </div>

            <h3 className="text-base font-bold text-white">Thanh toán phí dịch vụ</h3>
            <p className="text-2xl font-black text-green-400 font-mono mt-1">
              {selectedPlan.price.toLocaleString()} VNĐ / tháng
            </p>

            <div className="bg-white p-2.5 rounded-2xl my-4 inline-block shadow-lg">
              <img src={qrUrl} alt="VietQR Nâng cấp" className="w-56 h-auto mx-auto rounded-lg" />
            </div>

            {!paymentSuccess ? (
              <button
                onClick={handleSimulateUpgradeSuccess}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" /> [TEST] Tôi đã chuyển tiền (Kích hoạt Pro)
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-green-950/60 border border-green-500/50 rounded-xl text-green-400 text-xs font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Chúc mừng! Tài khoản đã được nâng cấp Creator PRO!
                </div>
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl block text-center"
                >
                  Vào Studio Trải Nghiệm 0% Phí
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
