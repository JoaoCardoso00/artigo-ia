import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthInitializer } from "@/components/auth-initializer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Artigo IA",
  description: "Escreva seu trabalho acadêmico em minutos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
