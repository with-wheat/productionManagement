import type { Metadata, Viewport } from 'next';
import { Noto_Sans_SC } from 'next/font/google';
import './globals.css';

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: '刷题系统 - 安全生产管理人员',
  description: '机械类专职安全生产管理人员(C1) 刷题练习',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: '刷题系统' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#0d9488',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${notoSansSC.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans">
        {children}
      </body>
    </html>
  );
}
