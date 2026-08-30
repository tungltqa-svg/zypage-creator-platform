'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await login(email);
    router.push('/dashboard');
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    await loginWithGoogle();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-4 selection:bg-pink-500 selection:text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-pink-500/20 to-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-[#0f172a] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-pink-500/25">
              Z
            </div>
            <span className="font-black text-2xl tracking-tight text-white">
              Zy<span className="text-pink-500">Page</span>
            </span>
          </Link>
          <h2 className="text-lg font-bold text-white mt-4">
            Đăng nhập Creator Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Quản lý trang Bio, nhận tiền VietQR và cài đặt OBS Overlay
          </p>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2.5"
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
          Đăng nhập nhanh bằng Google
        </button>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-[#0f172a] px-3 text-[11px] text-slate-500 font-medium uppercase">
            Hoặc bằng Email
          </span>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Địa chỉ Email</label>
            <div className="relative mt-1.5">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="creator@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Mật khẩu</label>
            <div className="relative mt-1.5">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-500/20 transition flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? 'Đang xử lý...' : 'ĐĂNG NHẬP VÀO STUDIO'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Chưa có tài khoản?{' '}
          <button
            onClick={handleGoogleLogin}
            className="text-pink-400 font-bold hover:underline"
          >
            Tạo trang miễn phí ngay
          </button>
        </div>
      </div>
    </div>
  );
}
