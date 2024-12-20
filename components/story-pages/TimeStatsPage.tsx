import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeStatsPageProps {
  stats: {
    timeOfDay: {
      morning: number;
      afternoon: number;
      evening: number;
      night: number;
    };
  };
}

export default function TimeStatsPage({ stats }: TimeStatsPageProps) {
  const [showSecond, setShowSecond] = useState(false);
  
  // Calculate preferred time of day
  const timePreference = Object.entries(stats.timeOfDay).reduce((a, b) => 
    a[1] > b[1] ? a : b
  )[0];

 // thank you cursor for these LOL
  const timeDescriptions = {
    morning: {
      title: "Early Bird 🌅",
      description: "You're up with the sun, ready to tackle the day's challenges with AI by your side."
    },
    afternoon: {
      title: "Afternoon Thinker 🌤",
      description: "Mid-day is your sweet spot for creative problem-solving and AI collaboration."
    },
    evening: {
      title: "Evening Explorer 🌆",
      description: "As the day winds down, your curiosity peaks and ideas flow freely."
    },
    night: {
      title: "Night Owl 🌙",
      description: "In the quiet hours, you find your rhythm with AI assistance."
    }
  };

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

        <div className="text-center relative z-10 h-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-2"
          >
            <p className="text-xl text-gray-400">Your ChatGPT Style</p>
            <p className="text-5xl font-bold text-white">
              {timeDescriptions[timePreference as keyof typeof timeDescriptions].title}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showSecond ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 absolute top-32 left-0 right-0 pt-8"
          >
            <p className="text-xl text-gray-300 max-w-sm mx-auto">
              {timeDescriptions[timePreference as keyof typeof timeDescriptions].description}
            </p>
            <div className="flex justify-center items-end space-x-4 mt-6">
              {Object.entries(stats.timeOfDay).map(([time, count]) => (
                <div key={time} className="text-center">
                  <div className="h-32 w-3 bg-white/10 rounded-full relative">
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 bg-green-400 rounded-full"
                      initial={{ height: 0 }}
                      animate={{ height: showSecond ? `${(count / Math.max(...Object.values(stats.timeOfDay))) * 100}%` : 0 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 capitalize">{time}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="w-full h-1/3 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  );
} 