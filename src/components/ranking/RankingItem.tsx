import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Star } from 'lucide-react';

interface RankingItemProps {
  rank: number;
  name: string;
  score: number;
  wisdom?: number;    // 智慧星
  courage?: number;   // 勇气星
  gems?: number;      // 超能宝石
  avatar?: string | null;
}

export const RankingItem: React.FC<RankingItemProps> = ({ 
  rank, 
  name, 
  score, 
  wisdom = 0,
  courage = 0,
  gems = 0,
  avatar 
}) => {
  const getRankIcon = () => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={16} />;
      case 2:
        return <Medal className="text-gray-400" size={16} />;
      case 3:
        return <Award className="text-amber-600" size={16} />;
      default:
        return <span className="text-gray-500 font-semibold w-5 text-center">{rank}</span>;
    }
  };

  const getRankColor = () => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-white border-gray-100';
    }
  };

  return (
    <motion.div
      className={`card p-2 sm:p-3 border ${getRankColor()}`}
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
        <div className="flex-shrink-0 w-8">
          {getRankIcon()}
        </div>
        
        <div className="flex-shrink-0">
          <motion.div
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
            animate={{ 
              rotate: [0, 5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Star 
              className="text-yellow-400 fill-yellow-400 drop-shadow-sm"
              size={32}
            />
          </motion.div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 truncate">{name}</p>
        </div>
        
        <div className="flex-shrink-0 flex items-center space-x-1">
          <span className="text-lg font-semibold text-primary-600">{score}</span>
          <span className="text-xs text-gray-500">总分</span>
        </div>
      </div>
      
      {/* 详细积分信息 */}
      <div className="flex justify-around text-xs bg-white/50 rounded-lg p-2">
        <div className="flex flex-col items-center">
          <span className="text-blue-600 font-semibold">💡 {wisdom}</span>
          <span className="text-gray-500">智慧星</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-orange-600 font-semibold">🎯 {courage}</span>
          <span className="text-gray-500">勇气星</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-purple-600 font-semibold">💎 {gems}</span>
          <span className="text-gray-500">宝石</span>
        </div>
      </div>
    </motion.div>
  );
};