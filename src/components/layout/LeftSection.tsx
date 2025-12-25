import React from 'react';
import { MorningReadingDetector } from '../features/MorningReadingDetector';
import { StudyGuardian } from '../features/StudyGuardian';
import { GradeAnalysis } from '../features/GradeAnalysis';
import { StarGrowthSystem } from '../features/StarGrowthSystem';
import { ProhibitedItemDetection } from '../features/ProhibitedItemDetection';

export const LeftSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-primary-700 mb-4">功能模块</h2>
      <MorningReadingDetector />
      <StudyGuardian />
      <GradeAnalysis />
      <StarGrowthSystem />
      <ProhibitedItemDetection />
    </div>
  );
};