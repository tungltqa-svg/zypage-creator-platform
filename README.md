# 🚀 ZyPage - Creator Bio & Donation Platform (Clone Zypage.com)

Nền tảng trang Bio cá nhân & nhận ủng hộ qua mã **VietQR tự động**, tích hợp hiệu ứng **Realtime OBS Studio Overlay** cho Streamer & Creator Việt Nam.

---

## 🌟 Điểm nổi bật & Chi phí 0đ

- **Chi phí vận hành**: **0 VNĐ / tháng** (Next.js trên Vercel + Database/Realtime Supabase + VietQR/PayOS).
- **Thanh toán 0đ chiết khấu**: Tiền từ khán giả chuyển thẳng vào tài khoản ngân hàng của bạn.
- **OBS Studio Overlay**: Hiệu ứng nổ chuông ting-ting, pháo hoa Confetti, thanh tiến độ Goal Bar nhảy số ngay lập tức.
- **Dễ bảo trì (Maintain)**: Toàn bộ Frontend, API Webhook và Widget gói gọn trong 1 repository Next.js App Router duy nhất.

---

## 🛠️ Cấu trúc Dự án

```text
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing Page với Sân khấu Live Simulator
│   │   ├── [username]/page.tsx         # Trang Bio & Form Donate của Creator (VD: /mixigaming)
│   │   ├── dashboard/page.tsx          # Creator Dashboard (quản lý, lấy link OBS, test alert)
│   │   ├── overlay/[token]/
│   │   │   ├── alert/page.tsx          # Widget Popup OBS (nền trong suốt)
│   │   │   └── goal/page.tsx           # Widget Thanh mục tiêu Livestream OBS
│   │   └── api/
│   │       ├── donate/create/route.ts  # API tạo đơn donate & sinh VietQR
│   │       ├── donate/test-alert/route.ts # API kích hoạt test thông báo
│   │       └── webhook/payos/route.ts  # Webhook bắt tiền ngân hàng -> Realtime sang OBS
│   ├── lib/
│   │   ├── vietqr.ts                   # Utility sinh mã VietQR NAPAS 247
│   │   ├── supabase.ts                 # Kết nối Supabase Realtime
│   │   └── mock-data.ts                # Dữ liệu mẫu demo
│   └── types/index.ts                  # TypeScript Interfaces
├── supabase_schema.sql                 # Script SQL khởi tạo Database trên Supabase
└── .env.example                        # Mẫu cấu hình biến môi trường
```

---

## 🚀 Hướng dẫn Cài đặt & Chạy Local

### 1. Cài đặt thư viện
```bash
npm install
```

### 2. Chạy môi trường phát triển
```bash
npm run dev
```
Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

---

## 📺 Cách nhúng vào OBS Studio

1. Mở **OBS Studio** -> Chọn cảnh Livestream của bạn.
2. Bấm dấu **`+`** ở ô Sources -> Chọn **Browser**.
3. Đặt URL là liên kết lấy từ Dashboard:
   - **Alert Box**: `https://your-domain.com/overlay/demo-token-123/alert` (Kích thước: 800 x 600)
   - **Goal Bar**: `https://your-domain.com/overlay/demo-token-123/goal` (Kích thước: 500 x 120)
4. Vào Dashboard bấm nút **"BẮN TEST ALERT LÊN OBS"** để xem kết quả!

---

## 🌐 Hướng dẫn Triển khai Lên Vercel (Public ra Internet)

1. Đẩy mã nguồn lên **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. Truy cập [vercel.com](https://vercel.com) -> Đăng nhập bằng GitHub.
3. Chọn **Add New Project** -> Chọn repository vừa tạo.
4. (Tùy chọn) Thêm các biến môi trường từ `.env.example` vào phần **Environment Variables**.
5. Bấm **Deploy**. Sau 1 phút, bạn sẽ nhận được link public miễn phí dạng `https://ten-du-an.vercel.app`.
