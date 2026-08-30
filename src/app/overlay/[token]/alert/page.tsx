'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AlertPayload } from '@/types';

export default function ObsAlertPage() {
  const params = useParams();
  const token = (params?.token as string) || 'demo-token-123';
  const [currentAlert, setCurrentAlert] = useState<AlertPayload | null>(null);

  // Phát âm thanh ting ting Web Audio API (không cần tải file audio bên ngoài)
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn('Audio play prevented', e);
    }
  };

  const triggerAlert = (payload: AlertPayload) => {
    // 1. Âm thanh chuông
    playAlertSound();

    // 2. Nổ pháo hoa
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      zIndex: 9999,
    });

    // 3. Đặt alert và tự ẩn sau 7 giây
    setCurrentAlert(payload);
    setTimeout(() => {
      setCurrentAlert(null);
    }, 7000);
  };

  useEffect(() => {
    // Lắng nghe qua BroadcastChannel nội bộ trình duyệt (hoạt động ngay lập tức khi mở tab cùng browser)
    const localChannel = new BroadcastChannel(`obs_${token}`);
    localChannel.onmessage = (event) => {
      if (event.data?.type === 'NEW_DONATE') {
        triggerAlert(event.data.payload);
      }
    };

    // Lắng nghe qua Supabase Realtime nếu đã cấu hình
    let sbChannel: any = null;
    if (isSupabaseConfigured && supabase) {
      sbChannel = supabase
        .channel(`obs:${token}`)
        .on('broadcast', { event: 'NEW_DONATE' }, ({ payload }) => {
          triggerAlert(payload);
        })
        .subscribe();
    }

    return () => {
      localChannel.close();
      if (sbChannel && supabase) {
        supabase.removeChannel(sbChannel);
      }
    };
  }, [token]);

  return (
    <div className="w-screen h-screen bg-transparent overflow-hidden flex items-center justify-center p-8 selection:bg-transparent">
      <AnimatePresence>
        {currentAlert && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 60, rotate: -3 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: -60, rotate: 3 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative max-w-xl w-full bg-slate-950/95 border-2 border-pink-500 rounded-3xl p-6 shadow-[0_0_50px_rgba(255,46,147,0.4)] backdrop-blur-2xl text-center text-white"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xs font-black tracking-widest uppercase shadow-lg mb-3">
              <Sparkles className="w-4 h-4" /> ỦNG HỘ MỚI
            </div>

            {/* Donor & Amount */}
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl font-black text-cyan-400">
                {currentAlert.donorName}
              </h2>
              <div className="text-4xl font-black text-green-400 font-mono tracking-tight my-1 drop-shadow-md">
                +{currentAlert.amount.toLocaleString()} VNĐ
              </div>
            </div>

            {/* Message Box */}
            {currentAlert.message && (
              <div className="mt-3 bg-slate-900/90 border border-white/10 rounded-2xl p-3.5 shadow-inner">
                <p className="text-base font-medium text-slate-200 italic leading-relaxed">
                  "{currentAlert.message}"
                </p>
              </div>
            )}

            {/* Animated Glow Border */}
            <div className="absolute inset-0 rounded-3xl border border-cyan-400/30 pointer-events-none animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guide hint when empty */}
      {!currentAlert && (
        <div className="text-slate-500/20 text-xs font-mono select-none">
          OBS Alert Box Widget Ready (Token: {token})
        </div>
      )}
    </div>
  );
}
