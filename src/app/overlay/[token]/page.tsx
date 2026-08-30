'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, Timer, Gift, Star, CheckCircle, Clock } from 'lucide-react';
import { YoutubeIcon } from '@/components/icons/YoutubeIcon';
import confetti from 'canvas-confetti';
import { AlertPayload, QuizItem } from '@/types';
import { DEFAULT_WHEEL_ITEMS } from '@/lib/mock-data';

export default function MasterObsOverlayPage() {
  const params = useParams();
  const token = (params?.token as string) || 'demo-token-123';

  // Active States
  const [activeAlert, setActiveAlert] = useState<AlertPayload | null>(null);
  const [activeWheel, setActiveWheel] = useState<{ donor: string; result: string } | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState<{ quiz: QuizItem; donor: string } | null>(null);
  const [quizCountdown, setQuizCountdown] = useState(10);
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const [activeMusic, setActiveMusic] = useState<{ title: string; donor: string } | null>(null);

  // Goal & Countdown states
  const [goalCurrent, setGoalCurrent] = useState(8450000);
  const goalTarget = 15000000;
  const [countdownSecs, setCountdownSecs] = useState(11692);

  // Countdown timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSecs((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Audio chime
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn(e);
    }
  };

  // AI TTS Text to speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const channel = new BroadcastChannel(`obs_${token}`);
    channel.onmessage = (event) => {
      const { type, payload } = event.data || {};

      if (type === 'NEW_DONATE' || type === 'TEST_ALERT') {
        playAlertSound();
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });

        // Update stats
        if (payload?.amount) {
          setGoalCurrent((prev) => prev + payload.amount);
          setCountdownSecs((prev) => prev + 15);
        }

        // Branch by donation type
        if (payload?.type === 'wheel') {
          const item = DEFAULT_WHEEL_ITEMS[Math.floor(Math.random() * DEFAULT_WHEEL_ITEMS.length)];
          setActiveWheel({ donor: payload.donorName, result: payload.wheelResult || item.title });
          setWheelRotation((prev) => prev + 1800 + Math.random() * 360);
          setTimeout(() => setActiveWheel(null), 8000);
        } else if (payload?.type === 'quiz') {
          setActiveQuiz({ quiz: payload.quizData, donor: payload.donorName });
          setQuizCountdown(10);
          setShowQuizAnswer(false);
        } else if (payload?.type === 'music') {
          setActiveMusic({ title: payload.youtubeTitle || 'Chạy Ngay Đi — Sơn Tùng M-TP', donor: payload.donorName });
          setTimeout(() => setActiveMusic(null), 10000);
        } else {
          // Standard Donate / Voice
          setActiveAlert(payload);
          if (payload?.message) {
            setTimeout(() => speakText(`${payload.donorName} nói: ${payload.message}`), 800);
          }
          setTimeout(() => setActiveAlert(null), 7000);
        }
      }
    };

    return () => {
      channel.close();
    };
  }, [token]);

  // Quiz countdown
  useEffect(() => {
    if (!activeQuiz || showQuizAnswer) return;
    if (quizCountdown > 0) {
      const t = setTimeout(() => setQuizCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setShowQuizAnswer(true);
      const closeT = setTimeout(() => setActiveQuiz(null), 5000);
      return () => clearTimeout(closeT);
    }
  }, [activeQuiz, quizCountdown, showQuizAnswer]);

  return (
    <div className="w-screen h-screen bg-transparent p-6 relative overflow-hidden font-sans text-white selection:bg-transparent">
      {/* 1. Top Left: Subathon Countdown */}
      <div className="absolute top-6 left-6 z-20">
        <div className="bg-slate-950/85 border border-slate-700/80 rounded-2xl px-4 py-2 shadow-2xl backdrop-blur-md flex items-center gap-2.5">
          <Timer className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-slate-400">SUBATHON:</span>
          <span className="text-sm font-black font-mono text-white">
            {Math.floor(countdownSecs / 3600)}h {Math.floor((countdownSecs % 3600) / 60)}m {countdownSecs % 60}s
          </span>
        </div>
      </div>

      {/* 2. Top Right: Goal Target Bar */}
      <div className="absolute top-6 right-6 z-20 w-80">
        <div className="bg-slate-950/85 border border-slate-700/80 rounded-2xl p-3 shadow-2xl backdrop-blur-md">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-bold text-slate-200 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-pink-500" /> Mua Màn Hình 4K
            </span>
            <span className="text-cyan-400 font-bold font-mono">
              {Math.min(Math.round((goalCurrent / goalTarget) * 100), 100)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-full"
              animate={{ width: `${Math.min((goalCurrent / goalTarget) * 100, 100)}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      {/* 3. CENTER: Dynamic Event Alerts */}
      <div className="w-full h-full flex items-center justify-center pointer-events-none">
        {/* A. Standard / Voice Alert */}
        <AnimatePresence>
          {activeAlert && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: -50 }}
              className="max-w-md w-full bg-slate-950/95 border-2 border-pink-500 rounded-3xl p-6 shadow-[0_0_50px_rgba(255,46,147,0.4)] backdrop-blur-2xl text-center"
            >
              <div className="inline-flex items-center gap-1 px-3 py-0.5 bg-pink-500/20 text-pink-400 rounded-full text-xs font-bold uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" /> ỦNG HỘ MỚI
              </div>
              <h2 className="text-xl font-extrabold text-cyan-400">{activeAlert.donorName}</h2>
              <div className="text-3xl font-black text-green-400 font-mono my-1">
                +{activeAlert.amount.toLocaleString()} VNĐ
              </div>
              {activeAlert.message && (
                <p className="text-sm text-slate-200 italic mt-2 bg-slate-900/90 p-3 rounded-2xl border border-white/10">
                  "{activeAlert.message}"
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* B. Lucky Wheel Spin */}
        <AnimatePresence>
          {activeWheel && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              className="max-w-md w-full bg-slate-950/95 border-2 border-purple-500 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl text-center flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-1 px-3 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold uppercase mb-2">
                <Gift className="w-3.5 h-3.5" /> VÒNG QUAY MAY MẮN: {activeWheel.donor}
              </div>
              <motion.div
                animate={{ rotate: wheelRotation }}
                transition={{ duration: 4.5, ease: [0.15, 0.9, 0.2, 1] }}
                className="w-48 h-48 rounded-full border-4 border-yellow-400 my-3 shadow-xl"
                style={{
                  background: 'conic-gradient(#ff2e93 0deg 72deg, #7928ca 72deg 144deg, #00dfd8 144deg 216deg, #f59e0b 216deg 288deg, #10b981 288deg 360deg)',
                }}
              />
              <div className="mt-2 text-sm font-bold text-yellow-300">
                🎉 Kết quả: <span className="text-white text-base">{activeWheel.result}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* C. AI Quiz Challenge */}
        <AnimatePresence>
          {activeQuiz && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="max-w-lg w-full bg-slate-950/95 border-2 border-cyan-500 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-cyan-400 uppercase">
                  Thách đố: {activeQuiz.donor}
                </span>
                <span className="text-xs font-mono font-bold bg-slate-900 px-2.5 py-1 rounded-lg text-yellow-400">
                  ⏳ {quizCountdown}s
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-3 bg-slate-900 p-3 rounded-xl">
                {activeQuiz.quiz.question}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {activeQuiz.quiz.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border ${
                      showQuizAnswer && i === activeQuiz.quiz.correctIndex
                        ? 'bg-green-600/30 border-green-500 text-green-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {['A', 'B', 'C', 'D'][i]}. {opt}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* D. YouTube Music Request */}
        <AnimatePresence>
          {activeMusic && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="max-w-md w-full bg-slate-950/95 border-2 border-red-500 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-center gap-3"
            >
              <YoutubeIcon className="w-8 h-8 text-red-500" />
              <div>
                <span className="text-[10px] text-slate-400 block">YÊU CẦU NHẠC TỪ {activeMusic.donor.toUpperCase()}</span>
                <h4 className="text-xs font-bold text-white">{activeMusic.title}</h4>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
