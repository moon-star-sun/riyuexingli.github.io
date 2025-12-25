import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { FeatureModule } from '../common/FeatureModule';

export const StudyGuardian: React.FC = () => {
  const icon = (
    <div className="p-2 bg-green-100 rounded-xl">
      <ShieldCheck className="text-green-600" size={24} />
    </div>
  );

  return (
    <FeatureModule
      title="静学智能哨兵"
      description="智能守护学习环境，专注学习不干扰"
      icon={icon}
      color="bg-green-50 hover:bg-green-100"
      path="静学智能哨兵.html"
    />
  );
};