import React from 'react';
import { Player, PlayerId } from '../types';
import { 
  ArrowRight, ArrowLeft, ArrowUp, 
  GripHorizontal, Ghost,
  Flower, TreePine, 
  Sun, Umbrella, 
  Fish, Waves, 
  Mountain, Snowflake, 
  Star, Moon, Rocket
} from 'lucide-react';
import { AvatarIcon } from './AvatarIcon';

interface SpecialMove {
  start: number;
  end: number;
  type: 'ladder' | 'monster';
}

interface BoardProps {
  players: Record<PlayerId, Player>;
  specialMoves: SpecialMove[];
  maxScore: number;
}

export const Board: React.FC<BoardProps> = ({ players, specialMoves, maxScore }) => {
  const gridCells = [];
  const rows = Math.ceil(maxScore / 10);
  
  for (let row = 0; row < rows; row++) {
    const mathRow = (rows - 1) - row; // 0 is bottom
    const isLTR = mathRow % 2 === 0;

    const rowNumbers = [];
    const startNum = mathRow * 10 + 1;
    
    for (let i = 0; i < 10; i++) {
      const num = startNum + i;
      if (num <= maxScore) {
        rowNumbers.push(num);
      }
    }
    
    if (!isLTR) {
      rowNumbers.reverse();
    }
    
    gridCells.push(...rowNumbers);
  }

  const getPlayerInCell = (n: number) => {
    return Object.values(players).filter(p => p.position === n);
  };

  // --- THEMATIC ZONES ---
  const getZone = (num: number) => {
    const percentage = num / maxScore;
    if (percentage <= 0.2) return 'meadow';
    if (percentage <= 0.4) return 'desert';
    if (percentage <= 0.6) return 'ocean';
    if (percentage <= 0.8) return 'mountain';
    return 'space';
  };

  const getCellStyles = (num: number) => {
    const zone = getZone(num);
    const isEven = num % 2 === 0;

    switch (zone) {
      case 'meadow':
        return isEven ? 'bg-green-100 border-green-200' : 'bg-emerald-100 border-emerald-200';
      case 'desert':
        return isEven ? 'bg-amber-100 border-amber-200' : 'bg-orange-100 border-orange-200';
      case 'ocean':
        return isEven ? 'bg-cyan-100 border-cyan-200' : 'bg-sky-100 border-sky-200';
      case 'mountain':
        return isEven ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-100 border-slate-200';
      case 'space':
        return isEven ? 'bg-violet-200 border-violet-300' : 'bg-indigo-200 border-indigo-300';
      default:
        return 'bg-white';
    }
  };
  
  const getDecoration = (num: number) => {
      // Check for special moves first
      const special = specialMoves.find(m => m.start === num);
      if (special) {
        if (special.type === 'monster') return <Ghost className="w-3 h-3 sm:w-5 sm:h-5 text-red-500 absolute top-0.5 right-0.5 sm:top-1 sm:right-1 animate-pulse drop-shadow-sm" />;
        if (special.type === 'ladder') return <GripHorizontal className="w-3 h-3 sm:w-5 sm:h-5 text-green-700 absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 -rotate-45 drop-shadow-sm" />;
      }

      const zone = getZone(num);
      const rand = (num * 123) % 100; // Deterministic randomish

      // Decorations based on zones
      switch (zone) {
        case 'meadow':
          if (rand < 20) return <Flower className="w-2 h-2 sm:w-3 sm:h-3 text-pink-400 absolute bottom-0.5 left-0.5 opacity-70" />;
          if (rand > 80) return <TreePine className="w-2 h-2 sm:w-3 sm:h-3 text-green-600 absolute top-0.5 right-0.5 opacity-60" />;
          break;
        case 'desert':
          if (rand < 20) return <Sun className="w-2 h-2 sm:w-3 sm:h-3 text-orange-400 absolute top-0.5 left-0.5 opacity-70" />;
          if (rand > 80) return <Umbrella className="w-2 h-2 sm:w-3 sm:h-3 text-red-400 absolute bottom-0.5 right-0.5 opacity-60" />;
          break;
        case 'ocean':
          if (rand < 20) return <Fish className="w-2 h-2 sm:w-3 sm:h-3 text-blue-600 absolute bottom-0.5 left-0.5 opacity-60" />;
          if (rand > 80) return <Waves className="w-2 h-2 sm:w-3 sm:h-3 text-cyan-600 absolute top-0.5 right-0.5 opacity-60" />;
          break;
        case 'mountain':
          if (rand < 20) return <Mountain className="w-2 h-2 sm:w-3 sm:h-3 text-slate-400 absolute bottom-0.5 left-0.5 opacity-60" />;
          if (rand > 80) return <Snowflake className="w-2 h-2 sm:w-3 sm:h-3 text-blue-300 absolute top-0.5 right-0.5 opacity-70" />;
          break;
        case 'space':
          if (rand < 20) return <Star className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-200 absolute top-0.5 right-0.5 opacity-80" />;
          if (rand > 80) return <Moon className="w-2 h-2 sm:w-3 sm:h-3 text-slate-200 absolute bottom-0.5 left-0.5 opacity-60" />;
          if (num === maxScore - 1) return <Rocket className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 absolute top-0.5 left-0.5" />;
          break;
      }
      return null;
  };

  const getTileCenter = (num: number) => {
    // Math row: 0 is 1-10, 1 is 11-20
    const mathRow = Math.floor((num - 1) / 10);
    const isLTR = mathRow % 2 === 0;
    const colIndex = (num - 1) % 10;
    
    // Calculate visual row (0 at top)
    const visualRow = (rows - 1) - mathRow;
    
    // Calculate visual col (0 at left)
    const visualCol = isLTR ? colIndex : 9 - colIndex;

    const rowHeight = 100 / rows;
    
    return {
      x: visualCol * 10 + 5,
      y: visualRow * rowHeight + (rowHeight / 2)
    };
  };

  return (
    <div className="relative p-2 sm:p-4 rounded-xl sm:rounded-3xl border-4 border-white/50 shadow-2xl bg-gradient-to-t from-green-200 via-sky-200 to-indigo-900 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>

      {/* SVG Overlay for Ladders and Monsters */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ padding: 'inherit' }}>
        {specialMoves.map((move, i) => {
          const start = getTileCenter(move.start);
          const end = getTileCenter(move.end);
          
          if (move.type === 'ladder') {
            return (
              <g key={`ladder-${i}`}>
                {/* Shadow */}
                <line x1={`${start.x}%`} y1={`${start.y}%`} x2={`${end.x}%`} y2={`${end.y}%`} stroke="rgba(0,0,0,0.1)" strokeWidth="8" strokeLinecap="round" transform="translate(2,2)" />
                {/* Rails */}
                <line x1={`${start.x}%`} y1={`${start.y}%`} x2={`${end.x}%`} y2={`${end.y}%`} stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
                {/* Rungs effect (dashed line) */}
                <line x1={`${start.x}%`} y1={`${start.y}%`} x2={`${end.x}%`} y2={`${end.y}%`} stroke="#86efac" strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" />
              </g>
            );
          } else {
             return (
              <g key={`monster-${i}`}>
                 {/* Shadow */}
                 <path 
                  d={`M ${start.x}% ${start.y}% Q ${(start.x + end.x)/2 + 5}% ${(start.y + end.y)/2}% ${end.x}% ${end.y}%`}
                  fill="none"
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth="5"
                  transform="translate(2,2)"
                />
                {/* Monster Slide Body */}
                <path 
                  d={`M ${start.x}% ${start.y}% Q ${(start.x + end.x)/2 + 5}% ${(start.y + end.y)/2}% ${end.x}% ${end.y}%`}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* Stripe pattern */}
                <path 
                  d={`M ${start.x}% ${start.y}% Q ${(start.x + end.x)/2 + 5}% ${(start.y + end.y)/2}% ${end.x}% ${end.y}%`}
                  fill="none"
                  stroke="#fee2e2"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />
              </g>
             );
          }
        })}
      </svg>

      <div className="grid grid-cols-10 gap-0.5 sm:gap-2 max-w-2xl mx-auto relative z-20">
        {gridCells.map((num, index) => {
          const occupants = getPlayerInCell(num);
          const isStart = num === 1;
          const isEnd = num === maxScore;
          
          const mathRow = Math.floor((num - 1) / 10);
          const isLTR = mathRow % 2 === 0;
          
          let ArrowIcon = null;
          if (num < maxScore) {
             const arrowClass = "w-2 h-2 sm:w-3 sm:h-3 text-slate-400/50";
             if (isLTR) {
                if (num % 10 === 0) ArrowIcon = <ArrowUp className={arrowClass} />;
                else ArrowIcon = <ArrowRight className={arrowClass} />;
             } else {
                if (num % 10 === 0) {
                    ArrowIcon = <ArrowUp className={arrowClass} />;
                } else {
                    ArrowIcon = <ArrowLeft className={arrowClass} />;
                }
             }
          }

          const cellColor = getCellStyles(num);

          return (
            <div
              key={num}
              className={`aspect-square flex flex-col items-center justify-center relative rounded-md sm:rounded-xl text-[10px] sm:text-sm font-bold transition-all duration-300 shadow-[0_2px_0_0_rgba(0,0,0,0.1)] sm:shadow-[0_3px_0_0_rgba(0,0,0,0.1)]
                ${isStart ? 'bg-gradient-to-br from-yellow-300 to-orange-400 ring-2 sm:ring-4 ring-white z-10 scale-105 shadow-lg' : ''}
                ${isEnd ? 'bg-gradient-to-br from-fuchsia-400 to-purple-600 ring-2 sm:ring-4 ring-yellow-300 z-10 scale-110 shadow-xl' : ''}
                ${!isStart && !isEnd ? `${cellColor} border-b-2 sm:border-b-4` : ''}
                ${occupants.length > 0 ? 'ring-2 sm:ring-4 ring-white z-20 shadow-2xl scale-110' : ''}
              `}
            >
              <span className={`select-none z-10 ${isStart ? 'text-white text-base sm:text-lg drop-shadow-md' : isEnd ? 'text-white text-lg sm:text-xl drop-shadow-md' : 'text-slate-600/80'}`}>{num}</span>
              
              {/* Decorations */}
              {!isStart && !isEnd && getDecoration(num)}

              {/* Path Arrows */}
              {!isStart && !isEnd && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="transform translate-y-2 sm:translate-y-3">{ArrowIcon}</div>
                 </div>
              )}

              {/* Players */}
              <div className="absolute inset-0 flex items-center justify-center z-30">
                 <div className="flex -space-x-2 sm:-space-x-3 transition-all duration-500">
                  {occupants.map((p) => (
                    <div
                      key={p.id}
                      className={`w-5 h-5 sm:w-9 sm:h-9 rounded-full border border-white sm:border-2 shadow-lg flex items-center justify-center transform transition-transform duration-300 hover:scale-125 hover:z-50 bg-white`}
                      title={p.name}
                    >
                      <AvatarIcon type={p.avatar} className="w-full h-full p-0.5 sm:p-1" />
                      <div className="absolute inset-0 rounded-full border sm:border-2 opacity-50" style={{ borderColor: p.color }}></div>
                    </div>
                  ))}
                </div>
              </div>
              
              {isEnd && <div className="absolute -top-3 sm:-top-4 -right-2 sm:-right-3 text-2xl sm:text-3xl drop-shadow-md filter animate-bounce">👑</div>}
              {isStart && <div className="absolute -top-2 sm:-top-3 -left-1 sm:-left-2 text-xl sm:text-2xl drop-shadow-md filter">🏡</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};