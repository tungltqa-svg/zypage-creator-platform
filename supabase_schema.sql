-- =========================================================
-- SUPABASE DATABASE SCHEMA FOR CREATOR BIO & DONATION (ZYPAGE)
-- Copy toàn bộ nội dung này dán vào SQL Editor trên Supabase
-- =========================================================

-- 1. Bảng Creators (Nhà sáng tạo / Streamer)
CREATE TABLE IF NOT EXISTS public.creators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT DEFAULT '',
    bio TEXT DEFAULT 'Chào mừng bạn đến với kênh của mình!',
    bank_name TEXT DEFAULT 'MBBANK',
    bank_account TEXT DEFAULT '0987654321',
    bank_account_name TEXT DEFAULT 'NGUYEN VAN A',
    obs_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
    goal_title TEXT DEFAULT 'Nâng cấp dàn PC Livestream',
    goal_target NUMERIC DEFAULT 10000000,
    goal_current NUMERIC DEFAULT 2500000,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Bảng Donations (Lịch sử ủng hộ / Donate)
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES public.creators(id) ON DELETE CASCADE,
    donor_name TEXT NOT NULL DEFAULT 'Người hâm mộ giấu tên',
    amount NUMERIC NOT NULL,
    message TEXT DEFAULT '',
    payment_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'EXPIRED')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Bật Row Level Security (RLS)
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- 4. Chính sách đọc công khai (Public Read)
CREATE POLICY "Public read creators" ON public.creators FOR SELECT USING (true);
CREATE POLICY "Public read paid donations" ON public.donations FOR SELECT USING (status = 'PAID');
CREATE POLICY "Public insert donations" ON public.donations FOR INSERT WITH CHECK (true);

-- 5. Bật tính năng Realtime cho bảng donations & creators
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.creators;

-- Dữ liệu mẫu ban đầu
INSERT INTO public.creators (username, full_name, avatar_url, bio, bank_name, bank_account, bank_account_name, obs_token, goal_title, goal_target, goal_current)
VALUES 
('mixigaming', 'Phùng Thanh Độ', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mixi', 'Tộc trưởng Bộ tộc MixiGaming. Cảm ơn sự ủng hộ của tất cả anh em!', 'MBBANK', '9999999999', 'PHUNG THANH DO', 'demo-token-123', 'Nâng cấp màn hình stream 4K', 15000000, 8450000)
ON CONFLICT (username) DO NOTHING;
