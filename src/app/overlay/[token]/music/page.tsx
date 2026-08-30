'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import { YoutubeIcon } from '@/components/icons/YoutubeIcon';

export default function ObsMusicPage() {
  const params = useParams();
  const token = (params?.token as string) || 'demo-token-123';

  const [currentSong, setCurrentSong] = useState<{
    title: string;
    sender: string;
    duration: number; // in seconds
    youtubeId?: string;
  } | null>(null);

  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const channel = new BroadcastChannel(`obs_${token}`);
    channel.onmessage = (event) => {
      if (event.data?.type === 'PLAY_MUSIC' || (event.data?.type === 'NEW_DONATE' && event.data.payload?.type === 'music')) {
        const payload = event.data.payload;
        setCurrentSong({
          title: payload?.youtubeTitle || 'Chúng Ta Của Tương Lai — Sơn Tùng M-TP',
          sender: payload?.donorName || 'Khán giả',
          duration: 210, // 3m30s
        });
        setCurrentTime(0);
      }
    };

    return () => {
      channel.close();
    };
  }, [token]);

  // Bộ đếm thời gian phát nhạc
  useEffect(() => {
    if (!currentSong) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= currentSong.duration) {
          setCurrentSong(null);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSong]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-screen h-screen bg-transparent p-6 flex items-start justify-start font-sans">
      <AnimatePresence>
        {currentSong && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="max-w-md w-full bg-slate-950/95 border-2 border-red-500/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-white"
          >
            {/* Header info */}
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <YoutubeIcon className="w-4 h-4" /> YÊU CẦU BÀI HÁT YOUTUBE
              </div>
              <span className="text-slate-400">
                Bởi: <b className="text-cyan-400">{currentSong.sender}</b>
              </span>
            </div>

            {/* Song Title */}
            <div className="flex items-center gap-3 bg-slate-900/90 p-3 rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center shrink-0">
                <Music className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate">
                  {currentSong.title}
                </h4>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-red-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${(currentTime / currentSong.duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(currentSong.duration)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
