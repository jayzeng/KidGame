import React, { useEffect, useState } from 'react';

interface SpinnerProps {
  onSpinComplete: (value: number) => void;
  disabled: boolean;
  spinTrigger: boolean;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ onSpinComplete, disabled, spinTrigger, className = "w-32 h-32 sm:w-48 sm:h-48" }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (spinTrigger && !isSpinning) {
      spin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinTrigger]);

  const spin = () => {
    setIsSpinning(true);
    
    // Weighted logic
    const rand = Math.random();
    let resultValue = 10;
    if (rand > 0.375 && rand <= 0.75) resultValue = 20;
    if (rand > 0.75) resultValue = 30;

    // Calculate rotation
    let targetAngle = 0;
    const jitter = Math.floor(Math.random() * 30) - 15;

    if (resultValue === 10) targetAngle = 360 * 5 + 45 + jitter;
    if (resultValue === 20) targetAngle = 360 * 5 + 135 + jitter;
    if (resultValue === 30) targetAngle = 360 * 5 + 270 + jitter;

    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(resultValue);
    }, 2000); // 2 seconds spin
  };

  return (
    <div className={`relative ${className} ${disabled ? 'opacity-50 grayscale' : ''}`}>
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-red-600 drop-shadow-md" />

      {/* Wheel */}
      <div
        className="w-full h-full rounded-full border-4 border-slate-700 overflow-hidden shadow-xl relative transition-transform duration-[2000ms] ease-out"
        style={{ transform: `rotate(-${rotation}deg)` }}
      >
        {/* Slices - Using conic-gradient for simplicity */}
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `conic-gradient(
              #fca5a5 0deg 45deg,
              #86efac 45deg 90deg,
              #93c5fd 90deg 135deg,
              #fcd34d 135deg 180deg,
              #fca5a5 180deg 225deg,
              #86efac 225deg 270deg,
              #93c5fd 270deg 315deg,
              #fcd34d 315deg 360deg
            )`,
          }}
        />
        
        {/* Lines/Labels overlay */}
        <div className="absolute inset-0 rounded-full text-[10px] sm:text-base">
           {/* We can place labels absolutely based on rotation */}
           <span className="absolute top-[15%] right-[30%] font-bold text-slate-800 rotate-[22deg]">10</span>
           <span className="absolute top-[30%] right-[15%] font-bold text-slate-800 rotate-[67deg]">20</span>
           <span className="absolute bottom-[30%] right-[15%] font-bold text-slate-800 rotate-[112deg]">30</span>
           <span className="absolute bottom-[15%] right-[30%] font-bold text-slate-800 rotate-[157deg]">10</span>
           <span className="absolute bottom-[15%] left-[30%] font-bold text-slate-800 rotate-[202deg]">20</span>
           <span className="absolute bottom-[30%] left-[15%] font-bold text-slate-800 rotate-[247deg]">30</span>
           <span className="absolute top-[30%] left-[15%] font-bold text-slate-800 rotate-[292deg]">10</span>
           <span className="absolute top-[15%] left-[30%] font-bold text-slate-800 rotate-[337deg]">20</span>
        </div>

        {/* Center Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-slate-800 rounded-full z-10 border-2 border-white" />
      </div>
    </div>
  );
};