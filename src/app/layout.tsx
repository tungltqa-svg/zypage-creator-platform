import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZyPage - Nền tảng Bio & Donate miễn phí cho Streamer & Creator',
  description: 'Trang bio cá nhân, nhận ủng hộ qua VietQR không mất phí trung gian, tích hợp OBS Studio Overlay Realtime cực mượt.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
