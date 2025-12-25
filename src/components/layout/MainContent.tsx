import React from 'react';
import { motion } from 'framer-motion';
import { LeftSection } from './LeftSection';
import { CenterSection } from './CenterSection';
import { RightSection } from './RightSection';

export const MainContent: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 50
      }
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-6">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6 h-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 左侧功能区 */}
        <motion.div 
          className="lg:col-span-3"
          variants={sectionVariants}
        >
          <LeftSection />
        </motion.div>
        
        {/* 中间核心区 - 在移动设备上占满宽度，在平板上占满宽度 */}
        <motion.div 
          className="md:col-span-2 lg:col-span-6"
          variants={sectionVariants}
        >
          <CenterSection />
        </motion.div>
        
        {/* 右侧游戏区 */}
        <motion.div 
          className="lg:col-span-3"
          variants={sectionVariants}
        >
          <RightSection />
        </motion.div>
      </motion.div>
    </main>
  );
};