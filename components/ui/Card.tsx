import { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { fadeUp } from './animations';
import { GRADIENTS, CORNERS, SHADOWS } from './constants';

interface CardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  gradient?: keyof typeof GRADIENTS;
  corner?: keyof typeof CORNERS;
  shadow?: keyof typeof SHADOWS;
}

export default function Card({
  children,
  className = "",
  gradient = 'card',
  corner = 'lg',
  shadow = 'lg',
  ...props
}: CardProps) {
  return (
    <motion.div
      className={`${GRADIENTS[gradient]} ${CORNERS[corner]} ${SHADOWS[shadow]} backdrop-blur-sm border border-white/10 p-6 ${className}`}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      {...props}
    >
      {children}
    </motion.div>
  );
}
