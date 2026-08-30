'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DEFAULT_WHEEL_ITEMS } from '@/lib/mock-data';

export default function ObsWheelPage() {
  const params = useParams();
  const token = (params?.token as string) || 'demo-token-123';

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [spinDonor, setSpinDonor] = useState<string>('Khán giả');

  const spinWheel = (donor: string, forcedResult?: string) => {
    setIsSpinning(true);
    setSelectedReward(null);
    setSpinDonor(donor);

    const targetItem = forcedResult
      ? DEFAULT_WHEEL_ITEMS.find((i) => i.title === forcedResult) || DEFAULT_WHEEL_ITEMS[0]
      : DEFAULT_WHEEL_ITEMS[Math.floor(Math.random() * DEFAULT_WHEEL_ITEMS.length)];

    const extraRounds = 5 * 360; // quay 5 vòng
    const sliceAngle = 360 / DEFAULT_WHEEL_ITEMS.length;
    const itemIndex = DEFAULT_WHEEL_ITEMS.findIndex((i) => i.id === targetItem.id);
    const targetAngle = extraRounds + (360 - itemIndex * sliceAngle - sliceAngle / 2);

    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedReward(targetItem.title);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    }, 4500);
  };

  useEffect(() => {
    const channel = new BroadcastChannel(`obs_${token}`);
    channel.onmessage = (event) => {
      if (event.data?.type === 'SPIN_WHEEL' || (event.data?.type === 'NEW_DONATE' && event.data.payload?.type === 'wheel')) {
        const payload = event.data.payload;
        spinWheel(payload?.donorName || 'Khán giả', payload?.wheelResult);
      }
    };

    return () => {
      channel.close();
    };
  }, [token]);

  return (
    <div className="w-screen h-screen bg-transparent p-6 flex items-center justify-center font-sans">
      <div className="bg-slate-950/95 border-2 border-purple-500 rounded-3xl p-6 shadow-2xl backdrop-blur-xl text-white max-w-xl w-full flex flex-col items-center relative overflow-hidden">
        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <Gift className="w-4 h-4" /> VÒNG QUAY MAY MẮN LIVESTREAM
        </div>

        <p className="text-xs text-slate-300 mb-4">
          Người quay: <b className="text-cyan-400">{spinDonor}</b>
        </p>

        {/* Wheel Assembly */}
        <div className="relative w-64 h-64 my-2 flex items-center justify-center">
          {/* Top Indicator Arrow */}
          <div className="absolute -top-3 z-30 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-yellow-400 drop-shadow-md" />

          {/* Rotating Disc */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 4.5, ease: [0.15, 0.9, 0.2, 1] }}
            className="w-60 h-60 rounded-full border-4 border-yellow-400 shadow-[0_0_30px_rgba(168,85,247,0.5)] relative overflow-hidden flex items-center justify-center"
            style={{
              background: `conic-gradient(
                #ff2e93 0deg 72deg,
                #7928ca 72deg 144deg,
                #00dfd8 144deg 216deg,
                #f59e0b 216deg 288deg,
                #10b981 288deg 360deg
              )`,
            }}
          >
            {/* Center Cap */}
            <div className="w-14 h-14 rounded-full bg-slate-950 border-2 border-white flex items-center justify-center text-yellow-400 shadow-xl z-20">
              <Star className="w-6 h-6 fill-current" />
            </div>
          </motion.div>
        </div>

        {/* Result Display */}
        <div className="mt-4 w-full text-center">
          <AnimatePresence>
            {selectedReward && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl shadow-xl border border-white/20"
              >
                <span className="text-[11px] font-bold text-yellow-300 uppercase tracking-wider block">
                  🎉 KẾT QUẢ THỬ THÁCH:
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  {selectedReward}
                </h3>
              </motion.div>
            )}
          </AnimatePresence>

          {!selectedReward && (
            <div className="grid grid-cols-2 gap-2 text-left text-[11px] bg-slate-900/80 p-3 rounded-xl border border-white/5 mt-2">
              {DEFAULT_WHEEL_ITEMS.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-slate-300">
                  <span className="truncate pr-1">• {item.title}</span>
                  <span className="font-mono text-purple-400 font-bold">{item.chance}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
