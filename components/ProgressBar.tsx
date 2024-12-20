import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="h-0.5 bg-gray-600 rounded-full overflow-hidden">
      <div
        className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;

