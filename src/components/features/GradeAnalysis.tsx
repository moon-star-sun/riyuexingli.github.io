import React from 'react';
import { BarChart3 } from 'lucide-react';
import { FeatureModule } from '../common/FeatureModule';

export const GradeAnalysis: React.FC = () => {
  const icon = (
    <div className="p-2 bg-purple-100 rounded-xl">
      <BarChart3 className="text-purple-600" size={24} />
    </div>
  );

  return (
    <FeatureModule
      title="成绩分析"
      description="多维度分析学习成绩，发现提升空间"
      icon={icon}
      color="bg-purple-50 hover:bg-purple-100"
      path="成绩分析.html"
    />
  );
};