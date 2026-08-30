import { Creator, Donation, WheelItem, DigitalProduct, QuizItem } from '@/types';

export const DEFAULT_WHEEL_ITEMS: WheelItem[] = [
  { id: 'w1', title: 'Hát 1 bài theo yêu cầu', chance: 20, color: '#ff2e93' },
  { id: 'w2', title: 'Không chơi game trong 5 phút', chance: 25, color: '#7928ca' },
  { id: 'w3', title: 'AFK đứng im 1 phút', chance: 25, color: '#00dfd8' },
  { id: 'w4', title: 'Chơi game bằng 1 tay', chance: 15, color: '#f59e0b' },
  { id: 'w5', title: 'Uống 1 cốc nước đầy', chance: 15, color: '#10b981' },
];

export const SAMPLE_QUIZZES: QuizItem[] = [
  {
    id: 'q1',
    question: 'Quốc gia nào có nhiều đảo nhất trên thế giới?',
    options: ['Indonesia', 'Philippines', 'Thụy Điển', 'Na Uy'],
    correctIndex: 2, // Thụy Điển (>221.800 đảo)
    topic: 'Địa lý',
    level: 'medium',
  },
  {
    id: 'q2',
    question: 'Tựa game GTA V lần đầu tiên phát hành vào năm nào?',
    options: ['2011', '2013', '2015', '2017'],
    correctIndex: 1, // 2013
    topic: 'Game',
    level: 'easy',
  },
  {
    id: 'q3',
    question: 'Vị vua nào đã ban chiếu dời đô về Thăng Long vào năm 1010?',
    options: ['Lý Thái Tổ', 'Lê Lợi', 'Trần Hưng Đạo', 'Quang Trung'],
    correctIndex: 0, // Lý Thái Tổ
    topic: 'Lịch sử',
    level: 'easy',
  },
];

export const SAMPLE_PRODUCTS: DigitalProduct[] = [
  {
    id: 'p1',
    creatorId: 'c1-mixi',
    title: 'Bộ Preset Lightroom Độc Quyền Tone Hàn Quốc & Cinematic',
    price: 99000,
    description: 'Bao gồm 15 bộ lọc màu chuyên nghiệp cho ảnh chân dung và du lịch, hỗ trợ cả Mobile và Desktop.',
    coverUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&auto=format&fit=crop&q=60',
    downloadUrl: 'https://example.com/downloads/preset-bundle.zip',
    soldCount: 342,
  },
  {
    id: 'p2',
    creatorId: 'c1-mixi',
    title: 'Gói Icon & Sound Effects cho Streamer (50+ Memes Sound)',
    price: 49000,
    description: 'Toàn bộ hiệu ứng âm thanh hot nhất trên stream kèm icon PNG trong suốt chất lượng cao.',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
    downloadUrl: 'https://example.com/downloads/sfx-pack.zip',
    soldCount: 819,
  },
  {
    id: 'p3',
    creatorId: 'c1-mixi',
    title: 'Ebook: Cẩm Nang Xây Dựng Kênh Content Creator từ Con Số 0',
    price: 150000,
    description: 'Bí kíp tối ưu SEO, setup dàn máy livestream, cách thu hút 10.000 followers đầu tiên.',
    coverUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500&auto=format&fit=crop&q=60',
    downloadUrl: 'https://example.com/downloads/ebook-creator.pdf',
    soldCount: 512,
  },
];

export const INITIAL_CREATORS: Record<string, Creator> = {
  mixigaming: {
    id: 'c1-mixi',
    username: 'mixigaming',
    fullName: 'Phùng Thanh Độ',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MixiGaming',
    bio: 'Streamer / Content Creator. Chào mừng bạn đến với Bộ tộc MixiGaming!',
    bankName: 'MB',
    bankAccount: '9999999999',
    bankAccountName: 'PHUNG THANH DO',
    obsToken: 'demo-token-123',
    goalTitle: 'Mua màn hình Stream 4K',
    goalTarget: 15000000,
    goalCurrent: 8450000,
    countdownSeconds: 11692, // 03:14:52
  },
};

export const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'd1',
    creatorId: 'c1-mixi',
    donorName: 'Minh Tú',
    amount: 100000,
    message: 'Chúc anh Độ và gia đình thật nhiều sức khỏe, stream vui vẻ ạ!',
    paymentCode: 'ZY9821',
    status: 'PAID',
    type: 'donate',
    createdAt: '2026-08-30T14:20:00Z',
  },
  {
    id: 'd2',
    creatorId: 'c1-mixi',
    donorName: 'Hoàng Long',
    amount: 50000,
    message: 'Quay thử thách trúng hát 1 bài anh nhé!',
    paymentCode: 'ZY3341',
    status: 'PAID',
    type: 'wheel',
    extraData: { wheelResult: 'Hát 1 bài theo yêu cầu' },
    createdAt: '2026-08-30T15:10:00Z',
  },
  {
    id: 'd3',
    creatorId: 'c1-mixi',
    donorName: 'Bộ Tộc Fan',
    amount: 30000,
    message: 'Thách đố kiến thức Địa lý!',
    paymentCode: 'ZY7729',
    status: 'PAID',
    type: 'quiz',
    extraData: { quizData: SAMPLE_QUIZZES[0] },
    createdAt: '2026-08-30T16:05:00Z',
  },
];
