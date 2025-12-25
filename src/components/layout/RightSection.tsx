import React from 'react';
import { PoemDetection } from '../features/PoemDetection';
import { FruitWordGame } from '../features/FruitWordGame';
import { MultiplicationGame } from '../features/MultiplicationGame';

export const RightSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-primary-700 mb-4">游戏学习</h2>
      <PoemDetection />
      <FruitWordGame />
      <MultiplicationGame />
    </div>
  );
};