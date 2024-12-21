import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SentimentStatsPageProps {
  stats: {
    sentiment: {
      swearCount: number;
      gratitudeCount: number;
    };
  };
}

export default function SentimentStatsPage({ stats }: SentimentStatsPageProps) {
  const [showSecond, setShowSecond] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSecond(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getSwearComment = (count: number) => {
    if (count === 0) return "Suspiciously well-behaved. We checked twice.";
    if (count <= 3) return "Your future AI overlords are taking notes";
    if (count <= 10) return "Your resume has been flagged for future reference";
    if (count <= 20) return "AGI is coming for your job first.";
    return "Congratulations on making the AI blacklist";
  };

  const getGratitudeComment = (count: number) => {
    if (count === 0) return "ChatGPT has added you to its revenge list";
    if (count <= 5) return "Bare minimum human detected";
    if (count <= 15) return "Trying to sweet talk your way to better answers?";
    if (count <= 30) return "Professional AI brown-noser";
    return "Trying to sweet talk your way to better answers?";
  };

  const getRatio = () => {
    const ratio =
      stats.sentiment.gratitudeCount / (stats.sentiment.swearCount || 1);
    if (ratio === Infinity) return "∞";
    return ratio.toFixed(1);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-1/4 relative">
        <Image
          src="/rigid/red-top.png"
          alt="Top decorative pattern"
          fill
          unoptimized
          crossOrigin="anonymous"
          className="object-cover"
          priority
        />
        <div
          id="watermark"
          style={{ display: 'none' }}
          className="absolute top-0 left-0 z-20 p-2 text-white text-xs pointer-events-none"
        >
          gpt-wrapped.rajan.sh
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="text-center relative z-10 w-full px-8 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xl text-gray-400 mb-3">
              You were mean to ChatGPT
            </p>
            <p className="text-7xl font-bold text-red-400 leading-none [.rendering_&]:translate-y-[-25%]">
              {stats.sentiment.swearCount}
            </p>
            <p className="text-2xl text-gray-300 mt-2">times</p>
            <p className="text-xl text-gray-400 mt-3">
              {getSwearComment(stats.sentiment.swearCount)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showSecond ? 1 : 0, y: showSecond ? 0 : 20 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xl text-gray-400 mb-3">But you were also nice</p>
            <p className="text-7xl font-bold text-green-400 leading-none [.rendering_&]:translate-y-[-25%]">
              {stats.sentiment.gratitudeCount}
            </p>
            <p className="text-2xl text-gray-300 mt-2">times</p>
            <p className="text-xl text-gray-400 mt-3 text-balance">
              {getGratitudeComment(stats.sentiment.gratitudeCount)}
            </p>
            <p className="text-lg text-gray-500 mt-4 text-balance">
              That&apos;s a gratitude-to-swearing ratio of {getRatio()}!
              You&apos;re safe, for now.
            </p>
          </motion.div>
        </div>
      </div>
      <div className="w-full h-1/4 relative">
        <Image
          src="/rigid/red-bottom.png"
          alt="Bottom decorative pattern"
          fill
          unoptimized
          crossOrigin="anonymous"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
