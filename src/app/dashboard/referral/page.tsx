'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Share2,
  DollarSign,
  Gift,
  Copy,
  Check,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_CREATORS } from '@/lib/mock-data';

export default function ReferralProgramPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://zypage.com/register?ref=mixigaming';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 pb-20 selection:bg-pink-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090d16]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center font-black text-sm text-white">
                Z
              </div>
              <span className="font-extrabold text-lg text-white">
                Zy<span className="text-pink-500">Affiliate</span>
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-400">
              <Link href="/dashboard" className="hover:text-white transition">Studio</Link>
              <Link href="/dashboard/wallet" className="hover:text-white transition">Ví & Rút tiền</Link>
              <span className="text-white">Giới thiệu Streamer</span>
              <Link href="/pricing" className="text-pink-400 hover:text-pink-300">Gói Pro</Link>
            </nav>
          </div>

          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
          >
            Quay lại Studio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        {/* Banner Hero */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-pink-950/50 to-slate-900 border border-purple-500/30 text-center relative overflow-hidden mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs font-bold mb-4">
            <Gift className="w-3.5 h-3.5" /> Chương Trình Đối Tác Giới Thiệu Streamer
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Nhận <span className="text-pink-400">10% Hoa Hồng Trọn Đời</span> <br />
            Khi Giới Thiệu Streamer Khác Gia Nhập ZyPage
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed">
            Mỗi khi Streamer bạn giới thiệu nhận donate hoặc bán sản phẩm số, bạn sẽ tự động nhận 10% hoa hồng từ phí nền tảng đổ thẳng vào ví rút tiền!
          </p>

          {/* Referral Link Box */}
          <div className="max-w-lg mx-auto mt-6 p-2 bg-slate-900/90 border border-purple-500/40 rounded-2xl flex items-center justify-between gap-2 shadow-2xl">
            <span className="font-mono text-xs text-purple-300 truncate pl-3 font-semibold">
              {referralLink}
            </span>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs rounded-xl transition shrink-0 flex items-center gap-1.5 shadow-lg shadow-pink-500/20"
            >
              {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Đã sao chép link!' : 'Sao chép link'}</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span>Hoa hồng đã nhận</span>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-3xl font-black text-green-400 font-mono mt-2">
              1.850.000đ
            </h2>
            <span className="text-[11px] text-slate-400 mt-1 block">Tự động cộng vào ví rút tiền</span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span>Streamer đã gia nhập</span>
              <Users className="w-5 h-5 text-pink-400" />
            </div>
            <h2 className="text-3xl font-black text-white font-mono mt-2">
              14 Kênh
            </h2>
            <span className="text-[11px] text-pink-400 mt-1 block">3 kênh nâng cấp gói PRO</span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span>Tỷ lệ hoa hồng</span>
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-3xl font-black text-cyan-400 font-mono mt-2">
              10% TRỌN ĐỜI
            </h2>
            <span className="text-[11px] text-slate-400 mt-1 block">Không giới hạn thời gian</span>
          </div>
        </div>

        {/* Referral List Table */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-400" /> Danh Sách Streamer Bạn Đã Giới Thiệu
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-2">Streamer</th>
                  <th className="py-3 px-2">Ngày Tham Gia</th>
                  <th className="py-3 px-2">Gói Dịch Vụ</th>
                  <th className="py-3 px-2">Doanh Thu Kênh</th>
                  <th className="py-3 px-2 text-right">Hoa Hồng Của Bạn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-2 flex items-center gap-2 font-bold text-white">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Cris" className="w-7 h-7 rounded-full bg-slate-800" />
                    @crisdevilgamer
                  </td>
                  <td className="py-3 px-2 text-slate-400">15/08/2026</td>
                  <td className="py-3 px-2"><span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 font-mono text-[10px] rounded font-bold">PRO</span></td>
                  <td className="py-3 px-2 font-mono text-slate-300">14.200.000đ</td>
                  <td className="py-3 px-2 font-mono font-black text-green-400 text-right">+710.000đ</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-2 flex items-center gap-2 font-bold text-white">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pew" className="w-7 h-7 rounded-full bg-slate-800" />
                    @pewpew
                  </td>
                  <td className="py-3 px-2 text-slate-400">20/08/2026</td>
                  <td className="py-3 px-2"><span className="px-2 py-0.5 bg-slate-800 text-slate-400 font-mono text-[10px] rounded font-bold">STARTER</span></td>
                  <td className="py-3 px-2 font-mono text-slate-300">5.600.000đ</td>
                  <td className="py-3 px-2 font-mono font-black text-green-400 text-right">+280.000đ</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-2 flex items-center gap-2 font-bold text-white">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rambo" className="w-7 h-7 rounded-full bg-slate-800" />
                    @rambogaming
                  </td>
                  <td className="py-3 px-2 text-slate-400">24/08/2026</td>
                  <td className="py-3 px-2"><span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 font-mono text-[10px] rounded font-bold">PRO</span></td>
                  <td className="py-3 px-2 font-mono text-slate-300">8.900.000đ</td>
                  <td className="py-3 px-2 font-mono font-black text-green-400 text-right">+445.000đ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
