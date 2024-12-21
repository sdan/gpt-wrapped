import Image from 'next/image';
import { motion } from 'framer-motion';

interface AiAuraPageProps {
  aura: {
    user_personality: string;
  };
}

export default function AiAuraPage({ aura }: AiAuraPageProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-1/5 relative">
        <Image
          src="/rigid/orange-top.png"
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
            <p className="text-xl text-gray-400 mb-3">Your User Aura</p>
            <p className="text-3xl font-bold text-orange-400 leading-snug">
              {aura.user_personality}
            </p>
          </motion.div>
        </div>
      </div>
      <div className="w-full h-1/5 relative">
        <Image
          src="/rigid/orange-bottom.png"
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