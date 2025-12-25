import React from 'react';
import { BookOpen } from 'lucide-react';
import { FeatureModule } from '../common/FeatureModule';

export const PoemDetection: React.FC = () => {
  const icon = (
    <div className="p-2 bg-indigo-100 rounded-xl">
      <BookOpen className="text-indigo-600" size={24} />
    </div>
  );

  return (
    <FeatureModule
      title="古诗检测"
      description="学习古诗词，感受中华文化魅力"
      icon={icon}
      color="bg-indigo-50 hover:bg-indigo-100"
      path="古诗检测.html"
    />
  );
};