import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import React from "react";

interface TimeStatsPageProps {
  stats: {
    timeOfDay: {
      morning: number;
      afternoon: number;
      evening: number;
      night: number;
    };
    totalCharacters?: number;
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
      title: "Morning",
      description: "You prefer to start early",
    },
    afternoon: {
      title: "Afternoon",
      description: "Peak productivity hours",
    },
    evening: {
      title: "Evening",
      description: "Winding down with AI",
    },
    night: {
      title: "Night Owl",
      description: "When inspiration strikes",
    },
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

  // Calculate pages and books (1625 characters per page, ~200 pages per book)
  const calculatePages = () => {
    if (!stats.totalCharacters) return 0;
    return Math.ceil(stats.totalCharacters / 1625);
  };

  const pages = calculatePages();
  const books = Math.ceil(pages / 200);

  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-1/5 relative">
        <Image
          src="/vertical/red-top.png"
          alt="Top decorative pattern"
          fill
          unoptimized
          crossOrigin="anonymous"
          className="object-cover"
          priority
        />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 relative">
        <div className="text-center relative z-10 max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <p className="text-xl text-gray-400 mb-3 text-balance">Most Active During</p>
            <p className="text-6xl font-bold text-white text-balance leading-none [.rendering_&]:translate-y-[-25%]">
              {timeDescriptions[timePreference as keyof typeof timeDescriptions].title}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showSecond ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {timeSlots.map((slot, index) => (
                <motion.div
                  key={slot.label}
                  className="flex items-center justify-between gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: showSecond ? 1 : 0, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div className="w-20 text-right">
                    <p className="text-sm text-gray-400">{slot.time}</p>
                  </div>
                  <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-red-500/80 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: showSecond ? `${(slot.count / maxCount) * 100}%` : 0,
                      }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                  <div className="w-20">
                    <p className="text-sm text-gray-400">{slot.count}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showSecond ? 1 : 0, y: showSecond ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="pt-8 border-t border-white/10"
            >
              <p className="text-xl text-gray-400 mb-4 text-balance">You wrote the equivalent of</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <p className="text-6xl font-bold text-white text-balance leading-none [.rendering_&]:translate-y-[-25%]">
                  {pages}
                </p>
                <p className="text-4xl">📄</p>
              </div>
              <p className="text-lg text-gray-300 text-balance">pages of text</p>
              {books > 0 && (
                <p className="text-md text-gray-400 mt-3 text-balance">
                  That&apos;s about {books} {books === 1 ? 'book' : 'books'}! 📚
                </p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
      <div className="w-full h-1/5 relative">
        <Image
          src="/vertical/red-bottom.png"
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
