import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const viewport: Viewport = {
  themeColor: "#6C5CE7",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://x-quest.vercel.app"),
  manifest: "/manifest.json",
  title: "X Quest - X運用マスターへの冒険",
  description:
    "X運用スキルをRPG感覚で習得。6つのステージをクリアして案件獲得レベルまでランクアップしよう。",
  openGraph: {
    title: "X Quest - X運用マスターへの冒険",
    description:
      "X運用スキルをRPG感覚で習得。クエストをクリアしてランクアップしよう。",
  },
  twitter: {
    card: "summary_large_image",
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
      <head>
        <link rel="apple-touch-icon" href="/icon" />
      </head>
      <body className={notoSansJP.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
