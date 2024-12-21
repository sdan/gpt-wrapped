import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import React from 'react';

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

  const timeDescriptions = {
    morning: {
      title: "Early Bird 🌅",
      description: "Up early, are we?"
    },
    afternoon: {
      title: "Afternoon Thinker 🌤",
      description: "insert wity comment"
    },
    evening: {
      title: "Evening Explorer 🌆",
      description: "insert wity comment"
    },
    night: {
      title: "Night Owl 🌙",
      description: "insert wity comment"
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSecond(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const maxCount = Math.max(...Object.values(stats.timeOfDay));
  const timeSlots = [
    { label: "Night", time: "Night", count: stats.timeOfDay.night },
    { label: "Morning", time: "Morning", count: stats.timeOfDay.morning },
    { label: "Afternoon", time: "Afternoon", count: stats.timeOfDay.afternoon },
    { label: "Evening", time: "Evening", count: stats.timeOfDay.evening },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-1/4 relative">
        <Image
          src="/vertical/red-top.png"
          alt="Top decorative pattern"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
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
            className="space-y-4 absolute w-full pt-6"
          >
            <p className="text-xl text-gray-300 max-w-sm mx-auto">
              {timeDescriptions[timePreference as keyof typeof timeDescriptions].description}
            </p>
            <div className="mt-8 space-y-3">
              {timeSlots.map((slot, index) => (
                <motion.div 
                  key={slot.label}
                  className="flex items-center justify-between gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: showSecond ? 1 : 0, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div className="flex-1 text-right">
                    <p className="text-sm text-gray-400">{slot.time}</p>
                  </div>
                  <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-red-500/80 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: showSecond ? `${(slot.count / maxCount) * 100}%` : 0 }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">{slot.count}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="w-full h-1/4 relative">
        <Image
          src="/vertical/red-bottom.png"
          alt="Bottom decorative pattern"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
} 