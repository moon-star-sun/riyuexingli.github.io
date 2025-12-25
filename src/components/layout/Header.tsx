import React from 'react';
import { motion } from 'framer-motion';
import { Star, GraduationCap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 sm:py-4 px-4 sm:px-6 shadow-lg relative overflow-hidden">
      {/* 背景装饰元素 */}
      <motion.div 
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-secondary-400 opacity-20"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, 10, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute -bottom-10 -left-10 w-30 h-30 rounded-full bg-white opacity-10"
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, -10, 0],
          y: [0, -10, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="max-w-7xl mx-auto flex items-center justify-center relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Star size={24} className="text-secondary-300" />
          </motion.div>
          <motion.h1 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold flex items-center"
            whileHover={{ textShadow: "0 0 15px rgba(255,255,255,0.5)" }}
          >
            星励 · 智学平台
            <motion.div
              animate={{ 
                rotateZ: [-5, 5, -5],
                y: [0, -3, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <GraduationCap className="ml-1 sm:ml-2 text-secondary-300" size={20} />
            </motion.div>
          </motion.h1>
        </motion.div>
      </motion.div>
    </header>
  );
};