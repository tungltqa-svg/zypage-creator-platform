'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Tv,
  QrCode,
  DollarSign,
  Gift,
  Volume2,
  Music,
  Target,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Play,
  Flame,
  Layers,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HomePage() {
  // Simulator State
  const [donorName, setDonorName] = useState('Khán Giả 88');
  const [amount, setAmount] = useState(50000);
  const [message, setMessage] = useState('Chúc anh livestream vui vẻ, bắn đỉnh chóp!');
  const [activeTab, setActiveTab] = useState<'donate' | 'wheel' | 'music'>('donate');
  const [alertShowing, setAlertShowing] = useState(false);
  const [liveAlertData, setLiveAlertData] = useState<{ name: string; amt: number; msg: string } | null>(null);
  const [currentGoal, setCurrentGoal] = useState(8450000);
  const targetGoal = 15000000;

  const triggerSimulatedDonate = () => {
    // Fire confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setLiveAlertData({
      name: donorName || 'Người hâm mộ',
      amt: amount,
      msg: message || 'Gửi tặng anh nhé!',
    });
    setAlertShowing(true);
    setCurrentGoal((prev) => Math.min(prev + amount, targetGoal));

    setTimeout(() => {
      setAlertShowing(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 selection:bg-pink-500 selection:text-white">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090d16]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-pink-500/20">
                Z
              </div>
              <span className="font-extrabold text-xl tracking-tight">
                Zy<span className="text-pink-500">Page</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <a href="#features" className="hover:text-white transition">Tính năng</a>
              <a href="#stage" className="hover:text-white transition">Sân khấu Demo</a>
              <Link href="/mixigaming" className="hover:text-pink-400 transition flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-400" /> Xem Bio Mẫu
              </Link>
              <Link href="/dashboard" className="hover:text-cyan-400 transition">
                Bảng quản trị
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition border border-white/10"
            >
              Đăng nhập
            </Link>
            <Link
              href="/mixigaming"
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl shadow-md shadow-pink-500/25 transition"
            >
              Tạo trang miễn phí
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Glow gradients background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-[130px] -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Nền tảng ủng hộ 0đ trung gian cho Creator & Streamer
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-100 max-w-4xl mx-auto leading-[1.15]">
            Trang Bio Donate & Widgets OBS <br />
            <span className="gradient-text">Tự động hóa 100% qua VietQR</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Người xem quét mã ngân hàng trực tiếp không mất phí. Hiệu ứng nổ chuông, giọng đọc AI, và thanh mục tiêu nhảy số tức thì trên OBS Studio.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                const stage = document.getElementById('stage');
                stage?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 rounded-2xl shadow-xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition"
            >
              <Zap className="w-5 h-5 inline mr-1" /> Thử nghiệm Live Demo
            </button>
            <Link
              href="/mixigaming"
              className="px-6 py-3 text-base font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-2xl transition"
            >
              Xem Trang Bio Fan Donate
            </Link>
          </div>
        </div>

        {/* 3. Interactive Stage (Fan Phone + Stream Screen) */}
        <div id="stage" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="p-1 rounded-3xl bg-gradient-to-b from-white/15 via-white/5 to-transparent border border-white/10 shadow-2xl">
            <div className="bg-[#0b101d] rounded-[22px] p-4 sm:p-8">
              <div className="text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
                  Interactive Simulator (Mô phỏng trải nghiệm thực tế)
                </span>
                <p className="text-sm text-slate-400 mt-2">
                  Bấm <b>"BẮN DONATE TEST"</b> ở điện thoại bên trái để xem hiệu ứng nổ pháo hoa trên màn hình Stream bên phải!
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* LEFT: Fan Phone Simulator */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="text-xs text-slate-400 font-medium mb-2 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-pink-400" /> Màn hình Người xem (Mobile)
                  </div>

                  {/* Phone Case */}
                  <div className="w-full max-w-[340px] bg-slate-900 border-4 border-slate-700/80 rounded-[38px] p-3 shadow-2xl shadow-purple-950/50">
                    <div className="bg-[#0f172a] rounded-[28px] p-4 text-left border border-white/5">
                      {/* Creator Info */}
                      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=MixiGaming"
                          alt="Mixi"
                          className="w-12 h-12 rounded-full border-2 border-pink-500 bg-slate-800"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-sm text-white">MixiGaming</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                          </div>
                          <span className="text-xs text-slate-400 font-mono">zypage.com/mixigaming</span>
                        </div>
                      </div>

                      {/* Tabs */}
                      <div className="flex bg-slate-800/80 p-1 rounded-xl my-3 text-xs font-semibold">
                        <button
                          onClick={() => setActiveTab('donate')}
                          className={`flex-1 py-1.5 rounded-lg text-center transition ${
                            activeTab === 'donate' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Ủng hộ
                        </button>
                        <button
                          onClick={() => setActiveTab('wheel')}
                          className={`flex-1 py-1.5 rounded-lg text-center transition ${
                            activeTab === 'wheel' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Vòng quay
                        </button>
                        <button
                          onClick={() => setActiveTab('music')}
                          className={`flex-1 py-1.5 rounded-lg text-center transition ${
                            activeTab === 'music' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Bài hát
                        </button>
                      </div>

                      {/* Form Inputs */}
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-[11px] font-medium text-slate-400">Tên của bạn</label>
                          <input
                            type="text"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-slate-400">Chọn số tiền</label>
                          <div className="grid grid-cols-3 gap-1.5 mt-1">
                            {[20000, 50000, 100000].map((amt) => (
                              <button
                                key={amt}
                                type="button"
                                onClick={() => setAmount(amt)}
                                className={`py-1 text-xs font-semibold rounded-lg border transition ${
                                  amount === amt
                                    ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                                    : 'bg-slate-800 border-slate-700 text-slate-300'
                                }`}
                              >
                                {amt.toLocaleString()}đ
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-slate-400">Lời nhắn kèm theo</label>
                          <textarea
                            rows={2}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 resize-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={triggerSimulatedDonate}
                          className="w-full mt-2 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-pink-500/30 transition flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> BẮN DONATE TEST NGAY
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: OBS Livestream Screen Simulator */}
                <div className="lg:col-span-7 flex flex-col items-center">
                  <div className="text-xs text-slate-400 font-medium mb-2 flex items-center gap-1.5">
                    <Tv className="w-4 h-4 text-cyan-400" /> Màn hình Livestream OBS Studio của Streamer
                  </div>

                  {/* Monitor Frame */}
                  <div className="w-full aspect-[16/10] bg-slate-950 border-2 border-slate-800 rounded-2xl p-2 relative overflow-hidden shadow-2xl flex flex-col justify-between">
                    {/* Simulated Game/Cam Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-slate-950 to-purple-950/80 -z-0">
                      <div className="w-full h-full opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                    </div>

                    {/* Top Status Bar: Live badge & Goal bar */}
                    <div className="relative z-10 flex items-center justify-between gap-4 p-2">
                      <div className="flex items-center gap-2 bg-red-600/90 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" /> LIVE · 15.2K
                      </div>

                      {/* Goal Bar Widget */}
                      <div className="flex-1 max-w-sm bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 shadow">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-slate-300">🎯 Mua màn hình 4K</span>
                          <span className="font-bold text-cyan-400">
                            {currentGoal.toLocaleString()}đ / {targetGoal.toLocaleString()}đ
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-full"
                            initial={{ width: '56%' }}
                            animate={{ width: `${Math.min((currentGoal / targetGoal) * 100, 100)}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* CENTER: Realtime Pop-up Alert Banner */}
                    <div className="relative z-20 flex-1 flex items-center justify-center p-4">
                      <AnimatePresence>
                        {alertShowing && liveAlertData && (
                          <motion.div
                            initial={{ scale: 0.6, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.7, opacity: 0, y: -40 }}
                            className="max-w-md w-full bg-slate-900/95 border-2 border-pink-500/80 rounded-2xl p-4 shadow-2xl shadow-pink-500/30 backdrop-blur-xl flex items-center gap-4"
                          >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
                              🎉
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="text-xs text-yellow-400 font-extrabold tracking-wider uppercase flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> ỦNG HỘ MỚI
                              </div>
                              <h4 className="text-sm font-bold text-white truncate">
                                <span className="text-cyan-400">{liveAlertData.name}</span> vừa gửi{' '}
                                <span className="text-green-400 font-black">
                                  {liveAlertData.amt.toLocaleString()}đ
                                </span>
                              </h4>
                              <p className="text-xs text-slate-300 italic mt-0.5 truncate">
                                "{liveAlertData.msg}"
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!alertShowing && (
                        <div className="text-center text-slate-500 text-xs">
                          <p>OBS Widget đang chờ sự kiện donate...</p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Cam Box */}
                    <div className="relative z-10 flex justify-between items-end p-2">
                      <div className="w-24 h-16 bg-slate-900 border border-slate-700 rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-mono">
                        [Webcam HD]
                      </div>
                      <div className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-white/5">
                        OBS Browser Source: <span className="text-pink-400 font-mono">/overlay/token/alert</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Grid */}
      <section id="features" className="py-20 bg-slate-950/60 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest bg-pink-950/50 border border-pink-500/20 px-3 py-1 rounded-full">
              Hệ sinh thái đầy đủ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
              Mọi công cụ Streamer cần chỉ trong 1 liên kết
            </h2>
            <p className="text-slate-400 mt-2">
              Không cần cài đặt bot rườm rà. Tất cả hoạt động tức thì qua trình duyệt web và OBS Studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-pink-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Thanh toán VietQR 0đ phí</h3>
              <p className="text-sm text-slate-400 mt-2">
                Tiền từ người hâm mộ chuyển thẳng về tài khoản ngân hàng của bạn. Không bị giữ tiền, không mất % chiết khấu trung gian.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-purple-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">OBS Overlay Realtime</h3>
              <p className="text-sm text-slate-400 mt-2">
                Nhúng liên kết trong suốt vào OBS Studio. Nổ popup thông báo, pháo hoa và âm thanh ting ting dưới 1 giây.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Thanh tiến độ Goal Bar</h3>
              <p className="text-sm text-slate-400 mt-2">
                Đặt mục tiêu livestream (Mua mic mới, từ thiện, nâng cấp dàn PC) với thanh tiến độ tự nhảy số mỗi khi nhận ủng hộ.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-yellow-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Vòng quay may mắn (Wheel)</h3>
              <p className="text-sm text-slate-400 mt-2">
                Cho phép fan donate để quay vòng quay thử thách (Hát 1 bài, AFK 1 phút, đổi súng trong game) ngay trên livestream.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-green-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Yêu cầu bài hát YouTube</h3>
              <p className="text-sm text-slate-400 mt-2">
                Fan gửi link YouTube kèm tiền ủng hộ để phát nhạc trực tiếp trên stream với bộ lọc kiểm duyệt bản quyền.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-orange-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Cửa hàng số & Digital File</h3>
              <p className="text-sm text-slate-400 mt-2">
                Bán preset ảnh, file 3D, tài liệu học tập hoặc nhận đặt lịch tư vấn 1-1 với thanh toán tự động trả file.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-white/10 bg-[#070a12] py-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-pink-500 flex items-center justify-center text-white font-bold text-xs">
              Z
            </div>
            <span className="font-bold text-slate-200 text-sm">ZyPage Platform</span>
          </div>
          <p>Mã nguồn mã mở cho Streamer & Creator Việt Nam. Triển khai 100% miễn phí trên Next.js + Vercel + Supabase.</p>
        </div>
      </footer>
    </div>
  );
}
