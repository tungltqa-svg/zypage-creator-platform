'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Palette,
  Sparkles,
  Volume2,
  Image as ImageIcon,
  Check,
  Eye,
  Save,
  Crown,
  Play,
  Heart,
  Sliders,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_CREATORS } from '@/lib/mock-data';

const THEME_PALETTES = [
  { name: 'Neon Cyber Pink', color: '#ff2e93', bg: 'from-pink-600 to-purple-600' },
  { name: 'Cyberpunk Cyan', color: '#00dfd8', bg: 'from-cyan-500 to-blue-600' },
  { name: 'Royal Gold VIP', color: '#f59e0b', bg: 'from-amber-500 to-yellow-600' },
  { name: 'Emerald Gamer', color: '#10b981', bg: 'from-emerald-500 to-teal-600' },
  { name: 'Deep Purple Matrix', color: '#7928ca', bg: 'from-purple-600 to-indigo-700' },
];

const SOUND_EFFECTS = [
  { id: 'tingting', name: 'Chuông Ting Ting Cổ Điển', desc: 'Âm thanh ting ting vui nhộn êm tai' },
  { id: 'fireworks', name: 'Pháo Hoa Nổ Hũ Jackpot', desc: 'Âm thanh nổ pháo hoa sôi động' },
  { id: 'cheer', name: 'Tiếng Vỗ Tay Cổ Vũ', desc: 'Tiếng khán giả hò reo nhiệt liệt' },
  { id: 'anime', name: 'Hiệu Ứng Anime Wow', desc: 'Âm thanh phong cách hoạt hình Nhật Bản' },
];

export default function CustomizerStudioPage() {
  const [selectedTheme, setSelectedTheme] = useState(THEME_PALETTES[0]);
  const [selectedSound, setSelectedSound] = useState(SOUND_EFFECTS[0].id);
  const [bioText, setBioText] = useState('Streamer / Content Creator. Chào mừng bạn đến với Bộ tộc MixiGaming!');
  const [goalText, setGoalText] = useState('Mua màn hình Stream 4K');
  const [isSaved, setIsSaved] = useState(false);

  const playPreviewSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      osc.frequency.setValueAtTime(987.77, audioCtx.currentTime + 0.15); // B5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {}
  };

  const handleSave = () => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
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
                Zy<span className="text-pink-500">Studio</span>
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-400">
              <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
              <span className="text-white">Tùy Biến Giao Diện</span>
              <Link href="/dashboard/wallet" className="hover:text-white transition">Ví Tiền</Link>
              <Link href="/pricing" className="text-pink-400 hover:text-pink-300">Gói Pro</Link>
            </nav>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition"
          >
            {isSaved ? <Check className="w-4 h-4 text-green-300" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Đã lưu thay đổi!' : 'Lưu cài đặt'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Customizer Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Color Palette */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-pink-400" /> Màu Sắc Chủ Đề (Theme Color)
            </h3>
            <p className="text-xs text-slate-400">Chọn tông màu đồng bộ cho cả trang Bio và các hiệu ứng trên OBS Overlay</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {THEME_PALETTES.map((pal) => (
                <button
                  key={pal.name}
                  onClick={() => setSelectedTheme(pal)}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                    selectedTheme.name === pal.name
                      ? 'border-pink-500 bg-pink-500/10 shadow-lg'
                      : 'border-slate-800 bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-gradient-to-r ${pal.bg} shrink-0 shadow`}
                  />
                  <span className="text-xs font-semibold text-white truncate">{pal.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Alert Sound Effects */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" /> Âm Thanh Alert Khi Nổ Donate
            </h3>
            <p className="text-xs text-slate-400">Âm thanh sẽ vang lên trực tiếp trên OBS Studio khi fan ủng hộ</p>

            <div className="space-y-2.5 pt-2">
              {SOUND_EFFECTS.map((snd) => (
                <div
                  key={snd.id}
                  onClick={() => setSelectedSound(snd.id)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    selectedSound === snd.id
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{snd.name}</span>
                    <span className="text-[11px] text-slate-400">{snd.desc}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playPreviewSound();
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Play className="w-3 h-3" /> Nghe thử
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Bio & Goal Text */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" /> Nội Dung Kênh & Mục Tiêu Gây Quỹ
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300">Lời giới thiệu kênh (Bio)</label>
              <textarea
                rows={2}
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                className="w-full mt-1.5 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Tiêu đề mục tiêu (Goal Bar)</label>
              <input
                type="text"
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                className="w-full mt-1.5 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Right Live Preview: Mock Phone (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="text-center mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-pink-400" /> Xem Trước Trực Tiếp (Live Preview)
            </span>
          </div>

          <div className="max-w-sm mx-auto bg-[#0f172a] border-2 border-slate-700 rounded-[36px] p-5 shadow-2xl relative overflow-hidden">
            {/* Header Banner */}
            <div className={`h-24 -mx-5 -mt-5 bg-gradient-to-r ${selectedTheme.bg} opacity-60 relative`} />

            <div className="relative -mt-12 text-center flex flex-col items-center">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=MixiGaming"
                className="w-20 h-20 rounded-full border-4 border-[#0f172a] shadow-xl bg-slate-800 object-cover"
              />
              <h4 className="text-sm font-black text-white mt-2">Phùng Thanh Độ</h4>
              <span className="text-[11px] text-pink-400 font-mono">@mixigaming</span>
              <p className="text-[11px] text-slate-300 mt-2 px-2 leading-relaxed">{bioText}</p>

              {/* Sample Donate Button */}
              <div className="w-full mt-5 p-3 rounded-2xl bg-slate-800/80 border border-white/5 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 block">Ủng hộ nhanh</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="py-1 rounded-lg text-[10px] font-mono font-bold bg-pink-600 text-white text-center">
                    50.000đ
                  </div>
                  <div className="py-1 rounded-lg text-[10px] font-mono bg-slate-800 text-slate-400 text-center">
                    100.000đ
                  </div>
                  <div className="py-1 rounded-lg text-[10px] font-mono bg-slate-800 text-slate-400 text-center">
                    200.000đ
                  </div>
                </div>
              </div>

              {/* Sample Goal */}
              <div className="w-full mt-3 p-3 rounded-2xl bg-slate-800/60 border border-white/5 text-left">
                <span className="text-[10px] font-bold text-white">{goalText}</span>
                <div className="w-full h-2 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${selectedTheme.bg} w-3/4 rounded-full`} />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                  <span>8.450.000đ</span>
                  <span>15.000.000đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
