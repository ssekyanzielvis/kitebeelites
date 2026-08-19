import type { Metadata } from "next";
import "./globals.css";
import Notification from "@/components/Notification";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const metadata: Metadata = {
  title: "Kitebe Elites FC - Official Website",
  description: "Official website of Kitebe Elites FC",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/icon.jpg',    sizes: 'any',               type: 'image/jpeg'   },
    ],
    shortcut: '/favicon.ico',
    apple:    '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AnalyticsTracker />
        {children}
        <Notification />
      </body>
    </html>
  );
}
