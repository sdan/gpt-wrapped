import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import "./globals.css";

const fira = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fira",
});

export const metadata: Metadata = {
  title: "Day 13: ChatGPT Wrapped",
  description: "Visualize your AI journey in 2024",
  openGraph: {
    title: "Day 13: ChatGPT Wrapped",
    description: "Visualize your AI journey in 2024",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ChatGPT Wrapped",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Day 13: ChatGPT Wrapped",
    description: "Visualize your AI journey in 2024",
    images: ["/og.png"],
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
