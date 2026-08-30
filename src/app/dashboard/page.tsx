'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Tv,
  QrCode,
  DollarSign,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Save,
  ArrowUpRight,
  TrendingUp,
  Settings,
  ListOrdered,
  Volume2,
  Gift,
  HelpCircle,
  Timer,
  Target,
  ShoppingBag,
  Plus,
  Trash2,
} from 'lucide-react';
import { YoutubeIcon } from '@/components/icons/YoutubeIcon';
import confetti from 'canvas-confetti';
import {
  INITIAL_CREATORS,
  INITIAL_DONATIONS,
  DEFAULT_WHEEL_ITEMS,
  SAMPLE_PRODUCTS,
  SAMPLE_QUIZZES,
} from '@/lib/mock-data';
import { POPULAR_BANKS } from '@/lib/vietqr';
import { DigitalProduct, WheelItem } from '@/types';

export default function DashboardPage() {
  const [creator, setCreator] = useState(INITIAL_CREATORS.mixigaming);
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(DEFAULT_WHEEL_ITEMS);
  const [products, setProducts] = useState<DigitalProduct[]>(SAMPLE_PRODUCTS);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  const masterOverlayUrl = `${baseUrl}/overlay/${creator.obsToken}`;
  const obsAlertUrl = `${baseUrl}/overlay/${creator.obsToken}/alert`;
  const obsWheelUrl = `${baseUrl}/overlay/${creator.obsToken}/wheel`;
  const obsMusicUrl = `${baseUrl}/overlay/${creator.obsToken}/music`;
  const obsQuizUrl = `${baseUrl}/overlay/${creator.obsToken}/quiz`;
  const obsGoalUrl = `${baseUrl}/overlay/${creator.obsToken}/goal`;
  const obsCountdownUrl = `${baseUrl}/overlay/${creator.obsToken}/countdown`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Kích hoạt BroadcastChannel test
  const fireTestEvent = (type: string, extraPayload: any = {}) => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    const channel = new BroadcastChannel(`obs_${creator.obsToken}`);
    channel.postMessage({
      type: 'NEW_DONATE',
      payload: {
        id: 'test_' + Date.now(),
        type,
        donorName: 'Minh Tú VIP',
        amount: 100000,
        message: 'Test hiệu ứng trên OBS Studio!',
        ...extraPayload,
        timestamp: Date.now(),
      },
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 pb-20 selection:bg-pink-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090d16]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center font-black text-sm text-white">
                Z
              </div>
              <span className="font-extrabold text-lg text-white">
                Zy<span className="text-pink-500">Dashboard</span>
              </span>
            </Link>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
              Creator Studio Pro
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${creator.username}`}
              target="_blank"
              className="px-3.5 py-1.5 text-xs font-semibold text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded-xl transition flex items-center gap-1"
            >
              <span>Xem Bio của bạn</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Creator Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <img
              src={creator.avatarUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl border-2 border-pink-500 bg-slate-800"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                {creator.fullName}
              </h1>
              <p className="text-xs text-slate-400 font-mono">@{creator.username}</p>
            </div>
          </div>

          {/* Quick Simulator Bar */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => fireTestEvent('donate')}
              className="px-3 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow"
            >
              <Volume2 className="w-3.5 h-3.5" /> Test Donate
            </button>
            <button
              onClick={() => fireTestEvent('wheel', { wheelResult: 'Hát 1 bài theo yêu cầu' })}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow"
            >
              <Gift className="w-3.5 h-3.5" /> Test Vòng quay
            </button>
            <button
              onClick={() => fireTestEvent('quiz', { quizData: SAMPLE_QUIZZES[0] })}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Test AI Quiz
            </button>
            <button
              onClick={() => fireTestEvent('music', { youtubeTitle: 'Chúng Ta Của Tương Lai — Sơn Tùng M-TP' })}
              className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow"
            >
              <YoutubeIcon className="w-3.5 h-3.5" /> Test YouTube
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Tổng thu nhập</span>
              <h3 className="text-xl font-black text-white font-mono mt-0.5">8.450.000đ</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Lượt ủng hộ & Mua file</span>
              <h3 className="text-xl font-black text-white font-mono mt-0.5">142 lượt</h3>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Mục tiêu hiện tại</span>
              <h3 className="text-xl font-black text-cyan-400 font-mono mt-0.5">56%</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* LEFT: OBS Link Setup (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* MASTER ALL-IN-ONE OVERLAY */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-slate-900/80 border-2 border-pink-500/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-pink-400 uppercase tracking-widest bg-pink-500/20 px-3 py-1 rounded-full">
                  Khuyên dùng cho Streamer
                </span>
                <span className="text-xs text-slate-400 font-mono">1920 x 1080</span>
              </div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" /> OBS All-in-One Master Overlay
              </h2>
              <p className="text-xs text-slate-300">
                Chỉ cần nhúng <b>1 link duy nhất</b> này vào OBS Studio, hệ thống sẽ tự động hiển thị mọi widget (Alert, Voice, Wheel, Quiz, YouTube Music, Goal, Countdown).
              </p>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  readOnly
                  value={masterOverlayUrl}
                  className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-pink-300 select-all"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(masterOverlayUrl, 'master')}
                  className="px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {copiedLink === 'master' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copiedLink === 'master' ? 'Đã chép' : 'Sao chép'}
                </button>
                <Link
                  href={masterOverlayUrl}
                  target="_blank"
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Individual Widgets Section */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Tv className="w-5 h-5 text-cyan-400" /> Các liên kết Widget OBS riêng biệt
              </h2>

              <div className="space-y-3">
                {/* 1. Alert */}
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-pink-400 block">1. Alert Box (Donate & Voice TTS)</span>
                    <span className="text-[11px] text-slate-400 font-mono">{obsAlertUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(obsAlertUrl, 'alert')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {copiedLink === 'alert' ? 'Đã chép' : 'Chép link'}
                  </button>
                </div>

                {/* 2. Wheel */}
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-purple-400 block">2. Lucky Wheel (Vòng quay may mắn)</span>
                    <span className="text-[11px] text-slate-400 font-mono">{obsWheelUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(obsWheelUrl, 'wheel')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {copiedLink === 'wheel' ? 'Đã chép' : 'Chép link'}
                  </button>
                </div>

                {/* 3. Quiz */}
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-cyan-400 block">3. AI Quiz (Thách đố trắc nghiệm)</span>
                    <span className="text-[11px] text-slate-400 font-mono">{obsQuizUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(obsQuizUrl, 'quiz')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {copiedLink === 'quiz' ? 'Đã chép' : 'Chép link'}
                  </button>
                </div>

                {/* 4. Music */}
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-red-400 block">4. YouTube Media Share</span>
                    <span className="text-[11px] text-slate-400 font-mono">{obsMusicUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(obsMusicUrl, 'music')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {copiedLink === 'music' ? 'Đã chép' : 'Chép link'}
                  </button>
                </div>

                {/* 5. Goal Bar */}
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-green-400 block">5. Goal Target Bar</span>
                    <span className="text-[11px] text-slate-400 font-mono">{obsGoalUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(obsGoalUrl, 'goal')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {copiedLink === 'goal' ? 'Đã chép' : 'Chép link'}
                  </button>
                </div>

                {/* 6. Subathon */}
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-yellow-400 block">6. Subathon Countdown Timer</span>
                    <span className="text-[11px] text-slate-400 font-mono">{obsCountdownUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(obsCountdownUrl, 'countdown')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    {copiedLink === 'countdown' ? 'Đã chép' : 'Chép link'}
                  </button>
                </div>
              </div>
            </div>

            {/* Digital Store Products Manager */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-cyan-400" /> Quản lý Cửa hàng số (Digital Store)
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    const title = prompt('Nhập tên sản phẩm số mới:');
                    if (title) {
                      setProducts([
                        ...products,
                        {
                          id: 'p_' + Date.now(),
                          creatorId: creator.id,
                          title,
                          price: 50000,
                          description: 'Sản phẩm số tự động tải về sau khi quét VietQR.',
                          coverUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&auto=format&fit=crop&q=60',
                          downloadUrl: 'https://example.com/file.zip',
                          soldCount: 0,
                        },
                      ]);
                    }
                  }}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm file số
                </button>
              </div>

              <div className="divide-y divide-slate-800">
                {products.map((prod) => (
                  <div key={prod.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={prod.coverUrl} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <span className="font-bold text-white block">{prod.title}</span>
                        <span className="text-green-400 font-mono font-bold">{prod.price.toLocaleString()}đ</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProducts(products.filter((p) => p.id !== prod.id))}
                      className="text-red-400 hover:text-red-300 p-1.5 bg-slate-800 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Banking & Wheel Items Settings (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" /> Cài đặt Tài khoản Ngân hàng
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-300">Ngân hàng thụ hưởng</label>
                <select
                  value={creator.bankName}
                  onChange={(e) => setCreator({ ...creator, bankName: e.target.value })}
                  className="w-full mt-1.5 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  {POPULAR_BANKS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Số tài khoản ngân hàng</label>
                <input
                  type="text"
                  value={creator.bankAccount}
                  onChange={(e) => setCreator({ ...creator, bankAccount: e.target.value })}
                  className="w-full mt-1.5 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Tên chủ tài khoản</label>
                <input
                  type="text"
                  value={creator.bankAccountName}
                  onChange={(e) => setCreator({ ...creator, bankAccountName: e.target.value })}
                  className="w-full mt-1.5 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-200 mb-3">Mục tiêu Livestream</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">Tiêu đề</label>
                    <input
                      type="text"
                      value={creator.goalTitle}
                      onChange={(e) => setCreator({ ...creator, goalTitle: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">Mục tiêu (VNĐ)</label>
                    <input
                      type="number"
                      value={creator.goalTarget}
                      onChange={(e) => setCreator({ ...creator, goalTarget: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> {isSaved ? 'ĐÃ LƯU THÀNH CÔNG!' : 'LƯU TẤT CẢ CÀI ĐẶT'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
