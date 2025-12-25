import React from 'react';
import { Calculator } from 'lucide-react';
import { FeatureModule } from '../common/FeatureModule';

export const MultiplicationGame: React.FC = () => {
  const icon = (
    <div className="p-2 bg-purple-100 rounded-xl">
      <Calculator className="text-purple-600" size={24} />
    </div>
  );

  return (
    <FeatureModule
      title="乘法小达人闯关赛"
      description="二年级数学学科小游戏"
      icon={icon}
      color="bg-purple-50 hover:bg-purple-100"
      path="乘法小达人闯关赛.html"
    />
  );
};