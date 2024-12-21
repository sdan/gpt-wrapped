import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import "./globals.css";

const fira = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira",
});

export const metadata: Metadata = {
  title: "ChatGPT Wrapped",
  description: "Visualize your AI journey in 2024",
  metadataBase: new URL('https://gpt-wrapped.rajan.sh'),
  openGraph: {
    title: "ChatGPT Wrapped",
    description: "Visualize your AI journey in 2024",
    url: 'https://gpt-wrapped.rajan.sh',
    siteName: 'ChatGPT Wrapped',
    images: [
      {
        url: "https://gpt-wrapped.rajan.sh/og.png",
        width: 1200,
        height: 630,
        alt: "ChatGPT Wrapped",
      },
    ],
    type: 'website',
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatGPT Wrapped",
    description: "Visualize your AI journey in 2024",
    creator: "@_rajanagarwal",
    images: ["https://gpt-wrapped.rajan.sh/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fira.variable} font-sans`}>{children}</body>
    </html>
  );
}
