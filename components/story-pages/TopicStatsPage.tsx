import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TopicStatsPageProps {
  stats: {
    topics: {
      topCategory: string;
      distribution: {
        [key: string]: number;
      };
    };
  };
}

export default function TopicStatsPage({ stats }: TopicStatsPageProps) {
  const [showSecond, setShowSecond] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSecond(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getTopicComment = (category: string) => {
    const comments = {
      'Coding': "Still can't solve FizzBuzz without ChatGPT?",
      'Writing': "Your grammar is so bad, even autocorrect gave up",
      'Research': "Wikipedia citations don't count as research", 
      'Business': "Your startup idea is just Uber for disappointment",
      'Education': "Learning how to learn? Maybe start with the basics",
      'Creative': "AI generates better art than you",
      'Lifestyle': "Touch grass occasionally, please",
      'Philosophy': "Deep thoughts from someone who can&apos;t do their own laundry"
    };
    return comments[category as keyof typeof comments] || "Even AI finds your conversations boring"
  };

  const topTopics = Object.entries(stats.topics.distribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-1/5 relative">
        <Image
          src="/rigid/green-top.png"
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
            <p className="text-xl text-gray-400 mb-3">You mostly talked about</p>
            <p className="text-7xl font-bold text-green-400">
              {stats.topics.topCategory}
            </p>
            <p className="text-xl text-gray-400 mt-6">
              {getTopicComment(stats.topics.topCategory)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showSecond ? 1 : 0, y: showSecond ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <p className="text-xl text-gray-400 mb-6">Your top 3 topics were</p>
            {topTopics.map(([topic, percentage], index) => (
              <div key={topic} className="flex items-center justify-center space-x-4">
                <p className="text-lg text-gray-400 w-32 text-right">{topic}</p>
                <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 * index }}
                    className="h-full bg-green-400"
                  />
                </div>
                <p className="text-lg text-gray-400 w-16 text-left">
                  {Math.round(percentage)}%
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="w-full h-1/5 relative">
        <Image
          src="/rigid/green-bottom.png"
          alt="Bottom decorative pattern"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
} 