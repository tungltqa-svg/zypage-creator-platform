'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldAlert,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  Clock,
  ArrowRight,
  LogOut,
  CreditCard,
  Building,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_PAYOUT_REQUESTS } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [payouts, setPayouts] = useState(INITIAL_PAYOUT_REQUESTS);

  const [creatorsList, setCreatorsList] = useState([
    {
      id: 'c1',
      username: 'mixigaming',
      fullName: 'Phùng Thanh Độ',
      email: 'mixi@gmail.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MixiGaming',
      totalEarned: 8450000,
      plan: 'PRO',
      status: 'ACTIVE',
      bank: 'MB - 9999999999',
    },
    {
      id: 'c2',
      username: 'crisdevilgamer',
      fullName: 'Cris Phan',
      email: 'cris@gmail.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CrisPhan',
      totalEarned: 14200000,
      plan: 'STARTER',
      status: 'ACTIVE',
      bank: 'VCB - 0071001234567',
    },
    {
      id: 'c3',
      username: 'pewpew',
      fullName: 'Hoàng Văn Khoa',
      email: 'pewpew@gmail.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PewPew',
      totalEarned: 5600000,
      plan: 'PRO',
      status: 'ACTIVE',
      bank: 'TCB - 190334882910',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const toggleCreatorStatus = (id: string) => {
    setCreatorsList((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : c
      )
    );
  };

  const handleApprovePayout = (payoutId: string) => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setPayouts((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status: 'COMPLETED' } : p))
    );
  };

  const handleRejectPayout = (payoutId: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status: 'REJECTED' } : p))
    );
  };

  const filteredCreators = creatorsList.filter(
    (c) =>
      c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 pb-20 selection:bg-pink-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-red-500/20 bg-[#090d16]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-red-500/30">
              ⚡
            </div>
            <div>
              <span className="font-extrabold text-lg text-white flex items-center gap-1.5">
                ZyPage <span className="text-red-500 font-mono text-sm px-2 py-0.5 bg-red-500/10 border border-red-500/30 rounded-md">ADMIN & REVENUE PORTAL</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400 hidden sm:inline">
              Quản trị viên: <b className="text-red-400">{user?.email || 'admin@zypage.com'}</b>
            </span>
            <button
              onClick={async () => {
                await logout();
                router.push('/login');
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Security & Financial Alert Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-purple-950/30 to-slate-900 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs mb-8">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <h4 className="font-bold text-red-300">Cổng Quản Trị Tài Chính & Doanh Thu Sàn</h4>
              <p className="text-slate-400">Tự động khấu trừ 5% phí giao dịch Free Tier & thu phí định kỳ gói Pro 99k/tháng.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full font-mono font-bold">
              ● DDoS Edge Protected
            </span>
          </div>
        </div>

        {/* 4 Financial KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {/* Sàn Profit */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-green-950/40 to-slate-900 border border-green-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">Lợi Nhuận Sàn (Platform Profit)</span>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-black text-green-400 font-mono mt-2">14.850.000đ</h3>
            <span className="text-[11px] text-green-400 mt-1 block">Từ phí 5% + Thuê bao Pro</span>
          </div>

          {/* Gross GMV */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">Tổng Luân Chuyển GMV</span>
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-black text-white font-mono mt-2">128.450.000đ</h3>
            <span className="text-[11px] text-slate-400 mt-1 block">Tổng tiền fan donate toàn sàn</span>
          </div>

          {/* Active Creators */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">Creator Hoạt Động</span>
              <Users className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="text-2xl font-black text-white font-mono mt-2">342 Kênh</h3>
            <span className="text-[11px] text-pink-400 mt-1 block">48 Creator gói PRO VIP</span>
          </div>

          {/* Pending Payouts */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">Lệnh Chờ Rút Tiền</span>
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-black text-yellow-400 font-mono mt-2">
              {payouts.filter((p) => p.status === 'PENDING').length} Lệnh
            </h3>
            <span className="text-[11px] text-slate-400 mt-1 block">Cần duyệt & chuyển khoản</span>
          </div>
        </div>

        {/* SECTION 1: DUYỆT LỆNH RÚT TIỀN (PAYOUT APPROVAL) */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-yellow-400" /> Yêu Cầu Rút Tiền Của Streamer (Payout Queue)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Xác nhận chuyển khoản VietQR cho Creator khi họ tạo lệnh rút</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-2">Mã Lệnh</th>
                  <th className="py-3 px-2">Creator</th>
                  <th className="py-3 px-2">Ngân Hàng Nhận</th>
                  <th className="py-3 px-2">Số Tiền Rút</th>
                  <th className="py-3 px-2">Trạng Thái</th>
                  <th className="py-3 px-2 text-right">Thao Tác Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-2 font-mono font-bold text-white">#{p.id}</td>
                    <td className="py-3 px-2 font-bold text-white">{p.creatorName}</td>
                    <td className="py-3 px-2 font-mono text-slate-300">
                      {p.bankName} - {p.bankAccount} ({p.bankAccountName})
                    </td>
                    <td className="py-3 px-2 font-mono font-black text-sm text-green-400">
                      {p.amount.toLocaleString()}đ
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'COMPLETED'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                            : p.status === 'PENDING'
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {p.status === 'COMPLETED' ? 'Đã Thanh Toán' : p.status === 'PENDING' ? 'Chờ Duyệt' : 'Từ Chối'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right space-x-2">
                      {p.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleApprovePayout(p.id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-xs transition"
                          >
                            ✓ Duyệt & Chuyển Tiền
                          </button>
                          <button
                            onClick={() => handleRejectPayout(p.id)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-red-600/40 text-slate-400 hover:text-red-300 rounded-lg text-xs transition"
                          >
                            ✕ Hủy
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Đã hoàn tất</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: QUẢN LÝ CREATORS TOÀN SÀN */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-400" /> Danh Sách Nhà Sáng Tạo (Creators)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Quản lý phân quyền gói Pro và giám sát kênh bio</p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc @username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-2">Creator</th>
                  <th className="py-3 px-2">Gói Dịch Vụ</th>
                  <th className="py-3 px-2">Ngân Hàng VietQR</th>
                  <th className="py-3 px-2">Tổng Tiền Nhận</th>
                  <th className="py-3 px-2">Trạng Thái</th>
                  <th className="py-3 px-2 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCreators.map((creator) => (
                  <tr key={creator.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-2 flex items-center gap-3">
                      <img src={creator.avatarUrl} className="w-9 h-9 rounded-full border border-slate-700 bg-slate-800" />
                      <div>
                        <span className="font-bold text-white block">{creator.fullName}</span>
                        <Link href={`/${creator.username}`} target="_blank" className="text-pink-400 hover:underline text-[11px] flex items-center gap-1 font-mono">
                          @{creator.username} <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-extrabold ${creator.plan === 'PRO' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-slate-800 text-slate-400'}`}>
                        {creator.plan}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-mono text-slate-300">
                      {creator.bank}
                    </td>
                    <td className="py-3 px-2 font-mono font-bold text-green-400">
                      {creator.totalEarned.toLocaleString()}đ
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          creator.status === 'ACTIVE'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {creator.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right space-x-2">
                      <button
                        onClick={() => toggleCreatorStatus(creator.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          creator.status === 'ACTIVE'
                            ? 'bg-red-600/20 text-red-400 hover:bg-red-600/40 border border-red-500/30'
                            : 'bg-green-600/20 text-green-400 hover:bg-green-600/40 border border-green-500/30'
                        }`}
                      >
                        {creator.status === 'ACTIVE' ? 'Khoá Kênh' : 'Mở Khoá'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
