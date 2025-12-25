import React from 'react';
import { Star } from 'lucide-react';
import { FeatureModule } from '../common/FeatureModule';

export const StarGrowthSystem: React.FC = () => {
  const icon = (
    <div className="p-2 bg-yellow-100 rounded-xl">
      <Star className="text-yellow-600" size={24} />
    </div>
  );

  return (
    <FeatureModule
      title="星励成长积分系统"
      description="记录学习历程，激励成长进步"
      icon={icon}
      color="bg-yellow-50 hover:bg-yellow-100"
      path="星励成长积分系统.html"
    />
  );
};