import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "X Quest - X運用マスターへの道",
  description:
    "X（Twitter）運用スキルをゲーム感覚で習得。ロードマップに沿ってタスクをクリアし、レベルアップしよう。",
  openGraph: {
    title: "X Quest - X運用マスターへの道",
    description:
      "X運用スキルをゲーム感覚で習得。ロードマップに沿ってレベルアップしよう。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>{children}</body>
    </html>
  );
}
