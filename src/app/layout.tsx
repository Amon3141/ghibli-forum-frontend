import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layouts/Header/Header";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "ジブリ掲示板",
  description: "ジブリ掲示板",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&family=Yomogi&family=Sawarabi+Mincho&family=M+PLUS+Rounded+1c&display=swap" rel="stylesheet" />
      </head>
      <AuthProvider>
        <body
          className="h-full flex flex-col relative"
          suppressHydrationWarning={true}
        >
          <Header />
          <main className="
            flex-1
            flex flex-col items-center
            w-full p-2 sm:p-4
            overflow-y-scroll no-scrollbar
            relative
          ">
            {children}
          </main>
        </body>
      </AuthProvider>
    </html>
  );
}
