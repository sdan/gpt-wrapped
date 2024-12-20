import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TotalStatsPageProps {
  stats: {
    totalConversations: number;
    totalMessages: number;
    titles: string[];
  };
}

export default function TotalStatsPage({ stats }: TotalStatsPageProps) {
  const [showSecond, setShowSecond] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSecond(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Get titles from stats and ensure we have at least 40 items for the animation
  const allTitles = stats.titles.slice(0, 40);

  // Create 4 evenly sized groups of titles
  const rows = Array.from({ length: 4 }, (_, i) => {
    const chunkSize = Math.ceil(allTitles.length / 4);
    return allTitles.slice(i * chunkSize, (i + 1) * chunkSize);
  });

  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-1/4 relative">
        <Image
          src="/rigid/red-top.png"
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
            className="space-y-2 absolute w-full pt-6"
          >
            <p className="text-xl text-gray-400">Which turned into</p>
            <p className="text-6xl font-bold text-green-400">
              {stats.totalMessages}
            </p>
            <p className="text-2xl text-gray-300">messages exchanged</p>
          </motion.div>
        </div>
      </div>
      <div className="w-full h-1/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
        <div className="absolute inset-0 flex flex-col justify-center gap-1 opacity-80">
          {rows.map((rowTitles, i) => (
            <div key={i} className="relative overflow-hidden py-1">
              <motion.div
                initial={{ x: i % 2 === 0 ? "0%" : "-100%" }}
                animate={{
                  x: i % 2 === 0 ? "-100%" : "0%",
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                }}
                className="whitespace-nowrap text-base"
              >
                <div className="inline-flex gap-3">
                  {rowTitles.map((title, j) => (
                    <span
                      key={j}
                      className="inline-block px-3 py-1 rounded-lg bg-zinc-800/80 text-zinc-200"
                    >
                      {title}
                    </span>
                  ))}
                  {/* Duplicate for seamless loop */}
                  {rowTitles.map((title, j) => (
                    <span
                      key={`dup-${j}`}
                      className="inline-block px-3 py-1 rounded-lg bg-zinc-800/80 text-zinc-200"
                    >
                      {title}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
