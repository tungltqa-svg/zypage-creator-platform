'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (isRegisterMode) {
      if (!username || !fullName) {
        setErrorMsg('Vui lòng điền đầy đủ họ tên và username');
        setIsSubmitting(false);
        return;
      }
      const res = await register(email, password, username, fullName);
      if (res.success) {
        router.push('/dashboard');
      } else {
        setErrorMsg(res.error || 'Đăng ký thất bại');
      }
    } else {
      const res = await login(email, password);
      if (res.success) {
        if (res.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrorMsg(res.error || 'Đăng nhập thất bại. Kiểm tra lại thông tin.');
      }
    }
    setIsSubmitting(false);
  };

  // Quick 1-Click Login for Demo Accounts
  const quickLogin = async (demoEmail: string, pass: string, role: string) => {
    setEmail(demoEmail);
    setPassword(pass);
    setIsSubmitting(true);
    const res = await login(demoEmail, pass);
    if (res.success) {
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-4 selection:bg-pink-500 selection:text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-pink-500/20 to-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-[#0f172a] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-pink-500/25">
              Z
            </div>
            <span className="font-black text-2xl tracking-tight text-white">
              Zy<span className="text-pink-500">Page</span>
            </span>
          </Link>
          <h2 className="text-lg font-bold text-white mt-3">
            {isRegisterMode ? 'Tạo Tài Khoản Creator Mới' : 'Đăng Nhập Creator Studio'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRegisterMode
              ? 'Tạo trang bio cá nhân, nhận ủng hộ VietQR và kết nối OBS Studio'
              : 'Quản lý doanh thu, cài đặt widget và lịch sử giao dịch'}
          </p>
        </div>

        {/* Tab Switcher: Đăng nhập vs Đăng ký */}
        <div className="flex bg-slate-800/90 p-1 rounded-2xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl transition ${
              !isRegisterMode ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl transition ${
              isRegisterMode ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng Ký Mới
          </button>
        </div>

        {/* Quick Demo Accounts Selection */}
        {!isRegisterMode && (
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-white/5 mb-5 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block">⚡ ĐĂNG NHẬP NHANH TÀI KHOẢN MẪU:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickLogin('admin@zypage.com', 'admin123', 'admin')}
                className="py-1.5 px-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
              >
                👑 Tài khoản Admin
              </button>
              <button
                type="button"
                onClick={() => quickLogin('mixi@gmail.com', '123456', 'creator')}
                className="py-1.5 px-2 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
              >
                🎮 Creator MixiGaming
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs mb-4">
            {errorMsg}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-3.5">
          {isRegisterMode && (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-300">Họ và tên của bạn</label>
                <div className="relative mt-1">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Tên người dùng (@username)</label>
                <div className="relative mt-1">
                  <span className="text-slate-500 font-mono text-xs absolute left-3.5 top-1/2 -translate-y-1/2">@</span>
                  <input
                    type="text"
                    required
                    placeholder="tenkenhcua-ban"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full pl-8 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300">Địa chỉ Email</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="creator@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Mật khẩu</label>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? 'Đang xử lý...' : isRegisterMode ? 'TẠO TÀI KHOẢN NGAY' : 'ĐĂNG NHẬP VÀO STUDIO'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Google OAuth Button */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={async () => {
              await loginWithGoogle();
              router.push('/dashboard');
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Đăng nhập nhanh với Google
          </button>
        </div>
      </div>
    </div>
  );
}
