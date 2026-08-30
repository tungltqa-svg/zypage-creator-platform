'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Sparkles, CheckCircle, Clock } from 'lucide-react';
import { QuizItem } from '@/types';
import { SAMPLE_QUIZZES } from '@/lib/mock-data';

export default function ObsQuizPage() {
  const params = useParams();
  const token = (params?.token as string) || 'demo-token-123';

  const [activeQuiz, setActiveQuiz] = useState<QuizItem | null>(null);
  const [challenger, setChallenger] = useState<string>('Khán giả');
  const [countdown, setCountdown] = useState<number>(10);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const startQuiz = (quiz: QuizItem, sender: string) => {
    setActiveQuiz(quiz);
    setChallenger(sender);
    setCountdown(10);
    setShowAnswer(false);
  };

  useEffect(() => {
    const channel = new BroadcastChannel(`obs_${token}`);
    channel.onmessage = (event) => {
      if (event.data?.type === 'START_QUIZ' || (event.data?.type === 'NEW_DONATE' && event.data.payload?.type === 'quiz')) {
        const payload = event.data.payload;
        startQuiz(payload?.quizData || SAMPLE_QUIZZES[0], payload?.donorName || 'Khán giả');
      }
    };

    return () => {
      channel.close();
    };
  }, [token]);

  // Bộ đếm ngược 10 giây
  useEffect(() => {
    if (!activeQuiz || showAnswer) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowAnswer(true);
      // Tự đóng sau 6 giây kể từ khi hiện đáp án
      const closeTimer = setTimeout(() => {
        setActiveQuiz(null);
      }, 6000);
      return () => clearTimeout(closeTimer);
    }
  }, [activeQuiz, countdown, showAnswer]);

  return (
    <div className="w-screen h-screen bg-transparent p-6 flex items-center justify-center font-sans">
      <AnimatePresence>
        {activeQuiz && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -30 }}
            className="max-w-lg w-full bg-slate-950/95 border-2 border-cyan-500 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] backdrop-blur-2xl text-white"
          >
            {/* Top header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    THÁCH ĐỐ KIẾN THỨC · {activeQuiz.topic.toUpperCase()}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Người gửi: <b className="text-pink-400">{challenger}</b>
                  </p>
                </div>
              </div>

              {/* Countdown ring */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl font-mono">
                <Clock className="w-4 h-4 text-yellow-400 animate-spin" />
                <span className={`text-base font-black ${countdown <= 3 ? 'text-red-400' : 'text-yellow-400'}`}>
                  {countdown}s
                </span>
              </div>
            </div>

            {/* Question */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl mb-4">
              <h2 className="text-base font-bold text-slate-100 leading-snug">
                {activeQuiz.question}
              </h2>
            </div>

            {/* 4 Choices */}
            <div className="grid grid-cols-2 gap-2.5">
              {activeQuiz.options.map((opt, idx) => {
                const isCorrect = idx === activeQuiz.correctIndex;
                const letter = ['A', 'B', 'C', 'D'][idx];

                let btnClass = 'bg-slate-900/80 border-slate-800 text-slate-300';
                if (showAnswer) {
                  if (isCorrect) {
                    btnClass = 'bg-green-600/30 border-green-500 text-green-300 font-bold scale-[1.02] shadow-lg';
                  } else {
                    btnClass = 'bg-slate-900/40 border-slate-800/40 text-slate-600 opacity-60';
                  }
                }

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-xs ${btnClass}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-200 font-black flex items-center justify-center text-[10px] shrink-0">
                      {letter}
                    </span>
                    <span className="truncate">{opt}</span>
                    {showAnswer && isCorrect && (
                      <CheckCircle className="w-4 h-4 text-green-400 ml-auto shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {showAnswer && (
              <div className="mt-4 text-center text-xs font-extrabold text-green-400 animate-bounce">
                🎉 ĐÁP ÁN ĐÚNG LÀ: {['A', 'B', 'C', 'D'][activeQuiz.correctIndex]}. {activeQuiz.options[activeQuiz.correctIndex]}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
