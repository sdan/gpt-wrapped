import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TotalStatsPageProps {
  stats: {
    totalConversations: number;
    totalMessages: number;
  };
}

export default function TotalStatsPage({ stats }: TotalStatsPageProps) {
  const [showSecond, setShowSecond] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSecond(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-1/3 relative">
        <Image
          src="/welcome/top.svg"
          alt="Top decorative pattern"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-48">
          <Image
            src="/welcome/left.png"
            alt="Left decorative pattern"
            fill
            className="object-contain opacity-50"
          />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-48">
          <Image
            src="/welcome/right.png"
            alt="Right decorative pattern"
            fill
            className="object-contain opacity-50"
          />
        </div>

        <div className="text-center relative z-10 h-[280px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-2"
          >
            <p className="text-xl text-gray-400">In 2024, you started</p>
            <p className="text-6xl font-bold text-white">
              {stats.totalConversations}
            </p>
            <p className="text-2xl text-gray-300">conversations with ChatGPT</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showSecond ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-2 absolute top-full left-0 right-0 pt-8"
          >
            <p className="text-xl text-gray-400">Which turned into</p>
            <p className="text-6xl font-bold text-green-400">
              {stats.totalMessages}
            </p>
            <p className="text-2xl text-gray-300">messages exchanged</p>
          </motion.div>
        </div>
      </div>
      <div className="w-full h-1/3 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  );
} 