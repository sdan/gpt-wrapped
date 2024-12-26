import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const fira = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira",
});

const interSemiBold = localFont({
  src: "./Inter-SemiBold.ttf",
  variable: "--font-inter-semibold",
});

export const metadata: Metadata = {
  title: "ChatGPT Wrapped",
  description: "Wrap up your year with a wrapper",
  metadataBase: new URL('https://gpt-wrapped.com'),
  keywords: ["ChatGPT", "Wrapped", "AI", "OpenAI", "Year in Review"],
  authors: [
    { name: "Rajan Agarwal" },
    { name: "Surya Dantuluri" }
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gpt-wrapped.com',
    siteName: 'ChatGPT Wrapped',
    title: 'ChatGPT Wrapped',
    description: 'Wrap up 2024 with a wrapper',
    images: [
      {
        url: 'https://gpt-wrapped.com/og.png',
        width: 1200,
        height: 630,
        alt: 'ChatGPT Wrapped',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChatGPT Wrapped',
    description: 'Wrap up your year with a wrapper',
    creator: '@_rajanagarwal',
    images: ['https://gpt-wrapped.com/og.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fira.variable} ${interSemiBold.variable}`}>
      <head>
        <meta property="og:image" content="https://gpt-wrapped.com/og.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="https://gpt-wrapped.com/og.png" />
      </head>
      <body className="font-sans relative min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800">
        {children}
      </body>
    </html>
  );
}
