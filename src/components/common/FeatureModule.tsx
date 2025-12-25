import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface FeatureModuleProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
}

export const FeatureModule: React.FC<FeatureModuleProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  path 
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    console.log('点击事件触发:', path);
    
    // 将HTML文件名转换为路由路径
    const routePath = '/' + path.replace('.html', '');
    navigate(routePath);
  };

  return (
    <div onClick={handleClick}>
      <motion.div
        className={`card p-3 sm:p-4 cursor-pointer ${color}`}
        whileHover={{ 
          scale: 1.05, 
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          y: -5,
          transition: { duration: 0.3, type: "spring", stiffness: 300 }
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {icon}
          </motion.div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};