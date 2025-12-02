import React from 'react';

interface DiceProps {
  value: number;
  rolling: boolean;
}

export const Dice: React.FC<DiceProps> = ({ value, rolling }) => {
  const dots: Record<number, React.ReactNode> = {
    1: <div className="w-3 h-3 bg-slate-800 rounded-full" />,
    2: (
      <>
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute top-2 left-2" />
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute bottom-2 right-2" />
      </>
    ),
    3: (
      <>
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute top-2 left-2" />
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute bottom-2 right-2" />
      </>
    ),
    4: (
      <>
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute top-2 left-2" />
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute top-2 right-2" />
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute bottom-2 left-2" />
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute bottom-2 right-2" />
      </>
    ),
    5: (
      <>
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute top-2 left-2" />
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute top-2 right-2" />
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute bottom-2 left-2" />
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute bottom-2 right-2" />
      </>
    ),
    6: (
      <>
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute top-2 left-2" />
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute top-2 right-2" />
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute top-1/2 left-2 -translate-y-1/2" />
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute top-1/2 right-2 -translate-y-1/2" />
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute bottom-2 left-2" />
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute bottom-2 right-2" />
      </>
    ),
  };

  return (
    <div
      className={`w-16 h-16 bg-white rounded-xl shadow-md border-2 border-slate-200 relative flex items-center justify-center transition-transform duration-300 ${
        rolling ? 'animate-spin' : ''
      }`}
    >
      {dots[value] || dots[1]}
    </div>
  );
};
