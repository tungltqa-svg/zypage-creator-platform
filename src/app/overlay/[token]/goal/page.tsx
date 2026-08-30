'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { INITIAL_CREATORS } from '@/lib/mock-data';

export default function ObsGoalPage() {
  const params = useParams();
  const token = (params?.token as string) || 'demo-token-123';

  const [goalTitle, setGoalTitle] = useState('Mua màn hình Stream 4K');
  const [targetAmount, setTargetAmount] = useState(15000000);
  const [currentAmount, setCurrentAmount] = useState(8450000);

  useEffect(() => {
    // Lắng nghe cập nhật qua BroadcastChannel
    const localChannel = new BroadcastChannel(`obs_${token}`);
    localChannel.onmessage = (event) => {
      if (event.data?.type === 'NEW_DONATE') {
        const added = event.data.payload?.amount || 0;
        setCurrentAmount((prev) => prev + added);
      }
    };

    return () => {
      localChannel.close();
    };
  }, [token]);

  const percent = Math.min(Math.round((currentAmount / targetAmount) * 100), 100);

  return (
    <div className="w-screen h-screen bg-transparent p-6 flex items-start justify-start">
      <div className="max-w-md w-full bg-slate-950/90 border border-slate-700 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-white font-sans">
        {/* Title & Stats */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-100">
            <Target className="w-4 h-4 text-pink-500" />
            <span>{goalTitle}</span>
          </div>
          <span className="font-extrabold text-xs text-cyan-400 font-mono">
            {percent}%
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10 relative">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-full shadow-lg"
          />
        </div>

        {/* Numbers */}
        <div className="flex justify-between text-[11px] font-mono mt-1.5 text-slate-400 font-semibold">
          <span className="text-green-400">{currentAmount.toLocaleString()} VNĐ</span>
          <span>{targetAmount.toLocaleString()} VNĐ</span>
        </div>
      </div>
    </div>
  );
}
