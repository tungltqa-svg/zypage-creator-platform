'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Calendar,
  Sparkles,
  PieChart,
  ArrowUpRight,
  Crown,
} from 'lucide-react';
import { TOP_DONORS_LEADERBOARD } from '@/lib/mock-data';

export default function AnalyticsIntelligencePage() {
  const weeklyData = [
    { day: 'T2 (25/8)', amount: 850000, height: '45%' },
    { day: 'T3 (26/8)', amount: 1200000, height: '65%' },
    { day: 'T4 (27/8)', amount: 950000, height: '50%' },
    { day: 'T5 (28/8)', amount: 1600000, height: '80%' },
    { day: 'T6 (29/8)', amount: 2100000, height: '100%' },
    { day: 'T7 (30/8)', amount: 1450000, height: '70%' },
    { day: 'CN (31/8)', amount: 1850000, height: '90%' },
  ];

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
                Zy<span className="text-pink-500">Analytics</span>
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-400">
              <Link href="/dashboard" className="hover:text-white transition">Studio</Link>
              <span className="text-white">Báo Cáo Doanh Thu</span>
              <Link href="/dashboard/wallet" className="hover:text-white transition">Ví Tiền</Link>
              <Link href="/dashboard/customizer" className="hover:text-white transition">Tùy Biến</Link>
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

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-pink-400" /> Báo Cáo & Phân Tích Dòng Tiền (Financial Insights)
            </h1>
            <p className="text-xs text-slate-400 mt-1">Theo dõi tốc độ tăng trưởng doanh thu và hành vi đóng góp của người xem</p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-slate-300 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-pink-400" /> 7 Ngày Gần Nhất
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10">
            <span className="text-xs text-slate-400">Doanh thu tuần này</span>
            <h3 className="text-2xl font-black text-white font-mono mt-2">10.000.000đ</h3>
            <span className="text-[11px] text-green-400 mt-1 block flex items-center gap-1 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% so với tuần trước
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10">
            <span className="text-xs text-slate-400">Lượt Fan ủng hộ</span>
            <h3 className="text-2xl font-black text-pink-400 font-mono mt-2">184 Lượt</h3>
            <span className="text-[11px] text-slate-400 mt-1 block">Trung bình 26 lượt / ngày</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10">
            <span className="text-xs text-slate-400">Doanh thu TB / Fan (ARPU)</span>
            <h3 className="text-2xl font-black text-cyan-400 font-mono mt-2">54.340đ</h3>
            <span className="text-[11px] text-cyan-400 mt-1 block">Tỷ lệ thanh toán 99.1%</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-white/10">
            <span className="text-xs text-slate-400">Tiết kiệm phí với PRO</span>
            <h3 className="text-2xl font-black text-yellow-400 font-mono mt-2">500.000đ</h3>
            <span className="text-[11px] text-yellow-400 mt-1 block">Đã được miễn 0% chiết khấu</span>
          </div>
        </div>

        {/* Weekly Revenue Bar Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 mb-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" /> Biểu Đồ Doanh Thu 7 Ngày Qua
            </h3>
            <span className="text-xs font-mono font-bold text-green-400">Đỉnh điểm: 2.100.000đ (T6)</span>
          </div>

          {/* Visual SVG / HTML Bars */}
          <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 pt-8 pb-2 px-4 bg-slate-950/60 rounded-2xl border border-white/5">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                  {d.amount.toLocaleString()}đ
                </span>
                <div
                  className="w-full bg-gradient-to-t from-pink-600 to-purple-500 rounded-t-xl transition-all duration-500 hover:brightness-125 cursor-pointer shadow-lg shadow-pink-500/20"
                  style={{ height: d.height }}
                />
                <span className="text-[10px] font-mono text-slate-400 mt-1 font-semibold">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2 Subsections: Revenue Breakdown & Super Fans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Breakdown */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" /> Cơ Cấu Nguồn Doanh Thu
            </h3>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Ủng hộ trực tiếp (Donate & Voice)</span>
                  <span className="font-mono text-pink-400 font-bold">60% (6.000.000đ)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 rounded-full w-[60%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Cửa hàng số (Digital Store)</span>
                  <span className="font-mono text-cyan-400 font-bold">22% (2.200.000đ)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full w-[22%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Vòng quay may mắn (Lucky Wheel)</span>
                  <span className="font-mono text-purple-400 font-bold">12% (1.200.000đ)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[12%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Đố vui thử thách AI Quiz</span>
                  <span className="font-mono text-amber-400 font-bold">6% (600.000đ)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full w-[6%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Super Fans */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" /> Top Super Fans Đóng Góp Nhiều Nhất
            </h3>

            <div className="space-y-2.5">
              {TOP_DONORS_LEADERBOARD.slice(0, 4).map((fan) => (
                <div
                  key={fan.rank}
                  className="p-3 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={fan.avatarUrl} className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700" />
                    <div>
                      <span className="font-bold text-white block">{fan.donorName}</span>
                      <span className="text-[10px] text-slate-400">{fan.donationCount} lần đóng góp</span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-green-400">
                    {fan.totalAmount.toLocaleString()}đ
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
