import { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { fadeUp } from './animations';

interface CardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "", ...props }: CardProps) {
  return (
    <motion.div
      className={`bg-card/10 backdrop-blur-sm p-6 rounded-xl shadow-md ${className}`}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      {...props}
    >
      {children}
    </motion.div>
  );
}
