import React from 'react';
import { Eye } from 'lucide-react';
import { FeatureModule } from '../common/FeatureModule';

export const ProhibitedItemDetection: React.FC = () => {
  const icon = (
    <div className="p-2 bg-red-100 rounded-xl">
      <Eye className="text-red-600" size={24} />
    </div>
  );

  return (
    <FeatureModule
      title="违禁物品检测"
      description="实时检测违禁物品，保障校园安全"
      icon={icon}
      color="bg-red-50 hover:bg-red-100"
      path="违规物品检测.html"
    />
  );
};