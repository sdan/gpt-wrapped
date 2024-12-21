import Image from 'next/image';
import { motion } from 'framer-motion';

interface AiEurekaPageProps {
  eureka: {
    top_3_moments: string[];
  };
}

export default function AiEurekaPage({ eureka }: AiEurekaPageProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-1/4 relative">
        <Image
          src="/rigid/green-top.png"
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
            <p className="text-xl text-gray-400 mb-3">What has been interesting to you</p>
            <div className="space-y-4">
              {eureka.top_3_moments.map((moment, index) => (
                <motion.p
                  key={moment}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 * index }}
                  className="text-3xl font-bold text-green-400 text-balance"
                >
                  {moment}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="w-full h-1/4 relative">
        <Image
          src="/rigid/green-bottom.png"
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