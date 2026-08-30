'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wallet,
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  CreditCard,
  Crown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_CREATORS } from '@/lib/mock-data';

export default function CreatorWalletPage() {
  const [creator, setCreator] = useState(INITIAL_CREATORS.mixigaming);
  const [walletBalance, setWalletBalance] = useState(7605000); // 8.450.000đ - 10% demo
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const [payouts, setPayouts] = useState([
    {
      id: 'po_102',
      amount: 5000000,
      bank: 'MB - 9999999999 (PHUNG THANH DO)',
      status: 'COMPLETED',
      createdAt: '2026-08-28 15:30',
    },
    {
      id: 'po_101',
      amount: 2500000,
      bank: 'MB - 9999999999 (PHUNG THANH DO)',
      status: 'COMPLETED',
      createdAt: '2026-08-20 09:15',
    },
  ]);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt < 50000) {
      alert('Số tiền rút tối thiểu là 50.000 VNĐ');
      return;
    }
    if (amt > walletBalance) {
      alert('Số dư ví khả dụng không đủ');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setWalletBalance((prev) => prev - amt);
      setPayouts([
        {
          id: 'po_' + Math.floor(100 + Math.random() * 900),
          amount: amt,
          bank: `${creator.bankName} - ${creator.bankAccount} (${creator.bankAccountName})`,
          status: 'PENDING',
          createdAt: 'Vừa xong',
        },
        ...payouts,
      ]);
      setIsSubmitting(false);
      setWithdrawSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setWithdrawSuccess(false);
        setWithdrawAmount('');
      }, 2000);
    }, 1000);
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
                Zy<span className="text-pink-500">Wallet</span>
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-400">
              <Link href="/dashboard" className="hover:text-white transition">Studio</Link>
              <span className="text-white">Ví & Doanh thu</span>
              <Link href="/pricing" className="text-pink-400 hover:text-pink-300">Nâng cấp Pro</Link>
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        {/* Banner Pro Upgrade Incentive */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-pink-950/60 via-purple-950/60 to-slate-900 border border-pink-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Bạn đang ở gói <span className="text-yellow-400">Khởi Đầu (5% phí giao dịch)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Nâng cấp lên <b>Creator PRO</b> để được miễn phí <b>0% chiết khấu</b> và rút tiền ưu tiên không giới hạn!
              </p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-lg shrink-0 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> Nâng cấp 0% Phí
          </Link>
        </div>

        {/* 3 Wallet Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {/* Available Balance */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 relative overflow-hidden">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span>Số dư ví khả dụng</span>
              <Wallet className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-3xl font-black text-white font-mono mt-2">
              {walletBalance.toLocaleString()}đ
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-4 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
            >
              <ArrowDownLeft className="w-4 h-4" /> RÚT TIỀN VỀ NGÂN HÀNG
            </button>
          </div>

          {/* Total Lifetime Earnings */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span>Tổng doanh thu tích lũy</span>
              <TrendingUp className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white font-mono mt-2">
                15.950.000đ
              </h2>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Bao gồm donate, shop và thử thách
              </span>
            </div>
          </div>

          {/* Platform Fee Incurred */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col justify-between">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span>Phí nền tảng đã đóng (5%)</span>
              <DollarSign className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-300 font-mono mt-2">
                845.000đ
              </h2>
              <Link href="/pricing" className="text-[11px] text-pink-400 hover:underline mt-1 block font-bold">
                → Tiết kiệm 845.000đ với gói Pro
              </Link>
            </div>
          </div>
        </div>

        {/* Bank Account Info Card */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Building className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Tài khoản nhận tiền tự động</span>
              <h4 className="text-sm font-bold text-white font-mono">
                {creator.bankName} - {creator.bankAccount}
              </h4>
              <span className="text-xs text-slate-300">{creator.bankAccountName}</span>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="text-xs text-cyan-400 hover:underline font-bold"
          >
            Đổi tài khoản
          </Link>
        </div>

        {/* Payout History Table */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-pink-400" /> Lịch sử Lệnh Rút Tiền
          </h3>

          <div className="divide-y divide-slate-800">
            {payouts.map((po) => (
              <div key={po.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono">#{po.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        po.status === 'COMPLETED'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                      }`}
                    >
                      {po.status === 'COMPLETED' ? 'Đã chuyển khoản' : 'Đang xử lý (trong 24h)'}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px] mt-0.5 block">{po.bank}</span>
                </div>

                <div className="text-right">
                  <span className="font-black text-white font-mono text-sm block">
                    -{po.amount.toLocaleString()}đ
                  </span>
                  <span className="text-[10px] text-slate-500">{po.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WITHDRAW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs bg-slate-800 p-1.5 rounded-full"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-white">Tạo Lệnh Rút Tiền</h3>
            <p className="text-xs text-slate-400 mt-1">
              Số dư khả dụng: <b className="text-green-400 font-mono">{walletBalance.toLocaleString()}đ</b>
            </p>

            <form onSubmit={handleRequestPayout} className="mt-4 space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold text-slate-300">Nhập số tiền muốn rút (VNĐ)</label>
                <input
                  type="number"
                  required
                  placeholder="VD: 1000000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl text-xs space-y-1 text-slate-300 border border-white/5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ngân hàng nhận:</span>
                  <span className="font-bold">{creator.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Số tài khoản:</span>
                  <span className="font-mono font-bold">{creator.bankAccount}</span>
                </div>
              </div>

              {!withdrawSuccess ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? 'Đang gửi yêu cầu...' : 'XÁC NHẬN RÚT TIỀN'}
                </button>
              ) : (
                <div className="p-3 bg-green-950/60 border border-green-500/50 rounded-xl text-green-400 text-xs font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Đã tạo lệnh rút tiền thành công!
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
