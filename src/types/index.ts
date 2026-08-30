export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  role: 'creator' | 'admin';
  plan: 'free' | 'pro' | 'enterprise';
}

export interface Creator {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  obsToken: string;
  goalTitle: string;
  goalTarget: number;
  goalCurrent: number;
  countdownSeconds: number;
  plan: 'free' | 'pro' | 'enterprise';
  walletBalance: number;
  totalEarnings: number;
  customDomain?: string;
  themeColor?: string;
}

export interface PayoutRequest {
  id: string;
  creatorId: string;
  amount: number;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  description: string;
  feePercent: number; // 0% for Pro, 5% for Free
  features: string[];
  popular?: boolean;
}

export interface WheelItem {
  id: string;
  title: string;
  chance: number;
  color: string;
}

export interface DigitalProduct {
  id: string;
  creatorId: string;
  title: string;
  price: number;
  description: string;
  coverUrl: string;
  downloadUrl: string;
  soldCount: number;
}

export interface QuizItem {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  topic: string;
  level: 'easy' | 'medium' | 'hard';
}

export interface Donation {
  id: string;
  creatorId: string;
  donorName: string;
  amount: number;
  netAmount: number; // Số tiền creator thực nhận sau khi trừ phí nền tảng
  platformFee: number; // Phí nền tảng thu được (Doanh thu của Admin)
  message: string;
  paymentCode: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED';
  type: 'donate' | 'voice' | 'wheel' | 'music' | 'quiz' | 'product';
  extraData?: {
    voiceAudioUrl?: string;
    youtubeUrl?: string;
    youtubeTitle?: string;
    wheelResult?: string;
    quizData?: QuizItem;
    productId?: string;
  };
  createdAt: string;
}

export interface AlertPayload {
  id: string;
  type: 'donate' | 'voice' | 'wheel' | 'music' | 'quiz';
  donorName: string;
  amount: number;
  message: string;
  avatarUrl?: string;
  voiceAudioUrl?: string;
  youtubeUrl?: string;
  youtubeTitle?: string;
  wheelResult?: string;
  quizData?: QuizItem;
  timestamp: number;
}

export interface VietQRParams {
  bankId: string;
  accountNo: string;
  accountName: string;
  amount: number;
  description: string;
}
