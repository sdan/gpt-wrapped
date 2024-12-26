import Image from "next/image";
import { motion } from 'framer-motion';
import { staggerChildren, fadeUp } from '../ui/animations';
import { GRADIENTS, CORNERS } from '../ui/constants';

export default function WelcomePage() {
  return (
    <motion.div
      variants={staggerChildren}
      initial="hidden"
      animate="show"
      className={`h-full flex flex-col ${GRADIENTS.primary} ${CORNERS.lg}`}
    >
      <div className="w-full h-1/4 relative">
        <Image
          src="/descending/top.png"
          alt="Top decorative pattern"
          fill
          unoptimized
          crossOrigin="anonymous"
          className="object-cover"
          priority
        />
      </div>
      <motion.div 
        variants={fadeUp}
        className="flex-1 flex items-center justify-center px-4"
      >
        <div className="text-center">
          <motion.h1 
            variants={fadeUp}
            className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 mb-4"
          >
            ChatGPT Wrapped
          </motion.h1>
          <motion.p 
            variants={fadeUp}
            className="text-xl text-gray-300"
          >
            The 13th Day of Christmas
          </motion.p>
        </div>
      </motion.div>
      <div className="w-full h-1/4 relative">
        <Image
          src="/descending/bottom.png"
          alt="Bottom image"
          fill
          unoptimized
          crossOrigin="anonymous"
          className="object-cover"
          priority
        />
      </div>
    </motion.div>
  );
}
