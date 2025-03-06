// components/Sidebar/ShimmerEffect.tsx
import React from 'react';

const ShimmerEffect = () => {
  return (
    <div className="px-4 py-2 flex items-center">
      <div className="h-4 w-4 rounded bg-[#312f2f] animate-pulse mr-2"></div>
      <div className="h-4 w-32 rounded bg-[#312f2f] animate-pulse"></div>
    </div>
  );
};

export default ShimmerEffect;