import React from 'react';
import { Loader2 } from 'lucide-react';

type LoadingSpinnerProps = {
  size?: number;
  className?: string;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, className = "" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <Loader2 size={size} className={`animate-spin text-primary-500 ${className}`} />
      <p className="mt-4 text-gray-400">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;