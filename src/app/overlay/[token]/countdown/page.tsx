'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Plus } from 'lucide-react';

export default function ObsCountdownPage() {
  const params = useParams();
  const token = (params?.token as string) || 'demo-token-123';

  const [secondsLeft, setSecondsLeft] = useState(11692); // ~3h14m52s
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel(`obs_${token}`);
    channel.onmessage = (event) => {
      if (event.data?.type === 'NEW_DONATE') {
        const addedSecs = 15; // Mỗi lần donate cộng 15 giây
        setSecondsLeft((prev) => prev + addedSecs);
        setAddedNotice(`+${addedSecs}s`);
        setTimeout(() => setAddedNotice(null), 3000);
      }
    };

    return () => {
      channel.close();
    };
  }, [token]);

  const formatHours = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-screen h-screen bg-transparent p-6 flex items-start justify-start font-sans">
      <div className="bg-slate-950/90 border border-slate-700 rounded-2xl px-5 py-3 shadow-2xl backdrop-blur-md text-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
          <Timer className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-semibold block uppercase tracking-wider">
            SUBATHON COUNTDOWN
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white font-mono tracking-tight">
              {formatHours(secondsLeft)}
            </span>
            <AnimatePresence>
              {addedNotice && (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="text-xs font-black text-green-400 bg-green-950/80 border border-green-500/30 px-2 py-0.5 rounded-full flex items-center"
                >
                  <Plus className="w-3 h-3" />
                  {addedNotice}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
