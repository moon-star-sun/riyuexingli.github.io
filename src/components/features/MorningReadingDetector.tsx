import React from 'react';
import { Clock } from 'lucide-react';
import { FeatureModule } from '../common/FeatureModule';

export const MorningReadingDetector: React.FC = () => {
  const icon = (
    <div className="p-2 bg-blue-100 rounded-xl">
      <Clock className="text-blue-600" size={24} />
    </div>
  );

  return (
    <FeatureModule
      title="早读检测仪"
      description="智能检测早读情况，提升学习效率"
      icon={icon}
      color="bg-blue-50 hover:bg-blue-100"
      path="早读检测仪.html"
    />
  );
};