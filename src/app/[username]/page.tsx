'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  INITIAL_CREATORS,
  DEFAULT_WHEEL_ITEMS,
  SAMPLE_QUIZZES,
  SAMPLE_PRODUCTS,
  TOP_DONORS_LEADERBOARD,
} from '@/lib/mock-data';
import { generateVietQRUrl } from '@/lib/vietqr';
import {
  Heart,
  QrCode,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Target,
  Trophy,
  Mic,
  MicOff,
  ShoppingBag,
  Gift,
  HelpCircle,
  Download,
  Flame,
  Volume2,
  Music,
  Crown,
  Medal,
  Award,
  Zap,
} from 'lucide-react';
import { YoutubeIcon } from '@/components/icons/YoutubeIcon';
import confetti from 'canvas-confetti';
import { DigitalProduct, QuizItem } from '@/types';

const PRESET_AMOUNTS = [10000, 20000, 50000, 100000, 200000, 500000];

export default function CreatorBioPage() {
  const params = useParams();
  const username = (params?.username as string) || 'mixigaming';

  const creator = INITIAL_CREATORS[username] || {
    id: 'c-custom',
    username: username,
    fullName: username.toUpperCase(),
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    bio: `Chào mừng bạn đến với trang ủng hộ của ${username}! Cảm ơn sự đồng hành của bạn.`,
    bankName: 'MB',
    bankAccount: '0987654321',
    bankAccountName: username.toUpperCase(),
    obsToken: 'demo-token-123',
    goalTitle: 'Nâng cấp thiết bị Livestream',
    goalTarget: 10000000,
    goalCurrent: 3500000,
    countdownSeconds: 11692,
    plan: 'free' as const,
    walletBalance: 0,
    totalEarnings: 0,
  };

  // State Tabs: donate | request | wheel | shop | leaderboard | goal
  const [activeTab, setActiveTab] = useState<'donate' | 'request' | 'wheel' | 'shop' | 'leaderboard' | 'goal'>('donate');

  // Tab 1: Donate Form State
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoice, setHasVoice] = useState(false);
  const [alertSound, setAlertSound] = useState('tingting');

  // Tab 2: Request State (YouTube / AI Quiz)
  const [requestType, setRequestType] = useState<'music' | 'quiz'>('music');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Địa lý');
  const [selectedQuiz, setSelectedQuiz] = useState<QuizItem>(SAMPLE_QUIZZES[0]);

  // Tab 3: Lucky Wheel State
  const [wheelAmount, setWheelAmount] = useState(50000);

  // Tab 4: Digital Store Selected Product
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);

  // State Payment Modal
  const [isPaying, setIsPaying] = useState(false);
  const [paymentCode, setPaymentCode] = useState('');
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);
  const [currentDonationType, setCurrentDonationType] = useState<string>('donate');

  const selectedAmount =
    activeTab === 'shop' && selectedProduct
      ? selectedProduct.price
      : activeTab === 'wheel'
      ? wheelAmount
      : customAmount
      ? parseInt(customAmount) || 0
      : amount;

  // Voice recording toggle
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setHasVoice(true);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  // Bắt đầu thanh toán VietQR
  const handleStartPayment = (type: string) => {
    if (selectedAmount < 2000) {
      alert('Số tiền ủng hộ tối thiểu là 2.000 VNĐ');
      return;
    }
    const code = 'ZY' + Math.floor(1000 + Math.random() * 9000);
    setPaymentCode(code);
    setCurrentDonationType(type);
    setIsPaidSuccess(false);
    setIsPaying(true);
  };

  // VietQR URL Generator
  const qrImageUrl = generateVietQRUrl({
    bankId: creator.bankName,
    accountNo: creator.bankAccount,
    accountName: creator.bankAccountName,
    amount: selectedAmount,
    description: `${paymentCode} ${donorName ? donorName.slice(0, 10) : 'FAN'}`,
  });

  // GIẢ LẬP THANH TOÁN THÀNH CÔNG VÀ KÍCH HOẠT OBS OVERLAY
  const handleSimulatePaymentSuccess = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });

    setIsPaidSuccess(true);

    // Phát âm thanh ting ting
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {}

    // Bắn Realtime BroadcastChannel tới toàn bộ màn hình OBS Overlay
    try {
      const channel = new BroadcastChannel('zy_obs_channel_' + creator.obsToken);
      let payload: any = {
        id: 'sim_' + Date.now(),
        type: currentDonationType,
        donorName: donorName || 'Đại gia giấu tên',
        amount: selectedAmount,
        message: message || 'Chúc streamer luôn vui vẻ và mạnh khỏe!',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${donorName || 'Fan'}`,
        timestamp: Date.now(),
      };

      if (currentDonationType === 'music') {
        payload.youtubeUrl = youtubeUrl;
        payload.youtubeTitle = 'Bản nhạc yêu cầu từ Fan Cứng';
      } else if (currentDonationType === 'quiz') {
        payload.quizData = selectedQuiz;
      } else if (currentDonationType === 'wheel') {
        payload.wheelResult = 'Hát 1 bài theo yêu cầu';
      }

      channel.postMessage(payload);
    } catch (err) {
      console.warn('BroadcastChannel simulated', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 selection:bg-pink-500 selection:text-white relative">
      {/* Background Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-pink-500/20 to-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar Creator Studio Switcher */}
      <div className="w-full max-w-xl flex justify-between items-center mb-4 text-xs">
        <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition font-bold">
          <div className="w-5 h-5 rounded-md bg-pink-500 flex items-center justify-center text-[10px] text-white font-black">
            Z
          </div>
          <span>ZyPage</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/pricing"
            className="px-2.5 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-400 font-bold transition"
          >
            💎 Nâng cấp Pro
          </Link>
          <Link
            href="/dashboard"
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            Quản lý kênh
          </Link>
        </div>
      </div>

      {/* Main Bio Card */}
      <div className="w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Banner Cover */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 opacity-40 -z-0" />

        {/* Creator Info */}
        <div className="relative z-10 flex flex-col items-center text-center mt-6">
          <div className="relative">
            <img
              src={creator.avatarUrl}
              alt={creator.fullName}
              className="w-24 h-24 rounded-full border-4 border-[#0f172a] shadow-xl bg-slate-800 object-cover"
            />
            <div className="absolute bottom-1 right-1 bg-cyan-500 text-slate-950 p-1 rounded-full shadow">
              <CheckCircle2 className="w-4 h-4 fill-cyan-400 text-slate-900" />
            </div>
          </div>

          <h1 className="text-xl font-extrabold text-white mt-3 flex items-center gap-1.5">
            {creator.fullName}
          </h1>
          <p className="text-xs text-pink-400 font-mono">@{creator.username}</p>
          <p className="text-xs text-slate-300 mt-2 max-w-md leading-relaxed">
            {creator.bio}
          </p>

          {/* 6 TABS NAVIGATION */}
          <div className="w-full grid grid-cols-6 gap-1 bg-slate-800/80 p-1 rounded-2xl mt-5 text-[10px] sm:text-[11px] font-bold">
            <button
              onClick={() => setActiveTab('donate')}
              className={`py-2 rounded-xl transition flex flex-col items-center justify-center gap-0.5 ${
                activeTab === 'donate' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" /> <span>Ủng hộ</span>
            </button>
            <button
              onClick={() => setActiveTab('request')}
              className={`py-2 rounded-xl transition flex flex-col items-center justify-center gap-0.5 ${
                activeTab === 'request' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <YoutubeIcon className="w-3.5 h-3.5" /> <span>Yêu cầu</span>
            </button>
            <button
              onClick={() => setActiveTab('wheel')}
              className={`py-2 rounded-xl transition flex flex-col items-center justify-center gap-0.5 ${
                activeTab === 'wheel' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gift className="w-3.5 h-3.5" /> <span>Vòng quay</span>
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`py-2 rounded-xl transition flex flex-col items-center justify-center gap-0.5 ${
                activeTab === 'shop' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" /> <span>Cửa hàng</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`py-2 rounded-xl transition flex flex-col items-center justify-center gap-0.5 ${
                activeTab === 'leaderboard' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" /> <span>Đại gia</span>
            </button>
            <button
              onClick={() => setActiveTab('goal')}
              className={`py-2 rounded-xl transition flex flex-col items-center justify-center gap-0.5 ${
                activeTab === 'goal' ? 'bg-green-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" /> <span>Mục tiêu</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DONATE & VOICE MESSAGE */}
        {activeTab === 'donate' && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Chọn số tiền ủng hộ (VNĐ)</span>
                <span className="text-pink-400 font-mono text-[11px] font-semibold">Tự động tạo VietQR</span>
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition ${
                      amount === amt && !customAmount
                        ? 'bg-pink-600 border-pink-500 text-white shadow-md shadow-pink-500/25'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {amt.toLocaleString()}đ
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Hoặc nhập số tiền tùy ý..."
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full mt-2 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Tên của bạn</label>
              <input
                type="text"
                placeholder="VD: Người hâm mộ ẩn danh"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full mt-1.5 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 flex justify-between">
                <span>Lời nhắn gửi Streamer</span>
                <span className="text-[11px] text-slate-500 font-normal">{message.length}/200</span>
              </label>
              <textarea
                rows={2}
                maxLength={200}
                placeholder="Nhập lời nhắn của bạn (AI sẽ đọc to trên livestream)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full mt-1.5 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            <button
              type="button"
              onClick={() => handleStartPayment('donate')}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-pink-500/25 transition flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" /> TIẾP TỤC ỦNG HỘ {selectedAmount.toLocaleString()} VNĐ
            </button>
          </div>
        )}

        {/* TAB 2: REQUEST (YOUTUBE & AI QUIZ) */}
        {activeTab === 'request' && (
          <div className="mt-6 space-y-4">
            <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setRequestType('music')}
                className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  requestType === 'music' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <YoutubeIcon className="w-3.5 h-3.5" /> Phát Nhạc YouTube (30k)
              </button>
              <button
                type="button"
                onClick={() => setRequestType('quiz')}
                className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  requestType === 'quiz' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> Đố Vui AI Quiz (20k)
              </button>
            </div>

            {requestType === 'music' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Dán đường link YouTube bạn muốn phát</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full mt-1.5 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleStartPayment('music')}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Music className="w-4 h-4" /> GỬI YÊU CẦU PHÁT NHẠC (30.000 VNĐ)
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Chọn chủ đề câu hỏi thử thách Streamer</label>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    {['Địa lý', 'Game', 'Lịch sử'].map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => {
                          setSelectedTopic(topic);
                          const q = SAMPLE_QUIZZES.find((item) => item.topic === topic) || SAMPLE_QUIZZES[0];
                          setSelectedQuiz(q);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                          selectedTopic === topic
                            ? 'bg-purple-600 border-purple-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartPayment('quiz')}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> GỬI CÂU ĐỐ THỬ THÁCH (20.000 VNĐ)
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LUCKY WHEEL */}
        {activeTab === 'wheel' && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl text-center">
              <h3 className="font-extrabold text-sm text-purple-300">🎡 Vòng Quay May Mắn Thử Thách</h3>
              <p className="text-xs text-slate-400 mt-1">
                Khi bạn ủng hộ, vòng quay trên màn hình stream sẽ tự động quay để trao hình phạt ngẫu nhiên cho Streamer!
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleStartPayment('wheel')}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" /> QUAY VÒNG QUAY NGAY ({wheelAmount.toLocaleString()} VNĐ)
            </button>
          </div>
        )}

        {/* TAB 4: DIGITAL STORE */}
        {activeTab === 'shop' && (
          <div className="mt-6 space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {SAMPLE_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl flex items-center gap-3 hover:border-cyan-500 transition"
                >
                  <img src={prod.coverUrl} alt={prod.title} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{prod.title}</h4>
                    <span className="text-xs font-mono font-black text-cyan-400 block mt-1">
                      {prod.price.toLocaleString()}đ
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(prod);
                      handleStartPayment('product');
                    }}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition shrink-0 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Mua ngay
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: LEADERBOARD (BẢNG VINH DANH ĐẠI GIA) */}
        {activeTab === 'leaderboard' && (
          <div className="mt-6 space-y-3">
            <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-center">
              <h3 className="font-extrabold text-sm text-amber-300 flex items-center justify-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" /> Bảng Vinh Danh Đại Gia Hàng Đầu
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Top những người hâm mộ ủng hộ nhiệt tình nhất</p>
            </div>

            <div className="space-y-2">
              {TOP_DONORS_LEADERBOARD.map((donor) => (
                <div
                  key={donor.rank}
                  className={`p-3 rounded-2xl flex items-center justify-between border text-xs transition ${
                    donor.rank === 1
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                      : donor.rank === 2
                      ? 'bg-slate-700/30 border-slate-500/30'
                      : donor.rank === 3
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : 'bg-slate-800/50 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs font-mono ${
                        donor.rank === 1
                          ? 'bg-amber-500 text-slate-950'
                          : donor.rank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : donor.rank === 3
                          ? 'bg-orange-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {donor.rank}
                    </span>
                    <img src={donor.avatarUrl} className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700" />
                    <div>
                      <span className="font-bold text-white block">{donor.donorName}</span>
                      <span className="text-[10px] text-slate-400">{donor.donationCount} lần ủng hộ</span>
                    </div>
                  </div>

                  <span className="font-mono font-black text-sm text-green-400">
                    {donor.totalAmount.toLocaleString()}đ
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: GOAL */}
        {activeTab === 'goal' && (
          <div className="mt-6 p-4 bg-slate-800/60 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
              <Target className="w-4 h-4" /> {creator.goalTitle}
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Đã đạt: {creator.goalCurrent.toLocaleString()}đ</span>
                <span className="text-cyan-400 font-bold font-mono">
                  {Math.round((creator.goalCurrent / creator.goalTarget) * 100)}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full"
                  style={{ width: `${Math.min((creator.goalCurrent / creator.goalTarget) * 100, 100)}%` }}
                />
              </div>
              <div className="text-right text-[11px] text-slate-500 mt-1">
                Mục tiêu: {creator.goalTarget.toLocaleString()}đ
              </div>
            </div>
          </div>
        )}
      </div>

      {/* VIETQR PAYMENT MODAL */}
      {isPaying && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsPaying(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs bg-slate-800 p-1.5 rounded-full"
            >
              ✕
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-500/10 text-pink-400 rounded-full text-xs font-semibold mb-3">
              <QrCode className="w-3.5 h-3.5" /> Quét mã VietQR bằng App Ngân hàng
            </div>

            <h3 className="text-base font-bold text-white">
              {currentDonationType === 'product' && selectedProduct
                ? selectedProduct.title
                : `Ủng hộ ${creator.fullName}`}
            </h3>
            <p className="text-xl font-extrabold text-green-400 font-mono mt-1">
              {selectedAmount.toLocaleString()} VNĐ
            </p>

            <div className="bg-white p-2.5 rounded-2xl my-4 inline-block shadow-lg">
              <img src={qrImageUrl} alt="VietQR" className="w-56 h-auto mx-auto rounded-lg" />
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl text-left text-xs space-y-1.5 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Ngân hàng:</span>
                <span className="font-bold text-white">{creator.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Số tài khoản:</span>
                <span className="font-bold text-white font-mono">{creator.bankAccount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Chủ tài khoản:</span>
                <span className="font-bold text-white">{creator.bankAccountName}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-700">
                <span className="text-slate-400">Nội dung CK:</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(paymentCode);
                    setIsCopiedCode(true);
                    setTimeout(() => setIsCopiedCode(false), 2000);
                  }}
                  className="font-bold text-pink-400 font-mono flex items-center gap-1 hover:underline"
                >
                  {paymentCode} {isCopiedCode ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {!isPaidSuccess ? (
              <button
                type="button"
                onClick={handleSimulatePaymentSuccess}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 animate-pulse"
              >
                <Zap className="w-4 h-4" /> [TEST] Tôi đã chuyển tiền (Kích hoạt OBS Overlay)
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-green-950/80 border border-green-500/50 rounded-xl text-green-400 text-xs font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Đã nhận thanh toán! Hiệu ứng đang nổ trên OBS Stream!
                </div>
                {currentDonationType === 'product' && selectedProduct && (
                  <a
                    href={selectedProduct.downloadUrl}
                    target="_blank"
                    className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl block transition flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Tải Xuống Tệp Số Ngay
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
