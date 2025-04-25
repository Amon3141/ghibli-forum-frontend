import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layouts/Header/Header";

export const metadata: Metadata = {
  title: "風の谷の集い",
  description: "ジブリフォーラム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="h-full flex flex-col">
        <Header />
        <main className="
          flex-1
          flex flex-col items-center
          w-full px-8 py-4
          overflow-y-scroll
        ">
          {children}
        </main>
      </body>
    </html>
  );
}
