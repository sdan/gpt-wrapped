import Image from 'next/image';
import { motion } from 'framer-motion';

interface AiHumorPageProps {
  humor: {
    exchange: string;
  };
}

export default function AiHumorPage({ humor }: AiHumorPageProps) {
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
            <p className="text-xl text-gray-400 mb-3">What ChatGPT REALLY noticed</p>
            <p className="text-4xl font-bold text-red-400 leading-snug text-balance">
              &ldquo;{humor.exchange}&rdquo;
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