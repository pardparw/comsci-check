import type { Metadata } from "next";
import { Geist, Geist_Mono, Kanit } from "next/font/google";
import "./globals.css";
import { CookiesProvider } from 'next-client-cookies/server';
import { Analytics } from "@vercel/analytics/react"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kanit = Kanit({ subsets: ['latin'], weight: '400' });


export const metadata: Metadata = {
  title: "COMSCI CHECK",
  description: "ระบบยืม / คืนสิ่งของ วิทย์-คอมสตรีอ่างทอง",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kanit.className} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
