import React from 'react';
import { Apple } from 'lucide-react';
import { FeatureModule } from '../common/FeatureModule';

export const FruitWordGame: React.FC = () => {
  const icon = (
    <div className="p-2 bg-red-100 rounded-xl">
      <Apple className="text-red-600" size={24} />
    </div>
  );

  return (
    <FeatureModule
      title="水果单词消消乐"
      description="趣味英语学习，水果单词大挑战"
      icon={icon}
      color="bg-red-50 hover:bg-red-100"
      path="水果单词消消乐.html"
    />
  );
};