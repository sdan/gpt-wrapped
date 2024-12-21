import Image from 'next/image';
import { motion } from 'framer-motion';

interface AiFascinationPageProps {
  fascination: {
    favorite_message: string;
    fun_fact: string;
    topic: string;
    total_messages: number;
  };
}

export default function AiFascinationPage({ fascination }: AiFascinationPageProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-1/4 relative">
        <Image
          src="/faded/red-top.png"
          alt="Top decorative pattern"
          fill
          unoptimized
          crossOrigin="anonymous"
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
            <p className="text-xl text-gray-400 mb-3">Your Primary Fascination</p>
            <p className="text-4xl font-bold text-red-400 leading-tight text-balance">
              {fascination.topic}
            </p>
            <p className="text-2xl text-gray-300 mt-2">
              {fascination.total_messages} messages
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="text-xl text-gray-400 mb-3">Favorite Message</p>
            <p className="text-3xl text-red-400 leading-snug">
              &ldquo;{fascination.favorite_message}&rdquo;
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <p className="text-xl text-gray-400 mb-3">What we noticed</p>
            <p className="text-3xl text-red-400 leading-snug text-balance">
              {fascination.fun_fact}
            </p>
          </motion.div>
        </div>
      </div>
      <div className="w-full h-1/4 relative">
        <Image
          src="/faded/red-bottom.png"
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