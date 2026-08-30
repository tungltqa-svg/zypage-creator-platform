'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  INITIAL_CREATORS,
  INITIAL_DONATIONS,
  DEFAULT_WHEEL_ITEMS,
  SAMPLE_QUIZZES,
  SAMPLE_PRODUCTS,
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
  };

  // State Tabs
  const [activeTab, setActiveTab] = useState<'donate' | 'request' | 'wheel' | 'shop' | 'goal'>('donate');

  // Tab 1: Donate Form State
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoice, setHasVoice] = useState(false);

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
      }, 3000); // mô phỏng ghi âm 3 giây
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
    setIsPaying(true);
    setIsPaidSuccess(false);
  };

  // Kích hoạt thanh toán thành công (Bắn Realtime tới OBS)
  const handleSimulatePaymentSuccess = async () => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    setIsPaidSuccess(true);

    const channel = new BroadcastChannel(`obs_${creator.obsToken}`);
    channel.postMessage({
      type: 'NEW_DONATE',
      payload: {
        id: 'don_' + Date.now(),
        type: currentDonationType,
        donorName: donorName.trim() || 'Người hâm mộ giấu tên',
        amount: selectedAmount,
        message: hasVoice ? '🎤 [Đã gửi kèm Voice Audio]' : message.trim() || 'Ủng hộ bạn hết mình!',
        youtubeTitle: youtubeUrl ? 'Bài hát yêu cầu: ' + youtubeUrl : undefined,
        quizData: currentDonationType === 'quiz' ? selectedQuiz : undefined,
        wheelResult: currentDonationType === 'wheel' ? 'Hát 1 bài theo yêu cầu' : undefined,
        timestamp: Date.now(),
      },
    });
  };

  const qrImageUrl = generateVietQRUrl({
    bankId: creator.bankName,
    accountNo: creator.bankAccount,
    accountName: creator.bankAccountName,
    amount: selectedAmount,
    description: `${paymentCode} ${donorName.replace(/[^a-zA-Z0-9]/g, '')}`.trim(),
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-6 px-4 sm:px-6 flex flex-col items-center">
      {/* Top Navbar */}
      <div className="w-full max-w-xl flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
          <span className="w-5 h-5 rounded-md bg-pink-500 text-white flex items-center justify-center font-black text-[10px]">
            Z
          </span>
          ZyPage Platform
        </Link>
        <Link
          href="/dashboard"
          className="text-xs text-pink-400 hover:text-pink-300 font-medium px-3 py-1 bg-pink-500/10 rounded-full border border-pink-500/20"
        >
          Quản lý kênh
        </Link>
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

          {/* 5 TABS NAVIGATION */}
          <div className="w-full grid grid-cols-5 gap-1 bg-slate-800/80 p-1 rounded-2xl mt-5 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab('donate')}
              className={`py-2 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                activeTab === 'donate' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" /> <span>Ủng hộ</span>
            </button>
            <button
              onClick={() => setActiveTab('request')}
              className={`py-2 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                activeTab === 'request' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <YoutubeIcon className="w-3.5 h-3.5" /> <span>Yêu cầu</span>
            </button>
            <button
              onClick={() => setActiveTab('wheel')}
              className={`py-2 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                activeTab === 'wheel' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gift className="w-3.5 h-3.5" /> <span>Vòng quay</span>
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`py-2 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                activeTab === 'shop' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" /> <span>Cửa hàng</span>
            </button>
            <button
              onClick={() => setActiveTab('goal')}
              className={`py-2 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
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
                <span className="text-pink-400 font-mono text-sm">{selectedAmount.toLocaleString()}đ</span>
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
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      selectedAmount === amt && !customAmount
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400 text-white shadow-md'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {amt.toLocaleString()}đ
                  </button>
                ))}
              </div>

              <input
                type="number"
                placeholder="Hoặc nhập số tiền khác..."
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full mt-2 px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Tên của bạn</label>
              <input
                type="text"
                placeholder="VD: Minh Tú (hoặc để trống để ẩn danh)"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                maxLength={40}
                className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Voice Message Recorder + Text Message */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                <span>Lời nhắn hoặc Ghi âm giọng nói</span>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : hasVoice
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-slate-800 text-pink-400 border border-pink-500/30'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  {isRecording ? 'Đang ghi âm (3s)...' : hasVoice ? 'Đã có Voice Memo' : 'Ghi âm Voice'}
                </button>
              </div>

              <textarea
                rows={3}
                placeholder="Nhập lời nhắn để AI đọc trực tiếp trên livestream..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={255}
                className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            <button
              type="button"
              onClick={() => handleStartPayment(hasVoice ? 'voice' : 'donate')}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:opacity-95 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-pink-500/25 transition active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" /> QUÉT MÃ VIETQR ỦNG HỘ ({selectedAmount.toLocaleString()}đ)
            </button>
          </div>
        )}

        {/* TAB 2: REQUEST (YOUTUBE MUSIC OR AI QUIZ) */}
        {activeTab === 'request' && (
          <div className="mt-6 space-y-4">
            <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setRequestType('music')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  requestType === 'music' ? 'bg-red-600 text-white' : 'text-slate-400'
                }`}
              >
                <YoutubeIcon className="w-4 h-4" /> Yêu cầu Nhạc YouTube
              </button>
              <button
                type="button"
                onClick={() => setRequestType('quiz')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  requestType === 'quiz' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                <HelpCircle className="w-4 h-4" /> Thách đố AI Quiz
              </button>
            </div>

            {requestType === 'music' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Đường dẫn bài hát YouTube</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full mt-1.5 px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="p-3 bg-slate-800/50 rounded-xl text-[11px] text-slate-400 space-y-1 border border-white/5">
                  <p>🛡️ <b>Bộ lọc bản quyền:</b> Bài hát sẽ được phát tối đa 3 phút trên stream.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartPayment('music')}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Music className="w-4 h-4" /> GỬI YÊU CẦU PHÁT NHẠC ({selectedAmount.toLocaleString()}đ)
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Chọn chủ đề thách đố</label>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    {['Địa lý', 'Game', 'Lịch sử'].map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => {
                          setSelectedTopic(topic);
                          const q = SAMPLE_QUIZZES.find((sq) => sq.topic === topic) || SAMPLE_QUIZZES[0];
                          setSelectedQuiz(q);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${
                          selectedTopic === topic
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700 text-xs">
                  <span className="text-slate-400 block text-[10px]">CÂU HỎI MẪU:</span>
                  <p className="font-bold text-white mt-1">{selectedQuiz.question}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartPayment('quiz')}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" /> GỬI CÂU HỎI THÁCH ĐỐ ({selectedAmount.toLocaleString()}đ)
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LUCKY WHEEL */}
        {activeTab === 'wheel' && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl text-center">
              <span className="text-xs font-bold text-purple-300 uppercase block">
                QUAY VÒNG QUAY MAY MẮN TRỰC TIẾP TRÊN STREAM
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Streamer sẽ phải thực hiện thử thách mà vòng quay chỉ vào!
              </p>
            </div>

            <div className="space-y-1.5 bg-slate-800/60 p-3 rounded-2xl border border-white/5">
              <span className="text-xs font-bold text-slate-300 block mb-2">Danh sách thử thách & Tỷ lệ:</span>
              {DEFAULT_WHEEL_ITEMS.map((item) => (
                <div key={item.id} className="flex justify-between text-xs py-1 px-2 rounded-lg bg-slate-900/60">
                  <span className="text-slate-200">🎯 {item.title}</span>
                  <span className="font-mono font-bold text-purple-400">{item.chance}%</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleStartPayment('wheel')}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-purple-500/30 transition flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" /> ỦNG HỘ {wheelAmount.toLocaleString()}đ ĐỂ QUAY VÒNG QUAY
            </button>
          </div>
        )}

        {/* TAB 4: DIGITAL STORE */}
        {activeTab === 'shop' && (
          <div className="mt-6 space-y-4">
            <div className="text-xs text-slate-400">
              Chọn sản phẩm số để thanh toán VietQR và <b>tải file về máy ngay lập tức</b>:
            </div>

            <div className="grid grid-cols-1 gap-3">
              {SAMPLE_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3.5 bg-slate-800/60 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition flex items-center justify-between gap-3"
                >
                  <img
                    src={prod.coverUrl}
                    alt={prod.title}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white leading-snug truncate">
                      {prod.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {prod.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-black text-green-400 font-mono">
                        {prod.price.toLocaleString()}đ
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        · Đã bán {prod.soldCount}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(prod);
                      handleStartPayment('product');
                    }}
                    className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow transition shrink-0 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Mua ngay
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GOAL */}
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
                className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> [TEST] Tôi đã chuyển tiền (Kích hoạt OBS Overlay)
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-green-950/60 border border-green-500/50 rounded-xl text-green-400 text-xs font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Đã gửi tín hiệu Realtime thành công lên OBS!
                </div>

                {currentDonationType === 'product' && selectedProduct && (
                  <a
                    href={selectedProduct.downloadUrl}
                    target="_blank"
                    className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> TẢI FILE VỀ MÁY NGAY
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
