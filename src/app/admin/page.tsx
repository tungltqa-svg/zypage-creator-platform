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
  Lock,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { INITIAL_CREATORS, INITIAL_DONATIONS } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [creatorsList, setCreatorsList] = useState([
    {
      id: 'c1',
      username: 'mixigaming',
      fullName: 'Phùng Thanh Độ',
      email: 'mixi@gmail.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MixiGaming',
      totalEarned: 8450000,
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

  const filteredCreators = creatorsList.filter(
    (c) =>
      c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 pb-16 selection:bg-pink-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-red-500/20 bg-[#090d16]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-red-500/30">
              ⚡
            </div>
            <div>
              <span className="font-extrabold text-lg text-white flex items-center gap-1.5">
                ZyPage <span className="text-red-500 font-mono text-sm px-2 py-0.5 bg-red-500/10 border border-red-500/30 rounded-md">ADMIN PORTAL</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400 hidden sm:inline">
              Đăng nhập bởi: <b className="text-red-400">{user?.email || 'admin@zypage.com'}</b>
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
        {/* Security Alert Banner */}
        <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-center justify-between text-xs mb-8">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <h4 className="font-bold text-red-300">Chế độ Quản trị Hệ thống Toàn sàn</h4>
              <p className="text-slate-400">Giám sát giao dịch donate, phòng chống gian lận & bảo vệ Rate Limit DDoS 30 req/10s.</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full font-mono text-[11px] font-bold">
            DDoS Shield Active
          </span>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Tổng doanh thu toàn sàn</span>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-black text-white font-mono mt-2">28.250.000đ</h3>
            <span className="text-[11px] text-green-400 mt-1 block">↑ 14.5% tuần này</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Tổng Creator hoạt động</span>
              <Users className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="text-2xl font-black text-white font-mono mt-2">342 kênh</h3>
            <span className="text-[11px] text-slate-400 mt-1 block">+18 kênh mới hôm nay</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Lượt giao dịch VietQR</span>
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-black text-white font-mono mt-2">1,894 đơn</h3>
            <span className="text-[11px] text-cyan-400 mt-1 block">Tỷ lệ thanh toán 99.2%</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">OBS Overlay Live</span>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-2xl font-black text-white font-mono mt-2">64 luồng</h3>
            <span className="text-[11px] text-purple-400 mt-1 block">Đang phát livestream</span>
          </div>
        </div>

        {/* Creator Management Table */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-400" /> Quản lý Nhà sáng tạo (Creators)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Danh sách các streamer và kênh bio đang hoạt động</p>
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
                  <th className="py-3 px-2">Ngân hàng VietQR</th>
                  <th className="py-3 px-2">Tổng tiền nhận</th>
                  <th className="py-3 px-2">Trạng thái</th>
                  <th className="py-3 px-2 text-right">Hành động</th>
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
                        {creator.status === 'ACTIVE' ? 'Khoá kênh' : 'Mở khoá'}
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
