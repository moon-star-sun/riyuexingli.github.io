import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';
import { RankingItem } from './RankingItem';

// 星励成长积分系统学生数据 - 基于实际系统的学生名单
const STUDENT_NAMES: Record<string, string> = {
  "001": "张三", "002": "李四", "003": "王五", "004": "赵六", "005": "孙七",
  "006": "周八", "007": "吴九", "008": "郑十", "009": "钱一", "010": "孙二",
  "011": "周小", "012": "吴大", "013": "郑华", "014": "钱明", "015": "冯伟",
  "017": "陈强", "018": "褚丽", "019": "卫芳", "020": "蒋斌", "021": "沈琳",
  "022": "韩东", "023": "杨婷", "024": "朱佳", "025": "秦磊", "026": "尤敏",
  "027": "许杰", "028": "何静", "029": "吕洋", "030": "施琪", "031": "张宇",
  "032": "孔浩", "033": "曹颖", "034": "严军", "035": "华琳", "036": "金鑫",
  "038": "魏娜", "039": "陶阳", "040": "姜博", "041": "戚丽", "043": "谢敏",
  "044": "邹杰", "046": "喻婷", "047": "柏浩", "048": "水琳", "049": "窦军",
  "050": "章颖", "051": "云博", "052": "苏丽", "053": "潘杰", "054": "葛琳",
  "055": "奚军", "056": "范颖", "057": "彭博", "058": "郎丽", "059": "鲁杰"
};

interface StudentData {
  id: string;
  name: string;
  wisdom: number;
  courage: number;
  gems: number;
}

interface RankingItemType {
  rank: number;
  name: string;
  score: number;
  wisdom: number;
  courage: number;
  gems: number;
  avatar: null;
}

// 从localStorage读取真实数据
const getRealStudentData = (): StudentData[] => {
  try {
    // 尝试从localStorage读取学生数据
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      const studentsData = JSON.parse(storedStudents);
      return Object.entries(studentsData).map(([id, student]: [string, any]) => ({
        id,
        name: student.name || STUDENT_NAMES[id] || `学生${id}`,
        wisdom: student.wisdom || 0,
        courage: student.courage || 0,
        gems: student.gems || 0,
      }));
    }
  } catch (error) {
    console.error('读取localStorage数据失败:', error);
  }
  
  // 如果没有数据，创建初始数据（全为0）
  const studentIds = Object.keys(STUDENT_NAMES);
  return studentIds.map(id => ({
    id,
    name: STUDENT_NAMES[id],
    wisdom: 0,
    courage: 0,
    gems: 0,
  }));
};

// 计算排名数据
const calculateRankings = (students: StudentData[]): RankingItemType[] => {
  return students
    .map((student: StudentData) => ({
      ...student,
      totalScore: student.wisdom + student.courage, // 总分 = 智慧星 + 勇气星
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10) // 只显示前10名
    .map((student, index) => ({
      rank: index + 1,
      name: student.name,
      score: student.totalScore,
      wisdom: student.wisdom,
      courage: student.courage,
      gems: student.gems,
      avatar: null // 不再使用头像图片
    }));
};

const initialRankings = calculateRankings(getRealStudentData());

export const StarRanking: React.FC = () => {
  const [rankings, setRankings] = useState<RankingItemType[]>(initialRankings);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // 从localStorage读取最新数据
  const updateRankingsFromStorage = () => {
    const studentsData = getRealStudentData();
    const newRankings = calculateRankings(studentsData);
    setRankings(newRankings);
    setLastUpdateTime(new Date());
  };

  // 监听localStorage变化
  useEffect(() => {
    // 初始加载数据
    updateRankingsFromStorage();

    // 监听storage事件（当其他标签页修改localStorage时触发）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'students') {
        updateRankingsFromStorage();
      }
    };

    // 定时检查localStorage变化（当前标签页内修改时不会触发storage事件）
    const interval = setInterval(() => {
      updateRankingsFromStorage();
    }, 5000); // 每5秒检查一次

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="h-full">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-t-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: "linear",
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            >
              <Star size={24} />
            </motion.div>
            <h3 className="text-xl font-bold">星励成长积分排行榜</h3>
          </div>
          <motion.div 
            className="flex items-center space-x-1 text-sm"
            animate={{ 
              x: [0, 3, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <TrendingUp size={16} />
            </motion.div>
            <span>实时更新</span>
          </motion.div>
        </div>
        <p className="text-xs opacity-90 mt-1">
          最后更新: {lastUpdateTime.toLocaleTimeString()}
        </p>
      </div>
      
      <div className="bg-white rounded-b-2xl shadow-lg p-3 sm:p-4 max-h-64 sm:max-h-80 lg:max-h-96 overflow-y-auto">
        {/* 积分说明 */}
        <div className="mb-3 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
          <div className="flex justify-around text-center">
            <div>
              <span className="text-blue-600 font-semibold">💡 智慧星</span>
              <div className="text-gray-500">学习能力</div>
            </div>
            <div>
              <span className="text-orange-600 font-semibold">🎯 勇气星</span>
              <div className="text-gray-500">挑战精神</div>
            </div>
            <div>
              <span className="text-purple-600 font-semibold">💎 超能宝石</span>
              <div className="text-gray-500">综合奖励</div>
            </div>
          </div>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {rankings.map((item: RankingItemType) => (
            <motion.div key={`${item.rank}-${item.name}`} variants={itemVariants}>
              <RankingItem 
                rank={item.rank} 
                name={item.name} 
                score={item.score}
                wisdom={item.wisdom}
                courage={item.courage}
                gems={item.gems}
                avatar={item.avatar}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};