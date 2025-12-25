import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <motion.footer 
      className="bg-primary-600 text-white py-3 sm:py-4 px-4 sm:px-6 text-center text-xs sm:text-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.p 
          className="flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          &copy; 2023 星励 · 智学平台 - 
          <motion.span
            animate={{ 
              color: ["#ffffff", "#fbbf24", "#ffffff"]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="mx-1"
          >
            让学习更有趣
          </motion.span>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              color: ["#ffffff", "#ef4444", "#ffffff"]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="ml-1"
          >
            <Heart size={14} fill="currentColor" />
          </motion.div>
        </motion.p>
      </div>
    </motion.footer>
  );
};