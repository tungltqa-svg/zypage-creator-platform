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
}

export interface WheelItem {
  id: string;
  title: string;
  chance: number; // percentage, e.g. 20
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
  options: [string, string, string, string]; // [A, B, C, D]
  correctIndex: number; // 0, 1, 2, 3
  topic: string;
  level: 'easy' | 'medium' | 'hard';
}

export interface Donation {
  id: string;
  creatorId: string;
  donorName: string;
  amount: number;
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
