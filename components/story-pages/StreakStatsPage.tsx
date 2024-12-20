import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface StreakStatsPageProps {
  stats: {
    streaks: {
      longest: number;
    };
    dailyStats: {
      mostChatsInOneDay: number;
      date: string;
    };
    longestConversation: {
      messageCount: number;
      title: string;
    };
  };
}

export default function StreakStatsPage({ stats }: StreakStatsPageProps) {
  const [showSecond, setShowSecond] = useState(false);
  const [showThird, setShowThird] = useState(false);
  const dayOfWeek = new Date(stats.dailyStats.date).toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    const timer1 = setTimeout(() => setShowSecond(true), 2000);
    const timer2 = setTimeout(() => setShowThird(true), 4000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-1/4 relative">
        <Image
          src="/rigid/blue-top.png"
          alt="Top decorative pattern"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="text-center relative z-10 w-full px-8 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xl text-gray-400 mb-3">Your longest streak was</p>
            <div className="flex items-center justify-center space-x-3">
              <p className="text-7xl font-bold text-white">
                {stats.streaks.longest}
              </p>
              <p className="text-5xl">🔥</p>
            </div>
            <p className="text-2xl text-gray-300 mt-2">consecutive days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showSecond ? 1 : 0, y: showSecond ? 0 : 20 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xl text-gray-400 mb-3">Your busiest day was</p>
            <p className="text-6xl font-bold text-green-400">
              {dayOfWeek}
            </p>
            <p className="text-2xl text-gray-300 mt-2">
              with {stats.dailyStats.mostChatsInOneDay} conversations
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showThird ? 1 : 0, y: showThird ? 0 : 20 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xl text-gray-400 mb-3">Your longest conversation had</p>
            <p className="text-7xl font-bold text-blue-400">
              {stats.longestConversation.messageCount}
            </p>
            <p className="text-2xl text-gray-300 mt-2">messages exchanged</p>
            <p className="text-lg text-gray-400 mt-1 line-clamp-1">
              &ldquo;{stats.longestConversation.title}&rdquo;
            </p>
          </motion.div>
        </div>
      </div>
      <div className="w-full h-1/4 relative">
        <Image
          src="/rigid/blue-bottom.png"
          alt="Bottom decorative pattern"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
} 