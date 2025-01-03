import Image from 'next/image';
import { motion } from 'framer-motion';

interface AiPersonaPageProps {
  persona: {
    persona_description: string;
    persona_vibe: string;
  };
}

export default function AiPersonaPage({ persona }: AiPersonaPageProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-1/4 relative">
        <Image
          src="/vertical/blue-top.png"
          alt="Top decorative pattern"
          fill
          unoptimized
          crossOrigin="anonymous"
          className="object-cover"
          priority
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
        <div className="text-center relative z-10 w-full space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xl text-gray-400 mb-3">Your AI Persona</p>
            <p className="text-4xl font-bold text-blue-300 leading-tight text-balance mb-3">
              {persona.persona_description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="text-xl text-gray-400 mb-3">Vibe Check</p>
            <p className="text-4xl text-blue-300 leading-snug text-balance mb-3">
              {persona.persona_vibe}  
            </p>
          </motion.div>
        </div>
      </div>
      <div className="w-full h-1/4 relative">
        <Image
          src="/vertical/blue-bottom.png"
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