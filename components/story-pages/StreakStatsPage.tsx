import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StreakStatsPageProps {
  stats: {
    streaks: {
      longest: number;
    };
    dailyStats: {
      mostChatsInOneDay: number;
      date: string;
    };
  };
}

export default function StreakStatsPage({ stats }: StreakStatsPageProps) {
  const [showSecond, setShowSecond] = useState(false);
  const dayOfWeek = new Date(stats.dailyStats.date).toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    const timer = setTimeout(() => setShowSecond(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-1/4 absolute top-0 left-0 right-0">
        <Image
          src="/rigid/blue-top.png"
          alt="Top decorative pattern"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        <div className="text-center relative z-10 h-[280px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-2"
          >
            <p className="text-xl text-gray-400">Your longest streak was</p>
            <div className="flex items-center justify-center space-x-3">
              <p className="text-6xl font-bold text-white">
                {stats.streaks.longest}
              </p>
              <p className="text-4xl">🔥</p>
            </div>
            <p className="text-2xl text-gray-300">consecutive days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showSecond ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-2 absolute w-full pt-6"
          >
            <p className="text-xl text-gray-400">And your busiest day was</p>
            <p className="text-5xl font-bold text-green-400">
              {dayOfWeek}
            </p>
            <p className="text-2xl text-gray-300">
              with {stats.dailyStats.mostChatsInOneDay} conversations
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