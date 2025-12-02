import React from 'react';
import { Player, PlayerId } from '../types';
import { ArrowRight, ArrowLeft, ArrowUp, Star, Cloud, Sun, Flower, Ghost, GripHorizontal } from 'lucide-react';
import { AvatarIcon } from './AvatarIcon';

interface SpecialMove {
  start: number;
  end: number;
  type: 'ladder' | 'monster';
}

interface BoardProps {
  players: Record<PlayerId, Player>;
  specialMoves: SpecialMove[];
}

export const Board: React.FC<BoardProps> = ({ players, specialMoves }) => {
  const gridCells = [];
  
  for (let row = 0; row < 10; row++) {
    const mathRow = 9 - row;
    const isLTR = mathRow % 2 === 0;

    const rowNumbers = [];
    const startNum = mathRow * 10 + 1;
    
    for (let i = 0; i < 10; i++) {
      rowNumbers.push(startNum + i);
    }
    
    if (!isLTR) {
      rowNumbers.reverse();
    }
    
    gridCells.push(...rowNumbers);
  }

  const getPlayerInCell = (n: number) => {
    return Object.values(players).filter(p => p.position === n);
  };

  // Helper for background colors/decorations
  const getCellStyles = (num: number) => {
    // Pastel palette
    const colors = [
      'bg-red-50', 'bg-orange-50', 'bg-amber-50', 'bg-yellow-50', 
      'bg-lime-50', 'bg-green-50', 'bg-emerald-50', 'bg-teal-50', 
      'bg-cyan-50', 'bg-sky-50', 'bg-blue-50', 'bg-indigo-50', 
      'bg-violet-50', 'bg-purple-50', 'bg-fuchsia-50', 'bg-pink-50', 'bg-rose-50'
    ];
    // deterministically pick a color based on number
    const colorClass = colors[num % colors.length];
    return colorClass;
  };
  
  const getDecoration = (num: number) => {
      // Check for special moves first
      const special = specialMoves.find(m => m.start === num);
      if (special) {
        if (special.type === 'monster') return <Ghost className="w-5 h-5 text-red-400 absolute top-1 right-1 animate-pulse" />;
        if (special.type === 'ladder') return <GripHorizontal className="w-5 h-5 text-green-600 absolute bottom-1 right-1 -rotate-45" />;
      }

      // Randomly place cute icons on some tiles
      if (num % 13 === 0) return <Star className="w-3 h-3 text-yellow-300 absolute top-1 right-1 opacity-60" />;
      if (num % 17 === 0) return <Cloud className="w-3 h-3 text-sky-200 absolute top-1 right-1 opacity-60" />;
      if (num % 19 === 0) return <Flower className="w-3 h-3 text-pink-300 absolute bottom-1 left-1 opacity-60" />;
      if (num % 23 === 0) return <Sun className="w-3 h-3 text-orange-200 absolute top-1 left-1 opacity-60" />;
      return null;
  };

  const getTileCenter = (num: number) => {
    const mathRow = Math.floor((num - 1) / 10);
    const isLTR = mathRow % 2 === 0;
    const colIndex = (num - 1) % 10;
    
    // Calculate visual row (0 at top)
    const visualRow = 9 - mathRow;
    
    // Calculate visual col (0 at left)
    const visualCol = isLTR ? colIndex : 9 - colIndex;

    // Return percentage (center of tile)
    return {
      x: visualCol * 10 + 5,
      y: visualRow * 10 + 5
    };
  };

  return (
    <div className="relative p-2 sm:p-4 bg-white/50 backdrop-blur-sm rounded-3xl border-4 border-white shadow-xl">
      
      {/* SVG Overlay for Ladders and Monsters */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ padding: 'inherit' }}>
        {specialMoves.map((move, i) => {
          const start = getTileCenter(move.start);
          const end = getTileCenter(move.end);
          
          if (move.type === 'ladder') {
            return (
              <g key={`ladder-${i}`}>
                {/* Main Ladder Lines */}
                <line x1={`${start.x}%`} y1={`${start.y}%`} x2={`${end.x}%`} y2={`${end.y}%`} stroke="#22c55e" strokeWidth="8" strokeOpacity="0.4" strokeLinecap="round" />
                <line x1={`${start.x}%`} y1={`${start.y}%`} x2={`${end.x}%`} y2={`${end.y}%`} stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
              </g>
            );
          } else {
             return (
              <g key={`monster-${i}`}>
                {/* Monster Slide Line */}
                <path 
                  d={`M ${start.x}% ${start.y}% Q ${(start.x + end.x)/2 + 5}% ${(start.y + end.y)/2}% ${end.x}% ${end.y}%`}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeOpacity="0.3"
                  strokeDasharray="5, 5"
                />
              </g>
             );
          }
        })}
      </svg>

      <div className="grid grid-cols-10 gap-1 sm:gap-2 max-w-2xl mx-auto relative z-20">
        {gridCells.map((num, index) => {
          const occupants = getPlayerInCell(num);
          const isStart = num === 1;
          const isEnd = num === 100;
          
          const mathRow = Math.floor((num - 1) / 10);
          const isLTR = mathRow % 2 === 0;
          
          let ArrowIcon = null;
          if (num < 100) {
             if (isLTR) {
                if (num % 10 === 0) ArrowIcon = <ArrowUp className="w-4 h-4 text-slate-300/70" />;
                else ArrowIcon = <ArrowRight className="w-4 h-4 text-slate-300/70" />;
             } else {
                if (num % 10 === 0) {
                    ArrowIcon = <ArrowUp className="w-4 h-4 text-slate-300/70" />;
                } else {
                    ArrowIcon = <ArrowLeft className="w-4 h-4 text-slate-300/70" />;
                }
             }
          }

          const cellColor = getCellStyles(num);

          return (
            <div
              key={num}
              className={`aspect-square flex flex-col items-center justify-center relative rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 shadow-[0_2px_0_0_rgba(0,0,0,0.05)]
                ${isStart ? 'bg-gradient-to-br from-green-100 to-green-200 ring-2 ring-green-300 z-10 scale-105 shadow-md' : ''}
                ${isEnd ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 ring-2 ring-yellow-300 z-10 scale-105 shadow-md' : ''}
                ${!isStart && !isEnd ? `${cellColor} border-2 border-white` : ''}
                ${occupants.length > 0 ? 'ring-4 ring-indigo-200 z-20 shadow-lg scale-110' : ''}
              `}
            >
              <span className={`select-none ${isStart || isEnd ? 'text-slate-800 text-base' : 'text-slate-400'}`}>{num}</span>
              
              {/* Decorations */}
              {!isStart && !isEnd && getDecoration(num)}

              {/* Path Arrows */}
              {!isStart && !isEnd && (
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 sm:opacity-50 pointer-events-none">
                    {ArrowIcon}
                 </div>
              )}

              {/* Players */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="flex -space-x-3 transition-all duration-500">
                  {occupants.map((p) => (
                    <div
                      key={p.id}
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform transition-transform duration-300 hover:scale-125 hover:z-50`}
                      style={{ backgroundColor: p.color }}
                      title={p.name}
                    >
                      <AvatarIcon type={p.avatar} className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  ))}
                </div>
              </div>
              
              {isEnd && <div className="absolute -top-3 -right-3 text-2xl drop-shadow-sm filter">👑</div>}
              {isStart && <div className="absolute -top-2 -left-2 text-xl drop-shadow-sm filter">🏠</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};