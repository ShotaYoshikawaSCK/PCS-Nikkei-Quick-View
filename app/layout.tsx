import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TNPクイックビュー",
  description: "経済ニュース要約と今日の注目銘柄をチェック",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body className="antialiased min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </body>
    </html>
  );
}
