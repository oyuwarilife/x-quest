import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "X Quest - X運用マスターへの冒険",
  description:
    "X運用スキルをRPG感覚で習得。6つのステージをクリアして案件獲得レベルまでランクアップしよう。",
  openGraph: {
    title: "X Quest - X運用マスターへの冒険",
    description:
      "X運用スキルをRPG感覚で習得。クエストをクリアしてランクアップしよう。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
